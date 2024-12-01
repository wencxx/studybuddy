<template>
    <div class="flex flex-col gap-y-5 overflow-auto content min-h-[90dvh]">
        <p>Listings</p>
        <div v-if="listings.length" class="grid lg:grid-cols-2 gap-5">
            <div v-for="(list, index) in listings" :key="list.id" class="bg-neutral-700/10 p-2 rounded">
                <img :src="list.imagesUrl[0]" alt="product image" class="rounded-md w-full aspect-video object-cover">
                <h1 class="font-bold text-lg">Php {{ list.productPrice }}</h1>
                <h2 class="text-md">{{ list.productName }}</h2>
                <p class="text-sm line-clamp-1">{{ list.productDescription }}</p>
                <p class="text-sm">Stocks: {{ list.productQuantity }}</p>
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <div class="mr-auto text-sm uppercase bg-green-500 px-2 rounded" :class="{ '!bg-red-500': list.status === 'sold' }">{{ list.status }}</div>
                    <button class="group relative" @click="updateItem(list.id)">
                        <div>
                            <Icon icon="mdi:pencil-outline" class="text-blue-500/70 text-2xl cursor-pointer" />
                        </div>
                        <div class="absolute !w-16 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Edit Item</p>
                        </div>
                    </button>
                    <button class="group relative" @click="deleteItem(list.id, index)">
                        <div>
                            <Icon icon="mdi:trash-outline" class="text-blue-500/70 text-2xl cursor-pointer" />
                        </div>
                        <div class="absolute !w-16 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Delete Item</p>
                        </div>
                    </button>
                    <router-link class="group relative" :to="{ name: 'prodDetails', params: { id: list.id } }">
                        <div>
                            <Icon icon="mdi:eye-outline" class="text-blue-500/70 text-2xl cursor-pointer" />
                        </div>
                        <div class="absolute !w-16 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">View details</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No lists</p>
        </div>


        <!-- update product modal -->
        <div v-if="isUpdatingItem" class="fixed top-0 left-0 bg-black/25 h-screen w-screen z-20 flex items-center justify-center">
            <form @submit.prevent="update()" class="w-full max-w-sm h-fit bg-white rounded-md text-black p-3 space-y-2">
                <h1 class="text-center text-xl mb-4">Update Product</h1>
                <div class="flex flex-col">
                    <label>Product Name</label>
                    <input type="text" v-model="updateDetails.productName" class="pl-2 border rounded h-8">
                </div>
                <div class="flex flex-col">
                    <label>Product Description</label>
                    <textarea class="min-h-14 p-2 border rounded" v-model="updateDetails.productDescription"></textarea>
                </div>
                <div class="flex flex-col">
                    <label>Product Price</label>
                    <input type="number" v-model="updateDetails.productPrice" class="pl-2 border rounded h-8">
                </div>
                <div class="flex flex-col">
                    <label>Product Quantity</label>
                    <input type="text" v-model="updateDetails.productQuantity" class="pl-2 border rounded h-8">
                </div>
                <div class="flex flex-col">
                    <label>Status</label>
                    <select v-model="updateDetails.status" class="pl-2 border rounded h-8">
                        <option value="available">Available</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
                <div class="flex items-center justify-end gap-x-2">
                    <button class="w-1/4 py-1 bg-blue-500 text-white rounded" type="button" @click="isUpdatingItem = false">Cancel</button>
                    <button v-if="!updating" class="w-1/4 py-1 bg-green-500 text-white rounded">Update</button>
                    <button v-else class="w-1/4 py-1 bg-green-500 text-white rounded animate-pulse" disabled>Updating</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { db } from '../../plugins/firebase'
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../store'
import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const $toast = useToast()

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)
const listings = ref([])


// listings ref
const listingsRef = collection(db, 'marketplace')
const getListings = async () => {
    try {
        const q = query(
            listingsRef,
            where('userId', '==', currentUser.value?.uid  )
        )
        const snapshot = await getDocs(q)

        snapshot.docs.forEach(doc => (
            listings.value.push({
                id: doc.id,
                ...doc.data()
            })
        ))

    } catch (error) {
        console.log(error)
    }
}

const itemToUpdateId = ref('')
const isUpdatingItem = ref(false)
const updateDetails = ref({
    productName: '',
    productDescription: '',
    productPrice: '',
    productQuantity: '',
    status: '',
})

const updateItem = (itemId) => {
    itemToUpdateId.value = itemId
    isUpdatingItem.value = true

    const productDets = listings.value.find(listing => listing.id === itemId)

    updateDetails.value.productName = productDets.productName
    updateDetails.value.productDescription = productDets.productDescription
    updateDetails.value.productPrice = productDets.productPrice
    updateDetails.value.productQuantity = productDets.productQuantity
    updateDetails.value.status = productDets.status
}

const updating = ref(false)
const update = async () => {
    try {
        updating.value = true
        await updateDoc(
            doc(db, 'marketplace', itemToUpdateId.value),
            {
                ...updateDetails.value
            }
        )

        const productDets = listings.value.find(listing => listing.id === itemToUpdateId.value)

        productDets.productName = updateDetails.value.productName
        productDets.productDescription = updateDetails.value.productDescription
        productDets.productPrice = updateDetails.value.productPrice
        productDets.productQuantity = updateDetails.value.productQuantity
        productDets.status = updateDetails.value.status

        isUpdatingItem.value = false
        $toast.success('Updated product successfully')
    } catch (error) {
        $toast.error('Failed to update product')
    } finally {
        updating.value = false
    }
}

const deleteItem = async (itemId, index) => {
    try {
        await deleteDoc(doc(db, 'marketplace', itemId))

        listings.value.splice(index, 1)
        $toast.success('Item deleted successfully')
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getListings()
    watch(currentUser, () => {
        getListings()
    })
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
