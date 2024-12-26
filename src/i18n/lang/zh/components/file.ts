const file: LComponentsFile = {
  editor: {
    navTabs: {
      close: '关闭',
      closeOthers: '关闭其他',
      closeAll: '关闭所有',
      showMore: '展示更多',
    },
    navMenu: {
      newFile: '新建文件',
      newFileWithAi: '用 AI 新建文件',
      newDirectory: '新建目录',
      rename: '重命名',
      duplicate: '复制',
      delete: '删除',
    },
    sidebar: {
      search: {
        placeholder: '搜索文件...',
      },
      settings: '设置',
      toggle: {
        showFiles: '展示文件',
        hideFiles: '隐藏文件',
      },
    },
    empty: {
      placeholder: '您可以通过双击左侧文件来编辑或查看文件.'
    },
    messageBox: {
      prompt: {
        newFile: '请输入新建文件名',
        newDirectory: '请输入新建目录名',
        rename: '请输入新名称',
        duplicate: '请输入新名称',
      },
      validator: {
        errorMessage: {
          newNameNotSameAsOldName: '新名称不能跟旧名称相同',
        },
      }
    },
    settings: {
      title: '文件编辑器设置',
      form: {
        theme: '主题'
      },
    },
    createWithAi: {
      title: '用 AI 创建',
      form: {
        fileName: '文件名',
        url: 'URL',
        language: '编程语言',
        framework: '框架',
        prompt: '提示',
      },
    },
  },
  upload: {
    title: '文件上传',
    buttons: {
      files: {
        dragFilesHereOr: '拖拽文件至此，或',
        clickToUpload: '点击上传',
      },
      folder: {
        clickToSelectFolderToUpload: '点击选择目录上传',
      }
    },
    tooltip: {
      folderName: '目录名称',
      filesCount: '文件数',
    },
    mode: {
      folder: '目录',
      files: '文件',
    },
    fileList: {
      title: '带上传文件',
    },
  }
};

export default file;
