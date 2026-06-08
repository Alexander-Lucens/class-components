import * as yup from 'yup'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg']

function validateEmail(value: string | undefined): boolean {
  if (!value) return false
  const atIndex = value.indexOf('@')
  if (atIndex < 1) return false
  const local = value.slice(0, atIndex)
  const domain = value.slice(atIndex + 1)
  if (!local) return false
  const dotIndex = domain.indexOf('.')
  if (dotIndex < 1 || dotIndex === domain.length - 1) return false
  return true
}

export const formSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .test('uppercase-first', 'First letter must be uppercase', (v) =>
      !v ? false : v[0] === v[0].toUpperCase()
    ),
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(0, 'Age must be non-negative'),
  email: yup
    .string()
    .required('Email is required')
    .test('valid-email', 'Invalid email address', (v) => validateEmail(v)),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'other'], 'Select a gender')
    .required('Gender is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms')
    .required('You must accept the terms'),
  image: yup
    .mixed<FileList | File | null>()
    .nullable()
    .test('image-required', 'Image is required', (v) => {
      if (v instanceof FileList) return v.length > 0
      if (v instanceof File) return true
      return false
    })
    .test('image-type', 'Only PNG and JPEG images are allowed', (v) => {
      const file = v instanceof FileList ? v[0] : (v as File | null | undefined)
      if (!file) return true
      return ALLOWED_IMAGE_TYPES.includes(file.type)
    })
    .test('image-size', 'Image must be smaller than 5MB', (v) => {
      const file = v instanceof FileList ? v[0] : (v as File | null | undefined)
      if (!file) return true
      return file.size <= MAX_IMAGE_SIZE
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  country: yup
    .string()
    .required('Country is required')
    .test('valid-country', 'Country must be selected from the list', function (value) {
      const { countries } = this.options.context as { countries?: string[] }
      if (!countries || countries.length === 0) return true
      return countries.includes(value ?? '')
    }),
})

export type FormValues = yup.InferType<typeof formSchema>
