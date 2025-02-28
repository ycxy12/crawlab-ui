export const getRequestBaseUrl = (): string => {
  return import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000';
};

export const getEmptyResponseWithListData = <T = any>(): ResponseWithListData<T> => {
  return {
    total: 0,
    data: [] as T[],
  } as ResponseWithListData<T>;
};

export const downloadURI = (uri: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  link.click();
};

export const downloadData = (data: string | ArrayBuffer, name: string, type: string) => {
  let blobArr: any[] = [data];
  let options: BlobPropertyBag = {};
  if (type === 'json') {
    blobArr = [JSON.stringify(data)];
  } else if (type === 'csv') {
    const read = new Uint8Array([0xEF, 0xBB, 0xBF]);
    blobArr = [read, data];
    options = {type: 'text/csv;charset=utf-8'};
  }
  const blob = new Blob(blobArr, options);
  const url = window.URL.createObjectURL(blob);
  downloadURI(url, name);
  window.URL.revokeObjectURL(url);
};

/**
 * 下载文件
 * @param {String} path - 文件地址
 * @param {String} name - 文件名,eg: test.png
 */
export const downloadBlob = (response:any, name = null) => {
	const disposition = response.headers["content-disposition"]
	// 获取文件下载头信息
	let fileName = "default-filename"
	// 默认文件名
	if (disposition && disposition.includes("attachment")) {
		// 如果下载头包含附件信息，提取文件名
		const fileNameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
		if (fileNameMatch != null && fileNameMatch[1]) {
			fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ""))
			// 解码并去除引号
		}
	}
	const url = window.URL.createObjectURL(new Blob([response.data]))
	const link = document.createElement("a")
	link.style.display = "none"
	link.href = url
	link.setAttribute("download", name ? name : fileName)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	window.URL.revokeObjectURL(url)
}
