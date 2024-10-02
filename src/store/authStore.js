import { defineStore } from "pinia";


export const useAuthStore = defineStore('auth', {
    state: () => ({
        currentUser: null,
        userDetails: null,
        isAuthenticated: !!localStorage.getItem('auth'),
        token: localStorage.getItem('token') || null
    }),
    actions: {
        async login(token){
            this.isAuthenticated = true
            this.token = token
        },
        logout(){
            this.token = null
            this.isAuthenticated = false
        }
    },
    getters: {
        isCollaborated: (state) => (uid) => {
            if(state.userDetails !== null){
                if(state.userDetails?.collabs?.includes(uid)){
                    return 'collaborated'
                }else if( state.userDetails?.incomingCollabRequest?.includes(uid)){
                    return 'accept'
                }else if( state.userDetails?.outgoingCollabRequest?.includes(uid)){
                    return 'requested'
                }else{
                    return 'request'
                }
            }else{
                return state.userDetails?.collabs
            }
        },
    }
})