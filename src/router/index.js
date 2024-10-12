import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'
// import Login from '../views/Login.vue'
// import Register from '../views/Register.vue'
// import Notes from '../views/Notes.vue'
// import Tasks from '../views/Tasks.vue'
// import UserDetails from '../views/UserDetails.vue'
// import Message from '../views/Message.vue'


const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/home',
        name: 'newsfeed',
        component: () => import('../views/Newsfeed.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/task',
        name: 'tasks',
        component: () => import('../views/Tasks.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/notes',
        name: 'notes',
        component: () => import('../views/Notes.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/user-details/:id',
        name: 'userDetails',
        component: () => import('../views/UserDetails.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/message/:id',
        name: "message",
        component: () => import('../views/Message.vue'),
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