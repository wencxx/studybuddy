<template>
    <div class="flex flex-col gap-y-5 mx-auto px-10 md:px-20">
        <div v-if="user" class="flex items-center gap-x-5">
            <img :src="user.photoURL" alt="profilePic" class="rounded-full">
            <div>
                <h2 class="text-2xl">{{ user.displayName }}</h2>
                <p class="text-sm">{{ user.email }}</p>
            </div>
        </div>
        <p v-if="user">Bio here soon to come!</p>
        <div v-if="user" class="flex gap-x-5">
            <div class="w-1/2" :class="{ '!w-full': isCollaborated(user?.userId) === 'request'}">
                <button class="border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 w-full h-full capitalize rounded flex justify-center items-center gap-x-2" v-if="isCollaborated(user?.userId) === 'collaborated'" @click="toggleCollab('collaborated', user?.userId)">
                    <Icon icon="fluent-mdl2:user-sync" class="text-xl" />
                    <span>Collaborated</span>
                </button>
                <button class="border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 w-full h-full capitalize rounded flex justify-center items-center gap-x-2" v-if="isCollaborated(user?.userId) === 'accept'" @click="toggleCollab('accept', user?.userId)">
                    <Icon icon="bx:user-check" class="text-2xl" />
                    <span>accept</span>
                </button>
                <button class="border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 w-full h-full capitalize rounded py-2" v-if="isCollaborated(user?.userId) === 'requested'" @click="toggleCollab('requested', user?.userId)">requested</button>
                <button class="border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 w-full h-full  py-2 capitalize rounded flex justify-center items-center gap-x-2" v-if="isCollaborated(user?.userId) === 'request'" @click="toggleCollab('request', user?.userId)">
                    <Icon icon="lucide:user-plus" class="text-xl" />
                    <span>request</span>
                </button>
            </div>
            <button v-if="isCollaborated(user?.userId) === 'accept'" class="w-1/2 border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2">
                <Icon icon="tdesign:user-error-1" class="text-xl" />
                <span>Decline</span>
            </button>
            <button v-if="isCollaborated(user?.userId) === 'requested'" class="w-1/2 border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2">
                <Icon icon="bitcoin-icons:message-outline" class="text-3xl" />
                <span>cancel</span>
            </button>
            <router-link :to="{ name: 'message', params: { id: user?.userId } }" v-if="isCollaborated(user?.userId) === 'collaborated'" class="w-1/2 border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2">
                <Icon icon="bitcoin-icons:message-outline" class="text-3xl" />
                <span>Message</span>
            </router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { collection, query, where, getDocs, limit, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { db } from '../plugins/firebase'; 
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store'
import { indexedDBLocalPersistence } from 'firebase/auth';

const authStore = useAuthStore()

const isCollaborated = computed(() => authStore.isCollaborated)
const currentUser = computed(() => authStore.currentUser)

const route = useRoute()

const user = ref(null);

const getUser = async () => {
  const q = query(
    collection(db, 'users'),
    where('userId', '==', route.params.id),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    user.value = doc.data();
  });
};

const toggleCollab = async (type, id) => {
    if(type === 'request'){
        try {
            // sent the request
            const sendRequest = query(collection(db, 'users'), where('userId', '==', currentUser.value?.uid));

            const querySnapshot = await getDocs(sendRequest);

            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    outgoingCollabRequest: arrayUnion(id)
                }); 
            });

            // receive the request
            const reeceiveRequest = query(collection(db, 'users'), where('userId', '==', id));

            const querySnapshot2 = await getDocs(reeceiveRequest);

            querySnapshot2.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    incomingCollabRequest: arrayUnion(currentUser.value?.uid)
                }); 
            });


        } catch (error) {
            console.error("Error updating documents: ", error);
        }
    }else if(type === 'accept'){
        try {
            // remove from incoming request
            const removeFromIncoming = query(
                collection(db, 'users'), 
                where('userId', '==', currentUser.value?.uid) 
            );

            const querySnapshot = await getDocs(removeFromIncoming);

            querySnapshot.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    incomingCollabRequest: arrayRemove(id)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
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
                    outgoingCollabRequest: arrayRemove(currentUser.value?.uid)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
            });

            // add to collab
            const acceptedRequest = query(collection(db, 'users'), where('userId', '==', id));

            const querySnapshot3 = await getDocs(acceptedRequest);

            querySnapshot3.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    collabs: arrayUnion(currentUser.value?.uid)
                }); 
            });

            // add to collab2
            const acceptedRequest2 = query(collection(db, 'users'), where('userId', '==', currentUser.value?.uid));

            const querySnapshot4 = await getDocs(acceptedRequest2);

            querySnapshot4.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    collabs: arrayUnion(id)
                }); 
            });
        }catch(error) {
            console.error(error)
        }
    }else if(type === 'collaborated'){
        try {
            // remove from collabs of current user
            const removeFromCollabs = query(
                collection(db, 'users'), 
                where('userId', '==', currentUser.value?.uid) 
            );

            const querySnapshot = await getDocs(removeFromCollabs);

            querySnapshot.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    collabs: arrayRemove(id)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
            });

            // remove from collabs of visited user
            const removeFromCollabs2 = query(
                collection(db, 'users'), 
                where('userId', '==', id) 
            );

            const querySnapshot2 = await getDocs(removeFromCollabs2);

            querySnapshot2.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    collabs: arrayRemove(currentUser.value?.uid)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
            });
        } catch (error) {
            console.error(error)
        }
    }
}

onMounted(() => {
  getUser();
});
</script>

<style scoped>

</style>