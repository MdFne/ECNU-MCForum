import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Forum from '../pages/Forum.vue'
import Profile from '../pages/Profile.vue'
import Stats from '../pages/Stats.vue'

const route = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/forum',
        name: 'Forum',
        component: Forum
    },
    {
        path: '/forum/:channelId',
        name: 'ForumChannel',
        component: Forum
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/stats',
        name: 'Stats',
        component: Stats
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: route
})

export default router