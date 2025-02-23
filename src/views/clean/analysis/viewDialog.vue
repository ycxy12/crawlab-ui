<template>
	<el-dialog v-model="dialogVisible" title="数据分析详情" top="15vh" width="80vw" :before-close="handleClose">
		<div class="analysis">
      <div>
        <span class="analysis_label">简介：</span>
        <p>{{ form.intro }}</p>
      </div>
      <div>
        <span class="analysis_label">要素信息：</span>
        <div class="info-container">
          <div class="info-row" v-for="item in getData(form.elementInfo)" :key="item.label">
            <span class="info-label">{{ categoryLabels[item.label] }}:</span>
            <div class="info-content">
              <el-tag v-for="(cell,index) in item.value" :key="index" :type="categoryColorMap[item.label]" size="small" class="info-tag">{{ cell }}</el-tag>
            </div>
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
import { ref, onMounted, onUnmounted } from "vue"
import useAnalysisService from "@/services/analysis/analysisService"

const { getAnalysisResult } = useAnalysisService()

const dialogVisible = ref(false)
const loading = ref(false)
const form = ref<any>({
  // intro: "123333",
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
})

//打开弹框
const openDialog = (id: any) => {
	if (id) {
		getAnalysisResult(id).then((res: any) => {
      form.value = res.data
		})
	}
	dialogVisible.value = true
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
}

const getData = (elementInfo:any)=>{
  return Object.entries(elementInfo).filter(([key, value]:any) => value?.length > 0).map(([key, items]: any)=>{
    return {
      label:key,
      value:elementInfo[key]
    }
})
}

// 分类颜色映射
const categoryColorMap: Record<string, string> = {
	 // 基础信息类
   Country: 'primary',   // 蓝色（国家）
  Job: 'success',       // 绿色（职位）
  Location: 'warning',  // 橙色（地点）
  People: 'danger',     // 红色（人物）
  Time: 'magenta',      // 品红（时间，自定义）

  // 军事信息类
  Troops: 'purple',     // 紫色（部队）
  ZB_Army: '#2c6e49',  // 陆军装备-深绿（自定义）
  ZB_Firearms: '#d4a017', // 轻武器-金色（自定义）
  ZB_Plane: '#0e7490', // 飞机-深青（自定义）
  ZB_Ship: '#1e3a8a',  // 舰船-海军蓝（自定义）
  ZB_other: '#4b5563', // 其他装备-灰（自定义）

  // 空分类（低优先级）
  O: 'default',         // 默认灰色（其他）
  Org: 'info'           // 青色（组织）
}
const categoryLabels: any = {
	Country: "国家",
	Job: "职位",
	Location: "地点",
	O: "其他",
	Org: "组织",
	People: "人物",
	Time: "时间",
	Troops: "部队",
	ZB_Army: "陆军装备",
	ZB_Firearms: "轻武器",
	ZB_Plane: "飞机",
	ZB_Ship: "舰船",
	ZB_other: "其他装备",
}


defineExpose({ openDialog })
</script>

<style lang="scss">
.analysis{
  .analysis_label{
    font-weight: bold;
    padding-right: 20px;
    text-align: right;
    width: 100px;
  }
  p{
    margin: 0;
  }
  &>div{
    display: flex;
    margin-bottom: 20px;
  }
}
.info-container {
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  width: 100%;
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
</style>
