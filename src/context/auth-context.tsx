
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { getBroker } from '@/lib/firestore-service';
import type { Broker, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  broker: Broker | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  createNewUser: (email: string, pass: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const brokerData = await getBroker(user.uid);
        setBroker(brokerData);
        setIsAdmin(brokerData?.role === 'admin');

        if (pathname === '/login') {
            router.push('/');
        }
      } else {
        setUser(null);
        setBroker(null);
        setIsAdmin(false);

        if (pathname !== '/login') {
            router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);
  
  const signInWithEmail = (email: string, pass: string) => {
      return signInWithEmailAndPassword(auth, email, pass);
  }

  const createNewUser = (email: string, pass: string) => {
    return createUserWithEmailAndPassword(auth, email, pass);
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'login_hint': 'user@example.com',
      'hd': 'p-na-areia-sales-flow.firebaseapp.com'
    });
    // This is a simplified flow. In a real app, you'd check if the Google user
    // exists in your 'brokers' collection and what their role is.
    return signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setBroker(null);
    setIsAdmin(false);
    router.push('/login');
  };
  
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, broker, loading, isAdmin, signInWithEmail, createNewUser, signInWithGoogle, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
