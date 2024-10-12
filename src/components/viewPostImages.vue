<template>
    <div class="absolute top-0 left-0 h-[100dvh] w-full bg-black/35 z-20 flex items-center justify-center">
        <div @click.self="closeModal"  class="relative flex items-center justify-between px-10 gap-x-6 w-full h-full">
            <button @click="changeImage('prev')" v-if="props.images.length > 1">
                <Icon icon="ooui:next-rtl" class="text-2xl lg:text-3xl" />
            </button>
            <div v-else></div>
            <img :src="props.images[curretShowing]" alt="post image" class="max-w-[60%] max-h-[80%]">
            <button v-if="props.images.length > 1" @click="changeImage('next')">
                <Icon icon="ooui:next-ltr" class="text-2xl lg:text-3xl" />
            </button>
            <div v-else></div>
            <div class="absolute top-5 right-5 bg-gray-300 dark:bg-gray-100/10 p-2 rounded-full cursor-pointer" @click="closeModal">
                <Icon icon="mdi:close" class="text-xl" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
    images: Array,
    imageIndex: Int16Array
})

const emits = defineEmits(['closeModal'])

const closeModal = () => {
    emits('closeModal')
}

const curretShowing = ref(props.imageIndex || 0)

// prev next image
const changeImage = (type) => {
    if(type === 'next'){
        if(props.images.length === curretShowing.value + 1) return curretShowing.value = 0

        curretShowing.value += 1
    }else{
        if(curretShowing.value === 0) return curretShowing.value = props.images.length - 1

        curretShowing.value -= 1
    }
}
</script>

<style scoped>

</style>