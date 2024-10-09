<template>
    <div class="flex flex-col gap-y-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addNewNote = true">New note</button>
        </div>
        <!-- notes -->
        <div v-if="notes.length > 0" class="grid md:grid-cols-2 gap-5">
            <div v-for="(note, index) in notes" :key="index" class="h-fit border p-3 border-gray-300 dark:border-gray-100/10 border-b-4 !border-b-blue-500 rounded-md flex flex-col gap-y-3">
                <!-- note header -->
                <div class="flex items-center justify-between">
                    <div class="border border-blue-500 w-10 aspect-square rounded-lg flex items-center justify-center">
                        <Icon icon="ic:outline-note-alt" class="text-blue-500 text-2xl" />
                    </div>
                    <Icon icon="mdi:dots-horizontal" class="text-gray-500 text-2xl dark:text-white ml-auto" />
                </div>
                <!-- note body -->
                <div class="flex flex-col gap-y-2">
                    <h1 class="uppercase font-semibold line-clamp-1">{{ note.title }}</h1>
                    <p class="line-clamp-4 text-sm">{{ note.details }}</p>
                </div>
                <!-- note footer -->
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <Icon icon="material-symbols:calendar-month-outline" class="text-blue-500 text-xl" />
                    <p class="text-xs">{{ formatDate(note.addedAt) }}</p> 
                </div>
            </div>
        </div>
        <p v-else class="text-center">No notes to show</p>
        <newNotes v-if="addNewNote" @click.self="addNewNote = false" @closeModal="addNewNote = false" />
    </div>
</template>

<script setup>
import newNotes from '../components/newNotes.vue'
import { formatDistanceToNow } from 'date-fns'
import { computed, onMounted, ref, defineProps, toRef } from 'vue'
import { onSnapshot, query, orderBy, where, collection } from 'firebase/firestore'
import { db } from '../plugins/firebase'

const addNewNote = ref(false)
const notes = ref([])

const { userId } = defineProps({
    userId: String
})

onMounted(() => {
    getNotes()
})

// get real time notes
const getNotes = () => {
    if(userId){
        const notesQuery = query(
            collection(db, 'notes'),
            where('userId', '==', userId),
            orderBy('addedAt', 'desc')
        );

        onSnapshot(notesQuery, (snapshot) => {
            notes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }, (error) => {
            console.error("Error fetching notes: ", error); 
        });
    }
}

const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate();
  
    return formatDistanceToNow(date, { addSuffix: true });
}
</script>


<style scoped>

</style>