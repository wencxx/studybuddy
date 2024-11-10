<template>
    <div class="flex flex-col gap-y-10 overflow-auto">
        <h1 class="text-lg">Create a listing</h1>
        <div>
            <p v-if="hasEmptyFields" class="bg-red-500 pl-2 rounded mb-2 py-1" >Input product details</p>
            <form @submit.prevent="createListing" class="flex flex-col gap-y-7">
                <div class="flex flex-col gap-y-2">
                    <label>Product Name</label>
                    <input type="text" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productName">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Description</label>
                    <textarea type="text" class="w-2/4 min-h-16 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none p-2" v-model="productData.productDescription"></textarea>
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Price</label>
                    <input type="number" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productPrice">
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
                    <input type="number" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2" v-model="productData.productQuantity">
                </div>
                <div class="flex flex-col gap-y-2">
                    <label>Product Image <span class="text-xs">(Atleast one image)</span></label>
                    <div @click="toggleImageInput" :class="{ '!cursor-not-allowed': tempUrl.length === 3 }" class="w-2/4 h-8 rounded border border-gray-300 dark:border-gray-100/10 dark:bg-transparent focus:outline-none pl-2 flex items-center justify-center gap-x-2 cursor-pointer">
                        <Icon icon="material-symbols:imagesmode-outline" class="dark:text-gray-100/55 text-2xl cursor-pointer hover:text-gray-600 hover:dark:text-gray-100/75" />
                        <p class="text-sm">Choose product image</p>
                    </div>
                    <input id="imageInput" type="file" class="hidden" accept=".jpg, .png, .jpeg" @change="handleImageUpload" multiple :disabled="tempUrl.length === 3">
                </div>
                <div class="grid grid-cols-3 gap-x-2">
                    <div v-for="(image, index) in tempUrl" :key="index" class="w-full relative group">
                        <img :src="image" alt="product image" class="w-full object-cover !aspect-square rounded">
                        <div class="bg-black/55 w-fit p-1 rounded-full absolute top-2 right-2 hidden group-hover:block cursor-pointer" @click="removeImage(index)">
                            <Icon icon="mdi:close" />
                        </div>
                    </div>
                </div>
                <div class="flex justify-end my-5">
                    <button v-if="!creatingList" class="bg-blue-500 rounded w-fit px-3 py-1">Create a listing</button>
                    <button v-else class="bg-blue-500 rounded w-fit px-3 py-1 animate-pulse" disabled>Creating..</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { db, storage } from '../../plugins/firebase'
import { collection, addDoc, Timestamp } from  'firebase/firestore'
import { ref as storageRef, getDownloadURL, uploadBytes } from  'firebase/storage'
import { useAuthStore } from '../../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

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

// handle image remove
const removeImage = (i) => {
    images.value.splice(i, 1)
    tempUrl.value.splice(i, 1)
}


const productData = ref({
    productName: '',
    productPrice: '',
    productDescription: '',
    productCategory: '',
    productQuantity: null,
    imagesUrl: []
})


// sell product
const marketplaceRef = collection(db, 'marketplace')

const creatingList = ref(false)
const hasEmptyFields = ref(false)

// staorege ref
const createListing = async () => {
    try {
        creatingList.value = true
        hasEmptyFields.value = false

        if(Object.values(productData.value).some(field => !field)) {
            console.log('Input product details')
            creatingList.value = false
            hasEmptyFields.value = true
            return
        } 

        if(images.value.length > 0){
            for(const image of images.value){
                const imageRef = storageRef(storage, `marketplace/${image.name}`)
                await uploadBytes(imageRef, image)
                const imageUrl = await getDownloadURL(imageRef)
                productData.value.imagesUrl.push(imageUrl)
            }
        }

        const snapshot = await addDoc(marketplaceRef, {
            ...productData.value,
            userId: currentUser.value.uid
        })

        productData.value = {
            productName: '',
            productPrice: '',
            productDescription: '',
            productCategory: '',
            productQuantity: null,
            imagesUrl: []
        }

        images.value = []
        tempUrl.value = []

        creatingList.value = false
    } catch (error) {
        console.log(error)
    }
}
</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
    display: none
}
</style>