module.exports = {
  rules: [
    {
      from: 'dist',
      to: '.',
      ignore: ['**/*.map', '**/.DS_store'],
      noCache: ['**/*.html'],
      lastUpload: ['**/*.html'],
    },
  ],
  environments: {
    production: {
      type: 'aliyun',
      region: '',
      bucket: '',
      accessKeyId: '',
      accessKeySecret: '',
    },
    testing: {
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
    },
  },
};
