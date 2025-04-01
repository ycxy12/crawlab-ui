<template>
	<el-dialog v-model="dialogVisible" title="详情" top="15vh" width="80vw" :before-close="handleClose">
		<div class="wiki_dialog">
			<h3 @click="handleTitleClick">{{ form.title }}</h3>
			<div class="wiki_content">
				<div ref="rightRef" class="right" v-if="form.contentInfo && form.contentInfo.infoboxTable && form.contentInfo.infoboxTable.length > 0">
					<div class="infobox">
            <template v-for="(item, index) in form.contentInfo.infoboxTable" :key="index">
              <div class="info_title" v-if="item&&item.length===1">{{ item[0] }}</div>
              <img v-if="index===0&&form.images&&form.images.length>0" :src="form.images[0].url" alt="">
              <div class="info_content" v-if="item&&item.length>1">
                <p v-html="item[0].replace(/\n/g, '<br/>')"></p>
                <!-- 遇到 /n 换行 -->
                <div v-html="item[1].replace(/\n/g, '<br/>')"></div>
              </div>
            </template>
          </div>
				</div>
				<div ref="leftRef" class="left">
					<!-- 描述 -->
					<div class="desc" v-if="form.contentInfo && form.contentInfo.segment && form.contentInfo.segment.text && form.contentInfo.segment.text.length > 0">
						<p v-for="item in form.contentInfo.segment.text" :key="item.index">{{ item }}</p>
					</div>
					<!-- 段落 -->
					<div class="segment" v-if="form.contentInfo && form.contentInfo.segment && form.contentInfo.segment.children && form.contentInfo.segment.children.length > 0">
						<template v-for="(item, index) in form.contentInfo.segment.children" :key="index">
							<h4>{{ item.title }}</h4>
							<p v-for="cell in item.text" :key="cell">{{ cell }}</p>
							<div v-if="item.children">
								<template v-for="(child, idx) in item.children" :key="idx">
									<h4>{{ child.title }}</h4>
									<p v-for="element in child.text" :key="element">{{ element }}</p>
								</template>
							</div>
						</template>
					</div>
					<!-- 参考文献 -->
					<div class="references">
						<div class="reference_list">
							<div class="reference_item" v-for="item in form.references" :key="item.index">
								<span>{{ item.index }}. </span>
								<a :href="item.url" target="_blank">{{ item.text }}</a>
							</div>
						</div>
					</div>
					<!-- 分类 -->
					<div class="categories">
						<span>分类：</span>
						<em v-for="item in form.categories" :key="item">{{ item }}</em>
					</div>
				</div>
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
import { ref, nextTick, watch } from "vue"
import useAnalysisService from "@/services/analysis/analysisService"

const { getWiki } = useAnalysisService()

const dialogVisible = ref(false)
const loading = ref(false)
const form = ref<any>({})
const rightRef = ref<HTMLElement | null>(null)
const leftRef = ref<HTMLElement | null>(null)

// 调整左侧区域的最小高度
const adjustLeftHeight = () => {
  nextTick(() => {
    if (rightRef.value && leftRef.value && form.value.contentInfo?.infoboxTable?.length > 0) {
      const rightHeight = rightRef.value.offsetHeight
      leftRef.value.style.minHeight = `${rightHeight}px`
      console.log('右侧高度:', rightHeight, '设置左侧最小高度')
    }
  })
}

// 监听数据变化
watch(() => form.value.contentInfo, () => {
  adjustLeftHeight()
}, { deep: true })

// 监听对话框显示状态
watch(dialogVisible, (newVal) => {
  if (newVal) {
    // 对话框显示时，等待内容渲染后再调整高度
    nextTick(() => {
      adjustLeftHeight()
    })
  }
})

//打开弹框
const openDialog = (id: any) => {
	if (id) {
		getWiki(id).then((res: any) => {
			form.value = res.data
      nextTick(() => {
        adjustLeftHeight()
      })
		})
	}
	dialogVisible.value = true
}

//点击标题
const handleTitleClick = () => {
	window.open(form.value.url, "_blank")
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
}

defineExpose({ openDialog })
</script>

<style lang="scss">
.wiki_dialog {
	h3 {
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 20px;
		border-bottom: 1px solid #a2a9b1;
		padding-bottom: 10px;
    text-align: left;
		&:hover {
			color: #3056a9;
			cursor: pointer;
		}
	}
	.wiki_content {
		position: relative;
    overflow: hidden; /* 创建BFC以处理浮动元素 */
		h4 {
			font-size: 20px;
			font-weight: bold;
			border-bottom: 1px solid #a2a9b1;
			padding-bottom: 10px;
		}
		.left {
			/* 将会由JavaScript动态设置min-height */
			.desc {
				font-size: 16px;
				line-height: 24px;
				margin-bottom: 20px;
			}
			.segment {
				font-size: 16px;
				line-height: 24px;
				margin-bottom: 20px;
			}
			.references {
				font-size: 16px;
				line-height: 24px;
				margin-bottom: 20px;
				a {
					color: #3056a9;
				}
			}
			.categories {
				font-size: 16px;
				color: #3056a9;
				border: 1px solid #a2a9b1;
				background: #f8f9fa;
				padding: 5px;
				width: max-content;
				em {
					font-style: normal;
					&:not(:last-child) {
						margin-right: 10px;
						&::after {
							content: "|";
							margin-left: 10px;
						}
					}
				}
			}
			.reference_item {
				display: flex;
				margin-bottom: 10px;
				a {
					color: #3056a9;
					cursor: pointer;
				}
			}
		}
		.right {
			width: 350px;
			background: #fff;
			float: right;
			clear: right;
      margin-left: 15px;
      margin-bottom: 15px;

			.infobox {
				margin-left: 15px;
				margin-top: 10px;
				margin-bottom: 10px;
				padding: 5px;
				border: 1px solid #a2a9b1;
				border-spacing: 3px;
				background-color: #f8f9fa;
        .info_title{
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 10px;
          background: #eee;
          line-height: 30px;
          text-align: center;
        }
        img{
          width: 100%;
        }
        .info_content{
          display: flex;
          p{
            line-height: 30px;
            width: 100px;
            margin: 0;
            font-weight: bold;
            flex-shrink: 0;
            margin-right: 10px;
          }
          div{
            line-height: 30px;
          }
        }
			}
		}
	}
}
</style>
