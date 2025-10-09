// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAXTjDegAmSQUp-LolGx2EHr58UWrPPNBM',
  authDomain: 'vuejs-test-3473d.firebaseapp.com',
  projectId: 'vuejs-test-3473d',
  storageBucket: 'vuejs-test-3473d.firebasestorage.app',
  messagingSenderId: '768627036369',
  appId: '1:768627036369:web:237ce8165f33c0d17cb5f0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
