module.exports = {
  rules: [
    {
      from: './dist/**/*',
      to: '.',
    }
  ],
  ignore: [
    '**/*.map',
    '**/.DS_store',
    '**/node_modules'
  ],
  noCache: [
    '**/*.html'
  ],
  lastUpload: [
    '**/*.html'
  ],
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
