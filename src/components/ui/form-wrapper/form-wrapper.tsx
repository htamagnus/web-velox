type FormWrapperProps = {
    children: React.ReactNode
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  }
  
  export function FormWrapper({ children, onSubmit }: FormWrapperProps) {
    return (
      <form onSubmit={onSubmit} className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
        {children}
      </form>
    )
  }
  