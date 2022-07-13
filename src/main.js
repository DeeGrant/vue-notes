import { createApp } from 'vue'
import { createApolloClient } from '@nhost/apollo'
import { NhostClient } from '@nhost/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createRouter, createWebHistory } from "vue-router/dist/vue-router.js";

import './main.css'
import App from './App.vue'

const nhost = new NhostClient({
    subdomain: 'httlmzfqaxtbwxipwpqp',
    region: 'us-east-1'
})

const apolloClient = createApolloClient({ nhost })

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./components/HomeView.vue'),
        meta: {
            protected: true
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./components/LoginView.vue')
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
router.beforeEach(async function(to, from, next) {
    if (to.matched.some(record => record.meta.protected)) {
        const isAuthenticated = await nhost.auth.isAuthenticatedAsync()
        if (!isAuthenticated) {
            return next('/login')
        }
    }
    next()
})


createApp(App)
    .provide(DefaultApolloClient, apolloClient)
    .use(nhost)
    .use(router)
    .mount('#app')
