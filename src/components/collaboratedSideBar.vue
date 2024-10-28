<template>
    <div class="py-5 pl-3">
        <div class="border-l border-gray-200 dark:border-gray-100/10 w-11/12 h-full pl-3 pt-5">
            <h1>Collaborated</h1>
            <div v-if="users.length > 0" class="flex flex-col gap-y-3 mt-5">
                <router-link :to="{ name: 'userDetails', params: { id:user.userId } }" v-for="user in users" :key="user.id" class="flex items-center gap-x-3">
                    <div class="w-10 rounded-full aspect-square overflow-hidden">
                        <img :src="user.photoURL" alt="profile pic">
                    </div>
                    <div>
                        <h1>{{ user.displayName }}</h1>
                    </div>
                </router-link>
            </div>
            <div v-else class="mt-5">
                <p class="text-sm">Start collaborating now</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, onMounted, watch, ref, defineEmits } from 'vue'
import { db } from '../plugins/firebase'
import { collection, getDocs, where, limit, query, doc, arrayRemove, arrayUnion, updateDoc, onSnapshot } from 'firebase/firestore'


const props = defineProps({
    userId: String
})

const emit = defineEmits(['collabs'])


const userRef = collection(db, 'users')

// get incoming collabs
const collaborated = ref([])

const getIncomingCollabs = async () => {
    try {
        if (props.userId) {
            const q = query(
                userRef,
                where('userId', '==', props.userId),
                limit(1)
            )

            onSnapshot(q, (snapshot) => {
                collaborated.value = []

                snapshot.forEach(doc => {
                    collaborated.value.push(...doc.data().collabs)
                })

                getUsers()
            })
        }
    } catch (error) {
        console.log(error)
    }
}

const users = ref([])

// get users
const getUsers = async () => {
    try {
        users.value = []

        const promises = collaborated.value.map(async (collaboratedUser) => {
            const q = query(
                userRef,
                where('userId', '==', collaboratedUser)
            )
            const snapshot = await getDocs(q)
            return snapshot
        })

        const result = await Promise.all(promises)

        result.forEach(snapshot => {
            snapshot.forEach(doc => {
                users.value.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
        })

        emit('collabs', users.value)
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    getIncomingCollabs()

    watch(() => props.userId, () => {
        getIncomingCollabs()
    })
})



</script>

<style scoped>

</style>