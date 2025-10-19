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

const _user = ref<User | null>(null)
const _initPromise = new Promise<void>((resolve) => {
  onAuthStateChanged(auth, async (u) => {
    _user.value = u
    // cria doc do usuário se logou e ainda não existe
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
      await signInWithEmailAndPassword(auth, email, password)
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
    user: _user,
    isAuthenticated,
    initReady: _initPromise, // para o router aguardar
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
  }
}
