
import { initializeApp, getApps, cert, getApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// This hardcoded service account is used for local development.
// In a production environment (like Vercel), this will be replaced by environment variables.
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
    throw new Error('CRITICAL ERROR: The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
}

const serviceAccountKey = JSON.parse(serviceAccountString);

// Manually create a new, clean object that perfectly matches the 'ServiceAccount' type.
// This is the key to fixing the error permanently.
const serviceAccount: ServiceAccount = {
  projectId: serviceAccountKey.project_id,
  clientEmail: serviceAccountKey.client_email,
  // This .replace() call keeps the private key format correct.
  privateKey: serviceAccountKey.private_key.replace(/\\n/g, '\n'),
};


// Initialize Firebase Admin SDK, but only if it's not already initialized
let adminDb: FirebaseFirestore.Firestore;
let adminAuth: import('firebase-admin/auth').Auth;

if (!getApps().length) {
  const app = initializeApp({
    credential: cert(serviceAccount),
  });
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
} else {
  // Get the already initialized app
  const app = getApp();
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
}

export { adminDb, adminAuth };
