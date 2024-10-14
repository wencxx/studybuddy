<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="submitQuiz" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/4 xl:w-1/4 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Add new quiz</h2>
        <Icon icon="ic:baseline-close" class="cursor-pointer text-xl" @click="closeModal" />
      </div>
      <!-- modal body -->
      <p v-if="invalidDueDate" class="bg-red-500 rounded pl-2">Invalid due date</p>
      <div class="flex gap-x-2">
            <div class="flex flex-col w-1/2 gap-y-2">
                <label>Quiz Title</label>
                <input type="text" class="border dark:border-gray/100 rounded bg-transparent pl-2 h-8" placeholder="Quiz title" v-model="quizTitle">
            </div>
            <div class="flex flex-col w-1/2 gap-y-2">
                <label>Due date</label>
                <input type="date" class="border dark:border-gray/100 rounded bg-transparent pl-2 h-8" placeholder="Due date" v-model="dueDate" @change="checkDueDate">
            </div>
      </div>
      <div class="flex flex-col items-end gap-y-4">
        <select @change="addItem(quizAddedType)" v-model="quizAddedType" class="text-black rounded h-7">
            <option value="" disabled>Add item</option>
            <option value="mc">Multiple choice</option>
            <option value="tf">True/False</option>
            <option value="fb">Fill in the blank</option>
        </select>
        <div v-if="quizzes.length > 0" class="w-full space-y-2 py-2 max-h-72 overflow-y-auto" id="quizList">
            <h1>Items {{ quizzes.length }}</h1>
            <div v-for="(quiz, index) in quizzes" :key="index" class="space-y-2">
                <div>
                    <p>{{ index + 1 }}. {{ quiz.question }}</p>
                </div>
                <div v-if="quiz.quizType === 'mc'" class="flex items-center gap-x-4 pl-3">
                    <div v-for="choice in quiz.choices" :key="choice" class="flex items-center gap-x-2">
                        <input type="radio" name="choice" class="w-4 aspect-square">
                        <label class="dark:text-white">{{ choice }}</label>
                    </div>
                </div>
                <div v-if="quiz.quizType === 'tf'" class="flex items-center gap-x-4 pl-3">
                    <div class="flex items-center gap-x-1">
                        <input type="radio" name="choice">
                        <label class="dark:text-white">True</label>
                    </div>
                    <div class="flex items-center gap-x-1">
                        <input type="radio" name="choice">
                        <label class="dark:text-white">False</label>
                    </div>
                </div>
                <div v-if="quiz.quizType === 'fb'" class="flex items-center gap-x-4 pl-3">
                    <input type="text" placeholder="enter your answer" class="pl-2 bg-transparent border rounded dark:border-gray-100/10">
                </div>
            </div>
        </div>
      </div>
      <div>
        <div>
          <button v-if="!adding" class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Add</button>
          <button v-else class="float-end bg-gray-300 dark:bg-gray-600 w-fit px-2 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700 animate-pulse" disabled>Adding</button>
        </div>
      </div>
    </form>

    <div v-if="addedItem" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow border w-1/5 h-fit flex flex-col items-center gap-y-3 p-2 text-black">
        <h1>Quiz details</h1>
        <div class="flex flex-col gap-y-1 w-2/3">
            <label>Question</label>
            <input type="text" class="border border-gray-300 rounded pl-2 h-8" v-model="question">
        </div>
        <div v-if="quizAddedType === 'mc'" class="w-2/3">
            <div class="flex items-center justify-between">
                <p>Choices</p>
                <Icon icon="gridicons:add-outline" class="text-xl text-green-500 cursor-pointer" @click="addChoices" />
            </div>
            <div v-if="showAddChoice" class="flex items-center gap-x-2 text-black text-xs my-2 border rounded px-2">
                <input type="text" placeholder="Enter a choice" class="py-1 focus:outline-none w-full h-7" v-model="choiceToAdd">
                <div class="flex">
                    <Icon icon="ei:close-o" class="text-xl text-red-500" @click="closeAddChoices" />
                    <Icon icon="ei:check" class="text-xl text-green-500" @click="addChoice" />
                </div>
            </div>
            <div v-if="choices.length > 0" class="py-1">
                <ol class="pl-5">
                    <li v-for="(choice, index) in choices" :key="index" class="text-xs list-decimal" @click="removeChoice(index)">{{ choice }}</li>
                </ol>
            </div>
        </div>
        <div v-if="quizAddedType == 'tf'" class="flex flex-col gap-y-1 w-2/3">
            <label>Answer</label>
            <select v-model="answer" class="border border-gray-300 rounded pl-2 h-8">
                <option value="" disabled>Select Answer</option>
                <option>True</option>
                <option>False</option>
            </select>
        </div>
        <div v-else class="flex flex-col gap-y-1 w-2/3">
            <label>Answer</label>
            <input type="text" class="border border-gray-300 rounded pl-2 h-8" v-model="answer">
        </div>
        <div class="mb-2 w-full flex justify-end gap-x-2">
            <button class="bg-red-500 text-white w-1/4 py-1 text-sm rounded" @click="addedItem = false">Close</button>
            <button class="bg-blue-500 text-white w-1/4 py-1 text-sm rounded" @click="addQuiz">Add quiz</button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed } from 'vue'
import { db } from '../plugins/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const emits = defineEmits(['closeModal', 'newQuizDetails'])

const closeModal = () => {
    emits('closeModal')
}

// check duee date if less than todays date
const invalidDueDate = ref(false)

const checkDueDate = () => {
    const dateNow = new Date()
    const dateToString = dateNow.toISOString().split('T')[0]

    if(dueDate.value < dateToString) return invalidDueDate.value = true
    invalidDueDate.value = false
}


// add new quiz
const quizTitle = ref('')
const dueDate = ref('')
const quizAddedType = ref('')
const question = ref('')
const choices = ref([])
const answer = ref('')


const addedItem = ref(false)

const quizzes = ref([])

// add item/show quiz details
const addItem = (type) => {
    addedItem.value = true
    quizAddedType.value = type
}

// add choices if multiple choice
const choiceToAdd = ref('')

const showAddChoice = ref(false)

// show add chouce input
const addChoices = () => {
    showAddChoice.value = true
}

// close the addchoice input
const closeAddChoices = () => {
    showAddChoice.value = false
    choiceToAdd.value = ''
}

// add choice
const addChoice = () => {
    choices.value.push(choiceToAdd.value)
    choiceToAdd.value = ''
}

// remove added choice
const removeChoice = (index) => {
    choices.value.splice(index, 1)
}

// add quiz to quizzes
const addQuiz = () => {
    quizzes.value.push({
        quizType: quizAddedType.value,
        question: question.value,
        choices: choices.value,
        answer: answer.value,
    })
    addedItem.value = false
    quizAddedType.value = ''
    question.value = ''
    answer.value = ''
    choices.value = []
}


// add to databas
const adding = ref(false)
const quizRef = collection(db, 'quizzes')

const submitQuiz = async () => {
    try {
        adding.value = true
        const snapshot = await addDoc(quizRef, {
            quizTitle: quizTitle.value,
            dueDate: dueDate.value,
            quizzes: quizzes.value,
            status: 'to do',
            userId:  currentUser.value.uid
        })

        closeModal()

        const newQuiz = {
            id: snapshot.id,
            quizTitle: quizTitle.value,
            dueDate: dueDate.value,
            ...quizzes.value
        }

        emits('newQuizDetails', newQuiz)
        quizzes.value = []
        quizTitle.value = ''
        dueDate.value = ''
        adding.value = false
    } catch (error) {
        console.log(error)
    }
}
</script>

<style scoped>
#quizList::-webkit-scrollbar {
    display: none;
}
</style>