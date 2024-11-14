<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="add" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/5 xl:w-1/5 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Add new event</h2>
        <Icon icon="ic:baseline-close" size="22" class="cursor-pointer" @click="closeModal" />
      </div>
      <!-- modal body -->
      <div>
        <p class="mb-1">Title</p>
        <input type="text" class="w-full rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="event">
        <p class="mb-1">Date</p>
        <input type="date" class="w-full rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="eventDate">
        <!-- buttons -->
        <div>
          <button v-if="!adding" class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Add event</button>
          <button v-else class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700 animate-pulse" disabled>Adding</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const emit = defineEmits(['closeModal'])

const closeModal = () => {
    emit('closeModal')
}

// add event
const adding = ref(false)
const event = ref('')
const eventDate = ref('')

// event reference
const eventRef = collection(db, 'events')

const add = async () => {
    try {
        adding.value = true
        const snapshot = await addDoc(eventRef, {
            title: event.value,
            date: eventDate.value,
            userId: currentUser.value?.uid,
            addedAt: Timestamp.now()
        })

        if(snapshot.empty) return console.log('failed to add')

        const data = {
            title: event.value,
            date: eventDate.value
        }

        event.value = ''
        eventDate.value = ''

        emit('closeModal', data)
    } catch (error) {
        console.log(error)
        $toast('Failed to add event')
    }finally{
        adding.value = false
    }
}
</script>