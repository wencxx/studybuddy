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
        <p class="mb-1">Details</p>
        <textarea class="w-full rounded min-h-32 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2" v-model="noteDetails"></textarea>
        <!-- add media -->
        <div class="flex">
          <Icon icon="material-symbols:imagesmode-outline" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" @click="addImage" />
          <input type="file" class="hidden" accept=".jpg, .png, .jpeg" id="imageInput">
          <Icon icon="material-symbols-light:video-library-outline" class="dark:text-gray-100/55 text-3xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" />
        </div>
        <!-- buttons -->
        <div>
          <button class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Add note</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, ref } from 'vue'
import { db } from '../plugins/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const emit = defineEmits(['closeModal'])


// close modal
const closeModal = () => {
  emit('closeModal')
}

const noteTitle = ref('')
const noteDetails = ref('')

const post = async () => {
    closeModal()
    try {
      await addDoc(collection(db, 'notes'), {
        title: noteTitle.value,
        details: noteDetails.value,
        addedAt: Timestamp.now(),
        userId: currentUser.value.uid
      });
      noteDetails.value = ''
      noteTitle.value = ''
    } catch (error) {
      console.error('Error adding note: ', error);
    }
}

const addImage = () => {
  const imageInput = document.getElementById('imageInput')
  imageInput.click()
}
</script>

<style scoped>

</style>