<template>
    <div>
        <div class="flex flex-col gap-y-5">
            <div v-for="skeleton in props.noOfSkeleton" :key="skeleton" class="w-full rounded-xl border animate-pulse shadow-sm dark:shadow-none dark:border-gray-100/10 p-4 flex flex-col">
                <div class="flex items-center gap-x-3">
                    <div class="h-9 aspect-square rounded-full bg-gray-300 animate-pulse"></div>
                    <div>
                        <div class="h-5 w-32 bg-gray-300 animate-pulse rounded"></div>
                        <div class="h-2 w-20 mt-1 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                    <div class="h-5 w-1 bg-gray-300 animate-pulse rounded ml-auto"></div>
                </div>
                <div class="flex flex-col gap-y-2 mt-3">
                    <div class="w-full h-5 bg-gray-300 animate-pulse rounded"></div>
                    <div class="w-full h-5 bg-gray-300 animate-pulse rounded"></div>
                    <div class="w-5/6 h-5 bg-gray-300 animate-pulse rounded"></div>
                </div>
                <div class="mt-2 flex items-center justify-between">
                    <div class="h-5 aspect-square rounded bg-gray-300 animate-pulse"></div>  
                    <div>
                        <div class="h-3 w-32 bg-gray-300 animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    noOfSkeleton: Number
})
</script>