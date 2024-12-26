import {useRoute} from 'vue-router';
import {computed} from 'vue';
import {
  TASK_MODE_ALL_NODES,
  TASK_MODE_RANDOM,
  TASK_MODE_SELECTED_NODE_TAGS,
  TASK_MODE_SELECTED_NODES
} from '@/constants/task';
import {Store} from 'vuex';
import useForm from '@/components/form/useForm';
import useTagService from '@/services/tag/tagService';
import {getDefaultFormComponentData} from '@/utils/form';
import {FORM_FIELD_TYPE_INPUT, FORM_FIELD_TYPE_INPUT_TEXTAREA,} from '@/constants/form';

// form component data
const formComponentData = getDefaultFormComponentData<Tag>();

const useTag = (store: Store<RootStoreState>) => {
  // options for default mode
  const modeOptions: SelectOption[] = [
    {value: TASK_MODE_RANDOM, label: 'Random Node'},
    {value: TASK_MODE_ALL_NODES, label: 'All Nodes'},
    {value: TASK_MODE_SELECTED_NODES, label: 'Selected Nodes'},
    {value: TASK_MODE_SELECTED_NODE_TAGS, label: 'Selected Tags'},
  ];

  // batch form fields
  const batchFormFields = computed<FormTableField[]>(() => [
    {
      prop: 'name',
      label: 'Name',
      width: '150',
      placeholder: 'Tag Name',
      fieldType: FORM_FIELD_TYPE_INPUT,
      required: true,
    },
    {
      prop: 'description',
      label: 'Description',
      width: '200',
      fieldType: FORM_FIELD_TYPE_INPUT_TEXTAREA,
    },
  ]);

  // route
  const route = useRoute();

  // tag id
  const id = computed(() => route.params.id);

  return {
    ...useForm('tag', store, useTagService(store), formComponentData),
    batchFormFields,
    id,
    modeOptions,
  };
};

export default useTag;
