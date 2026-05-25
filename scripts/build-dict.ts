import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAW_DICT_PATH = path.resolve(__dirname, '../src/assets/raw/yao.dict.yaml')
const OUTPUT_PATH = path.resolve(__dirname, '../src/assets/dict.json')

function buildDict() {
  console.log('[Build-Dict] Starting...')

  if (!fs.existsSync(RAW_DICT_PATH)) {
    console.error(`[Build-Dict] File not found: ${RAW_DICT_PATH}`)
    process.exit(1)
  }

  const content = fs.readFileSync(RAW_DICT_PATH, 'utf-8')
  const parts = content.split('...')
  
  if (parts.length < 2) {
    console.error('[Build-Dict] Invalid YAML format (missing ... separator)')
    process.exit(1)
  }

  // Part 0 is metadata, Part 1 is the actual dictionary
  const dictContent = parts[1].trim()
  const lines = dictContent.split('\n')
  
  const dict: Record<string, any[]> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const [hanzi, pinyin, weightStr] = trimmed.split('\t')
    if (!hanzi || !pinyin) continue

    const weight = weightStr ? parseInt(weightStr) : 0

    if (!dict[pinyin]) {
      dict[pinyin] = []
    }

    dict[pinyin].push({
      hanzi,
      pinyin,
      weight
    })
  }

  // Sort candidates by weight
  for (const key in dict) {
    dict[key].sort((a, b) => b.weight - a.weight)
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(dict, null, 2))
  console.log(`[Build-Dict] Done! Created ${OUTPUT_PATH} with ${Object.keys(dict).length} entries.`)
}

buildDict()
