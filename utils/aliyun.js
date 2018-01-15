const OSS = require('ali-oss')
const aliyunConfig = require('../deploy-config/aliyun.config')

module.exports = new OSS({
  region: aliyunConfig.oss.region,
  bucket: aliyunConfig.oss.bucket,
  accessKeyId: aliyunConfig.accessKey.id,
  accessKeySecret: aliyunConfig.accessKey.secret
})
