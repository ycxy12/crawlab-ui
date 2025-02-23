<template>
    <div class="list-layout">
      <div class="content">
          <cl-nav-actions  class="nav-actions">
            <cl-nav-action-group>
              <cl-nav-action-item>
                <cl-nav-action-button v-auth="ACTION_ADD" button-type="label" label="添加采集文章" tooltip="添加采集文章" type="success" :icon="icon" @click="onAdd" />
              </cl-nav-action-item>
              <cl-nav-action-item>
                <cl-filter-input placeholder="请输入标题" @change="onChange" />
              </cl-nav-action-item>
            </cl-nav-action-group>
          </cl-nav-actions>
        <cl-table
          ref="tableRef"
          :columns="tableColumns"
          :data="tableData"
          :total="tableTotal"
          :page="tablePagination.page"
          :page-size="tablePagination.size"
          selectable
          @selection-change="onSelect"
          @delete="onDelete"
          @edit="onEdit"
          @pagination-change="onPaginationChange"
        >
      </cl-table>
      </div>
      <editClean ref="editCleanRef" @refresh="getList" />
      <wordsChart ref="wordsChartRef" />
    </div>
</template>

<script setup lang='ts'>
import { ElMessageBox } from 'element-plus';
import { ref, onMounted, reactive, computed } from 'vue'
import useCollectionService from '@/services/collection/collectionService';
import {ACTION_ADD} from '@/constants/action';
import { ACTION_COPY, ACTION_VIEW, TABLE_COLUMN_NAME_ACTIONS } from "@/constants";
import editClean from './editClean.vue';
import wordsChart from './wordsChart.vue';

const { listCollectionResult, deleteCollectionResult,  } = useCollectionService();

const editCleanRef = ref<any>(null)
const wordsChartRef = ref<any>(null)

//列表
const icon = ['fa', 'plus']
const tableData = ref([])

const tableTotal = ref(0)
const tablePagination = reactive({
    page: 1,
    size: 10,
})
const getList = async () => {
    const res = await listCollectionResult({page: tablePagination.page, size: tablePagination.size, title: title.value})
    tableData.value = res.data.records
    tableTotal.value = res.data.total
}

//新增
const onAdd = () => {
    console.log('onAdd')
    editCleanRef.value?.openDialog()
}

const onSelect = (value: TableData) => {
    console.log(value, 'onSelect')
}

const onEdit = (value: TableData) => {
    console.log(value, 'onEdit')
    editCleanRef.value?.openDialog()
}

const onDelete = (value: TableData) => {
    console.log(value, 'onDelete')
}

const onPaginationChange = (value: TablePagination) => {
  console.log(value);
  tablePagination.page = value.page;
  tablePagination.size = value.size;
  getList();

}

const tableColumns = computed<TableColumns<Environment>>(() => [
    {
      key: 'title',
      label: '标题',
      width: '300',
    },
    {
      key: 'keywords',
      label: '关键词',
      width: '160',
    },
    {
      key: 'source',
      label: '来源',
      width: '160',
    },
    {
      key: 'releaseTime',
      label: '发布时间',
      width: '160',
    },
    {
      key: 'intro',
      label: '简介',
      width: 'auto',
    },
    {
      key: TABLE_COLUMN_NAME_ACTIONS,
      label: '操作',
      fixed: 'right',
      width: '200',
      buttons: [
        {
          type: 'warning',
          size: 'small',
          icon: ['far', 'edit'],
          tooltip: '编辑',
          onClick: async (row: Environment) => {
            editCleanRef.value?.openDialog(row.id)
          },
          action: ACTION_COPY,
        },
        {
          type: 'danger',
          size: 'small',
          icon: ['fa', 'trash-alt'],
          tooltip: '删除',
          onClick: async (row: Environment) => {
            const res = await ElMessageBox.confirm(
              '您是否确定删除?',
              '删除',
              {
                type: 'warning',
                confirmButtonClass: 'el-button--danger'
              }
            );

            if (res) {
              await deleteCollectionResult(row.id as string);
            }
            await getList()
          },
        },
        {
          className: 'view-btn',
          type: 'primary',
          icon: ['fa', 'cloud'],
          tooltip: '词频',
          onClick: (row) => {
            wordsChartRef.value?.openDialog(row.id)
          },
          action: ACTION_VIEW,
        },
      ],
      disableTransfer: true,
    }
  ]);
const title = ref('')
  const onChange = (value: string) => {
    console.log(value, 'onChange')
    title.value = value
    getList()
  }

onMounted(() => {
    getList()
})
</script>

<style lang='scss' scoped>
.list-layout {
  .nav-actions {
    background-color: var(--cl-container-white-bg);
    border-bottom: none;

    .nav-action-group {
      .nav-action-item {
        &:not(:last-child) {
          margin-right: 10px;
        }
      }
    }
  }

  .content {
    background-color: var(--cl-container-white-bg);
  }
}
</style>
