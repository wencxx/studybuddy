<template>
    <div class="flex flex-col space-y-5 mb-5 content">
        <h1 class="text-lg capitalize">Top Users</h1>
        <div class="bg-gray-100/10 p-5 rounded-md space-y-3 flex flex-col">
            <h1>Top Collaborators</h1>
            <table class="w-full cursor-pointer">
                <thead>
                    <tr class="border-b">
                        <th class="w-1/3 text-start">Rank</th>
                        <th class="w-1/3 text-start">Name</th>
                        <th class="w-1/3">Number of Collaboration</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(collaborator, index) in filteredTopCollaborators()" :key="collaborator.id">
                        <td class="pl-2 py-2">{{ index + 1 }}</td>
                        <td class="pl-2 py-2 capitalize">{{ collaborator.displayName }}</td>
                        <td class="pl-2 py-2 text-center">{{ collaborator.collabs?.length }}</td>
                    </tr>
                </tbody>    
            </table>
            <button v-if="topCollaborators.length > selectFilter" class="mx-auto hover:underline"  @click="selectFilter += 100">See more</button>
            <button v-else class="mx-auto hover:underline"  @click="selectFilter -= 100">See less</button>
        </div>
        <div class="bg-gray-100/10 p-5 rounded-md space-y-3 flex flex-col">
            <h1>Most Rated</h1>
            <table class="w-full cursor-pointer">
                <thead>
                    <tr class="border-b">
                        <th class="w-1/3 text-start">Rank</th>
                        <th class="w-1/3 text-start">Name</th>
                        <th class="w-1/3">Ratings</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(collaborator, index) in filteredMostRateds()" :key="collaborator.id">
                        <td class="pl-2 py-2">{{ index + 1 }}</td>
                        <td class="pl-2 py-2 capitalize">{{ collaborator.displayName }}</td>
                        <td class="pl-2 py-2 text-center">{{ collaborator.averageRating }}</td>
                    </tr>
                </tbody>    
            </table>
            <button v-if="topRatedUsers.length > filterMostRated" class="mx-auto hover:underline"   @click="filterMostRated += 100">See more</button>
            <button v-else class="mx-auto hover:underline"  @click="filterMostRated -= 100">See less</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useDataStore } from '../store'

const dataStore = useDataStore()
const topCollaborators = computed(() => dataStore.topCollaborators)
const topRatedUsers = computed(() => dataStore.topRatedUsers)

const selectFilter = ref(100)

const filteredTopCollaborators = () => {
    return topCollaborators?.value.slice(0, selectFilter.value)
}

const filterMostRated = ref(100)

const filteredMostRateds = () => {
    return topRatedUsers?.value.slice(0, filterMostRated.value)
}

onMounted(() => {
    dataStore.getStudents()
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}

</style>