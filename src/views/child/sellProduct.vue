<template>
    <div class="flex flex-col gap-y-10 overflow-auto">
        <h1 class="text-lg">Create a listing</h1>
        <div>
            {{ productData }}
            <form @submit.prevent="createListing" class="flex flex-col gap-y-7">
                <div class="flex flex-col gap-y-2">
                    <label>Product Name</label>
                    <input type="text" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productName" required>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Description</label>
                    <textarea type="text" class="w-2/4 min-h-16 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none p-2" v-model="productData.productDescription" required></textarea>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Price</label>
                    <input type="text" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productPrice" required>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Category</label>
                    <select v-model="productData.productCategory" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2 dark:text-gray-300">
                        <option value="">Select Category</option>
                        <option class="dark:text-black">Writing Instruments</option>
                        <option class="dark:text-black">Paper Products</option>
                        <option class="dark:text-black">Art and Craft Supplies</option>
                        <option class="dark:text-black">Organizational Supplies</option>
                        <option class="dark:text-black">Backpacks and Bags</option>
                        <option class="dark:text-black">Desk Supplies</option>
                    </select>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Quantity</label>
                    <input type="number" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productQuantity" required>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Image (Atleast one image)</label>
                    <div @click="toggleImageInput" :class="{ '!cursor-not-allowed': tempUrl.length === 3 }" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2 flex items-center justify-center gap-x-2 cursor-pointer">
                        <Icon icon="material-symbols:imagesmode-outline" class="dark:text-gray-100/55 text-2xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" />
                        <p class="text-sm">Choose product image</p>
                    </div>
                    <input id="imageInput" type="file" class="hidden" accept=".jpg, .png, .jpeg" @change="handleImageUpload" multiple required :disabled="tempUrl.length === 3">
                </div>
                <div class="grid grid-cols-3 gap-x-2">
                    <div v-for="(image, index) in tempUrl" :key="index" class="w-full">
                        <img :src="image" alt="product image" class="w-full object-cover !aspect-square">
                    </div>
                </div>
                <div class="flex justify-end mt-5">
                    <button class="bg-blue-500 rounded w-1/5 py-1">Create a listing</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { db, storage } from '../../plugins/firebase'
import { collection, addDoc, Timestamp } from  'firebase/firestore'
import { ref as storageRef, getDownloadURL, uploadBytes } from  'firebase/storage'

// handle image upload
const toggleImageInput = () => {
    document.getElementById('imageInput').click()
}

const images = ref([])
const tempUrl = ref([])

const handleImageUpload = () => {
    Array.from(event.target.files).forEach(file => {
        tempUrl.value.push(URL.createObjectURL(file))
        images.value.push(file)
    })
}


const productData = ref({
    productName: '',
    productPrice: '',
    productDescription: '',
    productCategory: '',
    productQuantity: null
})


// sell product
const marketplaceRef = collection(db, 'marketplace')

const createListing = () => {
    try {
        
    } catch (error) {
        
    }
}
</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
    display: none
}
</style>