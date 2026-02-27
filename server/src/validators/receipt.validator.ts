import { z } from 'zod';

export const receiptSchema = z.object({
  description: z
    .string()
    .min(5, 'Description must be atleast 5 characters long'),
});

export const nftMintSchema = z.object({
  walletAddress: z.string().min(32).max(44),
});

export type receiptType = z.infer<typeof receiptSchema>;
export type nftMintType = z.infer<typeof nftMintSchema>;
