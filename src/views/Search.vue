<template>
    <div class="flex flex-col gap-y-10 content pb-10">
        <div class="space-y-5">
            <h1 class="text-lg">Students</h1> 
            <div v-if="filteredUsers.length" class="space-y-2">
                <div v-for="user in filteredUsers" :key="user.id" class="border dark:border-gray-100/10 p-2 rounded-xl flex items-center gap-x-4">
                    <div class="w-10 aspect-square rounded-full overflow-hidden">
                        <img v-if="user.photoURL" :src="user.photoURL" alt="photo url" class="w-full h-full rounded-full">
                        <div v-else class="w-full h-full border rounded-full flex items-center justify-center">
                            <Icon icon="mdi:user" class="text-3xl" />
                        </div>
                    </div>
                    <div>
                        <h1 class="text-lg">{{ user.displayName }}</h1>
                        <p class="text-xs text-gray-300 -mt-1">{{ user.studentNumber }}</p>
                    </div>
                </div>
                <p class="text-center cursor-pointer" @click="limit += 3">See more</p>
            </div>
            <p class="text-center cursor-pointer" v-else>No students to show</p>
        </div>
        <div class="space-y-5">
            <h1 class="text-lg">Posts</h1> 
            <!-- post -->
            <div v-if="filteredPosts && filteredPosts.length" class="flex flex-col gap-y-5 mb-5">
                <div v-for="post in filteredPosts" :key="post.id"  @click.self="viewPost(post.id)" class="w-full rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col gap-y-3">
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
                            <!-- <p class="text-[.7rem]">{{ formatDate(post.postedAt) }}</p> -->
                        </div>
                        <div class="ml-auto relative z-10">
                            <Icon icon="mdi:dots-vertical" class="text-gray-500 dark:text-white text-2xl" @click="togglePostMenu(post.id)" />
                            <div :id="post.id" v-if="postMenu == post.id" class="flex flex-col w-fit items-start gap-y-[.2rem] absolute right-3 border border-gray-300 dark:border-gray-100/10 py-2 px-3 bg-white dark:bg-gray-900 rounded">
                                <button  v-if="post.userId == currentUser.uid" class="text-sm hover:text-gray-500 hover:dark:text-white" @click="editPostSigle(post.id)">Edit</button>
                                <button  v-if="post.userId == currentUser.uid" class="text-sm hover:text-gray-500 hover:dark:text-white" @click="deletePost(post.id)">Delete</button>
                                <button  v-else class="text-sm hover:text-gray-500 hover:dark:text-white" @click="reportPost(post.id)">report</button>
                                <button  class="text-sm hover:text-gray-500 hover:dark:text-white" @click="copyToClipboard(post.id)">Copy</button>
                            </div>
                        </div>
                    </div>
                    <!-- post body -->
                    <div>
                        <p class="line-clamp-4">{{ post.postDetails }}</p>
                    </div>
                    <!-- attachments -->
                    <div v-if="post.postAttachments && post.postAttachments?.length" class="flex">
                        <a v-for="(attachments, index) in post.postAttachments" :key="index" :href="attachments" target="_blank" class="relative group">
                            <Icon icon="bxs:file-pdf" class="text-4xl" v-if="attachments.includes('pdf')" />
                            <Icon icon="bxs:file-doc" class="text-4xl" v-else />
                            <p class="text-xs absolute hidden group-hover:block">
                                {{  attachments.split('%')[1] }}
                                <span v-if="attachments.includes('pdf')">.pdf</span>
                                <span v-if="attachments.includes('docx')">.docx</span>
                                <span v-if="attachments.includes('docs')">.docs</span>
                            </p>
                        </a>
                    </div>
                    <!-- images -->
                    <div v-if="post.postImages && post.postImages?.length" class="grid grid-cols-2 gap-1"  :class="{'!grid-cols-1': post.postImages?.length === 1}">
                        <div v-for="(imageUrl, index) in post.postImages" :key="index" class="relative rounded cursor-pointer overflow-hidden" :class="{ 'hidden': index > 3, 'col-span-2': post.postImages?.length === 3 && index === 2 }" @click="viewPostImages(post.postImages, index)" >
                            <img :src="imageUrl" alt="image posted" class="w-full aspect-square object-cover" :class="{ '!aspect-video': post.postImages?.length === 3 && index === 2, 'h-96': post.postImages?.length === 1 }" loading="lazy">
                            <div v-if="post.postImages?.length > 4 && index === 3" class="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center">
                                <p class="text-3xl">+{{ post.postImages?.length - 4 }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- post footer -->
                    <div class="mt-1 flex items-center justify-between gap-x-3">
                        <div class="flex gap-x-1">
                            <Icon v-if="post.reacts?.includes(currentUser?.uid)" icon="material-symbols-light:favorite"  class="text-red-500 text-2xl dark:text-red-500 cursor-pointer" @click="removeReact(post.id)" />
                            <Icon v-else icon="material-symbols-light:favorite-outline"  class="text-gray-500 text-2xl dark:text-white cursor-pointer" @click="react(post.id)" />
                            <p class="text-sm text-gray-500 cursor-pointer">{{ post.reacts?.length || 0 }}</p>
                            <!-- <share-network
                                network="messenger"
                                :url="`https://studybuddy-livid.vercel.app/user-details/${post.userId}`"
                                title="This is a post"
                                description="description"
                                v-slot="{ share }"
                            >
                                <span @click="share">Share on Facebook</span>
                            </share-network> -->
                            <!-- <Icon name="material-symbols-light:favorite"  class="text-red-500 text-xl cursor-pointer" /> -->
                        </div>  
                        <p class="text-sm text-gray-500 cursor-pointer" @click="toggleComment(post)">{{ commentCounts[post.id] }} comments</p>
                    </div>
                </div>
            </div>
            <p v-else class="text-center"> No post to show</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { db } from '../plugins/firebase'
import { collection, getDocs, doc, updateDoc, arrayRemove, arrayUnion, onSnapshot, where, orderBy, query, getCountFromServer } from 'firebase/firestore'
import { onMounted, ref, watch, watchEffect, computed, onUnmounted } from 'vue'
import { useAuthStore } from '../store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const searchQuery = computed(() => route.query.q)

const users = ref([])

// get users
const userCollection = collection(db, 'users')
const getUsers = async () => {
    users.value = []
    try {
        const snapshots = await getDocs(userCollection)

        snapshots.docs.forEach(doc => {
            users.value.push({
                id: doc.id,
                ...doc.data()
            })
        })
    } catch (error) {
        console.log(error)
    }
}


// filter user 
const limit = ref(3)
const filteredUsers = ref([])

watchEffect(() => {
    filteredUsers.value = users.value.filter(user => user.displayName.toLowerCase().includes(searchQuery.value.toLowerCase())).splice(0, limit.value)
})

const posts = ref([])

// get posts
let unsubscribe

const getPosts = (postId) => {
    unsubscribe = onSnapshot(
        query(collection(db, 'posts'), 
            where('group', '==', 'all'),
            orderBy('postedAt', 'desc')
        ), 
        (snapshot) => {
            posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    );
}


// filter user 
const postLimit = ref(3)
const filteredPosts = ref([])

watchEffect(() => {
    filteredPosts.value = posts.value.filter(post => post.postDetails.toLowerCase().includes(searchQuery.value.toLowerCase())).splice(0, postLimit.value)
})

const viewPost = (postId) => {
    router.push({
        path: '/post-details',
        query: {
            id: postId
        }
    })
}

const postMenu = ref('')

// toggle post menu
const togglePostMenu = (postId) => {
    if(postMenu.value){
        postMenu.value = ''
    }else{
        postMenu.value = postId
    }
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

// report a post
const reportrRef = collection(db, 'reports')

const reportPost = async (postId) => {
    try {
        await addDoc(reportrRef, {
            postId: postId,
            reportedBy: currentUser.value?.uid,
            reportedAt: new Date()
        })

        postMenu.value = ''
        $toast.success('Post successfully reported')
    } catch (error) {
        console.log(error)
    }
}

// conver date to x time ago
const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate();
  
    return formatDistanceToNow(date, { addSuffix: true });
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

const copyToClipboard = async (userId) => {
    const url = `${window.location.origin}/post-details?id=${userId}`;
    try {
    await navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
    } catch (err) {
    console.error('Failed to copy: ', err);
    }
}

// react to post
const react = async (postId) => {
    const docRef = doc(db, 'posts', postId)
    try {
        await updateDoc(docRef, {
            reacts: arrayUnion(currentUser.value.uid)
        })
    } catch (error) {
        console.log(error)
    } 
}

const removeReact = async (postId) => {
    const docRef = doc(db, 'posts', postId)
    try {
        await updateDoc(docRef, {
            reacts: arrayRemove(currentUser.value.uid)
        })
    } catch (error) {
        console.log(error)
    } 
}

onMounted(() => {
    getUsers()
    getPosts()

    watch(posts, () => {
        posts.value.forEach(post => countComments(post.id))
    })

    watch(() => searchQuery.value, (newVal) => {
        if(newVal){
            getUsers()
            getPosts()
        }
    })
})

onUnmounted(() => {
    if(unsubscribe){
        unsubscribe()
    }
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
