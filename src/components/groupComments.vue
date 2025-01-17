<template>
    <div class="absolute bg-white/55 dark:bg-black/55 backdrop-blur w-screen h-screen left-0 top-0 z-20 flex items-center justify-center">
        <div class="bg-white border dark:border-none dark:bg-gray-900 h-full w-5/6 md:w-4/6 lg:w-3/5 xl:w-2/5 p-4 space-y-5 overflow-y-auto">
            <div class="border border-gray-300 dark:border-gray-100/10 h-fit rounded-xl p-3 flex flex-col gap-y-5">
                <!-- post header -->
                <div class="flex items-center gap-x-2">
                    <img v-if="postDetails.photoURL" :src="postDetails.photoURL" alt="profile picture" class="w-10 aspect-square rounded-full">
                    <div v-else class="rounded-full border flex items-center justify-center p-2">
                        <Icon icon="mdi:user" class="text-gray-500 text-xl dark:text-white" />
                    </div>
                    <div class="-space-y-1">
                        <router-link :to="{ name: 'userDetails', params: { id: postDetails.userId } }">
                            <h2 class="font-medium">{{ postDetails.name }}</h2>
                        </router-link>
                        <p class="text-xs dark:text-gray-100/65">{{ formatDate(postDetails.postedAt) }}</p>
                    </div>
                    <div class=" ml-auto bg-gray-100/10 p-1 rounded hover:bg-gray-100/5 cursor-pointer" @click="closeModal">
                        <Icon icon="mdi:close" class="text-xl" />
                    </div>
                </div>
                <!-- post Details -->
                <div>
                    <p>{{ postDetails.postDetails }}</p>
                </div>
                <!-- images -->
                <div v-if="postDetails.postImages && postDetails.postImages?.length > 0" class="grid grid-cols-2 gap-1"  :class="{ 'col-span-2': postDetails.postImages?.length === 3 && index === 2, '!grid-cols-1': postDetails.postImages?.length === 1}">
                    <div v-for="(imageUrl, index) in postDetails.postImages" :key="index" class="relative rounded cursor-pointer overflow-hidden" :class="{ 'hidden': index > 3 }" @click="viewPostImages(post.postImages, index)" >
                        <img :src="imageUrl" alt="image posted" class="w-full aspect-square" :class="{ 'aspect-video': postDetails.postImages?.length === 3 && index === 2, 'h-96': postDetails.postImages?.length === 1 }" loading="lazy">
                        <div v-if="postDetails.postImages?.length > 4 && index === 3" class="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center">
                            <p class="text-3xl">+{{ postDetails.postImages?.length - 4 }}</p>
                        </div>
                    </div>
                </div>
                <!-- post footer -->
                <div class="flex justify-between">
                    <div class="flex gap-x-1">
                        <div class="flex items-center gap-x-3 text-2xl">
                            <div class="flex items-center gap-x-1">
                                <Icon icon="mdi:like" class="cursor-pointer" :class="{ '!text-blue-500': postDetails.likes?.includes(currentUser.uid) }" @click="likePost(postDetails.id)" />
                                <p class="text-lg mt-1">{{ postDetails.likes?.length }}</p>
                            </div>
                            <div class="flex items-center gap-x-1">
                                <Icon icon="mdi:dislike" class="cursor-pointer" :class="{ '!text-blue-500': postDetails.dislikes?.includes(currentUser.uid) }" @click="dislikePost(postDetails.id)" />
                                <p class="text-lg mt-1">{{ postDetails.dislikes?.length }}</p>
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
                    <p class="dark:text-gray-100/55 text-sm">{{ commentCount }} comments</p>
                </div>
            </div>
            <div v-if="comments.length > 0">
                <!-- see more/see less -->
                <p v-if="commentCount > queryLimit" class="dark:text-gray-100/55 mb-4 cursor-pointer text-sm" @click="queryLimit += 5">see more</p>
                <p v-else-if="commentCount === queryLimit" class="dark:text-gray-100/55 mb-4 cursor-pointer text-sm" @click="queryLimit = 5">see less</p>
                <p v-else class="dark:text-gray-100/55 mb-4 cursor-pointer text-sm">comments</p>
                <div class="flex flex-col gap-y-5">
                    <!-- comments to loop -->
                    <div v-for="comment in comments" :key="comment.id" class="flex flex-col gap-y-2 rounded-md">
                        <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded-xl">
                            <div class="flex items-center gap-x-2">
                                <img v-if="comment.photoURL" :src="comment.photoURL" alt="profile picture" class="w-9 aspect-square rounded-full">
                                <div v-else class="rounded-full border flex items-center justify-center p-2">
                                    <Icon icon="mdi:user" class="text-gray-500 text-lg dark:text-white" />
                                </div>
                                <div class="-space-y-1">
                                    <h2 class="text-sm font-medium">{{ comment.name }}</h2>
                                    <p class="text-[.7rem] dark:text-gray-100/65">{{ formatDate(comment.commentedAt) }}</p>
                                </div>
                            </div>
                            <div class="mt-1">
                                <p>{{ comment.comment }}</p>
                            </div>
                            <div class="flex items-center gap-x-2 mt-2">
                                <div class="flex items-center gap-x-3 text-2xl">
                                    <div class="flex items-center gap-x-1">
                                        <Icon icon="mdi:like" class="cursor-pointer text-lg" :class="{ '!text-blue-500': comment.likes?.includes(currentUser.uid) }" @click="likeComment(comment.id)" />
                                        <p class="text-lg mt-1">{{ comment.likes?.length }}</p>
                                    </div>
                                    <div class="flex items-center gap-x-1">
                                        <Icon icon="mdi:dislike" class="cursor-pointer text-lg" :class="{ '!text-blue-500': comment.dislikes?.includes(currentUser.uid) }" @click="dislikeComment(comment.id)" />
                                        <p class="text-lg mt-1">{{ comment.dislikes?.length }}</p>
                                    </div>
                                </div>
                                <p class="text-sm dark:text-gray-100/55 cursor-pointer hover:text-gray-500 hover:dark:text-gray-100/65" @click="toggleReplyInput(comment.id)">Reply</p>
                                <p v-if="replies[comment.id] && replies[comment.id].length" class="text-sm dark:text-gray-100/55 cursor-pointer hover:text-gray-500 hover:dark:text-gray-100/65 ml-auto" @click="viewReplies(comment.id)">View replies</p>
                            </div>
                        </div>
                        <div v-if="repliesIndex.includes(comment.id)" class="h-fit mt-2 flex gap-x-2">
                            <div class="w-[5%] border-l border-b rounded-bl h-10 border-gray-300 dark:border-gray-100/10"></div>
                            <div v-if="replies[comment.id] && replies[comment.id].length" class="w-[95%] flex flex-col gap-y-3">
                                <div v-for="(reply, index) in replies[comment.id]" :key="reply.id" class="flex flex-col gap-y-1">
                                    <div class="bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                                        <div class="flex items-center gap-x-2">
                                            <img v-if="reply.photoURL" :src="reply.photoURL" alt="profile picture" class="w-9 aspect-square rounded-full">
                                            <div v-else class="rounded-full border flex items-center justify-center p-2">
                                                <Icon icon="mdi:user" class="text-gray-500 text-lg dark:text-white" />
                                            </div>
                                            <div class="-space-y-1">
                                                <h2 class="text-sm font-medium">{{ reply.name }}</h2>
                                                <p class="text-[.7rem] dark:text-gray-100/65">{{ formatDate(reply.repliedAt) }}</p>
                                            </div>
                                        </div>
                                        <div class="mt-1">
                                            <p>{{ reply.reply }}</p>
                                        </div>
                                        <div class="flex items-center gap-x-3 text-2xl">
                                            <div class="flex items-center gap-x-1">
                                                <Icon icon="mdi:like" class="cursor-pointer text-lg" :class="{ '!text-blue-500': reply.likes?.includes(currentUser.uid) }" @click="likeReply(reply.id, comment.id, index)" />
                                                <p class="text-lg mt-1">{{ reply.likes?.length }}</p>
                                            </div>
                                            <div class="flex items-center gap-x-1">
                                                <Icon icon="mdi:dislike" class="cursor-pointer text-lg" :class="{ '!text-blue-500': reply.dislikes?.includes(currentUser.uid) }" @click="dislikeReply(reply.id, comment.id, index)" />
                                                <p class="text-lg mt-1">{{ reply.dislikes?.length }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <div v-if="addingReply && repliesIndex.includes(comment.id)" class="bg-gray-100 dark:bg-gray-800 p-2 rounded-md ml-9">
                            <div class="flex items-center gap-x-2">
                                <div class="rounded-full bg-gray-300 animate-pulse flex items-center justify-center p-2 w-8 aspect-square"></div>
                                <div class="w-full">
                                    <div class="h-3 w-1/3 rounded animate-pulse bg-gray-300"></div>
                                    <div class="mt-1 h-2 w-1/5 rounded animate-pulse bg-gray-300"></div>
                                </div>
                            </div>
                            <div class="mt-2 space-y-1">
                                <div class="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                                <div class="h-5 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            <div class="mt-2 flex items-center gap-x-2">
                                <div class="w-4 aspect-square rounded-full bg-gray-300 animate-pulse"></div>
                            </div>
                        </div> -->
                        <div v-if="repliesIndex.includes(comment.id) || replyToComment.includes(comment.id)" class="flex items-center gap-x-2 pl-12">
                            <img v-if="currentUser.photoURL" :src="currentUser.photoURL" alt="profile picture" class="w-8 aspect-square rounded-full">
                            <div v-else class="rounded-full border flex items-center justify-center p-1">
                                <Icon icon="mdi:user" class="text-gray-500 text-lg dark:text-white" />
                            </div>
                            <div class="border dark:border-gray-100/10 rounded-lg  w-full h-9 flex items-center p-2">
                                <input @keyup.enter="addReply(comment.id)" type="text" v-model="reply" :placeholder="`reply to ${comment.name.split(' ')[0]}'s comment`" class="h-full w-full dark:bg-transparent focus:outline-none">
                                <Icon icon="carbon:send-alt" class="text-2xl cursor-pointer" @click="addReply(comment.id)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <p class="text-gray-300/55">No comments to show</p>
            </div>
            <!-- add comment -->
            <div class="flex items-center gap-x-2 mt-4">
                <img v-if="currentUser.photoURL" :src="currentUser.photoURL" alt="profile picture" class="w-9 aspect-square rounded-full">
                <div v-else class="rounded-full border flex items-center justify-center p-1">
                    <Icon icon="mdi:user" class="text-gray-500 text-xl dark:text-white" />
                </div>
                <div class="border dark:border-gray-100/10 rounded-lg  w-full h-9 flex items-center p-2">
                    <input @keyup.enter="addComment(postDetails.id)" type="text" :placeholder="`Comment to ${postDetails.name.split(' ')[0]}'s post`" v-model="comment" class="h-full w-full dark:bg-transparent focus:outline-none">
                    <Icon icon="carbon:send-alt" class="text-2xl cursor-pointer" @click="addComment(postDetails.id)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted, watch } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '../store'
import { db } from '../plugins/firebase'
import { collection, addDoc, Timestamp, query, where, orderBy, onSnapshot, limit, getCountFromServer, doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'
import { Filter } from 'bad-words'

const authStore = useAuthStore()

// currentUser details
const currentUser = computed(() => authStore.currentUser)

const { postDetails } = defineProps({
    postDetails: Object
})

const emit = defineEmits([
    'closeModal'
])

// close modal
const closeModal = () => {
    emit('closeModal')
}

// format date
const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate();
  
    return formatDistanceToNow(date, { addSuffix: true });
}

// view replies
const repliesIndex = ref([])

const viewReplies = (commentId) => {
    if (repliesIndex.value.includes(commentId)) {
        repliesIndex.value = repliesIndex.value.filter(i => i !== commentId);
    } else {
        repliesIndex.value.push(commentId); 
    }
}

// comments collection reference
const commRefs = collection(db, 'comments')

// add comment
const comment = ref('')

const filter = new Filter();
filter.addWords('yawa', 'buang', 'ulol', 'gago', 'gaga', 'linti', 'buysit', 'bweset', 'putangina', 'tangina', 'tanga', 'bobo', 'pota', 'dipota', 'inutil', 'bilat', 'pitoy', 'monay', 'buto', 'boto')

const addComment = async (postId) => {

    if(!comment.value) return

    try {
        const res = await addDoc(commRefs, {
            postId: postId,
            comment: filter.clean(comment.value),
            name: currentUser.value.displayName,
            photoURL: currentUser.value.photoURL,
            commentedAt: Timestamp.now(),
            userId: currentUser.value.uid,
            likes: [],
            dislikes: []
        })

        comment.value = ''
    } catch (error) {
        console.log(error)
    }
}


// add reply
const reply = ref('')
// const addingReply = ref(false)

const replyRef = collection(db, 'replies')

const addReply = async (commentId) => {
    if(!reply.value) return

    try {
        // addingReply.value = true
        const res = await addDoc(replyRef, {
            reply: filter.clean(reply.value),
            commentId: commentId,
            name: currentUser.value.displayName,
            photoURL: currentUser.value.photoURL,
            repliedAt: Timestamp.now(),
            userId: currentUser.value.uid,
            likes: [],
            dislikes: []
        })

        reply.value = ''
        // addingReply.value = false
        if(!repliesIndex.value.includes(commentId)){
            viewReplies(commentId)
        }
        countComments()
    } catch (error) {
        console.log(error)
    }
}

// toggle reply input
const replyToComment = ref([])

const toggleReplyInput = (commentId) => {
    if (replyToComment.value.includes(commentId)) {
        replyToComment.value = replyToComment.value.filter(i => i !== commentId);
    } else {
        replyToComment.value.push(commentId); 
    }
}

// get comments
const comments = ref([])
const queryLimit = ref(5)

const getComments = async () => {
    try {
        onSnapshot(
            query(
                commRefs, 
                where('postId', '==', postDetails.id),
                limit(queryLimit.value)
            ),
            (snapshot) => {
                comments.value = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).reverse()
                countComments()
            }
        )
    } catch (error) {
        console.log(error)
    }
}

// get replies
const replies = ref({})

const getReplies = async (commentId) => {
    try {
        onSnapshot(
            query(
                collection(db, 'replies'),
                where('commentId', '==', commentId),
                orderBy('repliedAt', 'asc')
            ),
            (snapshot) => {
                replies.value[commentId] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                countComments()
            }
        )
    } catch (error) {
        console.log(error)
    }
}

// count comments
const commentCount = ref(0)

const countComments = async () => {
    try {
        const q = query(
            commRefs, 
            where('postId', '==', postDetails.id)
        )
        const snapshot = await getCountFromServer(q)

        commentCount.value = snapshot.data().count
    } catch (error) {
        console.log(error)
    }
}

// like posts
const likePost = async (id) => {
    const isLiked = postDetails.likes?.includes(currentUser.value?.uid)
    try {
        if (isLiked) {
            await updateDoc(
                doc(db, 'posts', id),
                {
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )
            const index = postDetails.likes.indexOf(currentUser.value?.uid)
            if (index > -1) postDetails.likes.splice(index, 1) 
        } else {
            await updateDoc(
                doc(db, 'posts', id),
                {
                    likes: arrayUnion(currentUser.value?.uid),
                    dislikes: arrayRemove(currentUser.value?.uid)  
                }
            )
            if (!postDetails.likes.includes(currentUser.value?.uid)) {
                postDetails.likes.push(currentUser.value?.uid)
            }
            const dislikeIndex = postDetails.dislikes.indexOf(currentUser.value?.uid)
            if (dislikeIndex > -1) postDetails.dislikes.splice(dislikeIndex, 1)
        }
    } catch (error) {
        console.log(error)
    }
}

// dislike posts
const dislikePost = async (id) => {
    const isDisliked = postDetails.dislikes?.includes(currentUser.value?.uid)
    try {
        if (isDisliked) {
            await updateDoc(
                doc(db, 'posts', id),
                {
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )
            const index = postDetails.dislikes.indexOf(currentUser.value?.uid)
            if (index > -1) postDetails.dislikes.splice(index, 1)  
        } else {
            await updateDoc(
                doc(db, 'posts', id),
                {
                    dislikes: arrayUnion(currentUser.value?.uid),
                    likes: arrayRemove(currentUser.value?.uid) 
                }
            )
            if (!postDetails.dislikes.includes(currentUser.value?.uid)) {
                postDetails.dislikes.push(currentUser.value?.uid)
            }
            const likeIndex = postDetails.likes.indexOf(currentUser.value?.uid)
            if (likeIndex > -1) postDetails.likes.splice(likeIndex, 1)
        }
    } catch (error) {
        console.log(error)
    }
}

// like commenet
const likeComment = async (id) => {
    const isLiked = comments.likes?.includes(currentUser.value?.uid)
    try {
        if (isLiked) {
            await updateDoc(
                doc(db, 'comments', id),
                {
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )
        } else {
            await updateDoc(
                doc(db, 'comments', id),
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

// dislike comment
const dislikeComment = async (id) => {
    const isDisliked = comments.dislikes?.includes(currentUser.value?.uid)
    try {
        if (isDisliked) {
            await updateDoc(
                doc(db, 'comments', id),
                {
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )
        } else {
            await updateDoc(
                doc(db, 'comments', id),
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

// like reply
const likeReply = async (id, commentID, index) => {
    const isLiked =replies.value[commentID][index].likes?.includes(currentUser.value?.uid)
    try {
        if (isLiked) {
            await updateDoc(
                doc(db, 'replies', id),
                {
                    likes: arrayRemove(currentUser.value?.uid)
                }
            )
        } else {
            await updateDoc(
                doc(db, 'replies', id),
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

// dislike reply
const dislikeReply = async (id, commentID, index) => {
    const isDisliked =replies.value[commentID][index].dislikes?.includes(currentUser.value?.uid)
    try {
        if (isDisliked) {
            await updateDoc(
                doc(db, 'replies', id),
                {
                    dislikes: arrayRemove(currentUser.value?.uid)
                }
            )
        } else {
            await updateDoc(
                doc(db, 'replies', id),
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


onMounted(() => {
    getComments()
    
    watch(queryLimit, () => {
        getComments()
    })
    watch(comments, () => {
        comments.value.forEach(comm => getReplies(comm.id))
    })
})
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    background-color: transparent;
    width: 3px
}
.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 5px
}
</style>