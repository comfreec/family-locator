import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth';
import { ref, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { auth, db } from '../lib/firebase';

const MEMBER_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        // 온라인 상태 설정
        const userStatusRef = ref(db, `users/${u.uid}/isOnline`);
        set(userStatusRef, true);
        onDisconnect(userStatusRef).set(false);
      }
    });
    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const colorIndex = Math.floor(Math.random() * MEMBER_COLORS.length);
    await set(ref(db, `users/${cred.user.uid}`), {
      uid: cred.user.uid,
      name,
      email,
      isOnline: true,
      color: MEMBER_COLORS[colorIndex],
      createdAt: Date.now(),
    });
    return cred.user;
  };

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (auth.currentUser) {
      await set(ref(db, `users/${auth.currentUser.uid}/isOnline`), false);
    }
    return signOut(auth);
  };

  return { user, loading, register, login, logout };
}
