<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addEvent = true">Add event</button>
        </div>
        <FullCalendar :options="calendarOptions" class="!h-full" />

        <addCalendarEvent v-if="addEvent" class="z-50" @closeModal="closeModal" />
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

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const addEvent = ref(false)

const handleDateClick = (arg) => {
    alert('date click! ' + arg.dateStr)
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