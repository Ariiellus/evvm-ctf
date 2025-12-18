import { Magic as MagicBase } from 'magic-sdk';
import { MagicRPCError } from '@magic-sdk/provider';
import { RPCErrorCode } from '@magic-sdk/types';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Magic = MagicBase;

type MagicContextType = {
  magic: Magic | null;
  loginWithMagicLink: (email: string, showUI?: boolean) => Promise<string | null>;
  loginWithEmailOTP: (email: string, showUI?: boolean) => Promise<string | null>;
  connectWithUI: () => Promise<string[]>;
  logout: () => Promise<void>;
  isLoggedIn: () => Promise<boolean>;
  getUserEmail: () => Promise<string | null>;
};

const MagicContext = createContext<MagicContextType>({
  magic: null,
  loginWithMagicLink: async () => null,
  loginWithEmailOTP: async () => null,
  connectWithUI: async () => [],
  logout: async () => {},
  isLoggedIn: async () => false,
  getUserEmail: async () => null,
});

export const useMagic = () => useContext(MagicContext);

export { MagicRPCError, RPCErrorCode };

const MagicProvider = ({ children }: { children: ReactNode }) => {
  const [magic, setMagic] = useState<Magic | null>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY && typeof window !== 'undefined') {
      const magicInstance = new MagicBase(process.env.NEXT_PUBLIC_MAGIC_API_KEY as string, {
        network: {
          rpcUrl: "https://arbitrum-sepolia.therpc.io",
          chainId: 421614, // Arbitrum Sepolia
        },
      });

      setMagic(magicInstance);
      console.log('✅ Magic SDK initialized with API key:', process.env.NEXT_PUBLIC_MAGIC_API_KEY);
    }
  }, []);

  const loginWithMagicLink = async (email: string, showUI: boolean = true): Promise<string | null> => {
    if (!magic) {
      console.error('Magic SDK not initialized');
      return null;
    }

    try {
      await magic.auth.loginWithMagicLink({
        email,
        showUI
      });

      // Get the DID token after successful login
      const didToken = await magic.user.getIdToken();
      return didToken;
    } catch (err) {
      if (err instanceof MagicRPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            console.error('Magic link verification failed');
            break;
          case RPCErrorCode.MagicLinkExpired:
            console.error('Magic link expired');
            break;
          case RPCErrorCode.MagicLinkRateLimited:
            console.error('Magic link rate limited');
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log('User already logged in');
            break;
          default:
            console.error('Magic link error:', err);
        }
      } else {
        console.error('Unexpected error during Magic link login:', err);
      }
      throw err;
    }
  };

  const logout = async (): Promise<void> => {
    if (!magic) {
      console.error('Magic SDK not initialized');
      return;
    }

    try {
      await magic.user.logout();
    } catch (err) {
      console.error('Error during logout:', err);
      throw err;
    }
  };

  const isLoggedIn = async (): Promise<boolean> => {
    if (!magic) {
      return false;
    }

    try {
      return await magic.user.isLoggedIn();
    } catch (err) {
      console.error('Error checking login status:', err);
      return false;
    }
  };

  const getUserEmail = async (): Promise<string | null> => {
    if (!magic) {
      return null;
    }

    try {
      const isUserLoggedIn = await magic.user.isLoggedIn();
      if (!isUserLoggedIn) {
        return null;
      }

      const metadata = await magic.user.getInfo();
      return metadata.email || null;
    } catch (err) {
      console.error('Error getting user email:', err);
      return null;
    }
  };

  const loginWithEmailOTP = async (email: string, showUI: boolean = true): Promise<string | null> => {
    if (!magic) {
      console.error('Magic SDK not initialized');
      return null;
    }

    try {
      // This shows Magic's Email OTP UI
      const didToken = await magic.auth.loginWithEmailOTP({
        email,
        showUI
      });

      console.log('DID Token received:', didToken);
      return didToken;
    } catch (err) {
      if (err instanceof MagicRPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkRateLimited:
            console.error('Too many authentication attempts');
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log('User already logged in');
            break;
          default:
            console.error('Magic Email OTP error:', err);
        }
      } else {
        console.error('Unexpected error during Email OTP authentication:', err);
      }
      throw err;
    }
  };

  const connectWithUI = async (): Promise<string[]> => {
    if (!magic) {
      console.error('Magic SDK not initialized');
      return [];
    }

    try {
      // This shows Magic's built-in UI with Email OTP option
      const accounts = await magic.wallet.connectWithUI();
      return accounts;
    } catch (err) {
      if (err instanceof MagicRPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkRateLimited:
            console.error('Too many authentication attempts');
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            console.log('User already logged in');
            break;
          default:
            console.error('Magic authentication error:', err);
        }
      } else {
        console.error('Unexpected error during Magic authentication:', err);
      }
      throw err;
    }
  };

  const value = useMemo(() => {
    return {
      magic,
      loginWithMagicLink,
      loginWithEmailOTP,
      connectWithUI,
      logout,
      isLoggedIn,
      getUserEmail,
    };
  }, [magic, loginWithMagicLink, loginWithEmailOTP, connectWithUI, logout, isLoggedIn, getUserEmail]);

  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
