import { Store } from 'vuex';
import useCleanService from '@/services/clean/cleanService';
import { getDefaultFormComponentData, translate } from "@/utils";
import useForm from '@/components/form/useForm';



// form component data
const formComponentData = getDefaultFormComponentData<Environment>();

export const useEnvironment: any = (store: Store<RootStoreState>) => {
  // store
  const ns = 'environment' as ListStoreNamespace;

  return {
    ...useForm(ns, store, useCleanService(store), formComponentData),
  };
};

export default useEnvironment;
