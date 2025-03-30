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
					<cl-nav-action-item v-if="selectedRowsCount > 0">
						<el-tag type="info">已选择 {{ selectedRowsCount }} 条记录</el-tag>
						<el-button type="text" @click="clearSelection">清空选择</el-button>
					</cl-nav-action-item>
				</cl-nav-action-group>
			</cl-nav-actions>
			<cl-table
				ref="clTableRef"
				:columns="tableColumns"
				:data="tableData"
				:total="tableTotal"
				:page="tablePagination.page"
				:page-size="tablePagination.size"
				:visibleButtons="visibleButtons"
				selectable
				:loading="loading"
				:row-key="(row) => row.id"
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
import { ElMessageBox, ElTag, ElButton } from "element-plus"
import { ref, onMounted, reactive, computed, h, nextTick } from "vue"
import useCleanService from "@/services/clean/cleanService"
import { ACTION_COPY, TABLE_COLUMN_NAME_ACTIONS } from "@/constants"
import { TABLE_ACTION_CUSTOMIZE_COLUMNS, TABLE_ACTION_EXPORT } from "@/constants/table"
import viewDialog from "./viewDialog.vue"
import { downloadBlob } from "@/utils/request"

const { listSubjectArticle, deleteSubjectArticle, exportSubjectArticle } = useCleanService()

const viewDialogRef = ref<any>(null)
const clTableRef = ref<any>(null)
const visibleButtons = [TABLE_ACTION_CUSTOMIZE_COLUMNS]

//列表
const icon = ["fa", "file-export"]
const tableData = ref([])
const times = ref([])
const loading = ref(false)

// 跨页选中的ID集合，用Map数据结构存储ID和对应的行数据
const selectedRows = reactive(new Map())
const selectedRowsCount = computed(() => selectedRows.size)
const ids = computed<any>(() => Array.from(selectedRows.keys()))

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

	// 当数据加载完成后，恢复选中状态
	nextTick(() => {
		setSelectionByIds()
	})
}

// 设置表格选中状态
const setSelectionByIds = () => {
	if (!clTableRef.value) return

	// 清除当前页面的选择状态
	// clTableRef.value.clearSelection()

  // console.log(selectedRows, "clTableRef")
	// 将当前页中已选中的行设置为选中状态
	tableData.value.forEach(row => {
		if (selectedRows.has(row.id)) {
      // console.log(clTableRef.value.tableRef, "row")
			clTableRef.value.tableRef.toggleRowSelection(row, true)
		}
	})
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
	// 获取当前页的数据ID
	const currentPageIds = tableData.value.map((item) => item.id)
  // console.log(currentPageIds, "currentPageIds")

	// 更新选中记录
	const selectedIds = value.map((item) => item.id)

	// 处理当前页的选择变化
	currentPageIds.forEach(id => {
		if (selectedIds.includes(id)) {
			// 添加到选中集合
      const row = tableData.value.find(item => item.id === id)
			selectedRows.set(id, row)
      // console.log(selectedRows, "set")
		} else {
			// 从选中集合中移除
			selectedRows.delete(id)
      // console.log(selectedRows, "delete")
		}
	})
}

// 清空所有选择
const clearSelection = () => {
	console.log(selectedRows, "clearSelection")
	selectedRows.clear()
	if (clTableRef.value) {
		clTableRef.value.clearSelection()
	}
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
		width: "300",
		value: (row: any) =>
			h(
				"div",
				stringToArray(row.keywords).map((item: any) => h(ElTag, { size: "small", class: "key-tag" }, item))
			),
	},
	{
		key: "source",
		label: "来源",
		width: "160",
	},
	{
		key: "publishTime",
		label: "发布时间",
		width: "160",
		value: (row: any) => {
			return row.publishTime ? row.publishTime : ""
		},
	},
	{
		key: "intro",
		label: "摘要",
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

const stringToArray = (input: any) => {
	if (!input) return []
	// 使用正则表达式匹配英文逗号和中文逗号，并将其替换为统一的分隔符
	return input.split(/,|，/)
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
<style lang="scss">
.key-tag {
	margin-right: 5px;
}
</style>
