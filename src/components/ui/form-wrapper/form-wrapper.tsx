type FormWrapperProps = {
  children: React.ReactNode
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}
export function FormWrapper({ children, onSubmit }: FormWrapperProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-[#1a2234] to-[#0f1419] border border-copy/10 rounded-2xl shadow-xl space-y-4"
    >
      {children}
    </form>
  )
}
