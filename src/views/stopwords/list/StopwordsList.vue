<template>
  <div class="stopwords-list">
    <input ref="fileInput" type="file" accept=".txt" style="display: none" @change="handleFileSelect" />
    <el-button type="primary" @click="triggerFileSelect">上传</el-button>
    <el-button type="primary" @click="handleDownload">下载</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';
import useStopwordsService from '@/services/stopwords/stopwordsService';

const { downloadStopwords, uploadStopwords } = useStopwordsService();

// 隐藏文件输入
const fileInput = ref<HTMLInputElement | null>(null);

// 上传前的验证
const beforeUpload = (file: File) => {
  const isValidType = file.type === 'text/plain' || file.name.endsWith('.txt');
  if (!isValidType) {
    ElMessage.error('只能上传txt格式的文件!');
    return false;
  }

  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!');
    return false;
  }

  return true;
};

// 触发选择文件
const triggerFileSelect = () => {
  fileInput.value?.click();
};

// 选择文件后立即上传
const handleFileSelect = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files[0];
  if (!file) return;

  if (!beforeUpload(file)) {
    // 重置选择，避免同名文件无法再次选择
    input.value = '';
    return;
  }

  try {
    await uploadStopwords(file);
    ElNotification({
      title: '成功',
      message: '停用词文件上传成功',
      type: 'success',
    });
  } catch (error) {
    console.error('上传失败:', error);
    ElNotification({
      title: '错误',
      message: '停用词文件上传失败',
      type: 'error',
    });
  } finally {
    // 清空输入，保证再次选择同一文件也能触发change
    input.value = '';
  }
};

// 处理下载
const handleDownload = async () => {
  try {
    const response = await downloadStopwords();

    // 创建下载链接
    const blob = new Blob([response.data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stopwords.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElNotification({
      title: '成功',
      message: '停用词文件下载成功',
      type: 'success',
    });
  } catch (error) {
    console.error('下载失败:', error);
    ElNotification({
      title: '错误',
      message: '停用词文件下载失败',
      type: 'error',
    });
  }
};
</script>

<style lang="scss" scoped>
.stopwords-list {

  background-color: #ffffff;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;


}
</style>
