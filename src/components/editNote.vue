<template>
  <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 flex items-center justify-center">
    <form @submit.prevent="update" class="bg-gray-100 dark:bg-gray-900 w-3/4 md:w-2/4 xl:w-1/4 h-fit rounded-xl border border-gray-100/10 p-5 flex flex-col gap-y-5">
      <!-- modal header -->
      <div class="flex items-center justify-between">
        <h2>Edit note</h2>
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
        <!-- buttons -->
        <div>
          <button v-if="!adding" class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700">Update note</button>
          <button v-else class="float-end bg-gray-300 dark:bg-gray-600 w-1/5 py-1 rounded hover:bg-gray-400/55 hover:dark:bg-gray-700 animate-pulse" disabled>Updating</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { db, storage } from '../plugins/firebase'
import { doc, updateDoc, Timestamp } from 'firebase/firestore'

const { note } = defineProps({
  note: Object
})

const emit = defineEmits(['closeModal'])

// close modal
const closeModal = () => {
  emit('closeModal')
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

const noteTitle = ref(note.title || '')
const noteDetails = ref(note.details || '')
const noteCategory = ref(note.category || '')
const tags = ref(note.tags || [])
const adding = ref(false)

const update = async () => {
    try {
      adding.value = true

      await updateDoc(doc(db, 'notes', note.id), {
        title: noteTitle.value,
        category: noteCategory.value,
        tags: tags.value,
        details: noteDetails.value,
        updatedAt: Timestamp.now(),
      });


      noteDetails.value = ''
      noteTitle.value = ''
      noteCategory.value = ''
      tags.value = []

      closeModal()
    } catch (error) {
      console.error('Error adding note: ', error);
    }finally{
      adding.value = false
    }
}
</script>

<style scoped>

</style>