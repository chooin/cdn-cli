let config = {
  deploy: {
    dirs: [], // 上传以下文件夹里面的内容，如：./dist，`->` 重命名文件夹
    files: [] // 上传以下文件，如：index.html，`->` 重命名文件
  },
  OSS: {
    region: '', // OSS 所在的区域，如：oss-cn-hangzhou
    bucket: '' // 填写你在阿里云申请的 Bucket，如：movin-h5
  },
  // 建议使用 AccessKey 子用户
  accessKey: {
    id: '', // 填写阿里云提供的 Access Key ID，如：LTAIR1m312sdawwq
    secret: '' // 填写阿里云提供的 Access Key Secret，如：v96wAI0Gkx2qVcEO2F1V31231
  },
  // 不缓存
  noCache: {
    fileSuffix: ['html'], // 文件类型
    fileName: ['service-worker.js'] // 文件名称
  }
}