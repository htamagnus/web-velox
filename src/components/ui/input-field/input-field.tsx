type InputFieldProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
}

export default function InputField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
}: InputFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-medium text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full px-4 py-2 rounded-md shadow-sm bg-transparent text-foreground placeholder:text-muted border ${
          error ? 'border-red-500' : 'border-border'
        } focus:ring-2 focus:ring-accent focus:outline-none`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
