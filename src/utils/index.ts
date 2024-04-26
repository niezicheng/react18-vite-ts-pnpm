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
        resolve(JSON.parse((reader as any)?.result || ''));
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