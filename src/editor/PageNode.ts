import { Node, mergeAttributes } from '@tiptap/core'

export interface PageOptions {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    page: {
      setPageMode: (mode: 'horizontal-tb' | 'vertical-rl') => ReturnType
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
    }
  },
})
