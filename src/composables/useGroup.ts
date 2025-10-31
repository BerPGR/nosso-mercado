import { db } from '@/firebase'
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  addDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { useAuth } from './useAuth'

export default function useGroup() {
  async function getGroupsFromCurrentUser() {
    const { user } = useAuth()
    const q = query(collection(db, 'groups'), where('memberIds', 'array-contains', user.value?.uid))
    const snap = await getDocs(q)
    return snap.docs.map((d) => {
      const data = d.data()
      console.log(data);
      
      return {
        id: d.id,
        createdAt: data.createdAt,
        memberIds: [...data.memberIds],
        name: data.name,
        ownerId: data.ownerId,
        code: data.code
      }
    })
  }

  async function createInviteCode(code: string) {
    const doc = await addDoc(collection(db, "inviteCodes"), {
        code
    })

    return doc.id
  }

  async function getGroupLists(groupId: string) {
    const snap = await getDocs(collection(db, 'groups', groupId, 'lists'))
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        createdAt: data.createdAt,
        memberIds: [...data.memberIds()],
        name: data.name,
        ownerId: data.ownerId
      }
    })
  }

  async function createGroup(name: string, code: string) {
    const actualDate = new Date()
    const dataToDB = `${actualDate.getFullYear()}-${actualDate.getMonth().toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`
    const { user } = useAuth()
    const docRef = await addDoc(collection(db, 'groups'), {
      name,
      code,
      ownerId: user.value?.uid,
      memberIds: [user.value?.uid],
      createdAt: dataToDB,
    })

    await setDoc(doc(db, 'groups', docRef.id, "members", user.value!.uid), {
        role: "member"
    })

    return docRef.id
  }

  async function joinGroup(code: string) {
    const {user} = useAuth()
    const q = query(collection(db, 'groups'), where('code', '==', code))
    const snap = await getDocs(q)
    const group = snap.docs[0]
    const groupId = group?.id
    const groupRef = doc(db, 'groups', groupId!)
    const memberRef = doc(db, 'groups', groupId!, 'members', user.value!.uid)

    const getGroup = await getDoc(groupRef)
    const groupData = getGroup.data()

    if (groupData!.memberIds.includes(user.value?.uid)) {
      throw ('Erro')
      return
    }

    await updateDoc(groupRef, {
      memberIds: arrayUnion(user.value?.uid)
    })

    await setDoc(memberRef, {
      role: 'member'
    })
  }

  async function createListInGroup(groupId: string, payload: any) {
    const actualDate = new Date()
    const dataToDB = `${actualDate.getFullYear()}-${actualDate.getMonth().toString().padStart(2, '0')}-${actualDate.getDate().toString().padStart(2, '0')}`
    const gSnap = await getDoc(doc(db, 'groups', groupId))
    const { memberIds } = gSnap.data() as { memberIds: string[] }
    const ref = await addDoc(collection(db, 'groups', groupId, 'lists'), {
      ...payload,
      groupId,
      memberIds,
      createdAt: dataToDB,
    })

    return ref.id
  }

  return { getGroupsFromCurrentUser, getGroupLists, createGroup, createInviteCode, joinGroup}
}
