import {
  getDefaultStoreActions,
  getDefaultStoreGetters,
  getDefaultStoreMutations,
  getDefaultStoreState
} from '@/utils/store';
import {getDefaultPagination} from '@/utils/pagination';
import useRequest from '@/services/request';
import {getFieldsFromData} from '@/utils/result';

const {
  getList,
} = useRequest();

const state = {
  ...getDefaultStoreState<DataCollection>('dataCollection'),
  resultTableData: [],
  resultTableTotal: 0,
  resultTablePagination: getDefaultPagination(),
  resultTableFilter: [],
  resultDialogVisible: false,
  resultDialogContent: '',
  resultDialogType: undefined,
  resultDialogKey: '',
  dedupFieldsDialogVisible: false,
} as DataCollectionStoreState;

const getters = {
  ...getDefaultStoreGetters<DataCollection>(),
  resultFields: (state: DataCollectionStoreState) => {
    return getFieldsFromData(state.resultTableData);
  },
} as DataCollectionStoreGetters;

const mutations = {
  ...getDefaultStoreMutations<DataCollection>(),
  setResultTableData: (state: DataCollectionStoreState, payload: TableDataWithTotal<Result>) => {
    const {data, total} = payload;
    state.resultTableData = data;
    state.resultTableTotal = total;
  },
  resetResultTableData: (state: DataCollectionStoreState) => {
    state.resultTableData = [];
    state.resultTableTotal = 0;
  },
  setResultTablePagination: (state: DataCollectionStoreState, pagination: TablePagination) => {
    state.resultTablePagination = pagination;
  },
  resetResultTablePagination: (state: DataCollectionStoreState) => {
    state.resultTablePagination = getDefaultPagination();
  },
  setResultTableFilter: (state: DataCollectionStoreState, filter: FilterConditionData[]) => {
    state.resultTableFilter = filter;
  },
  resetResultTableFilter: (state: DataCollectionStoreState) => {
    state.resultTableFilter = [];
  },
  setResultDialogVisible: (state: DataCollectionStoreState, visible: boolean) => {
    state.resultDialogVisible = visible;
  },
  setResultDialogContent: (state: DataCollectionStoreState, content: string) => {
    state.resultDialogContent = content;
  },
  resetResultDialogContent: (state: DataCollectionStoreState) => {
    state.resultDialogContent = '';
  },
  setResultDialogType: (state: DataCollectionStoreState, type: DataFieldType) => {
    state.resultDialogType = type;
  },
  resetResultDialogType: (state: DataCollectionStoreState) => {
    state.resultDialogType = undefined;
  },
  setResultDialogKey: (state: DataCollectionStoreState, type: string) => {
    state.resultDialogKey = type;
  },
  resetResultDialogKey: (state: DataCollectionStoreState) => {
    state.resultDialogKey = '';
  },
  setDedupFieldsDialogVisible: (state: DataCollectionStoreState, visible: boolean) => {
    state.dedupFieldsDialogVisible = visible;
  },
} as DataCollectionStoreMutations;

const actions = {
  ...getDefaultStoreActions<DataCollection>('/data/collections'),
  getResultData: async ({commit}: StoreActionContext<DataCollectionStoreState>, payload: { id: string; params: ListRequestParams }) => {
    const {id, params} = payload;
    const res = await getList(`/results/${id}`, params);
    commit('setResultTableData', {data: res.data || [], total: res.total});
    return res;
  },
} as DataCollectionStoreActions;

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
} as DataCollectionStoreModule;
