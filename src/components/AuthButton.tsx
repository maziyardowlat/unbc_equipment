'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '../styles/Header.module.css'; // Reusing header styles or I might need new ones

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>{session.user?.email}</span>
        <button onClick={() => signOut()} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn('azure-ad')} style={{ marginLeft: 'auto', padding: '0.5rem 1rem', cursor: 'pointer' }}>
      Sign In
    </button>
  );
}
