module.exports = {
  type: 'aliyun',
  deploy: {
    dirs: ['./src'], // 上传以下文件夹里面的内容，如：./dist，`->` 重命名文件夹
    files: [] // 上传以下文件，如：index.html，`->` 重命名文件
  },
  noCache: {
    fileSuffix: ['html'], // 文件类型
    fileName: ['service-worker.js'] // 文件名称
  },
  lastUpload: {
    fileSuffix: ['html'], // 文件类型
    fileName: [] // 文件名称
  }
}
