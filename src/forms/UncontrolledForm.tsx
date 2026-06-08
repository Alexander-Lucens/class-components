import { useRef, useState } from 'react'
import { useAppDispatch } from '../hooks/redux'
import { addSubmission } from '../features/formsSlice'
import { useSelector } from 'react-redux'
import { selectCountries } from '../features/formsSlice'
import { formSchema } from '../utils/validation'
import type { ValidationError } from 'yup'
import PasswordStrength from '../components/PasswordStrength'
import { fileToBase64 } from '../utils/imageUtils'

interface Props {
  onClose: () => void
}

type FormErrors = Partial<Record<string, string>>

export default function UncontrolledForm({ onClose }: Props) {
  const dispatch = useAppDispatch()
  const countries = useSelector(selectCountries)

  const nameRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const genderMaleRef = useRef<HTMLInputElement>(null)
  const genderFemaleRef = useRef<HTMLInputElement>(null)
  const genderOtherRef = useRef<HTMLInputElement>(null)
  const termsRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)

  const [errors, setErrors] = useState<FormErrors>({})
  const [passwordValue, setPasswordValue] = useState('')

  const getGender = () => {
    if (genderMaleRef.current?.checked) return 'male'
    if (genderFemaleRef.current?.checked) return 'female'
    if (genderOtherRef.current?.checked) return 'other'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const file = imageRef.current?.files?.[0] ?? null
    const rawData = {
      name: nameRef.current?.value ?? '',
      age: Number(ageRef.current?.value),
      email: emailRef.current?.value ?? '',
      gender: getGender(),
      terms: termsRef.current?.checked ?? false,
      image: file,
      password: passwordRef.current?.value ?? '',
      confirmPassword: confirmPasswordRef.current?.value ?? '',
      country: countryRef.current?.value ?? '',
    }

    try {
      await formSchema.validate(rawData, { abortEarly: false, context: { countries } })
    } catch (err) {
      const yupError = err as ValidationError
      const fieldErrors: FormErrors = {}
      yupError.inner.forEach((e) => {
        if (e.path) fieldErrors[e.path] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    const image = file ? await fileToBase64(file) : ''
    dispatch(addSubmission({ ...rawData, image, gender: rawData.gender as 'male' | 'female' | 'other' }))
    onClose()
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(e) }} noValidate>
      <div>
        <label htmlFor="uc-name">Name</label>
        <input id="uc-name" type="text" ref={nameRef} />
        {errors.name && <p role="alert">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="uc-age">Age</label>
        <input id="uc-age" type="number" ref={ageRef} />
        {errors.age && <p role="alert">{errors.age}</p>}
      </div>

      <div>
        <label htmlFor="uc-email">Email</label>
        <input id="uc-email" type="email" ref={emailRef} />
        {errors.email && <p role="alert">{errors.email}</p>}
      </div>

      <fieldset>
        <legend>Gender</legend>
        <label htmlFor="uc-male">Male</label>
        <input id="uc-male" type="radio" name="gender" value="male" ref={genderMaleRef} />
        <label htmlFor="uc-female">Female</label>
        <input id="uc-female" type="radio" name="gender" value="female" ref={genderFemaleRef} />
        <label htmlFor="uc-other">Other</label>
        <input id="uc-other" type="radio" name="gender" value="other" ref={genderOtherRef} />
        {errors.gender && <p role="alert">{errors.gender}</p>}
      </fieldset>

      <div>
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          type="password"
          ref={passwordRef}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        {errors.password && <p role="alert">{errors.password}</p>}
        <PasswordStrength password={passwordValue} />
      </div>

      <div>
        <label htmlFor="uc-confirm-password">Confirm Password</label>
        <input id="uc-confirm-password" type="password" ref={confirmPasswordRef} />
        {errors.confirmPassword && <p role="alert">{errors.confirmPassword}</p>}
      </div>

      <div>
        <label htmlFor="uc-country">Country</label>
        <input id="uc-country" type="text" list="uc-countries-list" ref={countryRef} />
        <datalist id="uc-countries-list">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.country && <p role="alert">{errors.country}</p>}
      </div>

      <div>
        <label htmlFor="uc-image">Image (PNG/JPEG, max 5MB)</label>
        <input id="uc-image" type="file" accept="image/png,image/jpeg" ref={imageRef} />
        {errors.image && <p role="alert">{errors.image}</p>}
      </div>

      <div>
        <label htmlFor="uc-terms">I agree to the Terms</label>
        <input id="uc-terms" type="checkbox" ref={termsRef} />
        {errors.terms && <p role="alert">{errors.terms}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  )
}
