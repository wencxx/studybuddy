<template>
    <div v-if="user" class="flex flex-col gap-y-5 mx-auto md:px-20" id="container" @click.self="toggledProfileMenu = false">
        <div class="flex items-center gap-x-5 relative">
            <div class="relative group">
                <img v-if="user.photoURL" :src="user.photoURL" alt="profilePic" class="h-16 aspect-square rounded-full object-cover">
                <div v-else class="h-16 aspect-square border rounded-full flex items-center justify-center">
                    <Icon icon="fluent:person-16-filled" class="text-5xl" />
                </div>
                <div v-if="uploadingProfile" class="h-16 aspect-square border rounded-full absolute top-0 left-0 bg-gray-100/25 animate-pulse"></div>
                <div class="h-16 aspect-square rounded-full absolute top-0 left-0 bg-black/50 cursor-pointer hidden group-hover:flex items-center justify-center">
                    <Icon icon="weui:camera-outlined" class="text-2xl" @click="chooseProfilePic" />
                    <input type="file" accept=".jpg, .png, .jpeg" class="hidden" id="fileInput" @change="changeImage">
                </div>
            </div>
            <div>
                <h2 class="text-2xl flex items-center gap-x-2 capitalize">
                    {{ user.displayName }} 
                    <span>
                        <Icon v-if="getRanking()" :icon="`tabler:rosette-number-${getRanking()}`" class="text-2xl bg-blue-500 rounded-full" />
                    </span>
                </h2>
                <p class="text-sm">{{ user.email }}</p>
            </div>
            <div  v-if="user.userId === currentUser.uid" class="absolute right-0 top-3 flex flex-col items-end">
                <Icon icon="mdi:dots-vertical" class="text-2xl text-gray-100/50 cursor-pointer" @click="toggledProfileMenu = true" />
                <div v-if="toggledProfileMenu" class="bg-neutral-800 p-2 rounded">
                    <p class="text-xs cursor-pointer" @click="passwordModal = true">change password</p>
                </div>
            </div>
        </div>
        <div>
            <p class="text-sm dark:text-gray-100/55">Course: {{ user.course }}</p>
            <p class="text-sm dark:text-gray-100/55">Year & Section: {{ user.yearSection }}</p>
            <p class="text-sm dark:text-gray-100/55">Ratings: {{ overAllRatings().toFixed(1) || 0 }}</p>
            <div class="flex gap-x-2 mt-2" v-if="currentUser.uid !== $route.params.id">
                <p class="text-sm dark:text-gray-100/55">Rate:</p>
                <Icon
                    v-for="star in 5"
                    :key="'q1-star-' + star"
                    :icon="star <= getCurrentUserRating() ? 'iconoir:star-solid' : 'iconoir:star'"
                    :class="['text-lg cursor-pointer', star <= getCurrentUserRating() ? 'text-yellow-500' : 'dark:text-white']"
                    @click="rate(star)"
                />
            </div>
        </div>
        <div v-if="user.userId !== currentUser.uid" class="flex gap-x-5">
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
                <!-- <Icon icon="tdesign:user-error-1" class="text-xl" /> -->
                <span>Decline</span>
            </button>
            <button v-if="isCollaborated(user?.userId) === 'requested'" class="w-1/2 border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2" @click="toggleCollab('cancel', user?.userId)">
                <!-- <Icon icon="tdesign:user-error-1" class="text-xl" /> -->
                <span>cancel</span>
            </button>
            <router-link :to="{ name: 'message', params: { id: user?.userId } }" v-if="isCollaborated(user?.userId) === 'collaborated'" class="w-1/2 border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2">
                <!-- <Icon icon="bitcoin-icons:message-outline" class="text-3xl" /> -->
                <span>Message</span>
            </router-link>
        </div>
        <div v-else>
            <router-link :to="{ name: 'messages' }" class="w-full border border-gray-300 dark:border-gray-100/10 hover:dark:bg-gray-700/25 py-1 rounded flex justify-center items-center gap-x-2">
                <Icon icon="bitcoin-icons:message-outline" class="text-3xl" />
                <span>Messages</span>
            </router-link>
        </div>
        <!-- post -->
        <div v-if="posts && posts?.length > 0" class="flex flex-col gap-y-5 mt-10 pb-5">
            <div v-for="(post) in posts" :key="post.id" class="w-full rounded-xl border shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col gap-y-3">
                <!-- post header -->
                <div class="flex items-center gap-x-3">
                    <img v-if="post.photoURL" :src="post.photoURL" alt="profile pic" class="h-9 aspect-square rounded-full" />
                    <div v-else class="flex border rounded-full p-2">
                        <Icon icon="mdi:user"  class="text-gray-500 text-xl dark:text-white" />
                    </div>
                    <div>
                        <h2 class="font-semibold cursor-pointer hover:underline hover:text-gray-200">{{ post.name }}</h2>
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
                        <img :src="imageUrl" alt="image posted" class="w-full aspect-square object-cover" :class="{ 'aspect-video': post.postImages?.length === 3 && index === 2, 'h-96': post.postImages?.length === 1 }" loading="lazy">
                        <div v-if="post.postImages?.length > 4 && index === 3" class="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center">
                            <p class="text-3xl">+{{ post.postImages?.length - 4 }}</p>
                        </div>
                    </div>
                </div>
                <!-- post footer -->
                <div class="mt-1 flex items-center justify-between">
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
                    <div>
                        <p @click="toggleComment(post)" class="text-xs text-gray-400 cursor-pointer">{{ commentCounts[post.id] || 0 }} comments</p>
                    </div>
                </div>
            </div>
        </div>
        <p v-else class="text-center"> No post to show</p>
        <!-- view comments component -->
        <comments :postDetails="postDetails" v-if="toggledComment" @click.self="toggleComment" @closeModal="toggleComment" />
        <!-- edit post component -->
        <editPost v-if="editPostModal" :postDetails="postToEdit" @click.self="editPostModal = false" @closeModal="editPostModal = false" />
        <!-- view post images -->
        <viewImages @closeModal="viewImagesModal = false" v-if="viewImagesModal" :images="imagesToview" :imageIndex="imageIndex"  />
        <!-- profile image view to change -->
        <div v-if="displaySelectedProfile" class="w-screen h-screen bg-black/10 fixed top-0 left-0 z-20 flex flex-col items-center justify-center gap-y-10">
            <img :src="tempUrl" class="border h-1/2 aspect-square rounded-full object-cover bg-white">
            <div class="flex gap-x-5">
                <button class="border border-blue-500 text-blue-500 px-5 py-1 rounded">Cancel</button>
                <button class="px-5 py-1 rounded bg-blue-500" @click="uploadProfilePic">Upload</button>
            </div>
        </div>
        <div v-if="uploadingProfile" class="fixed right-5 bottom-5 flex items-center gap-x-2 bg-blue-500 py-1 px-2 rounded">
            <Icon icon="eos-icons:loading" />
            <p>Uploading</p>
        </div>
        <!-- change password -->
        <div v-if="passwordModal" class="w-screen h-screen bg-black/10 fixed top-0 left-0 z-20 flex flex-col items-center justify-center gap-y-10">
            <form @submit.prevent="changePassword" class="bg-white rounded border p-3 text-black ">
                <h1 class="text-center">Update Password</h1>
                <div class="flex flex-col gap-y-1 mt-3">
                    <label class="text-sm">Current password</label>
                    <input type="password" class="rounded border h-8 pl-2" v-model="currentPassword">
                </div>
                <div class="flex flex-col gap-y-1 mt-3">
                    <label class="text-sm">New Password</label>
                    <input type="password" class="rounded border h-8 pl-2" v-model="newPassword">
                </div>
                <div class="flex gap-x-2 justify-end items-center !mt-5">
                    <button class="border border-blue-500 px-2 rounded text-blue-500">Cancel</button>
                    <button class="border border-transparent bg bg-blue-500 px-2 rounded text-white">Change</button>
                </div>
            </form>
        </div>
    </div>
    <div v-else class="flex flex-col gap-y-5 mx-auto px-10 md:px-20">
        <div class="flex items-center gap-x-5">
            <div class="h-16 aspect-square bg-gray-300 rounded-full animate-pulse"></div>
            <div>
                <div class="h-7 w-40 bg-gray-300 animate-pulse rounded"></div>
                <div class="h-4 w-32 bg-gray-300 animate-pulse rounded mt-2"></div>
            </div>
        </div>
        <div class="mt-2 space-y-2">
            <div class="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
            <div class="h-4 w-32 bg-gray-300 animate-pulse rounded"></div>
        </div>
        <div class="flex gap-x-2">
            <div class="w-1/2 h-8 bg-gray-300 animate-pulse rounded"></div>
            <div class="w-1/2 h-8 bg-gray-300 animate-pulse rounded"></div>
        </div>
    </div>
</template>

<script setup>
import viewImages from '../components/viewPostImages.vue'
import comments from '../components/comments.vue'
import editPost from '../components/editPost.vue'
import { formatDistanceToNow } from 'date-fns'
import { ref, onMounted, computed, watch } from 'vue';
import { collection, query, where, getDocs, onSnapshot, limit, updateDoc, arrayUnion, arrayRemove, doc, orderBy, getCountFromServer, addDoc, Timestamp, and, getDoc } from 'firebase/firestore';
import { db, storage, auth } from '../plugins/firebase'; 
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useDataStore } from '../store'
import { indexedDBLocalPersistence, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const toggledProfileMenu = ref(false)

const authStore = useAuthStore()
const dataStore = useDataStore()

const isCollaborated = computed(() => authStore.isCollaborated)
const currentUser = computed(() => authStore.currentUser)
const topRated = computed(() => dataStore.topRatedUsers)

const route = useRoute()
const router = useRouter()

const getRanking = () => {
    const user = topRated?.value.find(user => user.userId === route.params.id)
    const ranking = topRated?.value.indexOf(user)

    return ranking + 1
}

const user = ref(null);

// get visited user
const getUser = async () => {
  const q = query(
    collection(db, 'users'),
    where('userId', '==', route.params.id),
    limit(1)
  );

//   const querySnapshot = await getDocs(q)

  onSnapshot(
    q,
    (snapshots) => {
        user.value = null
        snapshots.forEach((doc) => {
            user.value = {
                id: doc.id,
                ...doc.data()
            }
        })
    }
  )
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
        })
    }

}

// get users posts
const posts = ref([])

const getUserPosts = async () => {
  onSnapshot(
    query(
        collection(db, 'posts'),
        and(
            where('userId', '==', route.params.id),
            where('group', '==', 'all'),
        ),
        orderBy('postedAt', 'desc')
    ),
    (snapshot) => {
        posts.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
  )
}

// edit post
const editPostModal = ref(false)
const postToEdit = ref({})

const editPostSigle = (postId) => {
    editPostModal.value = true
    const postDets = posts.value.find(p => p.id === postId)
    postToEdit.value = { ...postDets }
    postMenu.value = ''
}

const formatDate = (firestoreTimestamp) => {
     const date = firestoreTimestamp.toDate()
  
    return formatDistanceToNow(date, { addSuffix: true })
}


// toggle collaboration button
const notifRef = collection(db, 'notifications')

const toggleCollab = async (type, id) => {
    if(type === 'request'){
        try {
            // sent the request
            const sendRequest = query(collection(db, 'users'), where('userId', '==', currentUser.value?.uid))

            const querySnapshot = await getDocs(sendRequest)

            querySnapshot.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    outgoingCollabRequest: arrayUnion(id)
                }) 
            })

            // receive the request
            const reeceiveRequest = query(collection(db, 'users'), where('userId', '==', id));

            const querySnapshot2 = await getDocs(reeceiveRequest);

            querySnapshot2.forEach(async (doc) => {
                await updateDoc(doc.ref, {
                    incomingCollabRequest: arrayUnion(currentUser.value?.uid)
                }); 
            });

            // notify the receiver
            await addDoc(notifRef, {
                to: id,
                from: currentUser.value?.uid,
                name: currentUser.value?.displayName,
                photoURL: currentUser.value?.photoURL,
                link: '/requests',
                notifiedAt: Timestamp.now(),
                isView: false,
                isRead: false,
                type: 'request collab'
            })
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
    }else if(type === 'cancel'){
        try {
            // remove from outgoing request
            const removeFromOutgoing = query(
                collection(db, 'users'), 
                where('userId', '==', currentUser.value?.uid) 
            );

            const querySnapshot = await getDocs(removeFromOutgoing);

            querySnapshot.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    outgoingCollabRequest: arrayRemove(id)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
            });

            // remove from outgoing request
            const removeFromIncoming = query(
                collection(db, 'users'), 
                where('userId', '==', id) 
            );

            const querySnapshot2 = await getDocs(removeFromIncoming);

            querySnapshot2.forEach(async (docs) => {
                const docRef = doc(db, 'users', docs.id);
                await updateDoc(docRef, {
                    incomingCollabRequest: arrayRemove(currentUser.value?.uid)
                });
                console.log(`Item removed from document ID: ${docs.id}`);
            });
        }catch(error) {
            console.error(error)
        }
    }
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

// count comments
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

// change profile picture
const chooseProfilePic = () => {
    const fileInput = document.getElementById('fileInput')

    fileInput.click()
}

const displaySelectedProfile = ref(false)
const img = ref(null)
const tempUrl = ref('')

const changeImage = () => {
    const file = event.target.files[0]
    const url = URL.createObjectURL(file)

    img.value = file
    tempUrl.value = url

    displaySelectedProfile.value = true
}

const uploadingProfile = ref(false)

const uploadProfilePic = async () => {
    const docRef = doc(db, 'users', user.value.id);
    const postRef = collection(db, 'posts');
    const profileRef = storageRef(storage, `images/${img.value.name}`);
    
    try {
        uploadingProfile.value = true;
        displaySelectedProfile.value = false;
        
        await uploadBytes(profileRef, img.value);
        const link = await getDownloadURL(profileRef);

        await updateProfile(auth.currentUser, {
            photoURL: link
        });

        await updateDoc(docRef, {
            photoURL: link
        });

        const q = query(postRef, where('userId', '==', user.value.userId));
        const snapshots = await getDocs(q);

        snapshots.forEach(async (postDoc) => {
            const postDocRef = doc(db, 'posts', postDoc.id);
            await updateDoc(postDocRef, {
                photoURL: link
            });
        });

        uploadingProfile.value = false;
        getUser();
    } catch (error) {
        console.log(error);
    }
}

const passwordModal = ref(false)

const currentPassword = ref('')
const newPassword = ref('')

const changePassword = async () => {
    const currUser = auth.currentUser;

    if (!currUser) {
        console.log('No user is signed in.');
        return;
    }

    const credential = EmailAuthProvider.credential(currUser.email, currentPassword.value);
    try {
        await reauthenticateWithCredential(currUser, credential);
        
        await updatePassword(currUser, newPassword.value); 
        
        passwordModal.value = false
        currentPassword.value = ''
        newPassword.value = ''
    } catch (error) {
        console.error('Error updating password:', error);
    }
}

// get ratings
const ratings = ref(0)
const rate = async (rate) => {
    if (!currentUser.value?.uid) {
        console.log("User not logged in");
        return;
    }

    try {
        const docRef = doc(db, 'users', user.value.id);

        const userSnapshot = await getDoc(docRef);
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            const updatedRatings = (userData.ratings || []).filter(r => r.id !== currentUser.value.uid);

            updatedRatings.push({
                id: currentUser.value.uid,
                rating: rate
            });

            await updateDoc(docRef, { ratings: updatedRatings });
        } else {
            console.log("User not found in the database");
        }
    } catch (error) {
        console.error("Error updating ratings:", error);
    }
};

// filter ratings
const getCurrentUserRating = () => {
    const currenrUserRating = user.value?.ratings?.find(rating => rating.id === currentUser.value?.uid)


    return currenrUserRating?.rating
}

const overAllRatings = () => {
    const overallRatings = user.value?.ratings?.reduce((acc, rating) => {
        acc += rating.rating

        return acc
    }, 0)

    const average = overallRatings / user.value?.ratings?.length

    return average
}


onMounted(() => {
    getUser();
    getUserPosts()
    watch(posts.value, () => {
        posts.value.forEach(post => countComments(post.id))
    })
    watch(() => route.params.id, () => {
        getUser();
        getUserPosts()
    })
    dataStore.getStudents()
});
</script>

<style scoped>
#container::-webkit-scrollbar {
    background-color: transparent;
    width: 1px;
    display: none;
}
#container::-webkit-scrollbar-thumb {
    background-color: lightgray;
    border-radius: 50px;
}
</style>
