import { initializeApp } from 'firebase/app'
import { getAnalytics, logEvent as firebaseLogEvent, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let analytics: Analytics | null = null

if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig)
  analytics = getAnalytics(app)
}

export { analytics }

export function logEvent(eventName: string, params?: Record<string, string>) {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params)
  }
}
