<template>
    <div class="space-y-5 content pb-10">
        <h1><span class="font-bold text-lg">Title:</span> <span class="capitalize">{{ noteDetails.title }}</span></h1>
        <h1><span class="font-bold text-lg">Date created:</span> {{ formatDate(noteDetails.addedAt) }}</h1>
        <h1><span class="font-bold text-lg">Details: </span><span class="capitalize" v-html="formatNotesDetails(noteDetails.details)"></span></h1>
        <div class="flex gap-x-2 mt-2" v-if="currentUser?.uid !== noteDetails?.userId">
            <p class="text-sm dark:text-gray-100/55">Rate:</p>
            <Icon
                v-for="star in 5"
                :icon="star <= getCurrentUserRating() ? 'iconoir:star-solid' : 'iconoir:star'"
                :key="'q1-star-' + star"
                :class="['text-lg cursor-pointer', star <= getCurrentUserRating() ? 'text-yellow-500' : 'dark:text-white']"
                @click="rate(star)"
            />
        </div>
        <div v-if="noteDetails.notesFiles?.length" class="flex flex-wrap gap-2">
            <div v-for="file in noteDetails.notesFiles" :key="file">
                <a :href="file" class="bg-gray-100/25 px-3 py-1 rounded">{{ getFileName(file) }}</a>
            </div>
        </div>
        <div v-if="noteDetails.notesImages?.length" class="grid grid-cols-2 gap-2" :class="{ 'grid-cols-1': noteDetails.notesImages.length === 1 }">
            <div  v-for="(img, index) in noteDetails.notesImages" :key="index" class="relative">
                <img :src="img" @click="zoomImage(index)" class="w-full aspect-square object-cover rounded cursor-pointer" :class="{ 'hidden': index > 3, 'aspect-video': noteDetails.notesImages.length === 1 }">
                <div v-if="index === 3  && noteDetails.notesImages.length > 4" class="absolute top-0 left-0 w-full aspect-square rounded bg-black/55 flex items-center justify-center">
                    <p class="text-3xl">+{{ noteDetails.notesImages.length - 4 }}</p>
                </div>
            </div>
        </div>

        <!-- view images -->
        <div @click.self="showImage = false" v-if="showImage" class="fixed z-20 top-0 left-0 h-screen w-screen bg-black/25 !mt-0 flex items-center justify-center p-10">
            <div class="absolute top-5 right-5 bg-black/80 p-1 cursor-pointer rounded-full" @click="showImage = false">
                <Icon icon="mdi:close" class="text-2xl" />
            </div>
            <div class="bg-black/80 p-2 rounded-full absolute cursor-pointer left-10" @click="prev">
                <Icon icon="ep:arrow-left-bold" class="text-3xl" />
            </div>
            <img :src="noteDetails.notesImages[imageToShow]" class="max-h-[80%] aspect-video rounded">
            <div class="bg-black/80 p-2 rounded-full absolute cursor-pointer right-10" @click="next">
                <Icon icon="ep:arrow-right-bold" class="text-3xl" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { db } from '../plugins/firebase'
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { useRoute } from 'vue-router' 
import { computed, onMounted, ref } from 'vue'
import moment from 'moment' 
import { useAuthStore } from '../store'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const route = useRoute()

const noteRef = doc(db, 'notes', route.params.id)

const noteDetails = ref({})

const getDocs = async () => {
    try {
        onSnapshot(
            noteRef,
            (snapshot) => {
                noteDetails.value = {
                    id: snapshot.id,
                    ...snapshot.data()
                }
            }
        )
        // const snapshot = await getDoc(noteRef)
    } catch (error) {
        console.log(error)
    }
}

const imageToShow = ref(0)
const showImage = ref(false)

const zoomImage = (index) => {
    imageToShow.value = index
    showImage.value = true
}

const prev = () => {
    if(imageToShow.value === 0){
        imageToShow.value = noteDetails.value.notesImages.length - 1
    }else{
        imageToShow.value--
    }
}

const next = () => {
    if(noteDetails.value.notesImages.length - 1 === imageToShow.value){
        imageToShow.value = 0
    }else{
        imageToShow.value++
    }
}

// fomat date
const formatDate = (date) => {
    if (!date) return ''; 
    const convertedDate = date.toDate ? date.toDate() : new Date(date);

    return moment(convertedDate).format('lll');
};

const formatNotesDetails = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return content?.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" class="text-blue-500 hover:underline">${url}</a>`;
    });
}

const getFileName = (fileUrl) => {
    const decodedUrl = decodeURIComponent(fileUrl);
    return decodedUrl.split("/").pop().split("?")[0];
}

// get ratings
const ratings = ref(0)
const rate = async (rate) => {
    if (!currentUser.value?.uid) {
        console.log("User not logged in");
        return;
    }

    try {
        const docRef = doc(db, 'notes', route.params.id);

        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            const userData = snapshot.data();
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
    const currenrUserRating = noteDetails.value?.ratings?.find(rating => rating.id === currentUser.value?.uid)


    return currenrUserRating?.rating
}

onMounted(() => {
    getDocs()
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>