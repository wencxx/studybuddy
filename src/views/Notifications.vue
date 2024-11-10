<template>
    <div class="flex flex-col gap-y-14" id="contents">
        <h1>Notifications</h1>
        <div v-if="notifications.length" class="space-y-3">
            <h1>Today</h1>
            <div v-for="notification in notifications" :key="notification.id" @click="redirectToLink(notification.link, notification.id)" >
                <div v-if="checkDateIfToday(notification.notifiedAt)" class="bg-gray-100 dark:bg-neutral-700 p-2 px-3 rounded-xl flex items-center gap-x-2 cursor-pointer" :class="{ '!bg-gray-200 dark:!bg-neutral-600': !notification.isRead }" >
                    <div class="w-11 aspect-square rounded-full overflow-hidden">
                        <img v-if="notification.photoURL !== null" :src="notification.photoURL" alt="profile picture" class="w-full aspect-square">
                        <div class="w-full aspect-square bg-white dark:bg-gray-100/55 flex items-center justify-center">
                            <Icon icon="mdi:user" class="text-3xl text-black" />
                        </div>
                    </div>
                    <div>
                        <h1>{{ notification.name }}</h1>
                        <p class="text-sm -mt-1 text-gray-500 dark:text-gray-100/55">
                            <span v-if="notification.type === 'quiz'">Shared a quiz</span>
                            <span v-if="notification.type === 'notes'">Shared a note</span>
                            <span v-if="notification.type === 'request collab'">Requested a collaboration</span>
                            <span v-if="notification.type === 'accepted collab'">Accepted your request</span>
                        </p>
                    </div>
                    <div class="ml-auto space-y-1">
                        <p class="text-xs text-gray-500 dark:text-gray-100/55">{{ formatDate(notification.notifiedAt) }}</p>
                        <h1 class="text-xs text-center text-white w-fit ml-auto uppercase bg-blue-500 px-3 py-1 rounded" :class="{ 'bg-gray-500': notification.isRead }">{{ notification.isRead ? 'Checked' : 'Unchecked'  }}</h1>
                    </div>
                </div>
            </div>
            <h1 class="!mt-10">Earlier</h1>
            <div v-for="notification in notifications" :key="notification.id" @click="redirectToLink(notification.link, notification.id)" >
                <div v-if="!checkDateIfToday(notification.notifiedAt)" class="bg-gray-100 dark:bg-neutral-700 p-2 px-3 rounded-xl flex items-center gap-x-2 cursor-pointer" :class="{ '!bg-gray-200 dark:!bg-neutral-600': !notification.isRead }" >
                    <div class="w-11 aspect-square rounded-full overflow-hidden">
                        <img v-if="!notification.photoURL" :src="notification.photoURL" alt="profile picture" class="w-full aspect-square">
                        <div class="w-full aspect-square bg-white dark:bg-gray-100/55 flex items-center justify-center">
                            <Icon icon="mdi:user" class="text-3xl text-black" />
                        </div>
                    </div>
                    <div>
                        <h1>{{ notification.name }}</h1>
                        <p class="text-sm -mt-1 text-gray-500 dark:text-gray-100/55">
                            <span v-if="notification.type === 'quiz'">Shared a quiz</span>
                            <span v-if="notification.type === 'notes'">Shared a note</span>
                            <span v-if="notification.type === 'request collab'">Requested a collaboration</span>
                            <span v-if="notification.type === 'accepted collab'">Requested a collaboration</span>
                        </p>
                    </div>
                    <div class="ml-auto space-y-1">
                        <p class="text-xs text-gray-500 dark:text-gray-100/55">{{ formatDate(notification.notifiedAt) }}</p>
                        <h1 class="text-xs text-center w-fit text-white ml-auto uppercase bg-blue-500 px-3 py-1 rounded" :class="{ 'bg-gray-500': notification.isRead }">{{ notification.isRead ? 'Checked' : 'Unchecked'  }}</h1>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-sm text-center">No notifications to show</div>
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useAuthStore, useDataStore } from '../store'
import { db } from '../plugins/firebase'
import { updateDoc, collection, where, query, getDocs, doc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import moment from 'moment'

const router = useRouter()

const authStore = useAuthStore()
const dataStore = useDataStore()

const currentUser = computed(() => authStore.currentUser )
const notifications = computed(() => dataStore.notifications)


watch(() => currentUser.value, () => {
    viewAllNotifications()
})

onMounted(() => {
    if(currentUser.value){
        viewAllNotifications()
    }
})

// on mounted view all notifications
const notificationRef = collection(db, 'notifications')

const viewAllNotifications = async () => {
    try {
        const q = query(
            notificationRef,
            where('to', '==', currentUser.value.uid)
        )

        const snapshots = await getDocs(q)

        for(const snaps of snapshots.docs){
            const docRef = doc(db, 'notifications', snaps.id)
            await updateDoc(docRef, {
                isView: true
            })
        }

    } catch (error) {
        console.log(error)
    }
}

const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate();
  
    return moment(date).calendar()
}

const checkDateIfToday = (timestamp) => {
    const date = timestamp.toDate();

    const notificationDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

    const today = new Date();
    const todayDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    if (notificationDate === todayDate) return date;
    return false;
};


const redirectToLink = async (link, docId) => {
    if(link){
        router.push({
            path: link,
            query: {
                v: true
            }
        })

        try {
            const docRef = doc(db, 'notifications', docId)

            await updateDoc(docRef, {
                isRead: true
            })

        } catch (error) {
            console.log(error)
        }
    }
}

</script>

<style scoped>
#contents::-webkit-scrollbar {
    display: none;
}
</style>
