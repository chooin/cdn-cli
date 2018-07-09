# 对象存储部署前端项目，支持阿里云/七牛

[![npm package](https://img.shields.io/npm/v/cdn-cli.svg)](https://www.npmjs.org/package/cdn-cli)

#### 1. 安装依赖包

```sh
npm install cdn-cli -g
```

#### 2. 初始化项目

```sh
cdn init aliyun # 阿里云
cdn init qiniu # 七牛云
```

#### 3. 配置

deploy-config/config.json

``` json
{
  "type": "aliyun",
  "deploy": {
    "directories": [
      {
        "from": "./dist",
        "to": "."
      },
      "./static"
    ],
    "files": [
      {
        "from": "./product.html",
        "to": "./item.html"
      },
      "./login.html"
    ]
  },
  "noCache": {
    "fileSuffix": [
      "html"
    ],
    "fileName": [
      "service-worker.js"
    ]
  },
  "lastUpload": {
    "fileSuffix": [
      "html"
    ],
    "fileName": []
  },
  "ignore": {
    "fileSuffix": [
      "map"
    ],
    "fileName": []
  }
}
```

deplot-config/aliyun

```json
{
  "region": "",
  "bucket": "",
  "accessKeyId": "",
  "accessKeySecret": ""
}
```

deplot-config/qiniu

```json
{
  "region": "",
  "bucket": "",
  "accessKey": "",
  "secretKey": ""
}
```

##### 解释：

- 将代码部署到阿里云
- 将 `./dist` 目录里面的文件放到 `.` 目录下，将 `./static` 里面的文件放到 `./static` 目录下
- 上传 `./product.html` 到 `./item.html`，上传 `./login.html` 到 `./login.html`
- 不缓存后缀名为 `html` 的文件，不缓存 `service-worker.js` 文件；后缀名为 `html` 的文件最后上传
- 忽略后缀名为 `map` 的文件

#### 4. 发布项目

``` sh
cdn deploy production
cdn deploy test
cdn deploy development
...
```

#### 5. 不将 config 文件提交到 git

在项目下添加 .gitignore 文件，然后在 .gitignore 文件中添加下面内容

``` gitignore
deploy-config/aliyun/
deploy-config/qiniu/
```


