import LoginForm from "@/components/login-form/login-form.component";
import LanguageSelector from "@/components/language-selector/language-selector";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      <LoginForm />
    </main>
  )
}
