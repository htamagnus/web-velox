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
      <label htmlFor={name} className="block text-s font-medium text-gray-400 mb-2">
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
        className={`mt-1 block w-full px-4 py-3 rounded-xl text-white bg-white/5 border ${
          error ? 'border-red-500' : 'border-white/10 hover:border-white/20 focus:border-primary-light/50'
        } outline-none transition-all`}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
