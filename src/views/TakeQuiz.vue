<template>
    <div>
        <div v-if="quiz.quizzes">
            <h1 class="text-xl font-semibold">Quiz title: <span class="capitalize font-normal">{{ quiz.quizTitle }}</span></h1>
            <h1 class="text-sm mt-1">Due date: <span class="capitalize font-normal">{{ formatQuizDueDate(quiz.dueDate) }}</span></h1>
            
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
                    <button class="bg-blue-500 hover:bg-blue-600 rounded w-1/3 py-1 lg:w-1/5 ml-auto flex justify-center" @click="submitQuiz">Submit</button>
                </div>
            </div>
        </div>
        <p v-else>Loading quiz</p>

        <!-- modal if quiz is finished -->
        <div v-if="finishedQuiz" class="absolute top-0 left-0 w-screen h-screen bg-black/10 flex items-center justify-center z-30"> 
            <div class="w-[60dvw] lg:w-[20dvw] h-fit rounded-xl bg-white flex flex-col items-center justify-between gap-y-5 p-10 text-black">
                <h1 v-if="score >= quiz.quizzes.length/2" class="uppercase text-xl text-green-500">Congratulations</h1>
                <h1 v-else class="uppercase text-xl text-red-500">Study more</h1>
                <div class="w-2/3 aspect-square rounded-full border flex flex-col items-center justify-center">
                    <p class="text-5xl text-gray-700">{{score}}/{{ quiz.quizzes.length }}</p>
                    <p>score</p>
                </div>
                <div class="flex gap-x-5 lg:px-10 w-full">
                    <button v-if="retaking" class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500 animate-pulse">Retaking</button>
                    <button v-else class="border border-blue-500 w-full lg:w-1/2 rounded text-blue-500" @click="retake">Retake</button>
                    <button class="bg-blue-500 w-full lg:w-1/2 rounded text-white">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { db } from '../plugins/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import moment from 'moment'

const formatQuizDueDate = (date) => {
    return moment(date).format('ll')
}

const route = useRoute()

const quizId = route.params.id
const quiz = ref({})
const userAnswers = ref([])

// quiz reference
const quizRef = doc(db, 'quizzes', quizId)

const getQuiz = async () => {
    try {
        const snapshot = await getDoc(quizRef)

        quiz.value = {
            id: snapshot.id,
            ...snapshot.data()
        }
    } catch (error) {
        console.log(error)
    }
}

// submit quiz
const finishedQuiz = ref(false)

const score = ref(0)
const submitQuiz = () => {
    quiz.value.quizzes.forEach((quiz, index) => {
        if(quiz.answer === userAnswers.value[index]){
            score.value++
        }
    })

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
        retaking.value = false
    }, 1000)
}

onMounted(() => {
    getQuiz()
})
</script>

<style scoped>

</style>