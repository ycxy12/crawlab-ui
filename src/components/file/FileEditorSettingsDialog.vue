<template>
  <div class="file-editor-settings-dialog">
    <el-dialog
      :model-value="visible"
      :title="t('components.file.editor.settings.title')"
      @close="onClose"
    >
      <el-form
        label-width="var(--cl-file-editor-settings-dialog-label-width)"
        class="form"
      >
        <el-form-item
          :label="t('components.file.editor.settings.form.theme')"
        >
          <el-select
            v-model="options.theme"
          >
            <el-option
              v-for="(op, $index) in themeOptions"
              :key="$index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button plain type="info" @click="onClose">{{ t('common.actions.cancel') }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ t('common.actions.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeMount, ref} from 'vue';
import {useStore} from 'vuex';
import {plainClone} from '@/utils/object';
import {onBeforeRouteLeave} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {sendEvent} from '@/admin/umeng';

export default defineComponent({
  name: 'FileEditorSettingsDialog',
  setup() {
    const {t} = useI18n();

    const storeNamespace = 'file';
    const store = useStore();
    const {file} = store.state as RootStoreState;

    const visible = computed<boolean>(() => {
      const {editorSettingsDialogVisible} = file;
      return editorSettingsDialogVisible;
    });

    const themeOptions = computed<SelectOption[]>(() => {
      return [
        {value: 'vs', label: 'Visual Studio'},
        {value: 'vs-dark', label: 'Visual Studio Dark'},
        {value: 'hc-black', label: 'High Contrast Black'},
      ];
    });

    const options = ref<FileEditorOptions>(plainClone(file.editorOptions));

    const resetOptions = () => {
      options.value = plainClone(file.editorOptions);
    };

    const onClose = () => {
      store.commit(`${storeNamespace}/setEditorSettingsDialogVisible`, false);
      resetOptions();

      sendEvent('click_file_editor_settings_dialog_close');
    };

    const onConfirm = () => {
      store.commit(`${storeNamespace}/setEditorOptions`, options.value);
      store.commit(`${storeNamespace}/setEditorSettingsDialogVisible`, false);
      resetOptions();

      sendEvent('click_file_editor_settings_dialog_confirm');
    };

    onBeforeMount(() => {
      resetOptions();
    });

    onBeforeRouteLeave(() => {
      store.commit(`${storeNamespace}/setEditorSettingsDialogVisible`, false);
    });

    return {
      options,
      visible,
      themeOptions,
      onClose,
      onConfirm,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.file-editor-settings-dialog {
  .nav-menu {
    .el-menu-item {
      height: 40px;
      line-height: 40px;
    }
  }

  .form {
    margin: 20px;
  }
}
</style>

<style scoped>
.file-editor-settings-dialog >>> .el-dialog .el-dialog__body {
  padding: 10px 20px;
}

.file-editor-settings-dialog >>> .el-form-item > .el-form-item__label .icon {
  cursor: pointer;
}

.file-editor-settings-dialog >>> .el-form-item > .el-form-item__content {
  width: 240px;
}

.file-editor-settings-dialog >>> .el-form-item > .el-form-item__content .el-input,
.file-editor-settings-dialog >>> .el-form-item > .el-form-item__content .el-select {
  width: 100%;
}
</style>
<style>
.help-tooltip {
  max-width: 240px;
}
</style>
