import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config";
import { getStorage, ref } from "@firebase/storage";
import { env } from "process";

export const firebaseApp = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(firebaseApp);

export const storage = getStorage(firebaseApp, env.IMAGE_STORE_BUCKET_URL);
export const storageRootRef = ref(storage);
