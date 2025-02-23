import { RouteRecordRaw } from 'vue-router';


export default [
  {
    name: 'CleanResults',
    path: `wash`,
    component: () => import('@/views/clean/clean/index.vue'),
  },
  {
    name: 'CollectionResults',
    path: `collection`,
    component: () => import('@/views/clean/collection/index.vue'),
  },
  {
    name: 'analysis',
    path: `analysis`,
    component: () => import('@/views/clean/analysis/index.vue'),
  },
] as Array<RouteRecordRaw>;
