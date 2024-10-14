<template>
    <div class="flex flex-col gap-y-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addNewPost = true">Add Quiz</button>
        </div>

        <div v-if="quizzes.length > 0" class="h-fit grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="(quiz, index) in quizzes" :key="index" class="h-fit border p-3 border-gray-300 dark:border-gray-100/10 border-b-4 !border-b-blue-500 rounded-md flex flex-col gap-y-3">
                <!-- quiz header -->
                <div class="flex items-center justify-between">
                    <div class="border border-blue-500 w-10 aspect-square rounded-lg flex items-center justify-center">
                        <Icon icon="fluent-mdl2:task-list" class="text-blue-500 text-2xl" />
                    </div>
                    <Icon icon="mdi:dots-horizontal" class="text-gray-500 text-2xl dark:text-white ml-auto" />
                </div>
                <!-- quiz body -->
                <div class="flex flex-col gap-y-2">
                    <h1 class="uppercase font-semibold line-clamp-1">{{ quiz.quizTitle }}</h1>
                    <p class="line-clamp-4 text-sm"><span class="font-bold">Due:</span> {{ quiz.dueDate }}</p>
                </div>
                <!-- quiz footer -->
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <Icon icon="mdi-light:share" class="text-blue-500 text-xl cursor-pointer" />
                    <Icon icon="mdi-light:eye" class="text-blue-500 text-xl cursor-pointer" />
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center">No quiz to show</p>
        </div>

        <!-- newquiz component -->
        <newQuiz v-if="addNewPost" @closeModal="addNewPost = false" @click.self="addNewPost = false" @newQuizDetails="insertNewQuiz" />
    </div>
</template>

<script setup>
import newQuiz from '../components/newQuiz.vue'
import { useAuthStore } from '../store'
import { onMounted, ref, computed, watch, defineProps } from 'vue'
import { db } from '../plugins/firebase'
import{ collection, doc, getDocs, query, where, and } from 'firebase/firestore'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const quizzes = ref([])

// quiz collection
const quizRef = collection(db, 'quizzes')

// get quizzes
const getQuizzes = async () => {
    console.log('bwesit')
    const q = query(
        quizRef,
        and(
            where('status', '==', 'to do'),
            where('userId', '==', currentUser.value.uid),
        )
    )
    try {
        const snapshot = await getDocs(q)

        snapshot.docs.forEach(doc => {
            quizzes.value.push({
                id: doc.id,
                ...doc.data()
            })
        })
    } catch (error) {
        console.log(error)
    }
}

// insert newly added quiz to quiz list
const insertNewQuiz = (data) => {
    console.log("Received new quiz:", data)
    quizzes.value.unshift({
        ...data
    })
}

onMounted(() => {
    if (currentUser.value && currentUser.value.uid) {
        getQuizzes();
    }
    
    watch(currentUser, (newVal) => {
        if (newVal && newVal.uid) {
            getQuizzes();     
        }
    })
})
const addNewPost = ref(false)
</script>

<style scoped>

</style>