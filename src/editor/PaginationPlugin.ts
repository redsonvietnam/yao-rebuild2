import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { Node } from '@tiptap/pm/model'

export const paginationPluginKey = new PluginKey('pagination')

export const PaginationPlugin = () => {
  let isPaginating = false

  const runPagination = (view: EditorView) => {
    if (isPaginating) return
    if (!view || !view.dom || !(view as any).docView) return
    isPaginating = true

    try {
      const { state } = view
      const { doc } = state
      const pageNodes: { node: Node; pos: number; dom: HTMLElement }[] = []

      // 1. Gather all page nodes and their DOM elements
      doc.forEach((node, pos) => {
        if (node.type.name === 'page') {
          try {
            const dom = view.nodeDOM(pos) as HTMLElement
            if (dom) {
              pageNodes.push({ node, pos, dom })
            }
          } catch (e) {
            // Ignore intermediate DOM mapping errors
          }
        }
      })

      if (pageNodes.length === 0) return

      const tr = state.tr
      let changed = false

      // 2. Auto-Merge Pass: only run if we have more than 1 page
      // GUARD: Never reduce below 1 page
      if (pageNodes.length > 1) {
        for (let i = 0; i < pageNodes.length - 1; i++) {
          const currentPage = pageNodes[i]
          const nextPage = pageNodes[i + 1]

          const isVertical = currentPage.node.attrs.writingMode === 'vertical-rl'
          const currentRect = currentPage.dom.getBoundingClientRect()
          const currentStyle = window.getComputedStyle(currentPage.dom)

          const currentChildren = currentPage.dom.children
          const nextChildren = nextPage.dom.children

          // If next page is empty AND current page has content, join to delete the empty page
          // But only if total pages > 1 (checked above) AND current page is not also empty
          // GUARD: Don't merge if it would leave the next page empty (we need at least one paragraph per page)
          if (nextChildren.length === 0 && currentChildren.length > 0) {
            // Only merge if we have more than 2 pages, or if current page is not the last one
            if (pageNodes.length > 2 || i < pageNodes.length - 2) {
              const joinPos = currentPage.pos + currentPage.node.nodeSize
              tr.join(joinPos)
              changed = true
              break
            }
          }

          if (currentChildren.length === 0) continue

          const lastChild = currentChildren[currentChildren.length - 1] as HTMLElement
          const lastChildRect = lastChild.getBoundingClientRect()

          const firstChild = nextChildren[0] as HTMLElement
          const firstChildRect = firstChild.getBoundingClientRect()

          let fits = false
          if (!isVertical) {
            const paddingBottom = parseFloat(currentStyle.paddingBottom)
            const pageBottom = currentRect.bottom - paddingBottom
            const remainingHeight = pageBottom - lastChildRect.bottom
            const firstChildHeight = firstChildRect.height

            // Check if first child fits in remaining space (with padding buffer)
            fits = remainingHeight > firstChildHeight + 8
          } else {
            const paddingLeft = parseFloat(currentStyle.paddingLeft)
            const pageLeft = currentRect.left + paddingLeft
            const remainingWidth = lastChildRect.left - pageLeft
            const firstChildWidth = firstChildRect.width

            fits = remainingWidth > firstChildWidth + 8
          }

          if (fits) {
            const joinPos = currentPage.pos + currentPage.node.nodeSize
            tr.join(joinPos)
            changed = true
            break
          }
        }

        if (changed) {
          view.dispatch(tr.setMeta('pagination', true))
          return
        }
      }

      // 3. Auto-Split Pass: Check for page overflow
      for (let i = 0; i < pageNodes.length; i++) {
        const currentPage = pageNodes[i]
        const isVertical = currentPage.node.attrs.writingMode === 'vertical-rl'

        let overflows = false
        // clientHeight/Width must be > 0 (element must be rendered)
        // Add 2px tolerance to avoid false positive splits on initial render
        if (!isVertical) {
          overflows = currentPage.dom.clientHeight > 0 && currentPage.dom.scrollHeight > currentPage.dom.clientHeight + 2
        } else {
          overflows = currentPage.dom.clientWidth > 0 && currentPage.dom.scrollWidth > currentPage.dom.clientWidth + 2
        }

        if (overflows) {
          const children = currentPage.dom.children
          const currentStyle = window.getComputedStyle(currentPage.dom)
          const currentRect = currentPage.dom.getBoundingClientRect()

          let overflowBoundary = 0
          if (!isVertical) {
            const paddingBottom = parseFloat(currentStyle.paddingBottom)
            overflowBoundary = currentRect.bottom - paddingBottom
          } else {
            const paddingLeft = parseFloat(currentStyle.paddingLeft)
            overflowBoundary = currentRect.left + paddingLeft
          }

          let overflowChild: HTMLElement | null = null
          let overflowChildIdx = -1

          for (let j = 0; j < children.length; j++) {
            const child = children[j] as HTMLElement
            const childRect = child.getBoundingClientRect()

            if (!isVertical) {
              if (childRect.bottom > overflowBoundary) {
                overflowChild = child
                overflowChildIdx = j
                break
              }
            } else {
              if (childRect.left < overflowBoundary) {
                overflowChild = child
                overflowChildIdx = j
                break
              }
            }
          }

          if (overflowChild) {
            const splitPos = view.posAtDOM(overflowChild, 0)

            if (overflowChildIdx > 0) {
              // Split page before the overflowing child (depth 1)
              tr.split(splitPos, 1, [{ type: state.schema.nodes.page }])
              changed = true
            } else {
              // The first element overflows! Split inside it.
              let x = 0
              let y = 0
              if (!isVertical) {
                x = currentRect.left + parseFloat(currentStyle.paddingLeft) + 10
                y = overflowBoundary - 10
              } else {
                x = overflowBoundary + 10
                y = currentRect.top + parseFloat(currentStyle.paddingTop) + 10
              }

              const coordsPos = view.posAtCoords({ left: x, top: y })
              if (coordsPos && coordsPos.pos > splitPos && coordsPos.pos < currentPage.pos + currentPage.node.nodeSize - 1) {
                // Split both the paragraph/block and the page (depth 2)
                tr.split(coordsPos.pos, 2)
                changed = true
              }
            }
            break
          }
        }
      }

      if (changed) {
        view.dispatch(tr.setMeta('pagination', true))
      }
    } catch (e) {
      console.error('[Pagination] Error processing pagination:', e)
    } finally {
      isPaginating = false
    }
  }

  return new Plugin({
    key: paginationPluginKey,
    view(view) {
      const observer = new ResizeObserver(() => {
        requestAnimationFrame(() => {
          if (view.dom) {
            runPagination(view)
          }
        })
      })

      if (view.dom) {
        observer.observe(view.dom)
      }

      return {
        update(view) {
          const hasMeta = view.state.tr.getMeta('pagination')
          if (hasMeta) return

          requestAnimationFrame(() => {
            runPagination(view)
          })
        },
        destroy() {
          observer.disconnect()
        }
      }
    }
  })
}
