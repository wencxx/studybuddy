import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store'
import homeView from '../views/Newsfeed.vue'

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
        component: homeView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/requests',
        name: 'requests',
        component: () => import('../views/Request.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/post-details',
        name: 'postDetails',
        component: () => import('../views/PostDetails.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/quiz',
        name: 'quiz',
        component: () => import('../views/Quiz.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/shared-quiz',
        name: 'sharedQuiz',
        component: () => import('../views/SharedQuiz.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/take-quiz/:id',
        name: 'takeQuiz',
        component: () => import('../views/TakeQuiz.vue')
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
        path: '/shared-notes',
        name: 'sharedNotes',
        component: () => import('../views/SharedNotes.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/note-details/:id',
        name: 'noteDetails',
        component: () => import('../views/ViewNotes.vue')
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: () => import('../views/Calendar.vue')
    },
    {
        path: '/marketplace',
        name: 'marketplace',
        component: () => import('../views/MarketPlace.vue'),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: 'selling',
                name: 'selling',
                component: () => import('../views/child/sellProduct.vue')
            },
            {
                path: 'listings',
                name: 'listings',
                component: () => import('../views/child/marketplaceListings.vue')
            }
        ]
    },
    {
        path: '/marketplace-message/:id',
        name: "marketplaceMessage",
        component: () => import('../views/MarketplaceMessage.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/marketplace-messages',
        name: "marketplaceMessages",
        component: () => import('../views/MarketplaceMessages.vue'),
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
        path: '/notifications',
        name: "notifications",
        component: () => import('../views/Notifications.vue'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/messages',
        name: "messages",
        component: () => import('../views/Messages.vue'),
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
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'login', query: { redirect: to.fullPath } });
    } else if (to.path === '/' && authStore.isAuthenticated) {
        next({ name: 'newsfeed' });
    } else {
        next();
    }
});

export default router