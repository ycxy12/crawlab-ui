<template>
	<el-dialog v-model="dialogVisible" title="详情" top="15vh" width="80vw" :before-close="handleClose">
		<div class="analysis">
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
			<div class="tags">
				<el-tag v-for="(element, index) in parseString(articleInfo.keywords)" :key="index" type="primary">{{ element }}</el-tag>
			</div>
			<p v-html="articleInfo.content"></p>
			<div class="cover">
				<img v-if="articleInfo.cover" :src="articleInfo.cover" alt="" />
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
import { ref, onMounted, onUnmounted } from "vue"
import useCleanService from "@/services/clean/cleanService"

const { getSubjectArticle } = useCleanService()

const dialogVisible = ref(false)
const loading = ref(false)
const articleInfo = ref<any>(null)

//打开弹框
const openDialog = (id: any) => {
	if (id) {
		getSubjectArticle(id).then((res: any) => {
			articleInfo.value = res.data
		})
	}
	dialogVisible.value = true
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
}

const parseString = (input:any) => {
			if (!input) return []
			// 使用正则表达式匹配英文逗号和中文逗号，并将其替换为统一的分隔符
			return input.split(/[,，]\s*/) // 匹配英文逗号 (`,`) 或中文逗号 (`，`)，并去除可能的空格
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
    &>span{
      margin-right: 10px;
    }
		// button {
		// 	font-size: 12px;
		// 	border-radius: 4px;
		// 	padding: 4px 10px;
		// 	color: #409eff;
		// 	background: rgba(0, 84, 251, 0.2);
		// 	border: 1px solid #70a0ff;
		// 	margin-right: 15px;
		// }
	}
	p {
		margin: 10px 0;
		color: #333;
		text-indent: 2em;
		line-height: 28px;
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
</style>
