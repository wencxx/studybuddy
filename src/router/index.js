import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Newsfeed from '../views/Newsfeed.vue'
import Notes from '../views/Notes.vue'
import Tasks from '../views/Tasks.vue'
import UserDetails from '../views/UserDetails.vue'
import Message from '../views/Message.vue'


const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/home',
        name: 'newsfeed',
        component: Newsfeed,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/task',
        name: 'tasks',
        component: Tasks,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/notes',
        name: 'notes',
        component: Notes,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/user-details/:id',
        name: 'userDetails',
        component: UserDetails,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/message/:id',
        name: "message",
        component: Message,
        meta: {
            requiresAuth: true
        }
    }
]



const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if(to.meta.requiresAuth && !authStore.isAuthenticated){
        next({ name: 'login' });
    }else if(to.path == '/' && authStore.isAuthenticated){
        next({ name: 'newsfeed'})
    }
    else{
        next()
    }
})

export default router