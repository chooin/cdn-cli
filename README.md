# 通过命令行将文件上传至对象存储，支持阿里云、腾讯云以及七牛云

[![npm package](https://img.shields.io/npm/v/cdn-cli.svg)](https://www.npmjs.org/package/cdn-cli)
[![npm](https://img.shields.io/npm/dt/cdn-cli.svg?style=flat-square)](https://www.npmjs.com/package/cdn-cli)

<img src="https://github.com/chooin/cdn-cli/blob/master/awesome.gif" width="780" height="auto" />

##### 1. 初始化项目

```shell
npx cdn-cli init
```

##### 2. 配置

```js
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
```

| 字段             | 类型     | 详情                 |
| ---------------- | -------- | -------------------- |
| rules.from       | string   | 需要上传的资源目录   |
| rules.to         | string   | 上传目标目录         |
| rules.ignore     | string[] | 过滤文件或目录       |
| rules.noCache    | string[] | 不缓存的文件或目录   |
| rules.lastUpload | string[] | 最后上传的文件或目录 |
| environments     | object[] | 环境                 |

如果配置文件的参数不存在，系统将从 `process.env` 中获取值。例如，如果 `production` 中的 `region` 值不存在，系统将从 `process.env.region` 中提取。

##### 3. 发布项目

```shell
npx cdn-cli deploy production
npx cdn-cli deploy testing
npx cdn-cli deploy development
...
```
