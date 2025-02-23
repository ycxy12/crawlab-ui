<template>
	<el-dialog v-model="dialogVisible" title="词频" top="15vh" width="80vw" :before-close="handleClose">
		<div
			ref="chartContainer"
			style="width: 100%; height: 500px"
			v-loading="loading"
			element-loading-text="Loading..."
			:element-loading-spinner="svg"
			element-loading-svg-view-box="-10, -10, 50, 50"
			element-loading-background="rgba(122, 122, 122, 0.8)"
		></div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import * as echarts from "echarts"
import "echarts-wordcloud"
import useCollectionService from "@/services/collection/collectionService"

const { getWordFrequency } = useCollectionService()

const dialogVisible = ref(false)
const chartContainer = ref<any>(null) // 图表容器引用
let chart: any = null // ECharts 实例

// 示例数据
const wordData = ref<any>([])
const loading = ref(false)

//打开弹框
const openDialog = (id: any) => {
	if (id) {
		loading.value = true
		getWordFrequency(id).then((res: any) => {
			const data = res.data
			wordData.value = Object.keys(data).map((key) => ({
				name: key,
				value: data[key],
			}))
			chart = echarts.init(chartContainer.value)
			initChart()
			loading.value = false
		})
	}
	dialogVisible.value = true
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
  wordData.value = []
}

// 初始化图表配置
const initChart = () => {
	const options = {
		tooltip: {},
		series: [
			{
				type: "wordCloud",
				shape: "circle", // 形状，可选 'circle', 'cardioid', 'diamond' 等
				data: wordData.value,
				sizeRange: [20, 80], // 字体大小范围
				rotationRange: [0, 45], // 旋转角度范围
				rotationStep: 45, // 旋转步进角度
				gridSize: 8, // 布局网格大小
				drawOutOfBound: false, // 允许超出画布
				textStyle: {
					color: () =>
						`rgb(${[Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(",")})`, // 随机颜色
				},
				emphasis: {
					focus: "self", // 聚焦效果
					textStyle: {
						fontWeight: "bold",
						textShadowBlur: 10,
						textShadowColor: "#333",
					},
				},
			},
		],
	}
	chart.setOption(options)
}

// 处理窗口缩放
const handleResize = () => {
	chart?.resize()
}

// 组件挂载时初始化
onMounted(() => {
	window.addEventListener("resize", handleResize)
})

// 组件卸载时清理
onUnmounted(() => {
	window.removeEventListener("resize", handleResize)
	chart?.dispose()
})

defineExpose({ openDialog })
</script>

<style lang="scss"></style>
