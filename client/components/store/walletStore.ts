import AsyncStorage from '@react-native-async-storage/async-storage';
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import { Linking } from 'react-native';
import { create } from 'zustand';

interface WalletStore {
  isConnected: boolean;
  isConnecting: boolean;
  pubkey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  restoreWallet: () => Promise<void>;
}

const APP_IDENTITY = {
  name: 'Ephemeris',
  uri: 'https://ephemeris.app/',
  icon: './assets/images/ephimeris.png',
};

export const useWalletStore = create<WalletStore>((set) => ({
  isConnected: false,
  isConnecting: false,
  pubkey: null,

  connect: async () => {
    set({ isConnecting: true });
    try {
      const res = await transact(async (wallet: Web3MobileWallet) => {
        const authorizationResult = await wallet.authorize({
          chain: 'solana:devnet',
          identity: APP_IDENTITY,
        });

        const base64Address = authorizationResult.accounts[0].address;
        const pubkeyBytes = Uint8Array.from(atob(base64Address), (c) => c.charCodeAt(0));
        return new PublicKey(pubkeyBytes).toBase58();
      });

      set({ isConnected: true, pubkey: res });
      await AsyncStorage.setItem('walletPubkey', res);
      Linking.openURL('ephemeris://');
    } catch (err) {
      console.error('Connection Failed:', err);
      set({ isConnected: false, pubkey: null });
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: async () => {
    set({ isConnected: false, pubkey: null });
    await AsyncStorage.removeItem('walletPubkey');
  },

  restoreWallet: async () => {
    try {
      const savedPubkey = await AsyncStorage.getItem('walletPubkey');
      if (savedPubkey) {
        set({ isConnected: true, pubkey: savedPubkey });
      }
    } catch (err) {
      console.error('Failed to restore wallet:', err);
    }
  },
}));
