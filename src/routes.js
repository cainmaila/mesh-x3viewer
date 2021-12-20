import { createRouter, createWebHistory } from 'vue-router'
import MeshView from './components/MeshView.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: MeshView },
    { path: '/:id', component: MeshView },
  ],
})

export default router
