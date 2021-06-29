module.exports = {
  files: [
    {
      from: './dist',
      to: '.'
    }
  ],
  ignore: [],
  noCache: [],
  lastUpload: [],
  environments: {
    production: {
      type: 'aliyun',
      region: '',
      bucket: '',
      accessKeyId: '',
      accessKeySecret: '',
    },
    test: {
      type: 'qiniu ',
      region: '',
      bucket: '',
      accessKey: '',
      secretKey: '',
    },
    development: {
      type: 'tencent',
      region: '',
      bucket: '',
      appId: '',
      secretId: '',
      secretKey: '',
    }
  }
}
