<template>
	<div class="list-layout">
		<div class="content">
			<cl-nav-actions  class="nav-actions">
            <cl-nav-action-group>
              <cl-nav-action-item>
                <cl-filter-input placeholder="请输入关键字" @change="onChange" />
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
        :visibleButtons="visibleButtons"
				selectable
				@selection-change="onSelect"
				@delete="onDelete"
				@edit="onEdit"
				@pagination-change="onPaginationChange"
			>
			</cl-table>
		</div>
		<viewDialog ref="viewDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus"
import { ref, onMounted, reactive, computed, h } from "vue"
import useAnalysisService from "@/services/analysis/analysisService"
import { TABLE_COLUMN_NAME_ACTIONS } from "@/constants"
import viewDialog from './viewDialog.vue';
import {TABLE_ACTION_CUSTOMIZE_COLUMNS, TABLE_ACTION_EXPORT,} from '@/constants/table';

const { listWiki, deleteWiki } = useAnalysisService()

const viewDialogRef = ref<any>(null)
const visibleButtons = ['无']

//列表
const tableData = ref<any>([])

const tableTotal = ref(0)
const tablePagination = reactive({
	page: 1,
	size: 10,
})
const getList = async () => {
	const res = await listWiki({ page: tablePagination.page, size: tablePagination.size, keywords: keywords.value })
	tableData.value = res.data.records
	tableTotal.value = res.data.total
}

//新增
const onAdd = () => {
	console.log("onAdd")
}

const onSelect = (value: TableData) => {
	console.log(value, "onSelect")
}

const onEdit = (value: TableData) => {
	console.log(value, "onEdit")
}

const onDelete = (value: TableData) => {
	console.log(value, "onDelete")
}

const onPaginationChange = (value: TablePagination) => {
	console.log(value)
	tablePagination.page = value.page
	tablePagination.size = value.size
	getList()
}


const tableColumns = computed<TableColumns<Environment>>(() => [
  {
		key: "title",
		label: "名称",
		width: "300",
	},
	{
		key: "keywords",
		label: "关键字",
		width: "500",
	},
	{
		key: "desc",
		label: "描述",
		width: "auto",
	},
	{
		key: TABLE_COLUMN_NAME_ACTIONS,
		label: "操作",
		fixed: "right",
		width: "100",
		buttons: [
			{
				type: "primary",
				size: "small",
				icon: ["far", "eye"],
				tooltip: "查看",
				onClick: async (row: any) => {
					viewDialogRef.value?.openDialog(row.id)
				},
			},
			// {
			// 	type: "danger",
			// 	size: "small",
			// 	icon: ["fa", "trash-alt"],
			// 	tooltip: "删除",
			// 	onClick: async (row: any) => {
			// 		const res = await ElMessageBox.confirm("您是否确定删除?", "删除", {
			// 			type: "warning",
			// 			confirmButtonClass: "el-button--danger",
			// 		})

			// 		if (res) {
			// 			await deleteWiki(row.id as string)
			// 		}
			// 		await getList()
			// 	},
			// },
		],
		disableTransfer: true,
	},
])
const keywords = ref("")
const onChange = (value: string) => {
	keywords.value = value
	getList()
}

onMounted(() => {
	getList()
})
</script>

<style lang="scss">
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

	.info-row {
		display: flex;
		align-items: flex-start;
		line-height: 28px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.info-label {
		flex-shrink: 0;
		width: 80px;
		font-weight: bold;
		color: #606266;
	}

	.info-content {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.info-tag {
		margin: 2px;
	}

	.empty-tag {
		color: #909399;
		font-style: italic;
	}
}
</style>
