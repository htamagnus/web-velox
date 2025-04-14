type FormWrapperProps = {
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
export function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-md text-foreground rounded-2xl shadow-xl space-y-6"
    >
      {children}
    </form>
  )
}
