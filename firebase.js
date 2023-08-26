import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBD_kqio1PlGM_8LUZpNNVIVkaiv9FYmKM",
    authDomain: "blog-website-dcd0b.firebaseapp.com",
    projectId: "blog-website-dcd0b",
    storageBucket: "blog-website-dcd0b.appspot.com",
    messagingSenderId: "982573980159",
    appId: "1:982573980159:web:437d92d86ad18418026fca",
    measurementId: "G-M5XDDQ6MPR"
};

import {
    getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
    updatePassword, GoogleAuthProvider, signInWithPopup, reauthenticateWithCredential, EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc, collection, addDoc, query, where, updateDoc, onSnapshot, getDoc,
    serverTimestamp, orderBy, deleteDoc, getDocs
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
    getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const div = document.getElementById('div');
const loader = document.getElementById('loader');
export {
    getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
    updatePassword, GoogleAuthProvider, signInWithPopup, getFirestore, doc, setDoc, collection, addDoc,
    query, where, updateDoc, onSnapshot, getDoc, serverTimestamp, orderBy, deleteDoc, getStorage, ref,
    uploadBytes, uploadBytesResumable, getDownloadURL, auth, db, storage, reauthenticateWithCredential,
    EmailAuthProvider, getDocs 
};