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
      region: 'oss-cn-hangzhou',
      bucket: 'xxx',
      accessKeyId: 'xxx',
      accessKeySecret: 'xxx',
      domain: 'https://xxx.xxx.com',
    },
    testing: {
      type: 'qiniu',
      region: '',
      bucket: '',
      accessKey: '',
      secretKey: '',
      domain: '',
    },
    development: {
      type: 'tencent',
      region: '',
      bucket: '',
      appId: '',
      secretId: '',
      secretKey: '',
      domain: '',
    },
  },
};
