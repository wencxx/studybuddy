<template>
    <div>
        <h1 class="text-lg">Collab Requests</h1>
        <div v-if="users.length > 0" class="flex flex-col gap-y-2 mt-5">
            <!-- <div v-for="(user, index) in users" :key="user.id" class="rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-700">
                <router-link :to="{ name: 'userDetails', params: { id: user.userId } }">
                    <img v-if="user.photoURL" :src="user.photoURL" alt="profile pic" class="w-full aspect-square">
                    <div v-else class="w-full aspect-square flex items-center justify-center bg-gray-200 dark:bg-gray-100/10">
                        <Icon icon="mdi:user" class="dark:text-white text-6xl" />
                    </div>
                    <div class="p-1 px-2">
                        <h1 class="hover:underline">{{ user.displayName }}</h1>
                    </div>
                </router-link>
                <div class="flex flex-col p-1 px-2 gap-y-2">
                    <button class="rounded bg-blue-500 py-1 text-white text-sm" @click="toggleRequest('accept', user.userId, index)">Accept</button>
                    <button class="rounded border border-blue-500 py-1 text-blue-500 text-sm" @click="toggleRequest('decline', user.userId)">Decline</button>
                </div>
            </div> -->
            <div v-for="(user, index) in users" :key="user.id" class="rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-700 flex justify-between p-3">
                <router-link :to="{ name: 'userDetails', params: { id: user.userId } }" class="flex items-center">
                    <img v-if="user.photoURL" :src="user.photoURL" alt="profile pic" class="w-10 rounded-full aspect-square">
                    <div v-else class="w-10 rounded-full aspect-square flex items-center justify-center bg-gray-200 dark:bg-gray-100/10">
                        <Icon icon="mdi:user" class="dark:text-white text-2xl" />
                    </div>
                    <div class="p-1 px-2">
                        <h1 class="hover:underline">{{ user.displayName }}</h1>
                        <h1 class="text-xs -mt-1">@{{ user.studentNumber }}</h1>
                    </div>
                </router-link>
                <div class="flex items-center p-1 px-2 gap-x-2">
                    <button class="rounded-full bg-gray-300 text-black dark:bg-neutral-500 w-fit h-fit p-2 dark:text-white" @click="toggleRequest('decline', user.userId, index)">
                        <Icon icon="mdi:close" class="text-sm" />
                    </button>
                    <button class="rounded-full bg-blue-500 w-fit h-fit p-2 text-white" @click="toggleRequest('accept', user.userId, index)">
                        <Icon icon="mdi:check" class="text-sm" />
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="mt-5">
            <p class="text-center capitalize">No collaboration requests</p>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, watch, ref, computed } from 'vue'
import { db } from '../plugins/firebase'
import { collection, getDocs, where, limit, query, doc, arrayRemove, arrayUnion, updateDoc, addDoc, Timestamp } from 'firebase/firestore'
import { useAuthStore } from '../store'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const props = defineProps({
    userId: String
})

const userRef = collection(db, 'users')

// get incoming collabs
const incomingCollabs = ref([])

const getIncomingCollabs = async () => {
    try{
        if(props.userId){
            const q = query(
                userRef,
                where('userId', '==', props.userId),
                limit(1)
            )

            const snapshot = await getDocs(q)

            snapshot.docs.map(doc => {
                incomingCollabs.value = doc.data().incomingCollabRequest
            })

            getUsers()
        }
    }catch(error) {
        console.log(error)
    }
}

const users = ref([])

// get users
const getUsers = async () => {
    try {
        const promises = incomingCollabs.value.map(async (incomingUser) => {
            const q = query(
                userRef,
                where('userId', '==', incomingUser)
            )
            const snapshot = await getDocs(q)
            return snapshot
        })

        const result = await Promise.all(promises)

        result.forEach(snapshot => {
            snapshot.forEach(doc => {
                users.value.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
        });
    } catch (error) {
        console.log(error)
    }
}

// toggle collab request
const notifRef = collection(db, 'notifications')

const toggleRequest = async (type, id, index) => {
    if(type === 'accept'){
        try {
            // remove from incoming request
            const removeFromIncoming = query(
                collection(db, 'users'), 
                where('userId', '==', props.userId) 
            );

            const querySnapshot = await getDocs(removeFromIncoming);

            querySnapshot.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    incomingCollabRequest: arrayRemove(id)
                });
            });

            // remove from outgoing request
            const removeFromOutgoing = query(
                collection(db, 'users'), 
                where('userId', '==', id) 
            );

            const querySnapshot2 = await getDocs(removeFromOutgoing);

            querySnapshot2.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    outgoingCollabRequest: arrayRemove(props.userId)
                });
            });

            users.value.splice(index, 1)

            // add to collab
            const acceptedRequest = query(collection(db, 'users'), where('userId', '==', id));

            const querySnapshot3 = await getDocs(acceptedRequest);

            querySnapshot3.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    collabs: arrayUnion(props.userId)
                }); 
            });

            // add to collab2
            const acceptedRequest2 = query(collection(db, 'users'), where('userId', '==', props.userId));

            const querySnapshot4 = await getDocs(acceptedRequest2);

            querySnapshot4.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    collabs: arrayUnion(id)
                }); 
            });

            // notify the sender
            await addDoc(notifRef, {
                to: id,
                from: currentUser.value?.uid,
                name: currentUser.value?.displayName,
                photoURL: currentUser.value?.photoURL,
                link: `/user-details/${currentUser.value?.uid}`,
                notifiedAt: Timestamp.now(),
                isView: false,
                isRead: false,
                type: 'accepted collab'
            })
        }catch(error) {
            console.error(error)
        }
    }else if(type === 'decline'){
        try {
            // remove from incoming request
            const removeFromIncoming = query(
                collection(db, 'users'), 
                where('userId', '==', props.userId) 
            );

            const querySnapshot = await getDocs(removeFromIncoming);

            querySnapshot.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    incomingCollabRequest: arrayRemove(id)
                });
            });

            users.value.splice(index, 1)

            // remove from outgoing request
            const removeFromOutgoing = query(
                collection(db, 'users'), 
                where('userId', '==', id) 
            );

            const querySnapshot2 = await getDocs(removeFromOutgoing);

            querySnapshot2.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    outgoingCollabRequest: arrayRemove(props.userId)
                });
            });
        }catch(error) {
            console.error(error)
        }
    }
}

onMounted(() => {
    getIncomingCollabs()

    watch(props, () => {
        getIncomingCollabs()
    })
})


</script>

<style scoped>

</style>