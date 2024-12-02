<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <div>
            <button class="float-end bg-blue-500 w-1/5 lg:w-2/6 xl:w-1/5 py-1 rounded !text-white hover:bg-blue-700" @click="addNewNote = true">New note</button>
        </div>
        <div class="flex overflow-hidden">
            <router-link :to="{ name: 'notes' }" :class="{ 'bg-[#2563eb]': $route.name === 'notes' }" class="border border-[#2563eb] text-center rounded-tl rounded-bl w-3/5 lg:w-2/6 xl:w-1/5 py-1 !text-white hover:bg-[#2563eb]">My Notes</router-link>
            <router-link :to="{ name: 'sharedNotes' }" :class="{ 'bg-[#2563eb]': $route.name === 'sharedNotes' }" class="border border-[#2563eb] text-center rounded-tr rounded-br w-3/5 lg:w-2/6 xl:w-1/5 py-1 !text-white hover:bg-[#2563eb]">Shared Notes</router-link>
        </div>
        <!-- filter -->
        <div>
            <select class="w-fit float-right rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="filterCategory">
                <option value="">All</option>
                <option class="dark:text-black">Programming</option>
                <option class="dark:text-black">Science</option>
                <option class="dark:text-black">Math</option>
                <option class="dark:text-black">English</option>
                <option class="dark:text-black">Engineering</option>
                <option class="dark:text-black">Food trade</option>
            </select>
        </div>
        <!-- notes -->
        <div v-if="filteredNotes()?.length > 0" class="grid md:grid-cols-2 gap-5">
            <div v-for="(note, index) in filteredNotes()" :key="index" class="h-full border p-3 border-gray-300 dark:border-gray-100/10 border-b-4 !border-b-blue-500 rounded-md flex flex-col justify-between gap-y-3">
                <!-- note header -->
                <div class="flex items-center justify-between">
                    <div class="border border-blue-500 w-10 aspect-square rounded-lg flex items-center justify-center">
                        <Icon icon="ic:outline-note-alt" class="text-blue-500 text-2xl" />
                    </div>
                    <div class="flex items-center justify-end gap-x-2 mt-2">
                        <p class="text-xs">{{ formatDate(note.addedAt) }}</p> 
                    </div>
                </div>
                <!-- note body -->
                <div class="flex flex-col gap-y-2">
                    <h1 class="uppercase font-semibold line-clamp-1">{{ note.title }}</h1>
                    <p class="line-clamp-3">{{ note.details }}</p>
                    <p v-if="note.category?.length" class="line-clamp-3 text-xs dark:text-gray-300">Category: {{ note.category }}</p>
                    <p v-if="note.tags?.length" class="line-clamp-3 text-xs dark:text-gray-300 capitalize">
                        Tags: 
                        <span v-for="(tag, index) in note.tags" :key="tag">
                            {{ tag }}<span v-if="index < note.tags?.length - 1">, </span>
                        </span>
                    </p>
                    <p class="line-clamp-4 text-gray-300/85 text-xs">Note Ratings: {{ overAllRatings(note.ratings) || 0 }}</p>
                    <p v-if="note.notesImages?.length" class="line-clamp-4 text-gray-300/85 text-xs">{{ note.notesImages?.length }} attachments</p>
                </div>
                <!-- note footer -->
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <div class="group relative" @click="shareNote(note.id)">
                        <Icon icon="mdi-light:share" class="text-blue-500/70 text-lg cursor-pointer" />
                        <div class="absolute !w-14 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Share</p>
                        </div>
                    </div>
                    <div class="group relative" @click="editNote(note)">
                        <Icon icon="mdi:pencil-outline" class="text-blue-500/70 text-lg cursor-pointer" />
                        <div class="absolute !w-14 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Edit</p>
                        </div>
                    </div>
                    <div class="group relative" @click="deleteNote(note.id, index)">
                        <Icon icon="mdi:trash-outline" class="text-blue-500/70 text-lg cursor-pointer" />
                        <div class="absolute !w-14 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Delete</p>
                        </div>
                    </div>
                    <div class="group relative">
                        <router-link :to="{ name: 'noteDetails', params: { id: note.id } }">
                            <Icon icon="mdi:eye-outline" class="text-blue-500/70 text-lg cursor-pointer" />
                        </router-link>
                        <div class="absolute !w-16 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">View notes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center">No notes to show</p>

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
                        <div v-else class="rounded-full w-10 aspect-square flex items-center justify-center border">
                            <Icon icon="mdi:user" class="text-2xl" />
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

        <newNotes v-if="addNewNote" @click.self="addNewNote = false" @closeModal="addNewNote = false" />
        <editNoteComponent v-if="editNoteModal" :note="noteToEdit"  @closeModal="editNoteModal = false" />
    </div>
</template>

<script setup>
import newNotes from '../components/newNotes.vue'
import editNoteComponent from '../components/editNote.vue'
import { formatDistanceToNow } from 'date-fns'
import { computed, onMounted, ref, defineProps, toRef, watch } from 'vue'
import { onSnapshot, query, orderBy, where, collection, deleteDoc, doc, addDoc, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../plugins/firebase'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const addNewNote = ref(false)
const notes = ref([])

const props = defineProps({
    userId: String,
    collaborated: Array,
    searchQuery: String
})

const filterCategory = ref('')

onMounted(() => {
    if (currentUser.value && currentUser.value.uid) {
        getNotes();
    }
    
    watch(currentUser, (newVal) => {
        if (newVal && newVal.uid) {
            getNotes();     
        }
    })
})

// filter notes
const filteredNotes = () => {
    if(!filterCategory.value && !props.searchQuery) return notes.value

    if(props.searchQuery && filterCategory.value) {
        return notes.value.filter(note => 
            note.tags?.some(tag => tag.toLowerCase().includes(props.searchQuery.toLowerCase())) &&
            note.category?.toLowerCase().includes(filterCategory.value.toLowerCase())
        );
    }else if(props.searchQuery){
        return notes.value.filter(note => note.tags?.some(tag => tag.toLowerCase().includes(props.searchQuery.toLowerCase())))
    }else{
        return notes.value.filter(note => note.category === filterCategory.value)
    }
    
}

// get real time notes
const getNotes = () => {
    if(props.userId){
        const notesQuery = query(
            collection(db, 'notes'),
            where('userId', '==', currentUser.value.uid),
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


// share note
const noteToShare = ref('')
const showShareModal = ref(false)
const sharedTo = ref([])

const shareNote = (noteId) => {
    noteToShare.value = noteId
    showShareModal.value = true
}

// notifications reference
const notifRef = collection(db, 'notifications')

const shareToUser = async (userId) => {
    const notesDoc = doc(db, 'notes', noteToShare.value)

    try {
        await updateDoc(notesDoc, {
           sharedTo: arrayUnion(userId)
        })

        await addDoc(notifRef, {
            to: userId,
            from: currentUser.value.uid,
            name: currentUser.value.displayName,
            photoURL: currentUser.value.photoURL,
            link: `/note-details/${noteToShare.value}`,
            notifiedAt: Timestamp.now(),
            isView: false,
            isRead: false,
            type: 'notes'
        })

        sharedTo.value.push(userId)
    } catch (error) {
        console.log(error)
    }
}

// delete note
const deleteNote = async (noteID, index) => {
    const docRef = doc(db, 'notes', noteID)
    try {
        await deleteDoc(docRef)
        
        notes.value.splice(index, 1)
    } catch (error) {
        console.log(error)
    }
}

// edit note
const editNoteModal = ref(false)
const noteToEdit = ref(null)

const editNote = (note) => {
    noteToEdit.value = note

    editNoteModal.value = true
}

const overAllRatings = (ratings) => {
    const overallRatings = ratings?.reduce((acc, rating) => {
        acc += rating.rating

        return acc
    }, 0)

    const average = overallRatings / ratings?.length

    return average
}
</script>


<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>