import { z } from 'zod'
import {
  strongPasswordRegex,
  passwordValidationMessage,
} from '@/helpers/validation.helper'

export const registerSchema = z.object({
  name: z.string().min(1, 'nome é obrigatório').max(255, 'nome deve ter no máximo 255 caracteres'),
  email: z.string().email('e-mail inválido').max(255, 'e-mail deve ter no máximo 255 caracteres'),
  password: z
    .string()
    .min(8, 'a senha deve ter no mínimo 8 caracteres.')
    .max(255, 'senha deve ter no máximo 255 caracteres')
    .regex(strongPasswordRegex, passwordValidationMessage),
})
