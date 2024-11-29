<template>
    <div class="flex flex-col gap-y-10 overflow-auto">
        <h1 class="text-lg">Product Details</h1>
        <div class="space-y-10 mb-10">
            <div class="w-full space-y-2" v-if="Object.keys(product).length">
                <div class="w-full">
                    <img :src="product.imagesUrl[currentImage]" alt="" class="w-full aspect-video rounded-lg">
                </div>
                <div class="grid grid-cols-7 gap-2">
                    <img v-for="(image, index) in product.imagesUrl" :key="index" :src="image" class="w-full aspect-square rounded-md cursor-pointer" :class="{ 'border-2 border-neutral-500 dark:border-white': currentImage === index }" @click="currentImage = index">
                </div>
            </div>
            <div class="capitalize flex flex-col lg:grid gap-4 lg:grid-cols-2">
                <h1 class="font-bold text-lg">Product Name: <span class="font-normal">{{ product.productName }}</span></h1>
                <h1 class="font-bold text-lg">Product Category: <span class="font-normal">{{ product.productCategory }}</span></h1>
                <h1 class="font-bold text-lg">Product Price: <span class="font-normal">Php{{ product.productPrice }}</span></h1>
                <h1 class="font-bold text-lg">Product Quantity: <span class="font-normal">{{ product.productQuantity }}</span></h1>
                <h1 class="font-bold text-lg col-span-2">Product Description: <span class="font-normal">{{ product.productDescription }}</span></h1>
            </div>
            <router-link k :to="{ name: 'marketplaceMessage', params: { id: product.userId }, query: { item: product.id } }" class="bg-blue-500 text-white px-3 rounded py-1 float-end">Inquire</router-link>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '../../plugins/firebase'
import { doc, getDoc } from  'firebase/firestore'
import { useAuthStore } from '../../store'

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)

const route = useRoute()

onMounted(() => {
    getProductDetails()
})

// get product details
const product = ref({})

const docRef = doc(db, 'marketplace', route.params.id)

const getProductDetails = async () => {
    try {
        const snapshot = await getDoc(docRef)

        product.value = {
            id: snapshot.id,
            ...snapshot.data()            
        }
    } catch (error) {
        console.log('Failed to fetch product details')
    }
}

const currentImage = ref(0)


</script>

<style scoped>
.overflow-auto::-webkit-scrollbar {
    display: none
}
</style>