import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../hooks/redux'
import { addSubmission, selectCountries } from '../features/formsSlice'
import { formSchema } from '../utils/validation'
import type { FormValues } from '../utils/validation'
import PasswordStrength from '../components/PasswordStrength'
import { fileToBase64 } from '../utils/imageUtils'

interface Props {
  onClose: () => void
}

export default function HookForm({ onClose }: Props) {
  const dispatch = useAppDispatch()
  const countries = useSelector(selectCountries)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(formSchema) as Resolver<FormValues>,
    context: { countries },
    mode: 'onChange',
  })

  const passwordValue = watch('password', '')

  const onSubmit = async (data: FormValues) => {
    const file = data.image instanceof FileList ? data.image[0] : null
    const image = file ? await fileToBase64(file) : ''
    dispatch(addSubmission({ ...data, image, gender: data.gender as 'male' | 'female' | 'other' }))
    onClose()
  }

  return (
    <form onSubmit={(e) => { void handleSubmit(onSubmit)(e) }} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="hf-name">Name</label>
        <input className="form-input" id="hf-name" type="text" {...register('name')} />
        {errors.name && <p className="form-error" role="alert">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-age">Age</label>
        <input className="form-input" id="hf-age" type="number" {...register('age', { valueAsNumber: true })} />
        {errors.age && <p className="form-error" role="alert">{errors.age.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-email">Email</label>
        <input className="form-input" id="hf-email" type="email" {...register('email')} />
        {errors.email && <p className="form-error" role="alert">{errors.email.message}</p>}
      </div>

      <fieldset className="form-fieldset">
        <legend>Gender</legend>
        <div className="form-radio-group">
          <label className="form-radio-label" htmlFor="hf-male">
            <input id="hf-male" type="radio" value="male" {...register('gender')} />
            Male
          </label>
          <label className="form-radio-label" htmlFor="hf-female">
            <input id="hf-female" type="radio" value="female" {...register('gender')} />
            Female
          </label>
          <label className="form-radio-label" htmlFor="hf-other">
            <input id="hf-other" type="radio" value="other" {...register('gender')} />
            Other
          </label>
        </div>
        {errors.gender && <p className="form-error" role="alert">{errors.gender.message}</p>}
      </fieldset>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-password">Password</label>
        <input className="form-input" id="hf-password" type="password" {...register('password')} />
        {errors.password && <p className="form-error" role="alert">{errors.password.message}</p>}
        <PasswordStrength password={passwordValue} />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-confirm-password">Confirm Password</label>
        <input className="form-input" id="hf-confirm-password" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="form-error" role="alert">{errors.confirmPassword.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-country">Country</label>
        <input className="form-input" id="hf-country" type="text" list="hf-countries-list" {...register('country')} />
        <datalist id="hf-countries-list">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.country && <p className="form-error" role="alert">{errors.country.message}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hf-image">Image (PNG/JPEG, max 5MB)</label>
        <input className="form-input" id="hf-image" type="file" accept="image/png,image/jpeg" {...register('image')} />
        {errors.image && <p className="form-error" role="alert">{errors.image.message}</p>}
      </div>

      <div className="form-group form-checkbox-group">
        <input id="hf-terms" type="checkbox" {...register('terms')} />
        <label className="form-label" htmlFor="hf-terms">I agree to the Terms</label>
        {errors.terms && <p className="form-error" role="alert">{errors.terms.message}</p>}
      </div>

      <button type="submit" className="form-submit" disabled={!isValid}>Submit</button>
    </form>
  )
}
