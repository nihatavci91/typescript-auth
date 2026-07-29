import { z } from 'zod';

export const authorizationHeaderSchema = z
  .string({ error: 'Authorization başlığı zorunludur.' })
  .regex(/^Bearer\s+\S+$/, 'Authorization başlığı "Bearer TOKEN" biçiminde olmalıdır.');

export const tokenPayloadSchema = z
  .object({
    id: z.number().int().positive('Token içindeki kullanıcı ID değeri geçersiz.'),
    email: z.string().email('Token içindeki e-posta değeri geçersiz.'),
  })
  .passthrough();
