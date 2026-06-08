import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import COUNTRIES from '../data/countries'
import type { RootState } from '../types/store'

export interface FormSubmission {
  id: string
  name: string
  age: number
  email: string
  gender: 'male' | 'female' | 'other'
  terms: boolean
  image: string
  password: string
  country: string
  isNew: boolean
}

export interface FormsState {
  submissions: FormSubmission[]
  countries: string[]
}

type SubmissionInput = Omit<FormSubmission, 'id' | 'isNew'>

const initialState: FormsState = {
  submissions: [],
  countries: COUNTRIES,
}

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission(state, action: PayloadAction<SubmissionInput>) {
      state.submissions.unshift({
        ...action.payload,
        id: crypto.randomUUID(),
        isNew: true,
      })
    },
    markRead(state, action: PayloadAction<string>) {
      const item = state.submissions.find((s) => s.id === action.payload)
      if (item) item.isNew = false
    },
  },
})

export const { addSubmission, markRead } = formsSlice.actions

export const selectSubmissions = (state: RootState) => state.forms.submissions
export const selectCountries = (state: RootState) => state.forms.countries

export default formsSlice.reducer
