<template>
    <div class="flex flex-col gap-y-5">
        <p>Listings</p>
        <div v-if="listings.length" class="grid lg:grid-cols-2 gap-5">
            <div v-for="list in listings" :key="list.id" class="bg-neutral-700/10 p-2 rounded">
                <img :src="list.imagesUrl[0]" alt="product image" class="rounded-md aspect-video">
                <h1 class="font-bold text-lg">Php {{ list.productPrice }}</h1>
                <h2 class="text-md">{{ list.productName }}</h2>
                <p class="text-sm line-clamp-1">{{ list.productDescription }}</p>
                <button class="float-end mt-2 w-fit bg-blue-500 px-2 rounded">Inquire</button>
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
import { onMounted, ref } from 'vue'

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
