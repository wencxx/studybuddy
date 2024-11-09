<template>
    <div>
        <div v-if="!loadingQuiz" class="relative">
            <h1 class="text-xl font-semibold">Quiz title: <span class="capitalize font-normal">{{ quiz.quizTitle }}</span></h1>
            <h1 class="text-sm mt-1">Due date: <span class="capitalize font-normal">{{ formatQuizDueDate(quiz.dueDate) }}</span></h1>
            <h1 class="text-sm mt-1">Time: <span class="capitalize font-normal" v-if="quiz.quizTimer">{{ minutes }}:{{ seconds }}</span><span v-else>N/A</span></h1>
            <div class="mt-10 flex flex-col gap-y-6">   
                <div v-for="(quiz, index) in quiz.quizzes" :key="index" class="space-y-2">
                    <!-- question -->
                    <p class="text-lg">{{ index + 1 }}. {{ quiz.question }}</p>
                    <!-- answer base on item typee -->
                    <div v-if="quiz.quizType === 'mc'" class="flex flex-wrap gap-7 pl-5">
                        <div v-for="choice in quiz.choices" :key="choice" class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square" v-model="userAnswers[index]" :value="choice">
                            <label>{{ choice }}</label>
                        </div>
                    </div>
                    <div v-if="quiz.quizType === 'tf'" class="flex gap-7 pl-5">
                        <div class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square" v-model="userAnswers[index]" value="True">
                            <label>True</label>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square" v-model="userAnswers[index]" value="False">
                            <label>False</label>
                        </div>
                    </div>
                    <div v-if="quiz.quizType === 'fb'" class="flex gap-7 pl-5">
                        <input type="text" v-model="userAnswers[index]" placeholder="Enter your answer" :name="index" class="h-8 w-1/2 !bg-transparent border-b border-black dark:border-gray-100/10 focus:outline-none">
                    </div>
                </div>
                <div class="mt-10">
                    <button v-if="submittingQuiz" class="bg-blue-500 hover:bg-blue-600 rounded w-1/3 py-1 lg:w-1/5 ml-auto flex justify-center animate-pulse">Submitting</button>
                    <button v-else class="bg-blue-500 hover:bg-blue-600 rounded w-1/3 py-1 lg:w-1/5 ml-auto flex justify-center" @click="submitQuiz">Submit</button>
                </div>
            </div>
        </div>
        <p v-else>Loading quiz</p>

        <!-- modal to start quiz -->
        <div v-if="!loadingQuiz &&  notStartedQuiz" class="absolute top-0 left-0 w-screen h-screen bg-black/10 backdrop-blur flex items-center justify-center z-30"> 
            <div class="w-[60dvw] lg:w-[20dvw] h-fit rounded-xl bg-white flex flex-col items-center justify-between gap-y-10 p-10 text-black">
                <div  class="text-center space-y-2">
                    <h1 class="text-2xl">Proceed with the quiz?</h1>
                    <p v-if="quiz.quizTimer" class="text-sm">Clicking yes will start the {{ quiz.quizTimer }} minute(s) timer</p>
                </div>
                <div class="flex gap-x-5 lg:px-10 w-full">
                    <router-link v-if="!route.query.v" :to="{ name: 'quiz' }"  class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500 text-center">Later</router-link>
                    <router-link v-else :to="{ name: 'notifications' }"  class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500 text-center">Later</router-link>
                    <button class="bg-blue-500 w-full lg:w-1/2 rounded text-white" @click="startQuiz">Yes</button>
                </div>
            </div>
        </div>
        <div v-if="loadingQuiz &&  notStartedQuiz" class="absolute top-0 left-0 w-screen h-screen bg-black/10 backdrop-blur flex items-center justify-center z-30"> 
            <Icon icon="eos-icons:bubble-loading" class="text-4xl" />
        </div>

        <!-- modal if quiz is finished -->
        <div v-if="finishedQuiz" class="absolute top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center z-30"> 
            <div class="w-[60dvw] lg:w-[20dvw] h-fit rounded-xl bg-white flex flex-col items-center justify-between gap-y-5 p-10 text-black">
                <h1 v-if="score >= quiz.quizzes.length/2" class="uppercase text-xl text-green-500">Congratulations</h1>
                <h1 v-else class="uppercase text-xl text-red-500">Study more</h1>
                <div class="w-2/3 aspect-square rounded-full border flex flex-col items-center justify-center">
                    <p class="text-5xl text-gray-700">{{score}}/{{ quiz.quizzes?.length }}</p>
                    <p>score</p>
                </div>
                <p v-if="quiz.quizTimer" class="text-center text-sm">Finished in {{ timeConsumed }}</p>
                <div class="flex gap-x-5 lg:px-10 w-full">
                    <button v-if="retaking" class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500 animate-pulse">Retaking</button>
                    <button v-else class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500" @click="retake">Retake</button>
                    <router-link :to="{ name: 'quiz' }" class="bg-blue-500 w-full lg:w-1/2 rounded text-white text-center">Done</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { db } from '../plugins/firebase'
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const formatQuizDueDate = (date) => {
    return moment(date).format('ll')
}

const route = useRoute()

const quizId = route.params.id
const quiz = ref({})
const userAnswers = ref([])

const notStartedQuiz = ref(true)

// quiz reference
const quizRef = doc(db, 'quizzes', quizId)
const loadingQuiz = ref(false)

const getQuiz = async () => {
    try {
        loadingQuiz.value = true
        const snapshot = await getDoc(quizRef)

        quiz.value = {
            id: snapshot.id,
            ...snapshot.data()
        }
        loadingQuiz.value = false
    } catch (error) {
        console.log(error)
    }
}

// start quiz
const startQuiz = () => {
    notStartedQuiz.value = false
    startTimer()
}

// quiz timer if it has
const minutes = ref(0);
const seconds = ref(59);
let timerInterval = null;

const startTimer = () => {
    timerInterval = setInterval(() => {
        if (minutes.value === 0 && seconds.value === 0) {
            clearInterval(timerInterval); 
        } else {
            if (seconds.value === 0) {
                seconds.value = 59;
                minutes.value--;
            } else {
                seconds.value--;
            }
        }
    }, 1000);
};

watchEffect(() => {
    if (quiz.value.quizTimer !== null) {
        minutes.value = quiz.value.quizTimer - 1; 
        seconds.value = 59; 
    }
});


// submit quiz
const quizAnsweredRef = collection(db, 'answeredQuiz')

const finishedQuiz = ref(false)
const submittingQuiz = ref(false)
const score = ref(0)
const timeConsumed = ref('')


const submitQuiz = async () => {
    clearInterval(timerInterval)

    quiz.value.quizzes.forEach((quiz, index) => {
        if(quiz.answer === userAnswers.value[index]){
            score.value++
        }
    })

    const minuteTakes =  (quiz.value.quizTimer - 1) - minutes.value
    const secondTakes = (59 - seconds.value) + 1
    if(quiz.value.quizTimer && minuteTakes <= 0){
        timeConsumed.value = `${secondTakes} seconds`
    }else if(quiz.value.quizTimer && minuteTakes > 0){
        timeConsumed.value = `${minuteTakes} minutes and ${secondTakes} seconds`
    }else{
        timeConsumed.value = 'No timer'
    }

    submittingQuiz.value = true
    await addDoc(quizAnsweredRef, {
        userId: currentUser.value.uid,
        quizId: quiz.value.id,
        score: score.value,
        itemNumbers: quiz.value.quizzes.length,
        timeTakes: timeConsumed.value,
        takenAt: Timestamp.now()
    })

    submittingQuiz.value = false
    finishedQuiz.value = true
}

// retake quiz
const retaking = ref(false)

const retake = () => {
    retaking.value = true
    setTimeout(() => {
        userAnswers.value = []
        finishedQuiz.value = false
        score.value = 0
        startTimer()
        minutes.value = quiz.value.quizTimer - 1
        seconds.value = 59
        retaking.value = false
    }, 1000)
}

onMounted(() => {
    getQuiz()
})
</script>

<style scoped>

</style>