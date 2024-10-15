<template>
    <div>
        {{ collabRequest }}
    </div>
</template>

<script setup>
import { defineProps, onMounted, watch, ref } from 'vue'
import { db } from '../plugins/firebase'
import { collection, getDocs, where, limit, query } from 'firebase/firestore'

const props = defineProps({
    userId: String
})

const userRef = collection(db, 'users')

const collabRequest = ref([])

const getUser = async () => {
    try {
        const q = query(
            userRef,
            where('userId', '==', props.userId),
            limit(1)
        )

        const snapshot = await getDocs(q)

        snapshot.docs.map(doc => {
            collabRequest.value = doc.data().incomingCollabRequest
        })
    } catch (error) {
        console.log(error)
    }
}

onMounted(() => {
    watch(props, () => {
        getUser()
    })
})


</script>

<style scoped>

</style>