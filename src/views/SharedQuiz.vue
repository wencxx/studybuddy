<template>
    <div class="flex flex-col gap-y-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addNewQuiz = true">Add Task</button>
        </div>
        <div class="flex overflow-hidden">
            <router-link :to="{ name: 'quiz' }" :class="{ 'bg-[#2563eb]': $route.name === 'quiz' }" class="border border-[#2563eb] text-center rounded-tl rounded-bl w-1/5 lg:w-2/6 xl:w-1/5 py-1 !text-white hover:bg-[#2563eb]">My Tasks</router-link>
            <router-link :to="{ name: 'sharedQuiz' }" :class="{ 'bg-[#2563eb]': $route.name === 'sharedQuiz' }" class="border border-[#2563eb] text-center rounded-tr rounded-br w-1/5 lg:w-2/6 xl:w-1/5 py-1 !text-white hover:bg-[#2563eb]">Shared Tasks</router-link>
        </div>

        <div v-if="quizzes.length > 0" class="h-fit grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="(quiz, index) in quizzes" :key="index" class="h-fit border p-3 border-gray-300 dark:border-gray-100/10 border-b-4 !border-b-blue-500 rounded-md flex flex-col gap-y-3">
                <!-- quiz header -->
                <div class="flex items-center justify-between">
                    <div class="border border-blue-500 w-10 aspect-square rounded-lg flex items-center justify-center">
                        <Icon icon="fluent-mdl2:task-list" class="text-blue-500 text-2xl" />
                    </div>
                    <!-- delete button -->
                    <!-- <div class="relative">
                        <Icon @click="showDeleteModal(index)" icon="mdi:dots-horizontal" class="text-gray-500 text-2xl dark:text-white ml-auto cursor-pointer" />
                        <div v-if="deleteModal === index" class="absolute top-[110%] right-0 bg-neutral-500 p-1 rounded">
                            <button class="text-sm" @click="deleteQuiz(quiz.id, index)">delete</button>
                        </div>
                    </div> -->
                </div>
                <!-- quiz body -->
                <div class="flex flex-col gap-y-2">
                    <h1 class="uppercase font-semibold line-clamp-1">{{ quiz.quizTitle }}</h1>
                    <p class="line-clamp-4 text-sm"><span class="font-bold">Due:</span> {{ formatDate(quiz.dueDate) }}</p>
                    <p class="line-clamp-4 text-sm"><span class="font-bold">Timer:</span> <span v-if="quiz.quizTimer">{{ quiz.quizTimer }} Minutes</span><span v-else>None</span></p>
                </div>
                <!-- quiz footer -->
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <div class="group relative" @click="viewAnswered(quiz.id)">
                        <Icon icon="mdi:eye-outline" class="text-blue-500/70 text-lg cursor-pointer" />
                        <div class="absolute !w-24 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">View Answered</p>
                        </div>
                    </div>
                    <!-- share to button -->
                    <!-- <div class="group relative" @click="shareQuiz(quiz.id)">
                        <Icon icon="mdi-light:share" class="text-blue-500/70 text-lg cursor-pointer" />
                        <div class="absolute !w-14 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Share</p>
                        </div>
                    </div> -->
                    <div class="group relative">
                        <router-link :to="{ name: 'takeQuiz', params: { id: quiz.id } }">
                            <Icon icon="codicon:debug-start" class="text-blue-500/70 text-lg cursor-pointer" />
                        </router-link>
                        <div class="absolute !w-16 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Start task</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="text-center -ml-5">No shared task to show</p>
        </div>

        <!-- share to -->
        <div v-if="showShareModal" class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-30 flex items-center justify-center">
            <div class="w-3/4 lg:w-1/4 h-1/2 bg-white rounded-md p-5 text-black flex flex-col gap-y-10">
                <!-- header -->
                <div class="flex items-center justify-between">
                    <h1 class="text-lg">Share to</h1>
                    <Icon icon="mdi:close" class="text-xl cursor-pointer" @click="showShareModal = false" />
                </div>
                <!-- body -->
                <div v-if="props.collaborated.length" class="flex flex-col gap-y-2 overflow-auto">
                    <div v-for="user in props.collaborated" :key="user.userId" class="flex items-center gap-x-2">
                        <img v-if="user.photoURL" :src="user.photoURL" alt="profile pic" class="rounded-full w-10 aspect-square">
                        <div v-else class="rounded-full w-10 aspect-square bg-gray-100 flex items-center justify-center">
                            <Icon icon="mdi:user" class="text-3xl" />
                        </div>
                        <h1 class="text-lg">{{ user.displayName }}</h1>
                        <button v-if="sharedTo.includes(user.userId)" class="text-blue-500 border border-blue-500 rounded px-3 ml-auto" @click="shareToUser(user.userId)">Shared</button>
                        <button v-else class="text-white bg-blue-500 rounded px-3 ml-auto" @click="shareToUser(user.userId)">Share</button>
                    </div>
                </div>
                <div v-else class="flex flex-col gap-y-2 overflow-auto">
                    <p class="text-center text-sm">No collaboration</p>
                </div>
            </div>
        </div>

        <div @click.self="viewAnsweredModal = false" v-if="viewAnsweredModal" class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-30 flex items-center justify-center">
            <div class="w-3/4 lg:w-2/5 h-1/2 bg-white rounded-md p-5 text-black flex flex-col gap-y-10">
                <div class="flex justify-end">
                    <Icon icon="mdi:close" @click="viewAnsweredModal = false" class="text-xl cursor-pointer" />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th class="text-start w-2/4">Name</th>
                            <th class="text-start w-1/4">Score</th>
                            <th class="text-start w-1/4">Time takes</th>
                        </tr>
                    </thead>
                    <tbody v-if="!gettingAnswered && answered.length">
                        <tr v-for="(answer, index) in answered" :key="index">
                            <td>
                               <div class="flex items-center gap-x-2">
                                    <img :src="answer.photoURL" alt="profile pic" class="w-9 aspect-square rounded-full">
                                    {{ answer.displayName }}
                               </div>
                            </td>
                            <td>{{ answer.score }}/{{ answer.itemNumbers }}</td>
                            <td>{{ answer.timeTakes }}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="!gettingAnswered && !answered.length">
                        <tr>
                            <td colspan="3" class="text-center">No answers to show</td>
                        </tr>
                    </tbody>
                    <tbody v-if="gettingAnswered">
                        <tr>
                            <td colspan="3" class="text-center py-2">
                                <div class="flex justify-center">
                                    <Icon icon="eos-icons:bubble-loading" class="text-2xl" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        

        <!-- newquiz component -->
        <newQuiz v-if="addNewQuiz" @closeModal="addNewQuiz = false" @click.self="addNewQuiz = false" @newQuizDetails="insertNewQuiz" />
    </div>
</template>

<script setup>
import newQuiz from '../components/newQuiz.vue'
import { useAuthStore } from '../store'
import { onMounted, ref, computed, watch, defineProps } from 'vue'
import moment from 'moment'
import { db } from '../plugins/firebase'
import{ collection, doc, getDocs, query, where, and, addDoc, Timestamp, deleteDoc, arrayUnion, updateDoc } from 'firebase/firestore'

const props = defineProps({
    collaborated: Array
})

const deleteModal = ref('')

const showDeleteModal = (index) => {
    if(deleteModal.value === index){
        deleteModal.value = ''
    }else{
        deleteModal.value = index
    }
}

const deleteQuiz = async (quizId, index) => {
    const docRef = doc(db, 'quizzes', quizId)
    const answeredRef = collection(db, 'answeredQuiz')
    try {
        await deleteDoc(docRef)

       const q = query(
            answeredRef,
            where('quizId', '==', quizId)
        );

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        })

        quizzes.value.splice(index, 1)
        deleteModal.value = ''
    } catch (error) {
        console.log(error)
    }
}

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const quizzes = ref([])

// quiz collection
const quizRef = collection(db, 'quizzes')

// get quizzes
const getQuizzes = async () => {
    const q = query(
        quizRef,
        and(
            where('status', '==', 'to do'),
            where('sharedTo', 'array-contains', currentUser.value.uid),
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

// share quiz
const quizToShare = ref('')
const showShareModal = ref(false)
const sharedTo = ref([])

const shareQuiz = (quizId) => {
    quizToShare.value = quizId
    showShareModal.value = true
}

// notifications reference
const notifRef = collection(db, 'notifications')

const shareToUser = async (userId) => {
    const quizDOc = doc(db, 'quizzes', quizToShare.value)

    try {
        await updateDoc(quizDOc, {
           sharedTo: arrayUnion(userId)
        })

        await addDoc(notifRef, {
            to: userId,
            from: currentUser.value.uid,
            name: currentUser.value.displayName,
            photoURL: currentUser.value.photoURL,
            link: `/take-quiz/${quizToShare.value}`,
            notifiedAt: Timestamp.now(),
            isView: false,
            isRead: false,
            type: 'quiz'
        })

        sharedTo.value.push(userId)
    } catch (error) {
        console.log(error)
    }
}

const formatDate = (date) => {
    return moment(date).format('lll')
}

// get answered of quiz
const gettingAnswered = ref(false)
const answered = ref([])
const viewAnsweredModal = ref(false)

// doc reference
const answeredRef = collection(db, 'answeredQuiz')
const studentsRef = collection(db, 'users')

const viewAnswered = async (quizId) => {
    viewAnsweredModal.value = true
    try {
        answered.value = []
        gettingAnswered.value = true 
        
        const q = query(
            answeredRef,
            where('quizId', '==', quizId)
        )

        const snapshots = await getDocs(q)
        
        for (const doc of snapshots.docs) {
            const q2 = query(
                studentsRef,
                where('userId', '==', doc.data().userId)
            )

            const studentSnapshots = await getDocs(q2)

            studentSnapshots.docs.forEach(stud => {
                answered.value.push({
                    id: doc.id,
                    displayName: stud.data().displayName,
                    photoURL: stud.data().photoURL,
                    ...doc.data()
                })
            })
        }
    } catch (error) {
        console.log(error)
    }finally{
        gettingAnswered.value = false
    }
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

const addNewQuiz = ref(false)
</script>

<style scoped>

</style>