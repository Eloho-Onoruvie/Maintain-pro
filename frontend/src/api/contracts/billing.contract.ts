import { z } from 'zod';

export const subscriptionResponseSchema = z.object({
  id: z.string(),
  ownerType: z.enum(['organization', 'vendor']),
  plan: z.enum(['free', 'starter', 'professional', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annual']).optional(),
  status: z.enum(['trial', 'active', 'past_due', 'cancelled', 'expired']),
  provider: z.enum(['mock', 'stripe', 'paystack', 'flutterwave']).optional(),
  trialEndsAt: z.string().optional(),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const checkoutResponseSchema = z.object({
  paymentId: z.string(),
  providerCheckoutId: z.string(),
  redirectUrl: z.string().optional(),
  status: z.string(),
});

export type SubscriptionResponseContract = z.infer<typeof subscriptionResponseSchema>;
export type CheckoutResponseContract = z.infer<typeof checkoutResponseSchema>;

export function toSubscriptionResponse(value: unknown): SubscriptionResponseContract {
  return subscriptionResponseSchema.parse(value);
}

export function toCheckoutResponse(value: unknown): CheckoutResponseContract {
  return checkoutResponseSchema.parse(value);
}
