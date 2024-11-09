import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { db } from '../plugins/firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        notifications: []
    }),
})
