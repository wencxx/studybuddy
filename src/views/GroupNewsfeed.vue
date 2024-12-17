<template>
    <div class="flex flex-col gap-y-14" id="contents">
        <!-- add new post -->
        <div v-if="currentUser" class="w-full flex items-center gap-x-3 p-4 rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10">
            <img v-if="currentUser?.photoURL" :src="currentUser?.photoURL" class="h-9 aspect-square rounded-full" />
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
        <div v-if="currentUser && posts && posts.length > 0">
            <div v-if="posts && posts.length > 0" class="flex flex-col gap-y-5 mb-5">
                <div v-for="post in posts" :key="post.id"  @click.self="viewPost(post.id)" class="w-full rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col gap-y-3">
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
                        <p class="line-clamp-4" v-html="formatPostContent(post.postDetails)"></p>
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
                    <div v-if="post.postImages && post.postImages?.length > 0" class="grid grid-cols-2 gap-1"  :class="{'!grid-cols-1': post.postImages?.length === 1}">
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
                            <!-- <Icon v-if="post.reacts?.includes(currentUser?.uid)" icon="material-symbols-light:favorite"  class="text-red-500 text-2xl dark:text-red-500 cursor-pointer" @click="removeReact(post.id)" />
                            <Icon v-else icon="material-symbols-light:favorite-outline"  class="text-gray-500 text-2xl dark:text-white cursor-pointer" @click="react(post.id)" /> -->
                            <div class="flex items-center gap-x-3 text-2xl">
                                <div class="flex items-center gap-x-1">
                                    <Icon icon="mdi:like" class="cursor-pointer" :class="{ '!text-blue-500': post.likes.includes(currentUser.uid) }" @click="likePost(post.id)" />
                                    <p class="text-lg mt-1">{{ post.likes.length }}</p>
                                </div>
                                <div class="flex items-center gap-x-1">
                                    <Icon icon="mdi:dislike" class="cursor-pointer" :class="{ '!text-blue-500': post.dislikes.includes(currentUser.uid) }" @click="dislikePost(post.id)" />
                                    <p class="text-lg mt-1">{{ post.dislikes.length }}</p>
                                </div>
                            </div>
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
            <p v-if="posts && posts.length === 0" class="text-center"> No post to show</p>
        </div>
        <!-- skeleton -->
        <p v-else-if="currentUser && posts && posts.length === 0" class="text-center">No post to show</p>
        <postSkeletonLoader v-else :noOfSkeleton="5" />

        <!-- add new post component -->
        <newGroupPost v-if="addNewPost" @click.self="addNewPost = false" :group="$route.meta.name" @closeModal="addNewPost = false" />
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
import newGroupPost from '../components/newGroupPost.vue'
import editPost from '../components/editPost.vue'
import comments from '../components/comments.vue'
import viewImages from '../components/viewPostImages.vue'
import postSkeletonLoader from '../components/postSkeletonLoader.vue'
// mods
import { formatDistanceToNow } from 'date-fns'
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { onSnapshot, collection, updateDoc, arrayUnion, arrayRemove, query, orderBy, deleteDoc, doc, getCountFromServer, where, addDoc } from 'firebase/firestore'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const router = useRouter()
const route = useRoute()
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

watch(() => route.meta.name, (newGroupName) => {
    posts.value = []
    if (unsubscribe) unsubscribe();
    getPosts()
});


// get realtime posts
let unsubscribe

const getPosts = (postId) => {
    unsubscribe = onSnapshot(
        query(collection(db, 'posts'), 
            where('group', '==', route.meta.name),
            orderBy('postedAt', 'desc')
        ), 
        (snapshot) => {
            posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    );
}

const viewPost = (postId) => {
    router.push({
        path: '/post-details',
        query: {
            id: postId
        }
    })
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

// like feedback
const likePost = async (id) => {
    const currentPost = posts.value.find(post => post.id === id)
    const isLiked = currentPost.likes?.includes(currentUser.value?.uid) 
    try {
        if(isLiked){
            await updateDoc(
                doc(db, 'posts', id),
                {
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }else{
            await updateDoc(
                doc(db, 'posts', id),
                {
                    likes: arrayUnion(currentUser.value?.uid),
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }
        
    } catch (error) {
        console.log(error)
    }
}

// dislike feedback
const dislikePost = async (id) => {
    const currentPost = posts.value.find(post => post.id === id)
    const isDisliked = currentPost.dislikes?.includes(currentUser.value?.uid) 
    try {
        if(isDisliked){
            await updateDoc(
                doc(db, 'posts', id),
                {
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }else{
            await updateDoc(
                doc(db, 'posts', id),
                {
                    dislikes: arrayUnion(currentUser.value?.uid),
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )   
        }
        
    } catch (error) {
        console.log(error)
    }
}

getPosts()

const formatPostContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return content.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
    });
}

onMounted(() => {
    watch(posts, () => {
        posts.value.forEach(post => countComments(post.id))
    })
})

onUnmounted(() => {
    if(unsubscribe){
        unsubscribe()
    }
})

</script>

<style scoped>
#contents::-webkit-scrollbar {
    display: none;
}
</style>