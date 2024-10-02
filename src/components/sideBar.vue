<template>
    <div class="py-5">
        <nav class="border-r border-gray-200 dark:border-gray-100/10 w-11/12 h-full pr-3 pt-5">
            <ul class="flex flex-col gap-y-2">
                <li>
                    <router-link :to="{ name: 'newsfeed' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:home-3-fill" size="30" />
                        <span class="text-xl">Home</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{ name: 'tasks' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="mingcute:task-2-fill" size="30" />
                        <span class="text-xl">Tasks</span>
                    </router-link>
                </li>
                <li>
                    <router-link  :to="{ name: 'notes' }" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="material-symbols:event-note" size="30" />
                        <span class="text-xl">Notes</span>
                    </router-link>
                </li>
                <li>
                    <router-link to="/" class="flex items-center gap-x-4 p-1 rounded-md hover:bg-blue-600 hover:text-white">
                        <Icon icon="ion:storefront" size="30" />
                        <span class="text-xl">Marketplace</span>
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script setup>

</script>

<style scoped>
.router-link-active {
    background-color: #2563eb;
    color: white;
}
</style>