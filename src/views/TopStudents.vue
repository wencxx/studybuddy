<template>
    <div class="flex flex-col space-y-5 mb-5 content">
        <h1 class="text-lg capitalize">Top Users</h1>

        <!-- Top Collaborators Section -->
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
                    <tr v-for="(collaborator, index) in paginatedTopCollaborators" :key="collaborator.id">
                        <td class="pl-2 py-2">{{ index + 1 + (currentCollaboratorPage - 1) * rowsPerPage }}</td>
                        <td class="pl-2 py-2 capitalize">{{ collaborator.displayName }}</td>
                        <td class="pl-2 py-2 text-center">{{ collaborator.collabs?.length }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-end space-x-2 mt-3">
                <button 
                    class="px-3 py-1 bg-gray-300 rounded text-black hover:bg-gray-400"
                    :disabled="currentCollaboratorPage === 1"
                    @click="currentCollaboratorPage--">
                    <Icon icon="weui:arrow-filled" class="text-2xl rotate-180" />
                </button>
                <button 
                    class="px-3 py-1 bg-gray-300 rounded text-black hover:bg-gray-400"
                    :disabled="currentCollaboratorPage === totalCollaboratorPages"
                    @click="currentCollaboratorPage++">
                    <Icon icon="weui:arrow-filled" class="text-2xl" />
                </button>
            </div>
        </div>

        <!-- Most Rated Section -->
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
                    <tr v-for="(collaborator, index) in paginatedMostRateds" :key="collaborator.id">
                        <td class="pl-2 py-2">{{ index + 1 + (currentMostRatedPage - 1) * rowsPerPage }}</td>
                        <td class="pl-2 py-2 capitalize">{{ collaborator.displayName }}</td>
                        <td class="pl-2 py-2 text-center">{{ collaborator.averageRating }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-end space-x-2 mt-3">
                <button 
                    class="px-3 py-1 bg-gray-300 rounded text-black hover:bg-gray-400"
                    :disabled="currentMostRatedPage === 1"
                    @click="currentMostRatedPage--">
                    <Icon icon="weui:arrow-filled" class="text-2xl rotate-180" />
                </button>
                <button 
                    class="px-3 py-1 bg-gray-300 rounded text-black hover:bg-gray-400"
                    :disabled="currentMostRatedPage === totalMostRatedPages"
                    @click="currentMostRatedPage++">
                    <Icon icon="weui:arrow-filled" class="text-2xl" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useDataStore } from '../store'

const dataStore = useDataStore()
const topCollaborators = computed(() => dataStore.topCollaborators)
const topRatedUsers = computed(() => dataStore.topRatedUsers)

const rowsPerPage = 15

// Pagination for Top Collaborators
const currentCollaboratorPage = ref(1)
const totalCollaboratorPages = computed(() => Math.ceil(topCollaborators.value.length / rowsPerPage))
const paginatedTopCollaborators = computed(() => {
    const start = (currentCollaboratorPage.value - 1) * rowsPerPage
    return topCollaborators.value.slice(start, start + rowsPerPage)
})

// Pagination for Most Rated
const currentMostRatedPage = ref(1)
const totalMostRatedPages = computed(() => Math.ceil(topRatedUsers.value.length / rowsPerPage))
const paginatedMostRateds = computed(() => {
    const start = (currentMostRatedPage.value - 1) * rowsPerPage
    return topRatedUsers.value.slice(start, start + rowsPerPage)
})

onMounted(() => {
    dataStore.getStudents()
})
</script>

<style scoped>
.content::-webkit-scrollbar {
    display: none;
}
</style>
