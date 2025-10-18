import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').max(255, 'E-mail deve ter no máximo 255 caracteres'),
  password: z.string().min(1, 'Digite sua senha.').max(255, 'Senha deve ter no máximo 255 caracteres'),
})
