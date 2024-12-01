<template>
    <div class="flex flex-col overflow-hidden">
        <div v-if="user" class="flex items-center gap-x-5 mb-2">
            <img v-if="user?.photoURL" :src="user?.photoURL" alt="profilepic" class="rounded-full h-14 aspect-square">
            <div v-else class="border rounded-full h-14 aspect-square flex items-center justify-center">
                <Icon icon="mdi:user" class="text-4xl" />
            </div>
            <router-link :to="{ name: 'userDetails', param: { id: $route.params.id } }">
                <h1 class="text-xl">{{ user?.displayName }}</h1>
                <p class="text-xs text-gray-300 dark:text-gray-300/55">{{ user?.email }}</p>
            </router-link>
        </div>
        <div v-else class="flex items-center gap-x-5 mb-2">
            <div class="h-16 aspect-square rounded-full bg-gray-300 animate-pulse"></div>
            <div class="space-y-2">
                <div class="h-6 w-36 bg-gray-300 animate-pulse rounded-md"></div>
                <div class="h-3 w-48 bg-gray-300 animate-pulse rounded-md"></div>
            </div>
        </div>
        <div v-if="user" class="h-full flex flex-col-reverse py-5 gap-y-5">
            <div v-for="message in messages" :key="message" class="w-fit space-y-1"  :class="{ 'self-end !bg-transparent': message.sendBy == currentUser?.uid }"> 
                <div class="flex items-center">
                    <a :href="message.message" v-if="message.type === 'Share'" class="border border-gray-300 dark:border-gray-100/10 bg-blue-500 px-3 py-1 rounded underline text-white"  :class="{ '!bg-transparent': message.sendBy == currentUser?.uid }">
                        {{ message.message }}
                    </a>
                    <div v-else class="border border-gray-300 dark:border-gray-100/10 bg-blue-500 text-white px-3 py-1 rounded"  :class="{ '!bg-transparent': message.sendBy == currentUser?.uid }">
                        {{ message.message }}
                    </div>
                </div>
                <p class="text-[.6rem] capitalize">{{ formatDate(message.messageAt) }}</p>
            </div>
        </div>
        <div v-else class="h-full flex flex-col-reverse py-5 gap-y-5">
            <div class="h-8 rounded-md bg-gray-300 animate-pulse w-1/3"></div>
            <div class="h-8 rounded-md bg-gray-300 animate-pulse self-end w-1/3"></div>
            <div class="h-8 rounded-md bg-gray-300 animate-pulse w-1/2"></div>
            <div class="h-8 rounded-md bg-gray-300 animate-pulse w-1/3"></div>
            <div class="h-8 rounded-md bg-gray-300 animate-pulse w-1/2 self-end"></div>
        </div>
        <form @submit.prevent="sendMessage(user?.userId)" class="h-14 w-full mb-5 flex gap-x-2">
            <div class="flex items-center h-full">
                <label for="imageUpload" class="bg-gray-100/10 h-full aspect-square flex items-center justify-center rounded cursor-pointer">
                    <Icon icon="mdi:image" class="text-4xl" />
                </label>
                <input
                    type="file"
                    id="imageUpload"
                    class="hidden"
                    accept="image/*"
                    @change="onFileChange"
                />
            </div>
            <input
                v-model="message"
                type="text"
                placeholder="Enter a message"
                class="h-full focus:outline-none rounded-md bg-transparent pl-2 border border-gray-300 dark:border-gray-100/10 w-full"
            />
            <button
                type="submit"
                class="bg-blue-500 w-1/5 h-full rounded-md text-white hover:bg-blue-600/90"
            >
                Send
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { collection, onSnapshot, query, where, getDocs, limit, addDoc, Timestamp, orderBy, updateDoc, writeBatch } from 'firebase/firestore'
import { db, storage } from '../plugins/firebase' 
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store'
import { indexedDBLocalPersistence } from 'firebase/auth'
import { formatRelative } from 'date-fns'

const formatDate = (firestoreTimestamp) => {
    const date = firestoreTimestamp.toDate()

    return formatRelative(date, new Date())

}

const authStore = useAuthStore()

const isCollaborated = computed(() => authStore.isCollaborated)
const currentUser = computed(() => authStore.currentUser)

const route = useRoute()

const user = ref(null)

const getUser = async () => {
  const q = query(
    collection(db, 'users'),
    where('userId', '==', route.params.id),
    limit(1)
  )

  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    user.value = doc.data()
    getMessages()
  })
}

const message = ref('')

const selectedFile = ref(null)

const onFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = file
        uploadImage()
    }
}

const uploadImage = async () => {
    if (!selectedFile.value) return

    const storage = getStorage()
    const fileRef = storageRef(storage, `chatImages/${selectedFile.value.name}`)

    try {
        await uploadBytes(fileRef, selectedFile.value)
        const downloadURL = await getDownloadURL(fileRef)
        sendMessage(user.value.userId, downloadURL, "image")
        selectedFile.value = null
    } catch (error) {
        console.error("Error uploading image:", error)
    }
}

const sendMessage = async (receiverID, content = message.value, messageType = "text") => {
    if (!content) return

    try {
        await addDoc(collection(db, "messages"), {
            sendBy: currentUser.value?.uid,
            receiveBy: receiverID,
            message: content,
            messageAt: Timestamp.now(),
            isRead: false,
            isView: false,
            type: 'personal',
            messageType,
        })
        message.value = ""
    } catch (error) {
        console.error("Error sending message:", error)
    }
}

const messages = ref([])


const getMessages = () => {
    if (currentUser.value) {
        const q1 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', route.params.id),
            where('sendBy', '==', currentUser.value?.uid),
            where('type', '==', 'personal'),
            orderBy('messageAt', 'desc')
        )

        const q2 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', currentUser.value?.uid),
            where('sendBy', '==', route.params.id),
            where('type', '==', 'personal'),
            orderBy('messageAt', 'desc')
        )  

        const unsubscribe1 = onSnapshot(q1, (snapshot) => {
            const messages1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            updateMessages(messages1)
        }, (error) => {
            console.error('Error in snapshot listener for q1:', error)
        })

        const unsubscribe2 = onSnapshot(q2, (snapshot) => {
            const messages2 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            updateMessages(messages2)
        }, (error) => {
            console.error('Error in snapshot listener for q2:', error)
        })

        const updateMessages = (newMessages) => {
            const allMessages = [...messages.value, ...newMessages]
            const uniqueMessagesMap = new Map()

            allMessages.forEach(message => {
                uniqueMessagesMap.set(message.id, message)
            })

            messages.value = Array.from(uniqueMessagesMap.values())
                .sort((a, b) => b.messageAt.toMillis() - a.messageAt.toMillis())
        }

        onUnmounted(() => {
            unsubscribe1()
            unsubscribe2()
        })
    }
}

const viewAllMessages = async () => {
    try {
        const q1 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', route.params.id),
            where('sendBy', '==', currentUser.value?.uid),
            where('type', '==', 'personal')
        )

        const q2 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', currentUser.value?.uid),
            where('sendBy', '==', route.params.id),
            where('type', '==', 'personal')
        )

        const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)])

        const allMessages = [...snapshot1.docs, ...snapshot2.docs]

        if (allMessages.length === 0) {
            return
        }

        const batch = writeBatch(db)

        allMessages.forEach(doc => {
            const docRef = doc.ref
            batch.update(docRef, { isRead: true })
        })

        await batch.commit()
        console.log("All messages marked as read.")
    } catch (error) {
        console.error("Error updating messages to 'isRead':", error)
    }
}


onMounted(() => {
    getUser()
    viewAllMessages()
})

</script>


<style scoped>

</style>