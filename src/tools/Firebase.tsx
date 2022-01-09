import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from "./FirebaseConfig";

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

