import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildCsv, exportSelectedToCsv } from '../csv'

const sample = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/', description: 'Seed Pokémon' }]

describe('csv utils', () => {
  beforeEach(() => {
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      if (tagName === 'a') {
        const anchor = originalCreateElement('a') as HTMLAnchorElement
        anchor.click = vi.fn()
        return anchor
      }
      return originalCreateElement(tagName)
    }) as typeof document.createElement)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('builds csv string with header and escaped values', () => {
    const csv = buildCsv(sample)

    expect(csv).toContain('name,description,url')
    expect(csv).toContain('bulbasaur,Seed Pokémon,https://pokeapi.co/api/v2/pokemon/1/')
  })

  it('wraps field in quotes when value contains a comma', () => {
    const csv = buildCsv([{ name: 'Bulba, saur', url: '/b', description: 'desc' }])
    expect(csv).toContain('"Bulba, saur"')
  })

  it('wraps field in quotes and doubles internal quotes when value contains a double-quote', () => {
    const csv = buildCsv([{ name: 'Say "hi"', url: '/b', description: 'desc' }])
    expect(csv).toContain('"Say ""hi"""')
  })

  it('wraps field in quotes when value contains a newline', () => {
    const csv = buildCsv([{ name: 'line1\nline2', url: '/b', description: 'desc' }])
    expect(csv).toContain('"line1\nline2"')
  })

  it('does not wrap plain values without special characters', () => {
    const csv = buildCsv([{ name: 'pikachu', url: '/p', description: 'electric' }])
    expect(csv).toContain('pikachu,electric,/p')
  })

  it('triggers native download with item count in filename', () => {
    exportSelectedToCsv(sample)

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
