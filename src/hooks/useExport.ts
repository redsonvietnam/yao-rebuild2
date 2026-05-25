import { useState, useCallback } from 'react'
import type { Editor } from '@tiptap/core'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, type ISectionOptions } from 'docx'
import { cacheExport, getCachedExport } from '@/db/dexie'

interface ExportState {
  isExporting: boolean
  progress: number
  format: 'pdf' | 'docx' | 'png' | null
  error: string | null
}

export function useExport() {
  const [state, setState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    format: null,
    error: null,
  })

  // Helper: get clean editor DOM for rendering
  const getEditorDOM = useCallback((editor: Editor): HTMLElement | null => {
    const dom = editor.view.dom
    if (!dom) return null
    // Clone the DOM to avoid mutations
    const clone = dom.cloneNode(true) as HTMLElement

    // Clean up: remove ProseMirror-specific attributes & cursor
    clone.querySelectorAll('.ProseMirror-selectednode, .ProseMirror-cursor, .prosemirror-cursor').forEach(el => el.remove())
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'))

    return clone
  }, [])

  // Export to PNG (full page)
  const exportPNG = useCallback(async (editor: Editor, filename?: string) => {
    setState({ isExporting: true, progress: 0, format: 'png', error: null })

    try {
      // Check cache
      const docId = 'current-doc'
      const cached = await getCachedExport(docId, 'png')
      if (cached) {
        const url = URL.createObjectURL(cached.blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || 'yao-document.png'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setState({ isExporting: false, progress: 100, format: null, error: null })
        return
      }

      setState(s => ({ ...s, progress: 10 }))

      const editorDOM = getEditorDOM(editor)
      if (!editorDOM) {
        throw new Error('Không thể lấy nội dung editor')
      }

      // Create a temporary container styled like the A4 pages
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.backgroundColor = '#ffffff'
      container.style.padding = '0'
      container.appendChild(editorDOM.cloneNode(true))

      // Apply page styles to the clone
      const pages = container.querySelectorAll('.yao-page')
      pages.forEach((page, i) => {
        const el = page as HTMLElement
        el.style.position = 'relative'
        el.style.display = 'block'
        el.style.width = '794px' // A4 at 96dpi
        el.style.height = '1123px'
        el.style.marginBottom = '20px'
        el.style.backgroundColor = '#ffffff'
        el.style.color = '#000000'
        el.style.pageBreakAfter = i < pages.length - 1 ? 'always' : 'auto'
        el.style.transform = 'none'
        el.style.flexShrink = '0'
      })

      document.body.appendChild(container)
      setState(s => ({ ...s, progress: 30 }))

      // Render each page and combine
      const pageElements = Array.from(container.querySelectorAll('.yao-page')) as HTMLElement[]
      const canvases: HTMLCanvasElement[] = []

      for (let i = 0; i < pageElements.length; i++) {
        const canvas = await html2canvas(pageElements[i], {
          scale: 2, // Retina quality
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
        })
        canvases.push(canvas)
        setState(s => ({ ...s, progress: 30 + Math.round(((i + 1) / pageElements.length) * 60) }))
      }

      // Combine canvases into single image
      const totalHeight = canvases.reduce((sum, c) => sum + c.height, 0)
      const maxWidth = Math.max(...canvases.map(c => c.width))
      const combinedCanvas = document.createElement('canvas')
      combinedCanvas.width = maxWidth
      combinedCanvas.height = totalHeight
      const ctx = combinedCanvas.getContext('2d')!

      let currentY = 0
      for (const canvas of canvases) {
        ctx.drawImage(canvas, 0, currentY)
        currentY += canvas.height
      }

      setState(s => ({ ...s, progress: 95 }))

      // Generate blob and download
      const blob = await new Promise<Blob>((resolve, reject) => {
        combinedCanvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error('Failed to generate PNG'))
        }, 'image/png')
      })

      // Cache
      try {
        await cacheExport(docId, 'png', blob)
      } catch { /* ignore */ }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'yao-document.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Cleanup
      document.body.removeChild(container)

      setState({ isExporting: false, progress: 100, format: null, error: null })
    } catch (err) {
      setState({
        isExporting: false,
        progress: 0,
        format: null,
        error: err instanceof Error ? err.message : 'Lỗi xuất PNG',
      })
    }
  }, [getEditorDOM])

  // Export to PDF
  const exportPDF = useCallback(async (editor: Editor, filename?: string) => {
    setState({ isExporting: true, progress: 0, format: 'pdf', error: null })

    try {
      const docId = 'current-doc'
      const cached = await getCachedExport(docId, 'pdf')
      if (cached) {
        const url = URL.createObjectURL(cached.blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || 'yao-document.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setState({ isExporting: false, progress: 100, format: null, error: null })
        return
      }

      setState(s => ({ ...s, progress: 10 }))

      const editorDOM = getEditorDOM(editor)
      if (!editorDOM) throw new Error('Không thể lấy nội dung editor')

      // Render pages to canvases using html2canvas
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '0'
      container.style.backgroundColor = '#ffffff'
      container.appendChild(editorDOM.cloneNode(true))

      const pages = container.querySelectorAll('.yao-page')
      pages.forEach((page, i) => {
        const el = page as HTMLElement
        el.style.position = 'relative'
        el.style.display = 'block'
        el.style.width = '794px'
        el.style.height = '1123px'
        el.style.marginBottom = '0'
        el.style.backgroundColor = '#ffffff'
        el.style.color = '#000000'
        el.style.pageBreakAfter = 'auto'
        el.style.transform = 'none'
        el.style.flexShrink = '0'
      })

      document.body.appendChild(container)
      setState(s => ({ ...s, progress: 20 }))

      const pageElements = Array.from(container.querySelectorAll('.yao-page')) as HTMLElement[]

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) pdf.addPage()

        const canvas = await html2canvas(pageElements[i], {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          allowTaint: true,
          useCORS: true,
        })

        const imgData = canvas.toDataURL('image/png')
        const imgWidth = 210 // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
        setState(s => ({ ...s, progress: 20 + Math.round(((i + 1) / pageElements.length) * 70) }))
      }

      setState(s => ({ ...s, progress: 95 }))

      const pdfBlob = pdf.output('blob')

      // Cache
      try {
        await cacheExport(docId, 'pdf', pdfBlob)
      } catch { /* ignore */ }

      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'yao-document.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      document.body.removeChild(container)
      setState({ isExporting: false, progress: 100, format: null, error: null })
    } catch (err) {
      setState({
        isExporting: false,
        progress: 0,
        format: null,
        error: err instanceof Error ? err.message : 'Lỗi xuất PDF',
      })
    }
  }, [getEditorDOM])

  // Export to DOCX
  const exportDOCX = useCallback(async (editor: Editor, filename?: string) => {
    setState({ isExporting: true, progress: 0, format: 'docx', error: null })

    try {
      const docId = 'current-doc'
      const cached = await getCachedExport(docId, 'docx')
      if (cached) {
        const url = URL.createObjectURL(cached.blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename || 'yao-document.docx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        setState({ isExporting: false, progress: 100, format: null, error: null })
        return
      }

      setState(s => ({ ...s, progress: 10 }))

      const json = editor.getJSON()

      // Traverse the JSON content and build docx paragraphs
      const buildParagraphs = (content: unknown[] | undefined): Paragraph[] => {
        if (!content || !Array.isArray(content)) return []

        const paragraphs: Paragraph[] = []

        for (const node of content) {
          if (!node || typeof node !== 'object') continue
          const n = node as Record<string, unknown>

          if (n.type === 'paragraph') {
            const children: TextRun[] = []
            const nodeContent = n.content as Array<Record<string, unknown>> | undefined

            if (nodeContent && Array.isArray(nodeContent)) {
              for (const child of nodeContent) {
                if (child.type === 'text') {
                  const textRun = new TextRun({
                    text: (child.text as string) || '',
                    bold: (child.marks as Array<{ type: string }> | undefined)?.some(m => m.type === 'bold') || false,
                    italics: (child.marks as Array<{ type: string }> | undefined)?.some(m => m.type === 'italic') || false,
                    underline: (child.marks as Array<{ type: string }> | undefined)?.some(m => m.type === 'underline')
                      ? { type: 'single' as const }
                      : undefined,
                    strike: (child.marks as Array<{ type: string }> | undefined)?.some(m => m.type === 'strike') || false,
                  })
                  children.push(textRun)
                }
              }
            }

            if (children.length > 0) {
              paragraphs.push(new Paragraph({ children }))
            } else {
              paragraphs.push(new Paragraph({ children: [new TextRun('')] }))
            }
          }
          // Handle page nodes (recurse into content)
          else if (n.type === 'page' && n.content) {
            paragraphs.push(...buildParagraphs(n.content as unknown[]))
          }
          // Handle heading
          else if (n.type === 'heading') {
            const headingChildren: TextRun[] = []
            const nodeContent = n.content as Array<Record<string, unknown>> | undefined
            const attrs = n.attrs as Record<string, unknown> | undefined
            const level = attrs?.level as number | undefined

            if (nodeContent && Array.isArray(nodeContent)) {
              for (const child of nodeContent) {
                if (child.type === 'text') {
                  headingChildren.push(new TextRun({
                    text: (child.text as string) || '',
                    bold: true,
                    size: level === 1 ? 32 : 28,
                  }))
                }
              }
            }
            if (headingChildren.length > 0) {
              const headingLevel = level === 1 ? HeadingLevel.HEADING_1
                : level === 3 ? HeadingLevel.HEADING_3
                : level === 4 ? HeadingLevel.HEADING_4
                : HeadingLevel.HEADING_2

              paragraphs.push(new Paragraph({
                children: headingChildren,
                heading: headingLevel,
              }))
            }
          }
        }

        return paragraphs
      }

      const paragraphs = buildParagraphs(json.content as unknown[])
      setState(s => ({ ...s, progress: 50 }))

      // Create sections
      const sections: ISectionOptions[] = [{
        properties: {
          page: {
            size: {
              width: 11906, // A4 in twips
              height: 16838,
            },
            margin: {
              top: 1134, // ~20mm
              bottom: 1134,
              left: 1134,
              right: 1134,
            },
          },
        },
        children: paragraphs,
      }]

      setState(s => ({ ...s, progress: 70 }))

      const doc = new Document({
        title: 'Yao Editor Document',
        sections,
      })

      const blob = await Packer.toBlob(doc)
      setState(s => ({ ...s, progress: 95 }))

      // Cache
      try {
        await cacheExport(docId, 'docx', blob)
      } catch { /* ignore */ }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'yao-document.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setState({ isExporting: false, progress: 100, format: null, error: null })
    } catch (err) {
      setState({
        isExporting: false,
        progress: 0,
        format: null,
        error: err instanceof Error ? err.message : 'Lỗi xuất DOCX',
      })
    }
  }, [])

  return {
    ...state,
    exportPDF,
    exportDOCX,
    exportPNG,
  }
}