<template>
    <div>
        <div v-if="quiz.quizzes">
            <h1 class="text-xl font-semibold">Quiz title: <span class="capitalize font-normal">{{ quiz.quizTitle }}</span></h1>
            <h1 class="text-sm mt-1">Due date: <span class="capitalize font-normal">{{ quiz.dueDate }}</span></h1>
            
            <div class="mt-10 flex flex-col gap-y-6">
                <div v-for="(quiz, index) in quiz.quizzes" :key="index" class="space-y-2">
                    <!-- question -->
                    <p class="text-lg">{{ index + 1 }}. {{ quiz.question }}</p>
                    <!-- answer base on item typee -->
                    <div v-if="quiz.quizType === 'mc'" class="flex flex-wrap gap-7 pl-5">
                        <div v-for="choice in quiz.choices" :key="choice" class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square">
                            <label>{{ choice }}</label>
                        </div>
                    </div>
                    <div v-if="quiz.quizType === 'tf'" class="flex gap-7 pl-5">
                        <div class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square">
                            <label>True</label>
                        </div>
                        <div class="flex items-center gap-x-2">
                            <input type="radio" :name="index" class="h-4 aspect-square">
                            <label>False</label>
                        </div>
                    </div>
                    <div v-if="quiz.quizType === 'fb'" class="flex gap-7 pl-5">
                        <input type="text" placeholder="Enter your answer" :name="index" class="h-8 w-1/2 bg-transparent border-b border-black dark:border-gray-100/10 focus:outline-none">
                    </div>
                </div>
                <div class="mt-10">
                    <button class="bg-blue-500 hover:bg-blue-600 rounded w-1/3 py-1 lg:w-1/5 ml-auto flex justify-center" >Submit</button>
                </div>
            </div>
        </div>
        <p v-else>Loading quiz</p>
    </div>
</template>

<script setup>
import { db } from '../plugins/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const quizId = route.params.id

const quiz = ref({})

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

onMounted(() => {
    getQuiz()
})
</script>

<style scoped>

</style>