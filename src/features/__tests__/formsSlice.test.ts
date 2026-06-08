import { describe, expect, it } from 'vitest'
import formsReducer, {
  addSubmission,
  markRead,
  selectSubmissions,
  selectCountries,
} from '../formsSlice'
import type { FormsState } from '../formsSlice'

const baseState: FormsState = { submissions: [], countries: [] }

const sampleSubmission = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com',
  gender: 'female' as const,
  terms: true,
  image: 'data:image/png;base64,abc',
  password: 'Pass1!',
  country: 'Germany',
}

describe('formsSlice', () => {
  it('addSubmission adds item with isNew: true and a generated id', () => {
    const state = formsReducer(baseState, addSubmission(sampleSubmission))
    expect(state.submissions).toHaveLength(1)
    expect(state.submissions[0].isNew).toBe(true)
    expect(state.submissions[0].id).toBeDefined()
    expect(state.submissions[0].name).toBe('Alice')
  })

  it('addSubmission prepends so newest is first', () => {
    let state = formsReducer(baseState, addSubmission({ ...sampleSubmission, name: 'First' }))
    state = formsReducer(state, addSubmission({ ...sampleSubmission, name: 'Second' }))
    expect(state.submissions[0].name).toBe('Second')
  })

  it('markRead sets isNew to false for matching id', () => {
    let state = formsReducer(baseState, addSubmission(sampleSubmission))
    const id = state.submissions[0].id
    state = formsReducer(state, markRead(id))
    expect(state.submissions[0].isNew).toBe(false)
  })

  it('markRead does not affect other items', () => {
    let state = formsReducer(baseState, addSubmission(sampleSubmission))
    state = formsReducer(state, addSubmission({ ...sampleSubmission, name: 'Bob' }))
    const firstId = state.submissions[1].id
    state = formsReducer(state, markRead(firstId))
    expect(state.submissions[0].isNew).toBe(true)
    expect(state.submissions[1].isNew).toBe(false)
  })

  it('selectSubmissions returns the submissions array', () => {
    const rootState = { forms: { submissions: [{ id: '1', ...sampleSubmission, isNew: false }], countries: [] } } as any
    expect(selectSubmissions(rootState)).toHaveLength(1)
  })

  it('selectCountries returns the countries array from initial state', () => {
    const rootState = { forms: { submissions: [], countries: ['Germany', 'France'] } } as any
    expect(selectCountries(rootState)).toContain('Germany')
  })

  it('initial state has a non-empty countries list', () => {
    const state = formsReducer(undefined, { type: '@@INIT' })
    expect(state.countries.length).toBeGreaterThan(0)
  })
})