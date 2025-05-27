<template>
	<el-dialog v-model="dialogVisible" title="详情" top="15vh" width="80vw" :before-close="handleClose">
		<div>
			<div v-if="articleInfo" v-loading="loading" element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
				<h3>{{ articleInfo.title }}</h3>
				<div class="sub_title">
					<span>{{ articleInfo.publishTime }}</span>
					<span>{{ articleInfo.source }}</span>
				</div>
				<div class="tags">
					<el-tag v-for="(element, index) in parseString(articleInfo.keywords)" :key="index" type="primary">{{
						element }}</el-tag>
				</div>
				<!-- <p v-html="articleInfo.content"></p> -->
				<div class="content_info">
					<template v-if="hasNewlines">
						<p v-for="(paragraph, index) in processedParagraphs" :key="index" class="paragraph"
							v-html="paragraph"></p>
					</template>
					<template v-else>
						<p v-html="articleInfo.content"></p>
					</template>
				</div>
				<div class="cover">
					<img v-if="articleInfo.cover" :src="articleInfo.cover" alt="" />
				</div>
				<div class="images" v-if="articleInfo.images && articleInfo.images.length > 0">
					<img :src="articleInfo.images[activeImage].url" alt="" class="first" />
					<div>
						<div>
							<img v-for="(image, index) in articleInfo.images" :key="index" :src="image.url" alt=""
								:class="{ active: activeImage === index }" @click="handleImageClick(index)" />
						</div>
					</div>
				</div>
				<div class="files" v-if="articleInfo.files && articleInfo.files.length > 0">
					<div class="summary">文件列表</div>
					<div class="file_list">
						<div class="file_item" v-for="(file, index) in articleInfo.files" :key="index">
							<span>{{ file.filename }}</span>
							<a :href="file.url" :download="file.filename" target="_blank">下载</a>
							<!-- <em class="download" @click="handleDownload(file)">下载</em> -->
						</div>
					</div>
				</div>
				<div class="summary">词云</div>
				<div class="info-con">
					<div ref="chartContainer" style="width: 100%; height: 500px"></div>
				</div>
				<a v-if="articleInfo.url" :href="articleInfo.url" target="_blank" class="original">查看原文</a>
			</div>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue"
import * as echarts from "echarts"
import "echarts-wordcloud"
import useCollectionService from "@/services/collection/collectionService"

const { getCollectionResult, getWordFrequency } = useCollectionService()

const dialogVisible = ref(false)
const loading = ref(false)
const articleInfo = ref<any>(null)
const chartContainer = ref<any>(null) // 图表容器引用
let chart: any = null // ECharts 实例
const wordData = ref<any>([])

//打开弹框
const openDialog = async (id: any) => {
	if (id) {
		loading.value = true
		await getCollectionResult(id).then((res: any) => {
			articleInfo.value = res.data
		})
		await getWordFrequency(id).then((res: any) => {
			const data = res.data
			if (data) {
				wordData.value = Object.keys(data).map((key) => ({
					name: key,
					value: data[key],
				}))
			} else {
				wordData.value = []
			}
		})
	}
	loading.value = false
	dialogVisible.value = true
	await nextTick()
	chart = echarts.init(chartContainer.value)
	initChart()
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
	activeImage.value = 0
}

// 判断是否存在有效换行
const hasNewlines = computed(() => {
	return /\n/.test(articleInfo.value.content)
})

const processedParagraphs = computed(() => {
	return articleInfo.value.content.split("\n").filter((p: any) => p.trim() !== "")
})


const parseString = (input: any) => {
	if (!input) return []
	// 使用正则表达式匹配英文逗号和中文逗号，并将其替换为统一的分隔符
	return input.split(/[,，]\s*/) // 匹配英文逗号 (`,`) 或中文逗号 (`，`)，并去除可能的空格
}

const activeImage = ref<number>(0)
const handleImageClick = (index: number) => {
	activeImage.value = index
}

// 初始化图表配置
const initChart = () => {
	const options = {
		tooltip: {},
		title: {
			text: "暂无数据",
			left: "center",
			top: "center",
			textStyle: {
				fontSize: 20,
				color: "#999",
			},
			show: !wordData.value || wordData.value.length === 0, // 根据数据是否为空显示
		},
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

// 下载文件
const handleDownload = async (file: any) => {
	try {
		const response = await fetch(file.url, {
			mode: 'cors'
		});
		const blob = await response.blob();
		const downloadUrl = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = downloadUrl;
		a.download = file.filename; // 下载保存的文件名
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(downloadUrl);
	} catch (error) {
		console.error('下载失败:', error);
	}

}

defineExpose({ openDialog })
</script>

<style lang="scss">
h3 {
	color: #333;
	font-size: 20px;
	margin-top: 20px;
	text-align: center;
	font-weight: 500;
}

.sub_title {
	display: flex;
	justify-content: center;
	margin: 30px 0 20px;
	color: #333;

	span {
		padding-right: 15px;
	}

	span:last-child {
		padding-right: 0;
	}
}

.tags {
	text-align: center;
	margin-bottom: 20px;

	&>span {
		margin-right: 10px;
	}
}

p {
	margin: 10px 0;
	color: #333;
	text-indent: 2em;
	line-height: 28px;
	font-size: 16px;
	margin: 0 40px;

	::v-deep img {
		width: calc(100% - 4em);
	}
}

.cover {
	width: 100%;
	text-align: center;
	margin-bottom: 50px;

	img {
		width: 60%;
	}
}

.images {
	text-align: center;

	.first {
		width: 50%;
		margin-bottom: 10px
	}

	&>div {
		width: 100%;
		overflow-x: auto;

		&>div {
			display: inline-flex;
			justify-content: center;
			align-items: center;
		}

		img {
			flex-shrink: 0;
			width: 100px;
			height: 100px;
			margin-right: 10px;
			border: 1px solid #a2a9b1;
			cursor: pointer;
		}

		img:last-child {
			margin-right: 0;
		}

		.active {
			border: 1px solid #409eff;
		}
	}
}

.original {
	position: absolute;
	right: 80px;
	top: 158px;
	color: #409eff;
	font-size: 14px;
	text-decoration: underline;
}

.files {
	.file_list {
		padding: 12px;
		border: 1px solid #ebeef5;
		border-radius: 4px;
		width: calc(100% - 80px);
		margin: 0 40px;
	}

	.file_item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 32px;
	}

	a {
		color: #409eff;
		text-decoration: underline;
	}
}

.summary {
	margin-left: 40px;
	margin-top: 20px;
	margin-bottom: 10px;
	font-size: 16px;
	font-weight: 600;
	color: #333;
}

.info-con {
	padding: 12px;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	width: calc(100% - 80px);
	margin: 0 40px;
}
</style>
