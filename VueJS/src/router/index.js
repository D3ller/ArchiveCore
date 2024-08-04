import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('../views/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('../views/auth/Register.vue')
        },
        {
            path: '/account/profile',
            name: 'dashboard',
            component: () => import('../views/account/Dashboard.vue')
        },
        {
            path: '/account/logout',
            name: 'logout',
            component: () => import('../views/account/Logout.vue')
        },
        {
            path: '/track/:id',
            name: 'song',
            component: () => import('../views/Song.vue')
        },
        {
            path: '/artist/:id',
            name: 'artist',
            component: () => import('../views/Artist.vue')
        },
        {
            path: '/album/:id',
            name: 'album',
            component: () => import('../views/Album.vue')
        },
        {
            path: '/discover',
            name: 'discover',
            component: () => import('../views/Discover.vue')
        }
    ]
})

export default router
