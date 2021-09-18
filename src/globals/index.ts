import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { createGlobalState } from "react-hooks-global-state";

export const firebaseConfig = {
    apiKey: "AIzaSyDKIzX7vgYBHKz604dOFRy8_qvTm9CE2nw",
    authDomain: "spotify-e2c66.firebaseapp.com",
    projectId: "spotify-e2c66",
    storageBucket: "spotify-e2c66.appspot.com",
    messagingSenderId: "726160660512",
    appId: "1:726160660512:web:ede723e165c70611ed8445",
    measurementId: "G-94D92QCTT9"
};
export const firebaseApp = initializeApp(firebaseConfig);

export const authProvider = new GoogleAuthProvider();

export const auth = getAuth();

export const storage = getStorage(firebaseApp);

export const { useGlobalState, getGlobalState, setGlobalState, useGlobalStateProvider } = createGlobalState({
    user: undefined as User | undefined
  })