import { useForm } from 'react-hook-form'
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
    resolver: yupResolver(formSchema),
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
      <div>
        <label htmlFor="hf-name">Name</label>
        <input id="hf-name" type="text" {...register('name')} />
        {errors.name && <p role="alert">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="hf-age">Age</label>
        <input id="hf-age" type="number" {...register('age', { valueAsNumber: true })} />
        {errors.age && <p role="alert">{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="hf-email">Email</label>
        <input id="hf-email" type="email" {...register('email')} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      <fieldset>
        <legend>Gender</legend>
        <label htmlFor="hf-male">Male</label>
        <input id="hf-male" type="radio" value="male" {...register('gender')} />
        <label htmlFor="hf-female">Female</label>
        <input id="hf-female" type="radio" value="female" {...register('gender')} />
        <label htmlFor="hf-other">Other</label>
        <input id="hf-other" type="radio" value="other" {...register('gender')} />
        {errors.gender && <p role="alert">{errors.gender.message}</p>}
      </fieldset>

      <div>
        <label htmlFor="hf-password">Password</label>
        <input id="hf-password" type="password" {...register('password')} />
        {errors.password && <p role="alert">{errors.password.message}</p>}
        <PasswordStrength password={passwordValue} />
      </div>

      <div>
        <label htmlFor="hf-confirm-password">Confirm Password</label>
        <input id="hf-confirm-password" type="password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p role="alert">{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <label htmlFor="hf-country">Country</label>
        <input id="hf-country" type="text" list="hf-countries-list" {...register('country')} />
        <datalist id="hf-countries-list">
          {countries.map((c) => <option key={c} value={c} />)}
        </datalist>
        {errors.country && <p role="alert">{errors.country.message}</p>}
      </div>

      <div>
        <label htmlFor="hf-image">Image (PNG/JPEG, max 5MB)</label>
        <input id="hf-image" type="file" accept="image/png,image/jpeg" {...register('image')} />
        {errors.image && <p role="alert">{errors.image.message}</p>}
      </div>

      <div>
        <label htmlFor="hf-terms">I agree to the Terms</label>
        <input id="hf-terms" type="checkbox" {...register('terms')} />
        {errors.terms && <p role="alert">{errors.terms.message}</p>}
      </div>

      <button type="submit" disabled={!isValid}>Submit</button>
    </form>
  )
}
