<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addEvent = true">Add event</button>
        </div>
        <FullCalendar :options="calendarOptions" class="!h-full" />

        <addCalendarEvent v-if="addEvent" class="z-50" @closeModal="closeModal" />

        <!-- show events -->
        <div v-if="isShowingEvents" class="fixed top-0 left-0 w-screen h-screen bg-black/10 z-20 flex items-center justify-center">
            <div class="w-full max-w-md h-fit bg-gray-900 border rounded-md p-4 relative">
                <Icon icon="mdi:close" class="absolute top-3 right-3 text-lg cursor-pointer" @click="isShowingEvents = false" />
                <h1 class="text-center text-white">Events On {{ moment(showingEvents[0].date).format('LL') }}</h1>
                <div class="h-fit max-h-[50dvh] overflow-y-auto mt-5">
                    <ol class="list-decimal list-inside space-y-2">
                        <li v-for="event in showingEvents" :key="event.id" class="capitalize">{{ event.title }}</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import addCalendarEvent from '../components/addCalendarEvent.vue'
import { computed, onMounted, ref, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { getDocs, collection, query, where } from 'firebase/firestore'
import moment from 'moment'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const addEvent = ref(false)

const events = ref([])

const isShowingEvents = ref(false)
const showingEvents = ref([])

const handleDateClick = (arg) => {
    const filteredEvents = events.value.filter(event => event.date === arg.dateStr) 
    showingEvents.value = filteredEvents
    isShowingEvents.value = true
}

const calendarOptions = ref({
    plugins: [ dayGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    dateClick: handleDateClick,
    events: []
})

// get events
const getEvents = async () => {
    try {
        const q = query(
            collection(db, 'events'),
            where('userId', '==', currentUser.value?.uid)
        )
        const snapshots = await getDocs(q)

        snapshots.docs.forEach(doc => {
            calendarOptions.value.events.push({
                id: doc.id,
                ...doc.data()
            })
            events.value.push({
                id: doc.id,
                ...doc.data()
            })
        })
    } catch (error) {
        console.log('failed to get events', error)
    }
}

const closeModal = (data) => {
    if(data){
        calendarOptions.value.events.push(data)
    }

    addEvent.value = false
}

onMounted(() => {
    watch(currentUser, () => {
        getEvents()
    })

    if(currentUser.value){
        getEvents()
    }
})
</script>