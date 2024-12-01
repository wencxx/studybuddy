<template>
    <div class="flex flex-col gap-y-5 overflow-auto content min-h-[90dvh]">
        <p>Listings</p>
        <div v-if="listings.length" class="grid lg:grid-cols-2 gap-5">
            <div v-for="list in listings" :key="list.id" class="bg-neutral-700/10 p-2 rounded">
                <img :src="list.imagesUrl[0]" alt="product image" class="rounded-md w-full aspect-video object-cover">
                <h1 class="font-bold text-lg">Php {{ list.productPrice }}</h1>
                <h2 class="text-md">{{ list.productName }}</h2>
                <p class="text-sm line-clamp-1">{{ list.productDescription }}</p>
                <p class="text-sm">stocks: {{ list.productQuantity }}</p>
                <div class="flex items-center justify-end gap-x-2 mt-2">
                    <div class="mr-auto text-sm uppercase bg-green-500 px-2 rounded" :class="{ '!bg-red-500': list.status === 'sold' }">{{ list.status }}</div>
                    <router-link v-if="list.userId !== currentUser.uid" :to="{ name: 'marketplaceMessage', params: { id: list.userId }, query: { item: list.id } }" class="group relative">
                        <Icon icon="mage:message" class="text-blue-500/70 text-xl cursor-pointer" />
                        <div class="absolute !w-14 top-full mt-1 right-1/4 md:right-1/2 md:translate-x-1/2 border dark:border-gray-100/10 py-1 rounded-md hidden group-hover:block">
                          <p class="text-[.6rem] text-center">Inquire</p>
                        </div>
                    </router-link>
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
    </div>
</template>

<script setup>
import { db } from '../../plugins/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../../store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.currentUser)

const listings = ref([])


// listings ref
const listingsRef = collection(db, 'marketplace')
const getListings = async () => {
    try {
        const snapshot = await getDocs(listingsRef)

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

onMounted(() => {
    getListings()
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
