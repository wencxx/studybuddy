<template>
    <div class="flex flex-col overflow-hidden">
        <div class="flex items-center gap-x-5 mb-2">
            <img v-if="user?.photoURL" :src="user?.photoURL" alt="profilepic" class="rounded-full h-16 aspect-square">
            <div>
                <h1 class="text-xl">{{ user?.displayName }}</h1>
                <p class="text-xs text-gray-300 dark:text-gray-300/55">{{ user?.email }}</p>
            </div>
        </div>
        <div class="h-full flex flex-col-reverse py-5 gap-y-5">
            <div v-for="message in messages" :key="message" class="border border-gray-300 dark:border-gray-100/10 bg-blue-500 px-3 py-1 rounded w-fit" :class="{ 'self-end !bg-transparent': message.sendBy == currentUser?.uid }"> 
                {{ message.message }}
            </div>
        </div>
        <form @submit.prevent="sendMessage(user?.userId)" class="h-14 w-full mb-1 flex gap-x-2">
            <input v-model="message" type="text" placeholder="Enter a message" class="h-full focus:outline-none rounded-md bg-transparent pl-2 border border-gray-300 dark:border-gray-100/10 w-full">
            <button type="submit" class="bg-blue-500 w-1/5 h-full rounded-md text-white hover:bg-blue-600/90">Send</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { collection, onSnapshot, query, where, getDocs, limit, addDoc, Timestamp, orderBy } from 'firebase/firestore';
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
    getMessages()
  });
};

const message = ref('')

const sendMessage = async (receiverID) => {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        sendBy: currentUser.value?.uid,
        receiveBy: receiverID,
        message: message.value,
        messageAt: Timestamp.now(),
      });
      message.value = ''
    } catch (error) {
      console.error('Error creating post: ', error);
    }
}

const messages = ref([])


const getMessages = () => {
    if (currentUser.value) {
        const q1 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', route.params.id),
            where('sendBy', '==', currentUser.value?.uid),
            orderBy('messageAt', 'desc')
        );

        const q2 = query(
            collection(db, 'messages'),
            where('receiveBy', '==', currentUser.value?.uid),
            where('sendBy', '==', route.params.id),
            orderBy('messageAt', 'desc')
        );  

        const unsubscribe1 = onSnapshot(q1, (snapshot) => {
            const messages1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateMessages(messages1);
        }, (error) => {
            console.error('Error in snapshot listener for q1:', error);
        });

        const unsubscribe2 = onSnapshot(q2, (snapshot) => {
            const messages2 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateMessages(messages2);
        }, (error) => {
            console.error('Error in snapshot listener for q2:', error);
        });

        const updateMessages = (newMessages) => {
            const allMessages = [...messages.value, ...newMessages];
            const uniqueMessagesMap = new Map();

            allMessages.forEach(message => {
                uniqueMessagesMap.set(message.id, message);
            });

            messages.value = Array.from(uniqueMessagesMap.values())
                .sort((a, b) => b.messageAt.toMillis() - a.messageAt.toMillis());
        };

        onUnmounted(() => {
            unsubscribe1();
            unsubscribe2();
        });
    }
};





onMounted(() => {
    getUser()
})

</script>


<style scoped>

</style>