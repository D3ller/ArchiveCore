import {createRouter, createWebHistory, RouterView} from 'vue-router'
import HomeView from '../views/Home.vue'
import {middleware} from "./middleware.js";

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
            path: '/account/history',
            name: 'history',
            component: () => import('../views/account/History.vue')
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
        },
        {
            path: '/friends',
            name: 'friends',
            component: () => import('../views/account/friends.vue')
        },
        {
            path: '/playlist',
            name: 'playlist',
            component: () => import('../views/account/Playlist.vue')
        },
        {
            path: '/playlist/:id',
            name: 'playlistView',
            component: () => import('../views/playlist/[playlistSlug].vue')
        },
        {
            path: '/dev/',
            component: RouterView,
            children: [
                {
                    path: 'dashboard',
                    name: 'devDashboard',
                    component: () => import('../views/dev-only/dashboard.vue'),
                    beforeEnter: middleware
                },
                {
                    path: 'artist',
                    name: 'devArtist',
                    component: () => import('../views/dev-only/artist/main.vue'),
                },
                {
                    path: 'song',
                    name: 'devSong',
                    component: () => import('../views/dev-only/song/main.vue'),
                }
            ]
        }

    ]
})

export default router
