import {computed, onBeforeMount, ref} from 'vue';
import useDetail from '@/layouts/content/detail/useDetail';
import useNotification from '@/components/notification/notification';
import {useStore} from 'vuex';
import {translate} from '@/utils';
import {DataItem} from 'element-plus';

const t = translate;

const useNotificationDetail = () => {
  const ns = 'notification';
  const store = useStore();
  const {
    notification: state,
  } = store.state as RootStoreState;

  const {
    id,
    form,
  } = useNotification(store);

  const triggersList = computed<DataItem[]>(() => state.triggersList?.map((trigger: string) => {
    return {
      label: trigger,
      key: trigger,
    } as DataItem;
  }) || []);

  onBeforeMount(async () => {
    await store.dispatch(`${ns}/getById`, id.value);
  });

  return {
    ...useDetail('notification'),
    form,
    triggersList,
  };
};

export default useNotificationDetail;
