import { describe, expect, it, vi } from 'vitest'
import { fileToBase64 } from '../imageUtils'

describe('fileToBase64', () => {
  it('resolves with a base64 data URL string', async () => {
    const content = 'fake-image-content'
    const file = new File([content], 'test.png', { type: 'image/png' })
    const result = await fileToBase64(file)
    expect(typeof result).toBe('string')
    expect(result.startsWith('data:')).toBe(true)
  })

  it('returns different results for different file contents', async () => {
    const file1 = new File(['aaa'], 'a.png', { type: 'image/png' })
    const file2 = new File(['bbb'], 'b.png', { type: 'image/png' })
    const [r1, r2] = await Promise.all([fileToBase64(file1), fileToBase64(file2)])
    expect(r1).not.toBe(r2)
  })

  it('rejects when FileReader fires an error', async () => {
    const file = new File(['x'], 'test.png', { type: 'image/png' })
    vi.spyOn(FileReader.prototype, 'readAsDataURL').mockImplementationOnce(function (this: FileReader) {
      setTimeout(() => this.onerror?.(new ProgressEvent('error')))
    })
    await expect(fileToBase64(file)).rejects.toThrow('Failed to read file')
  })
})
