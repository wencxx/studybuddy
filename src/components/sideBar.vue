<template>
    <div class="py-5">
        <nav class="border-r border-gray-200 dark:border-gray-100/10 w-11/12 h-full pr-3 pt-5">
            <ul class="flex flex-col gap-y-2">
                <li>
                    <router-link :to="{ name: 'newsfeed' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:home-3-fill" class="text-2xl" />
                        <span class="text-xl">Home</span>
                    </router-link>
                </li>
                <li>
                    <div @click="toggleGroups = !toggleGroups" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="fluent-mdl2:publish-course" class="text-2xl" />
                        <span class="text-xl">Courses</span>
                        <Icon icon="weui:arrow-outlined" class="text-2xl ml-auto duration-150" :class="{ 'rotate-90': toggleGroups }" />
                    </div>
                    <div v-if="toggleGroups" class="flex flex-col gap-y-1 pl-10 mt-3">
                        <router-link :to="{ name: 'ITNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Information Technology</span>
                        </router-link>
                        <router-link :to="{ name: 'ISNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Information Systems</span>
                        </router-link>
                        <router-link :to="{ name: 'INDUSNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Industrial Technology</span>
                        </router-link>
                        <router-link :to="{ name: 'EDUCNewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Technical Teacher Education</span>
                        </router-link>
                        <router-link :to="{ name: 'CENewsfeed' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Computer Engineering</span>
                        </router-link>
                    </div>
                </li>
                <li>
                    <router-link :to="{ name: 'requests' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="carbon:collaborate" class="text-2xl" />
                        <span class="text-xl">Request</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'quiz' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'sharedQuiz' }">
                        <Icon icon="mingcute:task-2-fill" class="text-2xl" />
                        <span class="text-xl">Tasks</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'notes' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'sharedNotes' }">
                        <Icon icon="material-symbols:event-note" class="text-2xl" />
                        <span class="text-xl">Notes</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'calendar' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'calendar' }">
                        <Icon icon="tabler:calendar" class="text-2xl"/>
                        <span class="text-xl">Calendar</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'rate' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'rate' }">
                        <Icon icon="iconoir:star" class="text-2xl"/>
                        <span class="text-xl">Rate Us</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'feedback' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'feedback' }">
                        <Icon icon="mdi:feedback-outline" class="text-2xl"/>
                        <span class="text-xl">Feedback</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'topStudents' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white" :class="{ 'bg-[#2563eb] text-white': $route.name === 'topStudents' }">
                        <Icon icon="solar:ranking-linear" class="text-2xl"/>
                        <span class="text-xl">Top Users</span>
                    </router-link>
                </li>
                <li>
                    <div @click="toggledMarketplace = !toggledMarketplace" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="ion:storefront" class="text-2xl" />
                        <span class="text-xl">Marketplace</span>
                        <Icon icon="weui:arrow-outlined" class="text-2xl ml-auto duration-150" :class="{ 'rotate-90': toggledMarketplace }" />
                    </div>
                    <div v-if="toggledMarketplace" class="flex flex-col gap-y-1 pl-10 mt-3">
                        <router-link :to="{ name: 'selling' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Sell a product</span>
                        </router-link>
                        <router-link :to="{ name: 'sellings' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Sellings</span>
                        </router-link>
                        <router-link :to="{ name: 'listings' }" class="flex items-center gap-x-4 p-1 pl-2 rounded-md hover:bg-blue-600 hover:text-white">
                            <span>Listings</span>
                        </router-link>
                        <!-- <router-link :to="{ name: 'quiz' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                            <Icon icon="ion:storefront" class="text-2xl" />
                            <span class="text-xl">Marketplace</span>
                        </router-link> -->
                    </div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>
import { ref } from 'vue'
const toggledMarketplace = ref(false)
const toggleGroups = ref(false)
</script>

<style scoped>
.router-link-active {
    background-color: #2563eb;
    color: white;
}
</style>