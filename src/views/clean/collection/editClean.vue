<template>
	<el-dialog v-model="dialogVisible" title="创建" top="15vh" width="80vw" :before-close="handleClose">
		<el-form
			ref="ruleFormRef"
			:model="ruleForm"
			:rules="rules"
			label-width="auto"
			class="demo-ruleForm"
			status-icon
		>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标题" prop="title" >
            <el-input v-model="ruleForm.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="关键词" prop="keywords">
            <el-input v-model="ruleForm.keywords" placeholder='请输入关键词' />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="来源" prop="source">
            <el-input v-model="ruleForm.source" placeholder='请输入来源' />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="releaseTime">
            <el-date-picker
              v-model="ruleForm.releaseTime"
              type="datetime"
              placeholder="选择日期时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="简介" prop="intro">
            <el-input v-model="ruleForm.intro"  placeholder='请输入简介' type="textarea"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="正文" prop="content">
            <el-input v-model="ruleForm.content"  placeholder='请输入正文'  type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="封面" prop="cover">
            <el-input v-model="ruleForm.cover" />
          </el-form-item>
        </el-col>
      </el-row>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确认</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue"
import { ElMessage } from 'element-plus'
import useCollectionService from '@/services/collection/collectionService';

const { addCollectionResult, editCollectionResult, getCollectionResult } = useCollectionService();


const dialogVisible = ref(false)

const ruleFormRef = ref<any>()
const ruleForm = reactive<any>({
  title: "",
  keywords: "",
  source: "",
  releaseTime: "",
  intro: "",
  content: "",
  cover: "",
  remark: "",
})


const rules = reactive<any>({
	title: [{ required: true, message: "请输入标题", trigger: "blur" },],
	keywords: [{ required: true, message: "请输入关键词", trigger: "blur" }],
	source: [{ required: true, message: "请输入来源", trigger: "blur" }],
	releaseTime: [{ required: true, message: "请选择日期时间", trigger: "blur" }],
	intro: [{ required: true, message: "请输入简介", trigger: "blur" }],
	content: [{ required: true, message: "请输入正文", trigger: "blur" }],
})

//打开弹框
const openDialog = (id:any) => {
  if (id) {
    getCollectionResult(id).then((res:any) => {
      const data = res.data
      ruleForm.id = data.id
      ruleForm.title = data.title
      ruleForm.keywords = data.keywords
      ruleForm.source = data.source
      ruleForm.releaseTime = data.releaseTime
      ruleForm.intro = data.intro
      ruleForm.content = data.content
      ruleForm.cover = data.cover
      ruleForm.remark = data.remark
    })
  }
	dialogVisible.value = true
}

const emit = defineEmits(['refresh'])
//提交表单
const handleSubmit = () => {
	ruleFormRef.value.validate((valid: any) => {
    if (valid) {
      if (ruleForm.id) {
        editCollectionResult(ruleForm).then(() => {
          ElMessage.success("编辑成功")
          emit("refresh")
          handleClose()
        })
      } else {
        addCollectionResult(ruleForm).then(() => {
          ElMessage.success("添加成功")
          emit("refresh")
          handleClose()
        })
      }
    }
  })
}

//关闭弹窗
const handleClose = () => {
	dialogVisible.value = false
  ruleFormRef.value.resetFields()
}

defineExpose({ openDialog })
</script>

<style lang="scss" scoped></style>
