import { z } from 'zod';

const emailSchema = z
  .string({ error: 'E-posta alanı zorunludur.' })
  .trim()
  .min(1, 'E-posta alanı zorunludur.')
  .email('Geçerli bir e-posta adresi giriniz.')
  .max(191, 'E-posta en fazla 191 karakter olabilir.');

const passwordSchema = z
  .string({ error: 'Şifre alanı zorunludur.' })
  .min(8, 'Şifre en az 8 karakter olmalıdır.')
  .max(72, 'Şifre en fazla 72 karakter olabilir.')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir.')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir.')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir.');

export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Ad alanı zorunludur.' })
      .trim()
      .min(2, 'Ad en az 2 karakter olmalıdır.')
      .max(100, 'Ad en fazla 100 karakter olabilir.'),
    email: emailSchema,
    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ error: 'Şifre alanı zorunludur.' })
      .min(1, 'Şifre alanı zorunludur.'),
  })
  .strict();
