import { Extension } from '@tiptap/core'

export interface AlignmentOptions {
  types: string[]
  alignments: string[]
  defaultAlignment: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    alignment: {
      setTextAlign: (alignment: string) => ReturnType
      unsetTextAlign: () => ReturnType
    }
  }
}

export const AlignmentExtension = Extension.create<AlignmentOptions>({
  name: 'alignment',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left',
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          align: {
            default: this.options.defaultAlignment,
            parseHTML: element => element.style.textAlign || this.options.defaultAlignment,
            renderHTML: attributes => {
              if (attributes.align === this.options.defaultAlignment) {
                return {}
              }
              return { style: `text-align: ${attributes.align}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTextAlign: (alignment: string) => ({ commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false
        }
        return this.options.types.some(type => commands.updateAttributes(type, { align: alignment }))
      },
      unsetTextAlign: () => ({ commands }) => {
        return this.options.types.some(type => commands.updateAttributes(type, { align: null }))
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-l': () => this.editor.commands.setTextAlign('left'),
      'Mod-Shift-e': () => this.editor.commands.setTextAlign('center'),
      'Mod-Shift-r': () => this.editor.commands.setTextAlign('right'),
      'Mod-Shift-j': () => this.editor.commands.setTextAlign('justify'),
    }
  },
})
