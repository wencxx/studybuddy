<template>
    <div class="flex flex-col gap-y-14" id="contents">
        <div class="border h-10 dark:border-gray-100/10 rounded-md grid grid-cols-2">
            <router-link 
                class="h-full text-center content-center" 
                :class="{ 'bg-gray-100/10': $route.name === 'messages' }">Messages</router-link>
            <router-link 
                class="h-full text-center content-center" 
                :class="{ 'bg-gray-100/10': $route.name === 'marketplace' }">Marketplace</router-link>
        </div>

        <div v-if="groupedMessages && Object.keys(groupedMessages).length" class="flex flex-col gap-y-10">
            <div v-for="(group, person) in groupedMessages" :key="person">
                <router-link :to="{ name: 'message', params: { id: person } }" class="flex items-center gap-x-4 cursor-pointer">
                    <div class="w-14 aspect-square !rounded-full">
                        <img v-if="group[0].photoURL" :src="group[0].photoURL" alt="profile pic" class="w-full h-full rounded-full">
                        <Icon v-else icon="mdi:user" class="border p-2 w-full h-full rounded-full" />
                    </div>
                    <div class="flex flex-col w-full">
                        <div class="flex items-center justify-between">
                            <h3 class="font-bold capitalize">{{ group[0].displayName }}</h3>
                            <p class="text-xs">{{ formatDate(group[group.length - 1].messageAt) }}</p>
                        </div>
                        <p class="text-md text-gray-300">{{ group[group.length - 1].message }}</p>
                    </div>
                </router-link>
            </div>
        </div>
        <div v-else class="text-center">
            No messages to show
        </div>
    </div>
</template>

<script setup>
import { db } from '../plugins/firebase'
import { collection, or, where, query, onSnapshot, getDocs } from 'firebase/firestore'
import { onMounted, ref, defineProps, watch } from 'vue'
import { formatDistance, formatRelative } from 'date-fns'

const props = defineProps({
    userId: String
})

const messRef = collection(db, 'messages')

const messages = ref([])
const groupedMessages = ref({})

const groupMessages = async () => {
    // groupedMessages.value = {}; 


    const promises = messages.value.map(async (message) => {
        const otherPerson = (message.sendBy === props.userId) ? message.receiveBy : message.sendBy

        const person = await getUser(otherPerson)
        
        const data  = {
            ...message,
            ...person
        }

        if (!groupedMessages.value[otherPerson]) {
            groupedMessages.value[otherPerson] = []
        }
        groupedMessages.value[otherPerson].push(data)
    })

    await Promise.all(promises)
}

// user ref
const userRef = collection(db, 'users')

const getUser = async (person) => {
    try {
        const q = query(
            userRef,
            where('userId', '==', person)
        )
        const snapshot = await getDocs(q)

         if (!snapshot.empty) {
            const userDoc = snapshot.docs[0]; 
            return userDoc.data();
        } else {
            console.log(`No user found with id ${person}`);
            return null;
        }
    } catch (error) {
        console.log(error)
    }
}

const getMessages = () => {
    onSnapshot( 
        query(
            messRef,
            or(
                where('receiveBy', '==', props.userId),
                where('sendBy', '==', props.userId)
            ),
        ),
        (snapshot) => {
            messages.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            groupMessages();
        }
    )
}

// format date
const formatDate = (firestoreTimestamp) => {
    const date = firestoreTimestamp.toDate();
  
    return formatDistance(date, new Date(), { addSuffix: true });
}

onMounted(() => {
    if (props.userId) {
        getMessages()
    }

    watch(() => props.userId, (newVal) => {
        if (newVal) {
            getMessages()
        }
    });
})
</script>

<style scoped>
#contents::-webkit-scrollbar {
    display: none;
}
</style>
