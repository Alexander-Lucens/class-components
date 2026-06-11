import { describe, expect, it } from 'vitest'
import { formSchema } from '../validation'

const COUNTRIES = ['Germany', 'France', 'United States']
const ctx = { context: { countries: COUNTRIES } }

const validData = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female',
  terms: true,
  image: new File(['x'], 'a.png', { type: 'image/png' }),
  password: 'Pass1!ab',
  confirmPassword: 'Pass1!ab',
  country: 'Germany',
}

describe('formSchema', () => {
  it('passes for fully valid data', async () => {
    await expect(formSchema.validate(validData, ctx)).resolves.toBeDefined()
  })

  describe('name', () => {
    it('rejects empty name', async () => {
      await expect(formSchema.validateAt('name', { name: '' }, ctx)).rejects.toThrow('required')
    })
    it('rejects lowercase first letter', async () => {
      await expect(formSchema.validateAt('name', { name: 'alice' }, ctx)).rejects.toThrow('uppercase')
    })
    it('accepts uppercase first letter', async () => {
      await expect(formSchema.validateAt('name', { name: 'Alice' }, ctx)).resolves.toBe('Alice')
    })
  })

  describe('age', () => {
    it('rejects negative age', async () => {
      await expect(formSchema.validateAt('age', { age: -1 }, ctx)).rejects.toThrow('non-negative')
    })
    it('rejects non-numeric string', async () => {
      await expect(formSchema.validateAt('age', { age: NaN }, ctx)).rejects.toThrow()
    })
    it('accepts zero', async () => {
      await expect(formSchema.validateAt('age', { age: 0 }, ctx)).resolves.toBe(0)
    })
  })

  describe('email', () => {
    it('rejects empty email', async () => {
      await expect(formSchema.validateAt('email', { email: '' }, ctx)).rejects.toThrow('required')
    })
    it('rejects email without @', async () => {
      await expect(formSchema.validateAt('email', { email: 'noatsign.com' }, ctx)).rejects.toThrow('Invalid')
    })
    it('rejects email with @ at start', async () => {
      await expect(formSchema.validateAt('email', { email: '@domain.com' }, ctx)).rejects.toThrow('Invalid')
    })
    it('rejects email without dot in domain', async () => {
      await expect(formSchema.validateAt('email', { email: 'user@domain' }, ctx)).rejects.toThrow('Invalid')
    })
    it('accepts valid email', async () => {
      await expect(formSchema.validateAt('email', { email: 'a@b.co' }, ctx)).resolves.toBe('a@b.co')
    })
  })

  describe('passwords', () => {
    it('rejects password shorter than 8 chars', async () => {
      await expect(formSchema.validateAt('password', { password: 'Ab1!' }, ctx)).rejects.toThrow('8')
    })
    it('rejects mismatched confirmPassword', async () => {
      await expect(
        formSchema.validate({ ...validData, confirmPassword: 'Different1!' }, ctx)
      ).rejects.toThrow('match')
    })
  })

  describe('country', () => {
    it('rejects country not in list', async () => {
      await expect(
        formSchema.validate({ ...validData, country: 'Narnia' }, ctx)
      ).rejects.toThrow('list')
    })
    it('accepts country from the list', async () => {
      await expect(
        formSchema.validateAt('country', { country: 'Germany' }, ctx)
      ).resolves.toBe('Germany')
    })
  })

  describe('terms', () => {
    it('rejects unchecked terms', async () => {
      await expect(
        formSchema.validate({ ...validData, terms: false }, ctx)
      ).rejects.toThrow('terms')
    })
  })
})
