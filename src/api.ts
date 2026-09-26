import { z } from 'zod';

export const paymentSchema = z.object({
  id: z.string(),
  value: z.number().positive(),
  currency: z.enum(['GBP', 'USD', 'EUR']),
  status: z.enum(['processing', 'completed', 'failed']),
  createdAt: z.iso.datetime(),
});
export type Payment = z.infer<typeof paymentSchema>;

export const createPaymentRequestSchema = paymentSchema.pick({
  value: true,
  currency: true,
});
export type CreatePaymentRequest = z.infer<typeof createPaymentRequestSchema>;

export const problemSchema = z.object({
  error: z.string(),
});
