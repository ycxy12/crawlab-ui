<template>
	<div class="list-layout">
		<div class="content">
			<!-- <cl-nav-actions  class="nav-actions">
            <cl-nav-action-group>
              <cl-nav-action-item>
                <cl-nav-action-button v-auth="ACTION_ADD" button-type="label" label="添加清洗文章" tooltip="添加清洗文章" type="success" :icon="icon" @click="onAdd" />
              </cl-nav-action-item>
              <cl-nav-action-item>
                <cl-filter-input placeholder="请输入标题" @change="onChange" />
              </cl-nav-action-item>
            </cl-nav-action-group>
          </cl-nav-actions> -->
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
		<viewDialog ref="viewDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ElTag } from "element-plus"
import { ElMessageBox } from "element-plus"
import { ref, onMounted, reactive, computed, h } from "vue"
import useAnalysisService from "@/services/analysis/analysisService"
import { TABLE_COLUMN_NAME_ACTIONS } from "@/constants"
import viewDialog from './viewDialog.vue';

const { listAnalysisResult, deleteAnalysisResult } = useAnalysisService()

const viewDialogRef = ref<any>(null)

//列表
const tableData = ref<any>([])

const tableTotal = ref(0)
const tablePagination = reactive({
	page: 1,
	size: 10,
})
const getList = async () => {
	const res = await listAnalysisResult({ page: tablePagination.page, size: tablePagination.size, title: title.value })
	tableData.value = res.data.records
	// tableData.value = [{
  //   intro: "123333",
	// 		elementInfo: {
	// 			Country: ["菲律宾", "中国"],
	// 			Job: ["新闻发言人", "大校"],
	// 			Location: ["南部战区", "南沙岛礁", "黄岩岛", "南海"],
	// 			O: [],
	// 			Org: [],
	// 			People: ["田军里"],
	// 			Time: ["2月20日", "2月18日", "218秒"],
	// 			Troops: ["空军", "中国人民解放军"],
	// 			ZB_Army: [],
	// 			ZB_Firearms: [],
	// 			ZB_Plane: ["C-208型机", "N-22型机"],
	// 			ZB_Ship: [],
	// 			ZB_other: [],
	// 		},
  // }]
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

// 分类颜色映射
const categoryColorMap: Record<string, string> = {
	 // 基础信息类
  country: 'primary',   // 蓝色（国家）
  job: 'success',       // 绿色（职位）
  location: 'warning',  // 橙色（地点）
  people: 'danger',     // 红色（人物）
  time: 'magenta',      // 品红（时间，自定义）

  // 军事信息类
  troops: 'purple',     // 紫色（部队）
  zb_Army: '#2c6e49',  // 陆军装备-深绿（自定义）
  zb_Firearms: '#d4a017', // 轻武器-金色（自定义）
  zb_Plane: '#0e7490', // 飞机-深青（自定义）
  zb_Ship: '#1e3a8a',  // 舰船-海军蓝（自定义）
  zb_other: '#4b5563', // 其他装备-灰（自定义）

  // 空分类（低优先级）
  o: 'default',         // 默认灰色（其他）
  org: 'info'           // 青色（组织）
}
const categoryLabels: any = {
	country: "国家",
	job: "职位",
	location: "地点",
	o: "其他",
	org: "组织",
	people: "人物",
	time: "时间",
	troops: "部队",
	zb_Army: "陆军装备",
	zb_Firearms: "轻武器",
	zb_Plane: "飞机",
	zb_Ship: "舰船",
	zb_other: "其他装备",
}

const tableColumns = computed<TableColumns<Environment>>(() => [
  {
		key: "collectionResulTitle",
		label: "采集结果标题",
		width: "300",
	},
	{
		key: "intro",
		label: "简介",
		width: "500",
	},
	{
		key: "elementInfo",
		label: "要素信息",
		width: "auto",
		value: (row: any) =>
			h(
				"div",
				{ class: "info-container" },
				Object.entries(row.elementInfo)
					.filter(([key, value]:any) => value.length > 0)
					.map(([key, items]: any) => {
						const label = categoryLabels[key] || key
						const color = categoryColorMap[key] || "info"

						return h("div", { class: "info-row" }, [
							h("span", { class: "info-label" }, label + ":"), // 分类标签
							h(
								"div",
								{ class: "info-content" },
								items.length > 0
									? items.map((item:any) =>
											h(
												ElTag,
												{
													type: color,
													size: "small",
													class: "info-tag",
												},
												item
											)
									  )
									: h("span", { class: "empty-tag" }, "-") // 空值占位
							),
						])
					})
			),
	},
	{
		key: TABLE_COLUMN_NAME_ACTIONS,
		label: "操作",
		fixed: "right",
		width: "200",
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
			{
				type: "danger",
				size: "small",
				icon: ["fa", "trash-alt"],
				tooltip: "删除",
				onClick: async (row: any) => {
					const res = await ElMessageBox.confirm("您是否确定删除?", "删除", {
						type: "warning",
						confirmButtonClass: "el-button--danger",
					})

					if (res) {
						await deleteAnalysisResult(row.id as string)
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
