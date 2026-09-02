import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getFirebasePrivateKey(): string | undefined {
  return process.env['FIREBASE_PRIVATE_KEY']?.replace(/\\n/g, '\n');
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env['FIREBASE_PROJECT_ID'] &&
      process.env['FIREBASE_CLIENT_EMAIL'] &&
      getFirebasePrivateKey()
  );
}

function getFirebaseAdminApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      'Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  return initializeApp({
    credential: cert({
      projectId: process.env['FIREBASE_PROJECT_ID'],
      clientEmail: process.env['FIREBASE_CLIENT_EMAIL'],
      privateKey: getFirebasePrivateKey(),
    }),
  });
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}
