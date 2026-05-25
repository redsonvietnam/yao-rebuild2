export function transform(input: string): string {
  let result = input.toLowerCase()
  
  // Vowels transformation
  const rules: [string, string][] = [
    ['aw', 'ă'],
    ['iy', 'ĭ'],
    ['ew', 'ĕ'],
    ['ow', 'ŏ'],
    ['ee', 'ê'],
    ['oo', 'ô'],
  ]

  for (const [ascii, unicode] of rules) {
    result = result.replaceAll(ascii, unicode)
  }

  return result
}
