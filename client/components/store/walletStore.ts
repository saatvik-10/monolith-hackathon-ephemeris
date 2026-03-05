import { create } from 'zustand';
import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WalletStore {
  isConnected: boolean;
  isConnecting: boolean;
  pubkey: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  restoreWallet: () => Promise<void>;
}

const APP_IDENTITY = {
  name: 'Monolith',
  uri: '',
  icon: '',
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
          chain: `Solana: Devnet`,
          identity: APP_IDENTITY,
        });

        return authorizationResult.accounts[0].address;
      });

      set({ isConnected: true, pubkey: res });
      await AsyncStorage.setItem('walletPubkey', res);
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
