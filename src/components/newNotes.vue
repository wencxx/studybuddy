<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="post" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/4 xl:w-1/4 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Add new note</h2>
        <Icon icon="ic:baseline-close" size="22" class="cursor-pointer" @click="closeModal" />
      </div>
      <!-- modal body -->
      <div>
        <p class="mb-1">Title</p>
        <input type="text" class="w-full rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="noteTitle">
        <p class="mb-1">Category</p>
        <select class="w-full rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="noteCategory">
          <option value="">Select Category</option>
          <option class="dark:text-black">Programming</option>
          <option class="dark:text-black">Science</option>
          <option class="dark:text-black">Math</option>
          <option class="dark:text-black">English</option>
          <option class="dark:text-black">Engineering</option>
          <option class="dark:text-black">Food trade</option>
        </select>
        <p class="mb-1">Tags</p>
        <input type="text" class="w-full rounded h-9 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2 mb-2" v-model="tag" @keyup.space="addTags">
        <div class="flex flex-wrap gap-1">
          <p v-for="(tag, index) in tags" :key="tag" class="dark:bg-gray-100/10 w-fit px-3 py-1 rounded-full cursor-pointer" @click="removeTag(index)">{{ tag }}</p>
        </div>
        <p class="mb-1">Details</p>
        <textarea class="w-full rounded min-h-32 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2" v-model="noteDetails"></textarea>
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
        <div class="flex flex-wrap gap-2">
          <div v-for="file in fileNames" :key="file" class="bg-neutral-800 px-3 py-1 rounded">
              <p>{{ file }}</p>
          </div>
        </div>
        <!-- add media -->
        <div class="flex gap-x-1">
          <div class="flex">
            <Icon icon="material-symbols:imagesmode-outline" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" @click="addImage" />
            <input @change="handleImageUpload" type="file" class="hidden" accept=".jpg, .png, .jpeg" id="imageInput" multiple>
          </div>
          <div class="flex">
            <Icon icon="bxs:file-pdf" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" @click="addFile" />
            <input @change="handlePDFUpload" type="file" class="hidden" accept=".pdf, .docx, .docs" id="pdfInput" multiple>
          </div>
        </div>
        <!-- buttons -->
        <div>
          <button v-if="!adding" class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Add note</button>
          <button v-else class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700 animate-pulse" disabled>Adding</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import { db, storage } from '../plugins/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { useAuthStore } from '../store'

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

// pdf to post
const files = ref([])  
const fileNames = ref([])

// handle image to post
const handlePDFUpload = (event) => {
  Array.from(event.target.files).forEach(file => {
    fileNames.value.push(file.name);
    files.value.push(file);
  });
}

// remove image to post
const removeFileToPost = (img) => {
  const index = files.value.indexOf(img)

  if (index !== -1) {
    fileNames.value.splice(index, 1)
    files.value.splice(index, 1)
  }
}

// add tag
const tag = ref('')

const addTags = () => {
  tags.value.push(tag.value)
  tag.value = ''
}

// remove tag
const removeTag = (index) => {
  tags.value.splice(index, 1)
}

const noteTitle = ref('')
const noteDetails = ref('')
const noteCategory = ref('')
const tags = ref([])
const adding = ref(false)

const post = async () => {
    const imageUrls = []
    const pdfUrls = []
    try {
      adding.value = true
      if(images.value.length > 0){
        for(const image of images.value){
          const imageRef =  storageRef(storage, `notesImages/${image.name}`)
          await uploadBytes(imageRef, image)
          const  imageLink = await getDownloadURL(imageRef)
          imageUrls.push(imageLink)
        }
      }

      if(files.value.length){
        for(const file of files.value){
          const fileRef =  storageRef(storage, `notesFiles/${file.name}`)
          await uploadBytes(fileRef, file)
          const  fileLink = await getDownloadURL(fileRef)
          pdfUrls.push(fileLink)
        }
      }

      closeModal()

      await addDoc(collection(db, 'notes'), {
        title: noteTitle.value,
        category: noteCategory.value,
        tags: tags.value,
        details: noteDetails.value,
        addedAt: Timestamp.now(),
        userId: currentUser.value.uid,
        notesImages: imageUrls,
        notesFiles: pdfUrls,
      });


      noteDetails.value = ''
      noteTitle.value = ''
      noteCategory.value = ''
      tags.value = []
    } catch (error) {
      console.error('Error adding note: ', error);
    }finally{
      adding.value = false
    }
}

const addImage = () => {
  const imageInput = document.getElementById('imageInput')
  imageInput.click()
}

const addFile = () => {
  const pdfInput = document.getElementById('pdfInput')
  pdfInput.click()
}
</script>

<style scoped>

</style>