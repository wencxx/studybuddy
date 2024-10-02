<template>
    <div class="flex flex-col gap-y-14" id="contents">
        <!-- add new post -->
        <div class="w-full flex items-center gap-x-3 p-4 rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10">
            <img v-if="currentUser && currentUser.photoURL" :src="currentUser?.photoURL" class="h-9 aspect-square rounded-full" />
            <div v-else class="rounded-full border flex items-center justify-center p-2">
                <Icon icon="mdi:user" class="text-gray-500 text-xl dark:text-white" />
            </div>
            <input type="text" placeholder="What's on your mind?" class="h-10 w-full pl-4 font-light rounded-full border border-gray-200 dark:border-gray-100/10 bg-transparent focus:outline-none cursor-pointer" @click="addNewPost = true">
        </div>
        <!-- post -->
        <div v-if="posts.length > 0" class="flex flex-col gap-y-5">
            <div v-for="post in posts" :key="post.id" class="w-full rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col gap-y-3">
                <!-- post header -->
                <div class="flex items-center gap-x-3">
                    <img v-if="post.photoURL" :src="post.photoURL" alt="profile pic" class="h-9 aspect-square rounded-full" />
                    <div v-else class="flex border rounded-full p-2">
                        <Icon icon="mdi:user"  class="text-gray-500 text-xl dark:text-white" />
                    </div>
                    <div>
                        <router-link :to="{ name: 'userDetails', params: { id: post.userId } }">
                            <h2 class="font-semibold cursor-pointer hover:underline hover:text-gray-200">{{ post.name }}</h2>
                        </router-link>
                        <p class="text-[.7rem]">{{ formatDate(post.postedAt) }}</p>
                    </div>
                    <Icon icon="mdi:dots-vertical" class="text-gray-500 dark:text-white text-2xl ml-auto" />
                </div>
                <!-- post body -->
                <div>
                    <p class="line-clamp-4">{{ post.postDetails }}</p>
                </div>
                <!-- post footer -->
                <div class="mt-1 flex items-center justify-between">
                    <div class="flex gap-x-2">
                        <Icon icon="material-symbols-light:favorite-outline"  class="text-gray-500 text-2xl dark:text-white cursor-pointer" />
                        <!-- <Icon name="material-symbols-light:favorite"  class="text-red-500 text-xl cursor-pointer" /> -->
                    </div>  
                    <div>
                        <p class="text-xs text-gray-400 cursor-pointer">{{ post.comments.length }} comments</p>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center"> No post to show</p>
        <!-- skeleton -->

        <newPost v-if="addNewPost" @click.self="addNewPost = false" @closeModal="addNewPost = false" />
    </div>
</template>

<script setup>
import newPost from '../components/newPost.vue'
import { formatDistanceToNow } from 'date-fns'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { onSnapshot, collection, updateDoc, arrayUnion, query, orderBy } from 'firebase/firestore'

onMounted(() => {
    getPosts()
})

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const addNewPost = ref(false)


const posts = ref([])

// get realtime posts
const getPosts = () => {
    onSnapshot(
        query(collection(db, 'posts'), orderBy('postedAt', 'desc')), (snapshot) => {
        posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
}

// conver date to x time ago
const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate();
  
    return formatDistanceToNow(date, { addSuffix: true });
}

const requestCollaboration = async (uid) => {
    const userRef = doc(db, 'users', userId);

    try {
        await updateDoc(userRef, {
            friends: arrayUnion(uid)
        });
        console.log('Friend added successfully!');
    } catch (error) {
        console.error('Error adding friend: ', error);
    }
}


</script>

<style scoped>
#contents::-webkit-scrollbar {
    display: none;
}
</style>