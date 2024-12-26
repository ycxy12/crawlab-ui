import {readonly} from 'vue';
import {Store} from 'vuex';
import useDataSourceService from '@/services/ds/dataSourceService';
import {
  DATA_SOURCE_CONNECT_TYPE_HOSTS,
  DATA_SOURCE_CONNECT_TYPE_STANDARD,
  DATA_SOURCE_CONNECT_TYPE_URL,
  DATA_SOURCE_TYPE_MONGO,
  DATA_SOURCE_TYPE_MYSQL,
  DATA_SOURCE_TYPE_POSTGRESQL,
  DATA_SOURCE_TYPE_MSSQL,
  DATA_SOURCE_TYPE_SQLITE,
  DATA_SOURCE_TYPE_COCKROACHDB,
  DATA_SOURCE_TYPE_ELASTICSEARCH,
  DATA_SOURCE_TYPE_KAFKA,
} from '@/constants/ds';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getDefaultFormComponentData, plainClone, translate} from "@/utils";
import {FORM_FIELD_TYPE_INPUT, FORM_FIELD_TYPE_INPUT_TEXTAREA} from "@/constants";
import useForm from '@/components/form/useForm';

// i18n
const t = translate;

// form component data
const formComponentData = getDefaultFormComponentData<DataSource>();

export const useDataSource: any = (store: Store<RootStoreState>) => {
  // store
  const ns = 'ds' as ListStoreNamespace;
  const {ds: state} = store.state as RootStoreState;

  // batch form fields
  const batchFormFields: FormTableField[] = [
    {
      prop: 'name',
      label: 'Name',
      width: '150',
      fieldType: FORM_FIELD_TYPE_INPUT,
      required: true,
      placeholder: 'Name',
    },
    {
      prop: 'description',
      label: 'Description',
      width: '200',
      fieldType: FORM_FIELD_TYPE_INPUT_TEXTAREA,
    },
  ];

  // form rules
  const formRules = readonly<FormRules>({});

  // type options
  const typeOptions = readonly<SelectOption[]>([
    {label: t('components.ds.type.mongo'), value: DATA_SOURCE_TYPE_MONGO},
    {label: t('components.ds.type.mysql'), value: DATA_SOURCE_TYPE_MYSQL},
    {label: t('components.ds.type.postgresql'), value: DATA_SOURCE_TYPE_POSTGRESQL},
    {label: t('components.ds.type.mssql'), value: DATA_SOURCE_TYPE_MSSQL},
    {label: t('components.ds.type.sqlite'), value: DATA_SOURCE_TYPE_SQLITE},
    {label: t('components.ds.type.cockroachdb'), value: DATA_SOURCE_TYPE_COCKROACHDB},
    {label: t('components.ds.type.elasticsearch'), value: DATA_SOURCE_TYPE_ELASTICSEARCH},
    {label: t('components.ds.type.kafka'), value: DATA_SOURCE_TYPE_KAFKA},
  ]);
  const getTypeOptionsWithDefault = (): SelectOption[] => {
    return [
      {label: t('components.ds.type.default'), value: undefined},
      ...typeOptions,
    ];
  };

  // on change password function
  const onChangePasswordFunc = async (id?: string) => {
    if (!id) return;

    const {value} = await ElMessageBox.prompt(
      t('components.user.messageBox.prompt.changePassword'),
      t('components.user.form.changePassword'),
      {
        inputType: 'password',
        inputPlaceholder: t('components.user.form.newPassword'),
      });

    await store.dispatch(`${ns}/changePassword`, {id, password: value});
    await ElMessage.success(t('common.message.success.save'));
  };

  // on connect type change
  const onConnectTypeChange = (connectType: DataSourceConnectType) => {
    const form = plainClone(state.form);
    switch (connectType) {
      case DATA_SOURCE_CONNECT_TYPE_STANDARD:
        form.host = '';
        form.port = '';
        break;
      case DATA_SOURCE_CONNECT_TYPE_URL:
        form.url = '';
        break;
      case DATA_SOURCE_CONNECT_TYPE_HOSTS:
        form.hosts = [''];
        break;
    }
    store.commit(`${ns}/setForm`, {...form});
  };

  // on hosts add
  const onHostsAdd = (index: number) => {
    const form = plainClone(state.form);
    if (!form.hosts) form.hosts = [];
    form.hosts?.splice(index + 1, 0, '');
    store.commit(`${ns}/setForm`, {...form});
  };

  // on hosts delete
  const onHostsDelete = (index: number) => {
    const form = plainClone(state.form);
    form.hosts?.splice(index, 1);
    if (form.hosts?.length === 0) form.hosts?.push('');
    store.commit(`${ns}/setForm`, {...form});
  };

  return {
    ...useForm(ns, store, useDataSourceService(store), formComponentData),
    batchFormFields,
    formRules,
    typeOptions,
    getTypeOptionsWithDefault,
    onChangePasswordFunc,
    onConnectTypeChange,
    onHostsAdd,
    onHostsDelete,
  };
};

export default useDataSource;
