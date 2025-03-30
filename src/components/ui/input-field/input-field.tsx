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
    required = false
  }: InputFieldProps) {
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mt-5">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className={`mt-1 block w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          placeholder={placeholder}
          required={required}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    )
  }
  