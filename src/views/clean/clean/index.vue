<template>
	<div class="list-layout">
		<div class="content">
			<cl-nav-actions class="nav-actions">
				<cl-nav-action-group>
					<cl-nav-action-item>
						<cl-nav-action-button button-type="label" label="导出" tooltip="导出文章数据" type="success" :icon="icon" @click="onExport" />
					</cl-nav-action-item>
					<cl-nav-action-item>
						<label class="nav-label">标题：</label>
						<cl-filter-input placeholder="请输入标题" @change="onChange" />
					</cl-nav-action-item>
					<cl-nav-action-item>
						<label class="nav-label">时间范围：</label>
						<el-date-picker
							v-model="times"
							type="datetimerange"
							range-separator="-"
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							value-format="YYYY-MM-DD HH:mm:ss"
							@change="onChangeTime"
						/>
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
        :loading="loading"
				@selection-change="onSelect"
				@delete="onDelete"
				@pagination-change="onPaginationChange"
			>
			</cl-table>
		</div>
		<viewDialog ref="viewDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ElMessageBox } from "element-plus"
import { ref, onMounted, reactive, computed } from "vue"
import useCleanService from "@/services/clean/cleanService"
import { ACTION_COPY, TABLE_COLUMN_NAME_ACTIONS } from "@/constants"
import { TABLE_ACTION_CUSTOMIZE_COLUMNS, TABLE_ACTION_EXPORT } from "@/constants/table"
import viewDialog from "./viewDialog.vue"
import {downloadBlob} from "@/utils/request"

const { listSubjectArticle, deleteSubjectArticle, exportSubjectArticle } = useCleanService()

const viewDialogRef = ref<any>(null)
const visibleButtons = [TABLE_ACTION_CUSTOMIZE_COLUMNS, TABLE_ACTION_EXPORT]

//列表
const icon = ["fa", "file-export"]
const tableData = ref([])
const times = ref([])
const loading = ref(false)

const ids = ref<any>([])
const tableTotal = ref(0)
const tablePagination = reactive({
	page: 1,
	size: 10,
})
const getList = async () => {
	let query = {}
	if (times.value && times.value.length > 0) {
		query = {
			page: tablePagination.page,
			size: tablePagination.size,
			title: title.value,
			startTime: times.value[0],
			endTime: times.value[1],
		}
	} else {
		query = {
			page: tablePagination.page,
			size: tablePagination.size,
			title: title.value,
		}
	}

	const res = await listSubjectArticle(query)
	tableData.value = res.data.records
	tableTotal.value = res.data.total
}

//新增
const onExport = async () => {
	let query = {}
	if (times.value && times.value.length > 0) {
		query = {
			title: title.value,
			startTime: times.value[0],
			endTime: times.value[1],
      ids: ids.value?.length > 0 ? ids.value : undefined,
		}
	} else {
		query = {
			title: title.value,
      ids: ids.value?.length > 0 ? ids.value : undefined,
		}
	}
  loading.value = true
	const res = await exportSubjectArticle(query)
  // console.log(res);
  downloadBlob(res)
  loading.value = false
}

const onSelect = (value: TableData) => {
	console.log(value, "onSelect")
  ids.value = value.map((item) => item.id)
}

const onEdit = (value: TableData) => {
	console.log(value, "onEdit")
	// editCleanRef.value?.openDialog()
}

const onDelete = (value: TableData) => {
	console.log(value, "onDelete")
}

const onPaginationChange = (value: TablePagination) => {
	tablePagination.page = value.page
	tablePagination.size = value.size
	getList()
}

const tableColumns = computed<TableColumns<Environment>>(() => [
	{
		key: "title",
		label: "标题",
		width: "300",
	},
	{
		key: "keywords",
		label: "关键词",
		width: "160",
	},
	{
		key: "source",
		label: "来源",
		width: "160",
	},
	{
		key: "releaseTime",
		label: "发布时间",
		width: "160",
		value: (row: any) => {
			return row.releaseTime ? row.releaseTime : ""
		},
	},
	{
		key: "intro",
		label: "简介",
		width: "auto",
		value: (row: any) => {
			return row.intro ? row.intro : ""
		},
	},
	{
		key: TABLE_COLUMN_NAME_ACTIONS,
		label: "操作",
		fixed: "right",
		width: "200",
		buttons: [
			// {
			//   type: 'warning',
			//   size: 'small',
			//   icon: ['far', 'edit'],
			//   tooltip: '编辑',
			//   onClick: async (row: Environment) => {
			//     editCleanRef.value?.openDialog(row.id)
			//   },
			//   action: ACTION_COPY,
			// },
			{
				type: "primary",
				size: "small",
				icon: ["far", "eye"],
				tooltip: "详情",
				onClick: async (row: Environment) => {
					viewDialogRef.value?.openDialog(row.id)
				},
				action: ACTION_COPY,
			},
			{
				type: "danger",
				size: "small",
				icon: ["fa", "trash-alt"],
				tooltip: "删除",
				onClick: async (row: Environment) => {
					const res = await ElMessageBox.confirm("您是否确定删除?", "删除", {
						type: "warning",
						confirmButtonClass: "el-button--danger",
					})

					if (res) {
						await deleteSubjectArticle(row.id as string)
					}
					await getList()
				},
			},
		],
		disableTransfer: true,
	},
])
const title = ref("")
const onChange = (value: string) => {
	console.log(value, "onChange")
	title.value = value
	getList()
}

const onChangeTime = (value: any) => {
	console.log(value, "onChangeTime")
	times.value = value
	getList()
}

onMounted(() => {
	getList()
})
</script>

<style lang="scss" scoped>
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
	.nav-label {
		font-size: 14px;
	}

	.content {
		background-color: var(--cl-container-white-bg);
	}
}
</style>
