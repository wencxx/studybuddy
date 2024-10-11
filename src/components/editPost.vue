<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="update" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/4 xl:w-1/4 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Edit post</h2>
        <Icon icon="ic:baseline-close" class="cursor-pointer text-xl" @click="closeModal" />
      </div>
      <!-- modal body -->
      <div>
        <textarea class="w-full rounded min-h-32 bg-transparent border border-gray-300 dark:border-gray-100/10 focus:outline-none p-2" v-model="postDetails.postDetails" autofocus></textarea>
        <!-- buttons -->
        <div>
          <button class="float-end bg-gray-300 dark:bg-gray-600 w-fit px-2 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Save changes</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue'
import { db } from '../plugins/firebase'
import { collection, query, where, doc, updateDoc  } from 'firebase/firestore'
import { useAuthStore } from '../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const emit = defineEmits(['closeModal'])

const props = defineProps({
  postDetails: Object
})

const postDetails = computed(() => props.postDetails)

// close modal
const closeModal = () => {
  emit('closeModal')
}


const update = async () => {
  const postRef = doc(db, 'posts', postDetails.value.id)

  try {
    await updateDoc(postRef, {
      postDetails: postDetails.value.postDetails
    })

    closeModal()
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped>

</style>