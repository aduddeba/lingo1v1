'use client';

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env['NEXT_PUBLIC_FIREBASE_API_KEY'],
  authDomain: process.env['NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'],
  projectId: process.env['NEXT_PUBLIC_FIREBASE_PROJECT_ID'],
  appId: process.env['NEXT_PUBLIC_FIREBASE_APP_ID'],
};

function getFirebaseClientApp() {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export const firebaseAuth = getAuth(getFirebaseClientApp());

void setPersistence(firebaseAuth, inMemoryPersistence);
