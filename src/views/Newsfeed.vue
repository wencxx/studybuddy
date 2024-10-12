<template>
    <div class="flex flex-col gap-y-14" id="contents">
        <!-- add new post -->
        <div v-if="currentUser" class="w-full flex items-center gap-x-3 p-4 rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10">
            <img v-if="currentUser.photoURL" :src="currentUser?.photoURL" class="h-9 aspect-square rounded-full" />
            <div v-else class="rounded-full border flex items-center justify-center p-2">
                <Icon icon="mdi:user" class="text-gray-500 text-xl dark:text-white" />
            </div>
            <input type="text" placeholder="Got something to share?" class="h-10 w-full pl-4 font-light rounded-full border border-gray-200 dark:border-gray-100/10 bg-transparent focus:outline-none cursor-pointer" :disabled="addNewPost == true" @click="addNewPost = true">
        </div>
        <!-- skeleton user -->
        <div v-else class="w-full flex items-center gap-x-3 p-4 rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10 animate-pulse">
            <div class="h-9 aspect-square rounded-full bg-gray-300 animate-pulse"> </div>
            <div class="h-10 w-full pl-4 font-light rounded-full border border-gray-200 dark:border-gray-100/10 bg-gray-300 animate-pulse"></div>
        </div>
        <!-- post -->
        <div v-if="currentUser">
            <div v-if="posts && posts.length > 0" class="flex flex-col gap-y-5">
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
                        <div class="ml-auto relative">
                            <Icon icon="mdi:dots-vertical" class="text-gray-500 dark:text-white text-2xl" @click="togglePostMenu(post.id)" />
                            <div :id="post.id" v-if="postMenu == post.id" class="flex flex-col w-fit items-start gap-y-[.2rem] absolute right-3 border border-gray-300 dark:border-gray-100/10 py-2 px-3 bg-white dark:bg-gray-900 rounded">
                                <button  v-if="post.userId == currentUser.uid" class="text-sm hover:text-gray-500 hover:dark:text-white" @click="editPostSigle(post.id)">Edit</button>
                                <button  v-if="post.userId == currentUser.uid" class="text-sm hover:text-gray-500 hover:dark:text-white" @click="deletePost(post.id)">Delete</button>
                                <button  v-else class="text-sm hover:text-gray-500 hover:dark:text-white">report</button>
                            </div>
                        </div>
                    </div>
                    <!-- post body -->
                    <div>
                        <p class="line-clamp-4">{{ post.postDetails }}</p>
                    </div>
                    <!-- images -->
                    <div v-if="post.postImages && post.postImages?.length > 0" class="grid grid-cols-2 gap-1"  :class="{ 'col-span-2': post.postImages?.length === 3 && index === 2, '!grid-cols-1': post.postImages?.length === 1}">
                        <div v-for="(imageUrl, index) in post.postImages" :key="index" class="relative rounded cursor-pointer overflow-hidden" :class="{ 'hidden': index > 3 }" @click="viewPostImages(post.postImages, index)" >
                            <img :src="imageUrl" alt="image posted" class="w-full aspect-square" :class="{ 'aspect-video': post.postImages?.length === 3 && index === 2, 'h-96': post.postImages?.length === 1 }" loading="lazy">
                            <div v-if="post.postImages?.length > 4 && index === 3" class="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center">
                                <p class="text-3xl">+{{ post.postImages?.length - 4 }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- post footer -->
                    <div class="mt-1 flex items-center gap-x-3">
                        <div class="flex gap-x-2">
                            <Icon icon="material-symbols-light:favorite-outline"  class="text-gray-500 text-2xl dark:text-white cursor-pointer" />
                            <!-- <Icon name="material-symbols-light:favorite"  class="text-red-500 text-xl cursor-pointer" /> -->
                        </div>  
                        <p class="text-sm text-gray-500 cursor-pointer" @click="toggleComment(post)">{{ commentCounts[post.id]}} comments</p>
                    </div>
                </div>
            </div>
            <p v-if="posts && posts.length === 0" class="text-center"> No post to show</p>
        </div>
        <!-- skeleton -->
        <div v-else class="flex flex-col gap-y-5">
            <div v-for="skeleton in 3" :key="skeleton" class="w-full rounded-xl border animate-pulse shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col">
                <div class="flex items-center gap-x-3">
                    <div class="h-9 aspect-square rounded-full bg-gray-300 animate-pulse"></div>
                    <div>
                        <div class="h-5 w-32 bg-gray-300 animate-pulse rounded"></div>
                        <div class="h-2 w-20 mt-1 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                    <div class="h-5 w-1 bg-gray-300 animate-pulse rounded ml-auto"></div>
                </div>
                <div class="flex flex-col gap-y-2 mt-3">
                    <div class="w-full h-5 bg-gray-300 animate-pulse rounded"></div>
                    <div class="w-full h-5 bg-gray-300 animate-pulse rounded"></div>
                    <div class="w-5/6 h-5 bg-gray-300 animate-pulse rounded"></div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="h-5 aspect-square rounded bg-gray-300 animate-pulse"></div>  
                    <div>
                        <div class="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- add new post component -->
        <newPost v-if="addNewPost" @click.self="addNewPost = false" @closeModal="addNewPost = false" />
        <!-- edit post component -->
        <editPost v-if="editPostModal" :postDetails="postToEdit" @click.self="editPostModal = false" @closeModal="editPostModal = false" />
        <!-- view comments component -->
        <comments :postDetails="postDetails" v-if="toggledComment" @click.self="toggleComment" @closeModal="toggleComment" />
        <!-- view post images -->
        <viewImages @closeModal="viewImagesModal = false" v-if="viewImagesModal" :images="imagesToview" :imageIndex="imageIndex"  />
    </div>
</template>

<script setup>
// components
import newPost from '../components/newPost.vue'
import editPost from '../components/editPost.vue'
import comments from '../components/comments.vue'
import viewImages from '../components/viewPostImages.vue'
// mods
import { formatDistanceToNow } from 'date-fns'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { onSnapshot, collection, updateDoc, arrayUnion, query, orderBy, deleteDoc, doc, getCountFromServer, where } from 'firebase/firestore'

onMounted(() => {
    getPosts()
    watch(posts, () => {
        posts.value.forEach(post => countComments(post.id))
    } )
})

const router = useRouter()
const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const addNewPost = ref(false)

const postMenu = ref('')

// toggle post menu
const togglePostMenu = (postId) => {
    if(postMenu.value){
        postMenu.value = ''
    }else{
        postMenu.value = postId
    }
}

// post collections
const posts = ref(null)

// get realtime posts
const getPosts = (postId) => {
    onSnapshot(
        query(collection(db, 'posts'), orderBy('postedAt', 'desc')), 
        (snapshot) => {
        posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    });
}

// view post images
const viewImagesModal = ref(false)
const imagesToview = ref([])
const imageIndex = ref('')

const viewPostImages = (images, index) => {
    imagesToview.value = images
    imageIndex.value = index
    viewImagesModal.value = true
}

// edit post
const editPostModal = ref(false)
const postToEdit = ref({})

const editPostSigle = (postId) => {
    editPostModal.value = true
    const postDets = posts.value.find(p => p.id === postId)
    postToEdit.value = { ...postDets }

    console.log(postToEdit.value)
}

// delete post
const deletePost = async (postId) => {
    const postRef = doc(db, 'posts', postId)

    deleteDoc(postRef)
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


// view comments
const toggledComment = ref(false)
const postDetails = ref(null)

const toggleComment = (postDets) => {

    if(toggledComment.value === false){
        router.push({
            query: {
                c: postDets.id
            }
        })

        postDetails.value = postDets

        toggledComment.value = true
    }else{
        toggledComment.value = false
        router.push({
            query: {}
        });
    }

}

// count comments by post

const commentCounts = ref({})

const countComments = async (postId) => {
    try {
        const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId)
        );

        const snapshot = await getCountFromServer(q);

        if (snapshot) {
            commentCounts.value[postId] = snapshot.data().count;
        }
    } catch (error) {
        console.log(error);
        commentCounts.value[postId] = 0
    }
};

</script>

<style scoped>
#contents::-webkit-scrollbar {
    display: none;
}
</style>