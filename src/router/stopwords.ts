import {RouteRecordRaw} from 'vue-router';

const endpoint = 'stopwords';

export default [
  {
    name: 'StopwordsList',
    path: endpoint,
    component: () => import('@/views/stopwords/list/StopwordsList.vue'),
  },
] as Array<RouteRecordRaw>;
