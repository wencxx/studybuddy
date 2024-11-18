<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="post" @keyup.enter="post" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/4 xl:w-1/4 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Add new post</h2>
        <Icon icon="ic:baseline-close" class="cursor-pointer text-xl" @click="closeModal" />
      </div>
      <!-- modal body -->
      <div>
        <textarea class="w-full rounded min-h-32 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2" v-model="postDetails" autofocus></textarea>
        <!-- media list -->
        <div v-if="tempImgUrls.length > 0" class=" flex gap-x-2 my-1">
            <div v-for="(img, index) in tempImgUrls" :key="index" class="relative group bg-gray-100/10 rounded overflow-hidden" :class="{ '!hidden': index > 4 }">
              <img :src="img" alt="image to post" class="w-16 aspect-square object-cover">
              <div class="absolute right-0 top-0 bg-gray-500 rounded-full hidden group-hover:block cursor-pointer">
                <Icon icon="mdi:close" class="text-md" @click="removeImageToPost(img)" />
              </div>
              <div v-if="tempImgUrls.length > 5 && index === 4" class="w-16 aspect-square bg-black/65 absolute top-0 left-0 flex items-center justify-center">
                  <p class="w-fit h-fit -translate-x-1 -translate-y-1 text-lg">+{{ tempImgUrls.length - 5 }}</p>
              </div>
            </div>
        </div>
        <!-- add media -->
        <div class="flex">
          <Icon icon="material-symbols:imagesmode-outline" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" @click="addImage" />
          <input @change="handleImageUpload" type="file" class="hidden" accept=".jpg, .png, .jpeg" id="imageInput" multiple>
          <Icon icon="material-symbols-light:video-library-outline" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" />
        </div>
        <!-- buttons -->
        <div>
          <button v-if="!posting" :disabled="!postDetails && images.length === 0" :class="{ 'cursor-not-allowed': !postDetails && images.length === 0 }" class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Post</button>
          <button v-else class="float-end bg-gray-300 dark:bg-gray-600 w-fit px-2 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700 animate-pulse" disabled>Posting</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, onMounted, ref } from 'vue'
import { db, storage } from '../plugins/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { useAuthStore } from '../store'
import { Filter } from 'bad-words'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const emit = defineEmits(['closeModal'])


// close modal
const closeModal = () => {
  emit('closeModal')
}

// images to post
const images = ref([])  
const tempImgUrls = ref([])

// handle image to post
const handleImageUpload = (event) => {
  // const image = event.target.files[0]
  Array.from(event.target.files).forEach(image => {
    const tempUrl = URL.createObjectURL(image);
    tempImgUrls.value.push(tempUrl);
    images.value.push(image);
  });
}

// remove image to post
const removeImageToPost = (img) => {
  const index = tempImgUrls.value.indexOf(img)

  if (index !== -1) {
    tempImgUrls.value.splice(index, 1)
    images.value.splice(index, 1)
  }
}

//add post
const postDetails = ref('')
const posting = ref(false)

const filter = new Filter();

const post = async () => {

    const imageUrls = []

    try {
      posting.value = true
      
      if(images.value.length > 0){
        for(const image of images.value){
          const imageRef =  storageRef(storage, `posts/${image.name}`)
          await uploadBytes(imageRef, image)
          const  imageLink = await getDownloadURL(imageRef)
          imageUrls.push(imageLink)
        }
      }

      closeModal()

      const docRef = await addDoc(collection(db, 'posts'), {
        postDetails: filter.clean(postDetails.value),
        postImages: imageUrls,
        userId: currentUser.value.uid,
        name: currentUser.value.displayName,
        photoURL: currentUser.value.photoURL,
        postedAt: Timestamp.now(),
      });
      
      postDetails.value = ''
    } catch (error) {
      console.error('Error creating post: ', error);
    }finally{
      posting.value = false
    }
}

const addImage = () => {
  const imageInput = document.getElementById('imageInput')
  imageInput.click()
}
</script>

<style scoped>

</style>