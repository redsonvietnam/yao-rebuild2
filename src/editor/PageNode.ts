import { Node, mergeAttributes } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export interface PageOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    page: {
      setPageMode: (mode: 'horizontal-tb' | 'vertical-rl') => ReturnType
      setPageOrientation: (orientation: 'portrait' | 'landscape') => ReturnType
    }
  }
}

export const PageNode = Node.create<PageOptions>({
  name: 'page',
  group: 'block',
  content: 'block+',
  
  addAttributes() {
    return {
      writingMode: {
        default: 'horizontal-tb',
        parseHTML: element => element.style.writingMode || 'horizontal-tb',
        renderHTML: attributes => ({
          style: `writing-mode: ${attributes.writingMode};`,
          class: `yao-page ${attributes.writingMode === 'vertical-rl' ? 'writing-vertical' : 'writing-horizontal'}`
        }),
      },
      pageSize: {
        default: 'A4',
      },
      orientation: {
        default: 'portrait',
        parseHTML: element => element.getAttribute('data-orientation') || 'portrait',
        renderHTML: attributes => ({
          'data-orientation': attributes.orientation,
          class: `yao-page ${attributes.orientation === 'landscape' ? 'page-landscape' : 'page-portrait'} ${attributes.writingMode === 'vertical-rl' ? 'writing-vertical' : 'writing-horizontal'}`
        }),
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.yao-page',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setPageMode: mode => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.doc.descendants((node, pos) => {
            if (node.type.name === 'page') {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, writingMode: mode })
            }
          })
        }
        return true
      },
      setPageOrientation: orientation => ({ tr, dispatch }) => {
        if (dispatch) {
          tr.doc.descendants((node, pos) => {
            if (node.type.name === 'page') {
              tr.setNodeMarkup(pos, undefined, { ...node.attrs, orientation })
            }
          })
        }
        return true
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        // Don't prevent default, let TipTap handle it
        // But we'll fix it in the plugin if needed
        return false
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('ensurePageContent'),
        appendTransaction(transactions, oldState, newState) {
          const tr = newState.tr
          let changed = false

          // Count pages
          let pageCount = 0
          newState.doc.descendants((node) => {
            if (node.type.name === 'page') {
              pageCount++
            }
          })

          console.log('[PageNode] Page count:', pageCount)

          // If no pages exist, create one with a paragraph
          if (pageCount === 0) {
            console.log('[PageNode] No pages found! Creating a new page...')
            const paragraph = newState.schema.nodes.paragraph.create()
            const page = newState.schema.nodes.page.create(
              { writingMode: 'horizontal-tb', pageSize: 'A4' },
              paragraph
            )
            tr.replaceWith(0, newState.doc.content.size, page)
            changed = true
          } else {
            // Check for empty pages and add paragraphs
            newState.doc.descendants((node, pos) => {
              if (node.type.name === 'page' && node.content.size === 0) {
                console.log('[PageNode] Empty page found at pos:', pos, '- adding paragraph')
                const paragraph = newState.schema.nodes.paragraph.create()
                tr.insert(pos + 1, paragraph)
                changed = true
              }
            })
          }

          return changed ? tr : null
        },
      }),
    ]
  },
})
