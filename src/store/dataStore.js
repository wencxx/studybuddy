import { defineStore } from 'pinia'
import { useAuthStore } from './authStore'
import { db } from '../plugins/firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        notifications: [],
        students: []
    }),
    actions: {
        getStudents (){
            const docRef = collection(db, 'users')
            try {
                onSnapshot(
                    docRef,
                    (snapshots) => {
                        this.students = []

                        snapshots.docs.forEach(doc => {
                            this.students.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        })
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }
    },
    getters: {
        topCollaborators: (state) => {
            return state.students
                .map(student => {
                    const collaboratorsCount = Array.isArray(student.collabs)
                        ? student.collabs.length
                        : 0
                    return {
                        ...student,
                        collaborationsCount: collaboratorsCount
                    }
                })
                .sort((a, b) => b.collaborationsCount - a.collaborationsCount)
        },
        topRatedUsers: (state) => {
            return state.students
                .map(student => {
                    const ratings = Array.isArray(student.ratings) ? student.ratings : []
                    const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0)
                    const averageRating = ratings.length > 0 ? (totalRatings / ratings.length).toFixed(1) : "0.0"

                    return {
                        ...student,
                        averageRating: parseFloat(averageRating)
                    }
                })
                .sort((a, b) => b.averageRating - a.averageRating)
        }
    }
})
