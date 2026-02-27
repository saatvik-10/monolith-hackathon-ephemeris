import { z } from 'zod';

export const receiptSchema = z.object({
  description: z
    .string()
    .min(5, 'Description must be atleast 5 characters long'),
});

export const nftMintSchema = z.object({
  walletAddress: z.string(),
});

export type receiptType = z.infer<typeof receiptSchema>;
export type nftMintType = z.infer<typeof nftMintSchema>;
