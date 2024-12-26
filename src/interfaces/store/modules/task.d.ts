type TaskStoreModule = BaseModule<TaskStoreState, TaskStoreGetters, TaskStoreMutations, TaskStoreActions>;

interface TaskStoreState extends BaseStoreState<Task> {
  logContent: string;
  logPagination: TablePagination;
  logTotal: number;
  logAutoUpdate: boolean;
  dataDisplayAllFields: boolean;
}

interface TaskStoreGetters extends BaseStoreGetters<TaskStoreState> {
}

interface TaskStoreMutations extends BaseStoreMutations<Task> {
  setLogContent: StoreMutation<TaskStoreState, string>;
  resetLogContent: StoreMutation<TaskStoreState>;
  setLogPagination: StoreMutation<TaskStoreState, TablePagination>;
  resetLogPagination: StoreMutation<TaskStoreState>;
  setLogTotal: StoreMutation<TaskStoreState, number>;
  resetLogTotal: StoreMutation<TaskStoreState>;
  enableLogAutoUpdate: StoreMutation<TaskStoreState>;
  disableLogAutoUpdate: StoreMutation<TaskStoreState>;
  setDataDisplayAllFields: StoreMutation<TaskStoreState, boolean>;
}

interface TaskStoreActions extends BaseStoreActions<Task> {
  getLogs: StoreAction<TaskStoreState, string>;
}
