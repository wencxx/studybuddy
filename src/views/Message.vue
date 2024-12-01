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
        <div v-if="user" class="h-full flex flex-col-reverse overflow-y-auto py-5 gap-y-5">
            <div v-for="message in messages" :key="message" class="w-1/2 flex flex-col space-y-2"  :class="{ 'self-end !bg-transparent items-end': message.sendBy == currentUser?.uid }"> 
                <div class="flex items-center" v-if="message.message">
                    <a :href="message.message" v-if="message.type === 'Share'" class="border border-gray-300 dark:border-gray-100/10 bg-blue-500 px-3 py-1 rounded underline text-white"  :class="{ '!bg-transparent': message.sendBy == currentUser?.uid }">
                        {{ message.message }}
                    </a>
                    <div v-else class="border border-gray-300 dark:border-gray-100/10 bg-blue-500 dark:text-white px-3 py-1 rounded"  :class="{ '!bg-transparent': message.sendBy == currentUser?.uid }">
                        {{ message.message }}
                    </div>
                </div>
                <div class="grid w-full gap-1" :class="{ 'grid-cols-2': message.images.length > 1 }">
                    <div v-for="image in message.images" :key="image" >
                        <img :src="image" :alt="image" class="w-full aspect-square border dark:border-gray-100/10 rounded-md cursor-pointer" @click="viewImages(image)">
                    </div>
                </div>
                <div class="space-y-2">
                    <div v-for="file in message.files" :key="file" >
                        <a :href="file" :download="getFileName(file)" target="_blank" class="px-2 py-1 rounded bg-gray-400/30 dark:bg-gray-300/10">{{ getFileName(file) }}</a>
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
        <div v-if="tempImagesURL.length || tempFilesNames.length" class="w-full h-20 mb-2 border dark:border-gray-100/10 rounded-xl flex gap-x-2 p-2 overflow-x-auto">
            <div v-for="(image, index) in tempImagesURL" :key="index" class="relative group">
                <img :src="image" alt="image" class="h-full aspect-square border rounded-md object-cover cursor-pointer">
                <div class="absolute top-0 left-0 h-full aspect-square bg-black/25 rounded-md items-start justify-end p-1 hidden group-hover:flex">
                    <Icon icon="mdi:close" class="text-white text-lg cursor-pointer" @click="removeImage(index)"/>
                </div>
            </div>
            <div v-for="(fileName, index) in tempFilesNames" :key="index" class="relative w-fit p-2 group flex items-center border border-gray-100/10 rounded-md">
                <div class="w-fit">{{ fileName }}</div>
                <div class="absolute top-0 left-0 h-full w-full bg-black/25 rounded-md items-start justify-end p-1 hidden group-hover:flex">
                    <Icon icon="mdi:close" class="text-white text-lg cursor-pointer" @click="removeFiles(index)"/>
                </div>
            </div>
        </div>
        <form @submit.prevent="sendMessage(user?.userId)" class="h-14 w-full mb-5 flex gap-x-2">
            <div class="flex items-center h-full relative">
                <div class="bg-gray-400/30 dark:bg-gray-100/10 h-full aspect-square flex items-center justify-center rounded cursor-pointer" @click="addAttachment = !addAttachment">
                    <Icon icon="et:attachments" class="text-xl" />
                </div>
                <div v-if="addAttachment" class="bg-red -top-[110%] left-0 h-fit w-fit border border-gray-100/10 bg-gray-200 dark:bg-neutral-800 absolute rounded-md p-1 flex items-center">
                    <label for="imageUpload" class="cursor-pointer"><Icon icon="mdi:image" class="text-gray-500 text-4xl" /></label>
                    <input
                        type="file"
                        id="imageUpload"
                        class="hidden"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        @change="onImageChange"
                    />
                    <label for="fileUpload" class="cursor-pointer"><Icon icon="solar:file-bold" class="text-4xl text-gray-500"/></label>
                    <input
                        type="file"
                        id="fileUpload"
                        class="hidden"
                        accept=".pdf, .docx, .docs, .csv"
                        multiple
                        @change="onFileChange"
                    />
                </div>
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

        <div v-if="viewImage" class="fixed top-0 left-0 h-screen w-screen bg-black/10 z-20 flex items-center justify-center">
            <Icon icon="mdi:close" class="top-5 right-5 absolute text-3xl cursor-pointer" @click="viewImage = false" />
            <img :src="imageToView" alt="iamge to view" class="h-1/2 lg:h-[90%] aspect-auto">
        </div>
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

const addAttachment = ref(false)

const message = ref('')

const selectedImages = ref([])
const tempImagesURL = ref([])

const onImageChange = (event) => {
    const files = event.target.files
    if (files.length) {
        for(const file of files){
            const url = URL.createObjectURL(file)
            tempImagesURL.value.push(url)
            selectedImages.value.push(file)
        }
    }

    addAttachment.value = false
}

const removeImage = (index) => {
    selectedImages.value.splice(index, 1)
    tempImagesURL.value.splice(index, 1)
}

const selectedFiles = ref([])
const tempFilesNames = ref([])

const onFileChange = (event) => {
    const files = event.target.files
    if (files.length) {
        for(const file of files){
            tempFilesNames.value.push(file.name)
            selectedFiles.value.push(file)
        }
    }

    addAttachment.value = false
}

const removeFiles = (index) => {
    selectedFiles.value.splice(index, 1)
    tempFilesNames.value.splice(index, 1)
}

const sendMessage = async (receiverID) => {
    message.value = ""
    selectedImages.value = []
    tempImagesURL.value = []
    selectedFiles.value = []
    tempFilesNames.value = []

    addAttachment.value = false
    try {
        let images = []
        let files = []

        if(selectedImages.value.length){
            for(const image of selectedImages.value){
                const storage = getStorage()
                const fileRef = storageRef(storage, `chatImages/${image.name}`)
                await uploadBytes(fileRef, image)
                const downloadURL = await getDownloadURL(fileRef)

                images.push(downloadURL)
            }
        }

        if(selectedFiles.value.length){
            for(const file of selectedFiles.value){
                const storage = getStorage()
                const fileRef = storageRef(storage, `chatFiles/${file.name}`)
                await uploadBytes(fileRef, file)
                const downloadURL = await getDownloadURL(fileRef)

                files.push(downloadURL)
            }
        }

        await addDoc(collection(db, "messages"), {
            sendBy: currentUser.value?.uid,
            receiveBy: receiverID,
            message: message.value,
            images: images,
            files: files,
            messageAt: Timestamp.now(),
            isRead: false,
            isView: false,
            type: 'personal',
        })
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

const viewImage = ref(false)
const imageToView = ref('')

const viewImages = (imageLink) => {
    viewImage.value = true
    imageToView.value = imageLink
}

const getFileName = (fileUrl) => {
    const decodedUrl = decodeURIComponent(fileUrl);
    return decodedUrl.split("/").pop().split("?")[0];
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
    watch(messages.value, () => {
        viewAllMessages()
    })
})

</script>


<style scoped>
.flex-col-reverse::-webkit-scrollbar {
    display: none;
}
</style>