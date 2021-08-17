# 通过命令上传文件到对象存储（支持阿里云、腾讯云、七牛云）

[![npm package](https://img.shields.io/npm/v/cdn-cli.svg)](https://www.npmjs.org/package/cdn-cli)
[![npm](https://img.shields.io/npm/dt/cdn-cli.svg?style=flat-square)](https://www.npmjs.com/package/cdn-cli)

<img src="https://github.com/chooin/cdn-cli/blob/master/awesome.gif" width="780" height="auto" />

##### 1. 安装依赖包

```sh
npm install cdn-cli -g
```

##### 2. 初始化项目

```sh
cdn init
```

##### 3. 配置

``` js
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

```

> 1. 将 `./dist` 目录里面的文件放到 `.` 目录下
> 2. 不缓存后缀名为 `html` 的文件，后缀名为 `html` 的文件最后上传
> 3. 忽略后缀名为 `.DS_store` 的文件

##### 4. 发布项目

``` sh
cdn deploy production
cdn deploy test
cdn deploy development
...
```


