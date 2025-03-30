import { z } from 'zod'
import {
  strongPasswordRegex,
  passwordValidationMessage,
} from '@/helpers/validation'

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(strongPasswordRegex, passwordValidationMessage),
})
