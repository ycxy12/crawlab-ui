import '@/utils/editor';

declare global {
  interface FileNavItem {
    id?: string;
    is_dir?: boolean;
    path?: string;
    name?: string;
    extension?: string;
    children?: FileNavItem[];
  }

  interface FileEditorStyle {
    backgroundColor?: string;
    color?: string;
  }

  interface FileEditorStyles {
    default: FileEditorStyle;
    active: FileEditorStyle;
  }

  interface FileEditorOptions {
    theme: 'vs' | 'vs-dark' | 'hc-black';
  }

  type FileEditorOptionDefinitionType = 'select' | 'input-number' | 'switch';

  interface FileEditorOptionDefinitionData {
    options?: string[];
    min?: number;
    step?: number;
  }

  interface FileEditorOptionDefinition {
    name: string;
    title: string;
    description: string;
    type: FileEditorOptionDefinitionType;
    data?: FileEditorOptionDefinitionData;
  }
}
