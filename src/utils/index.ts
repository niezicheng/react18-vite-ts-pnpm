/**
 * 读取文件
 * @param file
 * @returns
 */
export const readFile = (file: Blob) => {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = function () {
      try {
        resolve(JSON.parse(((reader as unknown as FileReader)?.result as string) || ''));
      } catch {
        resolve('');
      }
    };
  });
};

/**
 * cookie 操作
 */

export const cookie = {
  get: (name: string) => {
    const cookie = document.cookie;
    const cookieArr = cookie.split(';') || [];
    if (!cookieArr.length) return '';
    for (let i = 0; i < cookieArr.length; i++) {
      const arr = cookieArr[i].split('=');
      if (name === arr[0]) {
        return arr[1];
      }
    }
    return '';
  },
  set: (name: string, value: string) => {
    document.cookie = name + '=' + value;
  }
};

/**
 * 因 location.reload(true) 已经废弃，故强制刷新使用 search 部分添加 reload 标识
 */
export const hardReload = () => {
  const url = new URL(window.location.href);
  url.searchParams.set('hardReload', Date.now().toString());
  window.location.href = url.toString();
};

/**
 * 边界错误处理函数
 * @param error
 * @returns
 */
export const errorHandler = (error: Error) => {
  const isHardReload = window.location.href.includes('hardReload=');
  if (!isHardReload && /ChunkLoadError/.test(error.name)) {
    if (window.confirm('当前有新版本已发布，是否强制刷新体验？')) {
      hardReload();
    }
    return;
  }
};
