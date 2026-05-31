// geminiService.ts — M19: Gemini API integration for character explanation
// Uses @google/genai (already in package.json)

export interface CharacterExplanation {
  hanzi: string
  meaning: string        // Nghĩa tiếng Việt
  radical: string         // Bộ thủ
  sinoVietnamese: string  // Âm Hán Việt
  examples: string[]      // Ví dụ từ ghép
  strokeCount: number
}

const PROMPT_TEMPLATE = `Explain the Chinese character "{{hanzi}}" in Vietnamese. Respond ONLY with a valid JSON object (no markdown, no code fences) with these fields:
- meaning: meaning in Vietnamese (1-2 sentences)
- radical: the radical/bộ thủ (in Vietnamese, e.g. "Bộ Nhân (人)")
- sinoVietnamese: the Sino-Vietnamese reading/âm Hán Việt
- examples: array of 3 compound words using this character, with Vietnamese meaning in parentheses
- strokeCount: total stroke count as a number

Example response:
{"meaning":"Người, con người, nhân loại. Chỉ về cá thể trong xã hội.","radical":"Bộ Nhân (人)","sinoVietnamese":"nhân","examples":["人民 (nhân dân - người dân)","人間 (nhân gian - cõi người)","人格 (nhân cách - phẩm giá)"],"strokeCount":2}`

const GEMINI_TIMEOUT_MS = 30000 // 30 seconds timeout

async function callGemini(prompt: string): Promise<string> {
  // Dynamic import to avoid issues if module isn't loaded
  const { GoogleGenAI } = await import('@google/genai')
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Set VITE_GEMINI_API_KEY in .env')
  }

  const genAI = new GoogleGenAI({ apiKey })
  
  // Create timeout promise
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Gemini timeout'))
    }, GEMINI_TIMEOUT_MS)
  })
  
  // Create API call promise
  const apiPromise = genAI.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
  })

  const response = await Promise.race([apiPromise, timeoutPromise])

  const text = response.text || ''
  if (!text) {
    throw new Error('Gemini returned empty response')
  }
  return text
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code fences if present
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7)
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3)
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3)
  }
  return cleaned.trim()
}

export async function explainCharacter(hanzi: string): Promise<CharacterExplanation> {
  const prompt = PROMPT_TEMPLATE.replace('{{hanzi}}', hanzi)

  try {
    const rawText = await callGemini(prompt)
    const cleaned = cleanJsonResponse(rawText)
    const parsed = JSON.parse(cleaned)

    return {
      hanzi,
      meaning: parsed.meaning || 'Không có thông tin',
      radical: parsed.radical || 'Không xác định',
      sinoVietnamese: parsed.sinoVietnamese || 'Không xác định',
      examples: Array.isArray(parsed.examples) ? parsed.examples : [],
      strokeCount: typeof parsed.strokeCount === 'number' ? parsed.strokeCount : 0,
    }
  } catch (err) {
    // Re-throw error so caller can handle with notification
    const message = err instanceof Error ? err.message : 'Lỗi không xác định'
    throw new Error(message)
  }
}