<template>
	<el-dialog v-model="dialogVisible" title="详情" top="15vh" width="80vw" :before-close="handleClose">
		<div>
			<div
				v-if="articleInfo"
				v-loading="loading"
				element-loading-text="拼命加载中"
				element-loading-spinner="el-icon-loading"
				element-loading-background="rgba(0, 0, 0, 0.5)"
			>
				<h3>{{ articleInfo.title }}</h3>
				<div class="sub_title">
					<span>{{ articleInfo.releaseTime }}</span>
					<span>{{ articleInfo.source }}</span>
				</div>
				<div class="summary">摘要：</div>
				<div class="info-conent">
					<p>{{ articleInfo.intro }}</p>
				</div>
				<div class="summary comparison">
					<span>正文：</span>
					<div>
						<span>原文比对</span>
						<el-switch v-model="comparison" @change="handleComparison" />
					</div>
				</div>
				<div class="info-conent">
          <div class="example" v-if="comparison">
            <span>示例：</span>
            <i class="ws">文本分词</i>
            <i class="sw">停用词去除</i>
            <i class="cm">大小写转换</i>
            <i class="cnm">字符编码转换</i>
          </div>
					<div class="content_info">
						<template v-if="hasNewlines">
							<p v-for="(paragraph, index) in processedParagraphs" :key="index" class="paragraph" v-html="paragraph"></p>
						</template>
						<template v-else>
							<p v-html="articleInfo.content"></p>
						</template>
					</div>
					<div class="cover" v-if="articleInfo.cover">
						<img :src="articleInfo.cover" alt="" />
					</div>
          <div class="images" v-if="articleInfo.images && articleInfo.images.length > 0">
            <img  :src="articleInfo.images[activeImage].url" alt="" class="first" />
            <div>
              <div>
                <img v-for="(image, index) in articleInfo.images" :key="index" :src="image.url" alt="" :class="{active: activeImage === index}" @click="handleImageClick(index)" />
              </div>
            </div>
          </div>
				</div>

				<div class="summary">要素信息：</div>
				<div class="info-conent">
					<div class="info-row" v-for="item in getData(articleInfo.elementInfo)" :key="item.label">
						<span class="info-label">{{ categoryLabels[item.label] }}:</span>
						<div class="info-content">
							<el-tag
								v-for="(cell, index) in item.value"
								:key="index"
								:type="categoryColorMap[item.label]"
								size="small"
								class="info-tag"
								>{{ cell }}</el-tag
							>
						</div>
					</div>
				</div>
				<!-- <div class="summary">词云</div>
				<div class="info-conent">
					<div ref="chartContainer" style="width: 100%; height: 500px"></div>
				</div> -->
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
import { ref, onMounted, computed, onUnmounted, nextTick } from "vue"
import useCleanService from "@/services/clean/cleanService"
import * as echarts from "echarts"
import "echarts-wordcloud"
import useCollectionService from "@/services/collection/collectionService"

const { getSubjectArticle } = useCleanService()
const { getWordFrequency, getCollectionResult } = useCollectionService()

const dialogVisible = ref(false)
const loading = ref(false)
const articleInfo = ref<any>(null)
const chartContainer = ref<any>(null) // 图表容器引用
let chart: any = null // ECharts 实例
const wordData = ref<any>([])
const comparison = ref(false)
const articleId = ref<any>(null)
//打开弹框
const openDialog = async (id: any) => {
	console.log(id)
	if (id) {
		articleId.value = id
		loading.value = true
		await getSubjectArticle(id).then((res: any) => {
			articleInfo.value = res.data
		})
		// await	getWordFrequency(id).then((res: any) => {
		// 	const data = res.data
		// 	if (data) {
		// 		wordData.value = Object.keys(data).map((key) => ({
		// 			name: key,
		// 			value: data[key],
		// 		}))
		// 	} else {
		// 		wordData.value = []
		// 	}
		// })
	}
	loading.value = false
	dialogVisible.value = true
	// await nextTick()
	// chart = echarts.init(chartContainer.value)
	// initChart()
}

const activeImage = ref<number>(0)
const handleImageClick = (index: number) => {
  activeImage.value = index
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
	comparison.value = false
	articleInfo.value = null
  activeImage.value = 0
}

// 判断是否存在有效换行
const hasNewlines = computed(() => {
	return /\n/.test(articleInfo.value.content)
})

const processedParagraphs = computed(() => {
	return articleInfo.value.content.split("\n").filter((p: any) => p.trim() !== "")
})

// 原文比对
const handleComparison = () => {
	console.log(comparison.value)
	if (comparison.value) {
		getCollectionResult(articleInfo.value.collectionResultId).then((res: any) => {
			if (res.data && res.data.content) {
				// 获取原始内容
				let content = res.data.content

        // 处理大小写转换
				if (articleInfo.value.clearStep.caseMap) {
				  Object.entries(articleInfo.value.clearStep.caseMap).forEach(([key, value]: [string, any]) => {
				    if(key && key.length > 0){
				      const regex = new RegExp(key, 'g')
				      content = content.replace(regex, `<i class="cm" title="原文: ${key}">${value}</i>`)
				    }
				  })
				}

				// 处理字符编码转换
				if (articleInfo.value.clearStep.chartEncodingMap) {
				  Object.entries(articleInfo.value.clearStep.chartEncodingMap).forEach(([key, value]: [string, any]) => {
				    if(key && key.length > 0){
				      const regex = new RegExp(key, 'g')
				      content = content.replace(regex, `<i class="cnm" title="原文: ${key}">${value}</i>`)
				    }
				  })
				}

				// 处理分词高亮 - 先去重
				if (articleInfo.value.clearStep.wordSegmentations && articleInfo.value.clearStep.wordSegmentations.length > 0) {
					// 对数组进行去重
					const uniqueWordSegmentations = [...new Set(articleInfo.value.clearStep.wordSegmentations)]
					const excludeWords = [
						"，",
						"。",
						"、",
						"；",
						"：",
						"！",
						"？",
						" ",
						".",
						"/",
						'"',
						"(",
						")",
						"+",
						"-",
						"...",
						"...",
						"^",
						"$",
						".",
						"*",
						"?",
						"`",
						"{",
						"}",
						"[",
						"]",
						"i",
						"a",
						"as",
					]
					// 使用去重后的数组处理高亮
					uniqueWordSegmentations.forEach((word: any) => {
						if (word && word.length > 0 && !excludeWords.includes(word)) {
							console.log(word)
							const regex = new RegExp(word, "g")
							content = content.replace(regex, `<i class="ws">${word}</i>`)
						}
					})
				}

				// 处理停用词高亮
				if (articleInfo.value.clearStep.stopWords && articleInfo.value.clearStep.stopWords.length > 0) {
					// 对数组进行去重
					const uniqueStopWords = [...new Set(articleInfo.value.clearStep.stopWords)]
					const excludeWords = [
						"，",
						"。",
						"、",
						"；",
						"：",
						"！",
						"？",
						" ",
						".",
						"/",
						'"',
						"(",
						")",
						"+",
						"-",
						"...",
						"^",
						"$",
						".",
						"*",
						"?",
						"`",
						"{",
						"}",
						"[",
						"]",
						"i",
						"a",
						"as",
					]

					uniqueStopWords.forEach((word: any) => {
						if (word && word.length > 0 && !excludeWords.includes(word)) {
							const regex = new RegExp(word, "g")
							content = content.replace(regex, `<i class="sw">${word}</i>`)
						}
					})
				}

				// 更新文章内容
				articleInfo.value.content = content
				console.log(articleInfo.value.content)
			}
		})
	} else {
		// 恢复原始内容，不显示比对高亮
		getSubjectArticle(articleInfo.value.id).then((res: any) => {
			articleInfo.value.content = res.data.content
			console.log(articleInfo.value.content)
		})
	}
}

const getData = (elementInfo: any) => {
	if (!elementInfo) return []
	return Object.entries(elementInfo)
		.filter(([key, value]: any) => value?.length > 0)
		.map(([key, items]: any) => {
			return {
				label: key,
				value: elementInfo[key],
			}
		})
}
// 分类颜色映射
const categoryColorMap: Record<string, string> = {
	// 基础信息类
	country: "primary", // 蓝色（国家）
	job: "success", // 绿色（职位）
	location: "warning", // 橙色（地点）
	people: "danger", // 红色（人物）
	time: "warning", // 品红（时间，自定义）

	// 军事信息类
	troops: "danger", // 紫色（部队）
	zb_Army: "primary", // 陆军装备-深绿（自定义）
	zb_Firearms: "success", // 轻武器-金色（自定义）
	zb_Plane: "warning", // 飞机-深青（自定义）
	zb_Ship: "danger", // 舰船-海军蓝（自定义）
	zb_other: "success", // 其他装备-灰（自定义）

	// 空分类（低优先级）
	o: "info", // 默认灰色（其他）
	org: "info", // 青色（组织）
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
	& > span {
		margin-right: 10px;
	}
}
p {
	// margin: 10px 0;
	color: #333;
	text-indent: 2em;
	line-height: 28px;
	font-size: 16px;
	margin: 0;
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
.images{
  text-align: center;
  .first{
    width: 50%;
    margin-bottom:10px
  }
  &>div{
    width: 100%;
    overflow-x: auto;
    &>div{
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    img{
      width: 100px;
      height: 100px;
      margin-right: 10px;
      border: 1px solid #a2a9b1;
      cursor: pointer;
    }
    .active{
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
.clean-result {
	right: 160px;
	cursor: pointer;
}
.content_info {
	.paragraph {
		margin-bottom: 1.5em; /* 调整这个值改变间距 */
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
.comparison {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-right: 40px;
	div span {
		font-size: 14px;
		font-weight: 500;
		padding-right: 10px;
		color: #333;
	}
}

.info-conent {
	padding: 12px;
	border: 1px solid #ebeef5;
	border-radius: 4px;
	width: calc(100% - 80px);
	margin: 0 40px;
  .example{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 10px;
    span{
      font-weight: 500;
      color: #333;
      line-height: 26px;
    }
    i{
      padding: 5px 10px;

    }
  }
}

.info-row {
	display: flex;
	align-items: flex-start;
	margin-bottom: 8px;
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

/* 原文比对样式 */
.ws {
	color: #409eff;
	background-color: #e6f7ff;
	margin: 0 2px;
	padding: 0 5px;
	text-indent: 0;
	border-radius: 5px;
	display: inline-block;
	font-style: normal;
}

.sw {
	color: #f56c6c;
	background-color: rgb(254, 240.3, 240.3);
	margin: 0 2px;
	padding: 0 5px;
	text-indent: 0;
	border-radius: 5px;
	display: inline-block;
	text-decoration: line-through;
	font-style: normal;
}

.cm {
  color: #52c41a;
	background-color: #f6ffed;;
	margin: 0 2px;
	padding: 0 5px;
	text-indent: 0;
	border-radius: 5px;
	display: inline-block;
	font-style: normal;
}

.cnm {
  color: #eb2f96;
	background-color: #fff0f6;
	margin: 0 2px;
	padding: 0 5px;
	text-indent: 0;
	border-radius: 5px;
	display: inline-block;
	font-style: normal;
}
</style>
