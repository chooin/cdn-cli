# 对象存储部署前端项目，支持阿里云/腾讯云/七牛云

[![npm package](https://img.shields.io/npm/v/cdn-cli.svg)](https://www.npmjs.org/package/cdn-cli)

<img src="https://github.com/Chooin/cdn-cli/blob/master/awesome.gif" width="780" height="auto" />

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

```

> 1. 将代码部署到阿里云
> 2. 将 `./dist` 目录里面的文件放到 `.` 目录下，将 `./static` 里面的文件放到 `./static` 目录下
> 3. 上传 `./product.html` 到 `./item.html`，上传 `./login.html` 到 `./login.html`
> 4. 不缓存后缀名为 `html` 的文件，不缓存 `service-worker.js` 文件；后缀名为 `html` 的文件最后上传
> 5. 忽略后缀名为 `map` 的文件

##### 4. 发布项目

``` sh
cdn deploy production
cdn deploy test
cdn deploy development
...
```

注：可以自定义


