import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { auth, db, googleProvider } from '@/firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { FirebaseUser } from '@/types/types'

const _user = ref<User | null>(null)
const firebaseUser = ref<FirebaseUser | null>(null)
const _initPromise = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, async (u) => {
    _user.value = u
    // cria doc do usu�rio se logou e ainda n�o existe
    if (u) {
      const userRef = doc(db, 'users', u.uid)
      const snap = await getDoc(userRef)
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: u.uid,
          name: u.displayName ?? '',
          email: u.email ?? '',
          photoURL: u.photoURL ?? '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      } else {
        // opcional: atualiza lastLogin
        await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true })
      }
    }
    resolve()
  })
})

const isAuthenticated = computed(() => !!_user.value)

export function useAuth() {
  async function loginWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      throw new Error('Deu ruim: ' + e)
    }
  }

  async function loginWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const getUser = await getDoc(doc(db, 'users', result.user.uid))
      firebaseUser.value = {
        name: result.user.displayName || '',
        email: result.user.email || '',
        uid: result.user.uid,
        type: getUser.data()!.type || false
      }
    } catch (e) {
      throw new Error('Deu ruim: ' + e)
    }
  }

  async function registerWithEmail(name: string, email: string, password: string) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (cred.user && name) {
        await updateProfile(cred.user, { displayName: name })
      }
      // cria/merge perfil no Firestore
      const userRef = doc(db, 'users', cred.user.uid)
      await setDoc(
        userRef,
        {
          uid: cred.user.uid,
          name,
          email,
          photoURL: cred.user.photoURL ?? '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          type: false
        },
        { merge: true },
      )
    } catch (e) {
      throw new Error('Deu ruim: ' + e)
    }
  }

  async function logout() {
    await signOut(auth)
  }

  return {
    firebaseUser: firebaseUser,
    user: _user,
    isAuthenticated,
    initReady: _initPromise, // para o router aguardar
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }
}
