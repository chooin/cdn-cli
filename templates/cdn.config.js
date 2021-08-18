module.exports = {
  rules: [
    {
      from: 'dist',
      to: '.',
      ignore: [
        '**/.DS_store',
      ],
      noCache: [
        '**/*.html'
      ],
      lastUpload: [
        '**/*.html'
      ],
    }
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
      type: 'qiniu',
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
