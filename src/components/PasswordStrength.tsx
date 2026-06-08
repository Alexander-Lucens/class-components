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
    <ul aria-label="Password strength" style={{ listStyle: 'none', padding: 0, margin: '4px 0 0' }}>
      {criteria.map(({ label, test }) => (
        <li
          key={label}
          data-met={test(password)}
          style={{ color: test(password) ? 'green' : 'gray', fontSize: 12 }}
        >
          {test(password) ? '✓' : '○'} {label}
        </li>
      ))}
    </ul>
  )
}
