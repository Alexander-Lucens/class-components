interface Props {
  password: string
}

const criteria = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function PasswordStrength({ password }: Props) {
  if (!password) return null

  return (
    <ul className="password-strength" aria-label="Password strength">
      {criteria.map(({ label, test }) => (
        <li
          key={label}
          className="password-strength__item"
          data-met={test(password)}
        >
          {test(password) ? '✓' : '○'} {label}
        </li>
      ))}
    </ul>
  )
}
