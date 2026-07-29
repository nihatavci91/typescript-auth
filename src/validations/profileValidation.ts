import { z } from 'zod';

const optionalText = (fieldName: string, maxLength: number) =>
  z
    .string({ error: `${fieldName} metin olmalıdır.` })
    .trim()
    .min(1, `${fieldName} boş bırakılamaz.`)
    .max(maxLength, `${fieldName} en fazla ${maxLength} karakter olabilir.`)
    .nullable()
    .optional();

export const updateProfileSchema = z
  .object({
    firstName: optionalText('Ad', 100),
    lastName: optionalText('Soyad', 100),
    birthDate: z
      .string({ error: 'Doğum tarihi metin olmalıdır.' })
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Doğum tarihi YYYY-MM-DD biçiminde olmalıdır.')
      .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);
        return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
      }, 'Geçerli bir doğum tarihi giriniz.')
      .refine(
        (value) => new Date(`${value}T00:00:00.000Z`) <= new Date(),
        'Doğum tarihi gelecekte olamaz.',
      )
      .nullable()
      .optional(),
    address: optionalText('Adres', 1000),
    phone: z
      .string({ error: 'Cep telefonu metin olmalıdır.' })
      .trim()
      .regex(/^\+?[0-9][0-9 ()-]{7,28}$/, 'Geçerli bir cep telefonu numarası giriniz.')
      .nullable()
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Güncellenecek en az bir profil alanı gönderilmelidir.',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
