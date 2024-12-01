<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <h1>Rate Us</h1>
        <div class="space-y-10">
            <div class="space-y-2">
                <label>Give feedback about your StudyBuddy experience.</label>
                <textarea v-model="feedback" class="border dark:border-gray/100 rounded bg-transparent p-2 min-h-32 w-full focus:outline-none"></textarea>
            </div>
            <div>
                <button v-if="!submitting" class="float-right bg-blue-500 px-3 py-1 rounded" @click="submitRating">Submit</button>
                <button v-else class="float-right bg-blue-500 px-3 py-1 rounded" @click="submitRating">Submitting</button>
            </div>
        </div>
        <div v-for="feedback in feedbacks" :key="feedback.id" class="flex flex-col gap-y-2 border p-5 rounded-xl dark:border-gray-100/10">
            <div class="flex items-center gap-x-3">
                <div>
                    <img v-if="feedback.photoUrl" :src="feedback.photoUrl" alt="">
                    <div v-else class="w-12 aspect-square rounded-full border flex items-center justify-center">
                        <Icon icon="mdi:user" class="text-2xl"/>
                    </div>
                </div>
                <div>
                    <h1 class="text-lg">{{ feedback.name }}</h1>
                    <p class="text-xs -mt-1">{{ moment(feedback.dateAdded.toDate()).format('lll') }}</p>
                </div>
                <div v-if="feedback.userId === currentUser?.uid" class="ml-auto relative">
                    <Icon icon="mdi:dots-vertical" class="text-2xl cursor-pointer" @click="toggleFeedbackMenu(feedback.id)" />
                    <div v-if="openMenus.includes(feedback.id)" class="border dark:border-gray-100/10 px-3 py-1 text-xs rounded absolute right-0">
                        <p @click="deleteFeedback(feedback.id)" class="cursor-pointer">Delete</p>
                    </div>
                </div>
            </div>
            <div>
                <p>{{ feedback.feedback }}</p>
            </div>
            <div class="flex items-center gap-x-3 text-2xl">
                <div class="flex items-center gap-x-1">
                    <Icon icon="mdi:like" class="cursor-pointer" :class="{ '!text-blue-500': feedback.likes.includes(currentUser.uid) }" @click="likeFeedback(feedback.id)" />
                    <p class="text-lg mt-1">{{ feedback.likes.length }}</p>
                </div>
                <div class="flex items-center gap-x-1">
                    <Icon icon="mdi:dislike" class="cursor-pointer" :class="{ '!text-blue-500': feedback.dislikes.includes(currentUser.uid) }" @click="dislikeFeedback(feedback.id)" />
                    <p class="text-lg mt-1">{{ feedback.dislikes.length }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted} from 'vue';
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { collection, addDoc, onSnapshot, doc, arrayRemove, arrayUnion, updateDoc, deleteDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import moment from 'moment';

const $toast = useToast()

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const feedback = ref('')


// submit rating
const submitting = ref(false)
const feedbackRef = collection(db, 'feedback')

const submitRating = async () => {
    try {
        submitting.value = true
        const snapshot = await addDoc(feedbackRef, {
            feedback: feedback.value,
            userId: currentUser.value?.uid,
            name: currentUser.value?.displayName,
            photoUrl: currentUser.value?.photoURL || '',
            likes: [],
            dislikes: [],
            dateAdded: new Date()
        })

        if(!snapshot.empty){
            $toast.success('Submitted feedback sucessfully')
            feedback.value = ''
        }
    } catch (error) {
        console.log(error)
    }finally{
        submitting.value = false
    }
}

// get feedbacks
const feedbacks = ref([])

const getFeedbacks = () => {
    try {
        onSnapshot(
            collection(db, 'feedback'),
            (snapshots) => {
                feedbacks.value = []
                snapshots.docs.forEach(doc => {
                    feedbacks.value.push({
                        id: doc.id,
                        ...doc.data()
                    })
                })
            }
        )
    } catch (error) {
        console.log(error)
    }
}

// like feedback
const likeFeedback = async (id) => {
    const currentFeedback = feedbacks.value.find(feedback => feedback.id === id)
    const isLiked = currentFeedback.likes?.includes(currentUser.value?.uid) 
    try {
        if(isLiked){
            await updateDoc(
                doc(db, 'feedback', id),
                {
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }else{
            await updateDoc(
                doc(db, 'feedback', id),
                {
                    likes: arrayUnion(currentUser.value?.uid),
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }
        
    } catch (error) {
        console.log(error)
    }
}

// dislike feedback
const dislikeFeedback = async (id) => {
    const currentFeedback = feedbacks.value.find(feedback => feedback.id === id)
    const isDisliked = currentFeedback.dislikes?.includes(currentUser.value?.uid) 
    try {
        if(isDisliked){
            await updateDoc(
                doc(db, 'feedback', id),
                {
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }else{
            await updateDoc(
                doc(db, 'feedback', id),
                {
                    dislikes: arrayUnion(currentUser.value?.uid),
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }
        
    } catch (error) {
        console.log(error)
    }
}

// toggle feedback menu
const openMenus = ref([])

const toggleFeedbackMenu = (id) => {
    if(openMenus.value.includes(id)){
        const index = openMenus.value.indexOf(id)
        openMenus.value.splice(index, 1)
    }else{
        openMenus.value.push(id)
    }
}

// delete feedback
const deleteFeedback = async (id) => {
    try {
        await deleteDoc(doc(db, 'feedback', id))
    } catch (error) {
        console.log(error)
    }
}
 
onMounted(() => {
    getFeedbacks()
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
