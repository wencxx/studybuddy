<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <h1>Rate Us</h1>
        <div class="space-y-10">
            <!-- Question 1 -->
            <div class="flex flex-col gap-y-2">
                <label>1. How easy was it to navigate the StudyBuddy app?  </label>
                <div class="flex gap-x-2">
                    <Icon
                        v-for="star in 5"
                        :key="'q1-star-' + star"
                        :icon="star <= ratings.q1 ? 'iconoir:star-solid' : 'iconoir:star'"
                        :class="['text-3xl cursor-pointer', star <= ratings.q1 ? 'text-yellow-500' : 'text-black dark:text-white']"
                        @click="rate('q1', star)"
                    />
                </div>
            </div>

            <!-- Question 2 -->
            <div class="flex flex-col gap-y-2">
                <label>2. How satisfied are you with the app's features like tagging, categorization, and real-time collaboration?  </label>
                <div class="flex gap-x-2">
                    <Icon
                        v-for="star in 5"
                        :key="'q2-star-' + star"
                        :icon="star <= ratings.q2 ? 'iconoir:star-solid' : 'iconoir:star'"
                        :class="['text-3xl cursor-pointer', star <= ratings.q2 ? 'text-yellow-500' : 'text-black dark:text-white']"
                        @click="rate('q2', star)"
                    />
                </div>
            </div>

            <!-- Question 3 -->
            <div class="flex flex-col gap-y-2">
                <label>3. How helpful was the task assignment and tracking feature for managing your academic tasks?</label>
                <div class="flex gap-x-2">
                    <Icon
                        v-for="star in 5"
                        :key="'q3-star-' + star"
                        :icon="star <= ratings.q3 ? 'iconoir:star-solid' : 'iconoir:star'"
                        :class="['text-3xl cursor-pointer', star <= ratings.q3 ? 'text-yellow-500' : 'text-black dark:text-white']"
                        @click="rate('q3', star)"
                    />
                </div>
            </div>

            <!-- Question 4 -->
            <div class="flex flex-col gap-y-2">
                <label>4. How effective was the app in supporting your collaborative learning activities?</label>
                <div class="flex gap-x-2">
                    <Icon
                        v-for="star in 5"
                        :key="'q4-star-' + star"
                        :icon="star <= ratings.q4 ? 'iconoir:star-solid' : 'iconoir:star'"
                        :class="['text-3xl cursor-pointer', star <= ratings.q4 ? 'text-yellow-500' : 'text-black dark:text-white']"
                        @click="rate('q4', star)"
                    />
                </div>
            </div>

            <!-- Question 5 -->
            <div class="flex flex-col gap-y-2">
                <label>5. How satisfied are you with the overall performance of StudyBuddy? </label>
                <div class="flex gap-x-2">
                    <Icon
                        v-for="star in 5"
                        :key="'q5-star-' + star"
                        :icon="star <= ratings.q5 ? 'iconoir:star-solid' : 'iconoir:star'"
                        :class="['text-3xl cursor-pointer', star <= ratings.q5 ? 'text-yellow-500' : 'text-black dark:text-white']"
                        @click="rate('q5', star)"
                    />
                </div>
            </div>

            <div>
                <button v-if="!submitting" class="float-right bg-blue-500 px-3 py-1 rounded" @click="submitRating">Rate</button>
                <button v-else class="float-right bg-blue-500 px-3 py-1 rounded" @click="submitRating">Rating</button>
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

// Reactive object to store ratings for each question
const ratings = ref({
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
});

// Function to handle rating selection
const rate = (question, rating) => {
    ratings.value[question] = rating;
};

// submit rating
const submitting = ref(false)
const ratingsRef = collection(db, 'ratings')

const submitRating = async () => {
    try {
        submitting.value = true
        const snapshot = await addDoc(ratingsRef, {
            ...ratings.value,
            userId: currentUser.value?.uid
        })

        if(!snapshot.empty){
            $toast.success('Submitted rating sucessfully')
            ratings.value = {
                q1: 0,
                    q2: 0,
                    q3: 0,
                    q4: 0,
                    q5: 0,
                }
        } 
    } catch (error) {
        console.log(error)
    }finally{
        submitting.value = false
    }
}
</script>

<style scoped>
/* Add some transition for hover effect */
.icon:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
}
.content::-webkit-scrollbar {
    display: none;
}
</style>
