import { z } from 'zod';

export const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.email('Email inválido'),
    senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    telefone: z.string().min(8, 'Telefone inválido'),

    tipo: z.enum(['PF', 'PJ']),

    cpf: z.string().optional(),
    cnpj: z.string().optional(),

    foto: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'PF' && !data.cpf) {
      ctx.addIssue({
        path: ['cpf'],
        message: 'CPF é obrigatório',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.tipo === 'PJ' && !data.cnpj) {
      ctx.addIssue({
        path: ['cnpj'],
        message: 'CNPJ é obrigatório',
        code: z.ZodIssueCode.custom,
      });
    }
  });
