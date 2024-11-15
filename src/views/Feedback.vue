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
    </div>
</template>

<script setup>
import { ref, computed} from 'vue';
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css' 

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
            userId: currentUser.value?.uid
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
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
