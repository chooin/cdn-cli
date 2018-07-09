# 使用 Aliyun CDN 部署前端项目

[![npm package](https://img.shields.io/npm/v/cdn-cli.svg)](https://www.npmjs.org/package/cdn-cli)

### 目录：
- [创建OSS](#创建OSS)
- [开通CDN](#开通CDN)
- [项目编译完成后自动上传到OSS](#项目编译完成后自动上传到OSS)
- [让项目支持https](#让项目支持https)

## 创建OSS

#### 1. 设置默认首页：

OSS->选择部署的Bucket->进入Bucket属性->静态网站->配置默认首页(index.html)

#### 2. 绑定域名：

OSS->选择部署的Bucket->进入Bucket属性->绑定域名

## 开通CDN

https: CDN->CDN域名列表->管理->HTTPS安全加速->配置ssl信息->将CNAME修改成CDN的

SSL 证书拼接顺序

www.example.cn.crt

COMODORSADomainValidationSecureServerCA.crt

COMODORSAAddTrustCA.crt

AddTrustExternalCARoot.crt

## 项目编译完成后自动上传到OSS

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
    "files": [
      "service-worker.js"
    ]
  },
  "lastUpload": {
    "fileSuffix": [
      "html"
    ],
    "files": []
  }
}
```

##### 解释：

- 将代码部署到阿里云
- 将 `./dist` 目录里面的文件放到 `.` 目录下，将 `./static` 里面的文件放到 `./static` 目录下
- 上传 `./product.html` 到 `./item.html`，上传 `./login.html` 到 `./login.html`
- 不缓存后缀为 `html` 的文件，不缓存 `service-worker.js` 文件；后缀为 `html` 的文件最后上传

#### 4. 发布项目

``` sh
cdn deploy production
cdn deploy test
cdn deploy development
```

#### 5. 不将 config 文件提交到 git

在项目下添加 .gitignore 文件，然后在 .gitignore 文件中添加下面内容

``` gitignore
deploy-config/aliyun/
```

## 让项目支持https

阿里云可以申请时长为1年的免费证书

我一般去这里购买 https://www.ssls.com


