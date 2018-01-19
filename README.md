# 使用 Aliyun CDN 部署前端项目

[![npm package](https://img.shields.io/npm/v/cnd-cli.svg)](https://www.npmjs.org/package/cnd-cli)

### 目录：
- [创建OSS](#创建OSS)
- [开通CDN](#开通CDN)
- [项目编译完成后自动上传到OSS](#项目编译完成后自动上传到OSS)
- [让项目支持https](#让项目支持https)

## 创建OSS

##### 1. 设置默认首页：

OSS->选择部署的Bucket->进入Bucket属性->静态网站->配置默认首页(index.html)

##### 2. 绑定域名：

OSS->选择部署的Bucket->进入Bucket属性->绑定域名

## 开通CDN

https: CDN->CDN域名列表->管理->HTTPS安全加速->配置ssl信息->将CNAME修改成CDN的

SSL 证书拼接顺序

www.example.cn.crt

COMODORSADomainValidationSecureServerCA.crt

COMODORSAAddTrustCA.crt

AddTrustExternalCARoot.crt

## 项目编译完成后自动上传到OSS

##### 1. 安装依赖包

``` sh
yarn global add cdn-cli # or npm install cdn-cli -g
```

##### 2. 初始化项目

``` sh
cdn init aliyun
```

##### 3. 配置

deploy-config/aliyun/*.json

``` json
{
  "oss": {
    "region": "oss-cn-hangzhou",
    "bucket": "your project"
  },
  "accessKey": {
    "id": "",
    "secret": ""
  }
}
```

deploy-config/config.json

``` json
{
  "type": "aliyun",
  "deploy": {
    "dirs": ["./dist->."],
    "files": []
  },
  "noCache": {
    "fileSuffix": ["html"],
    "fileName": ["service-worker.js"]
  },
  "lastUpload": {
    "fileSuffix": ["html"],
    "fileName": []
  }
}
```

##### 4. 发布项目

``` sh
cdn deploy production
cdn deploy test
cdn deploy development
```

##### 5. 不将 config 文件提交到 git

在项目下添加 .gitignore 文件，然后在 .gitignore 文件中添加下面内容

``` gitignore
deploy-config/aliyun/
```

## 让项目支持https

阿里云可以申请时长为1年的免费证书

我一般去这里购买 https://www.ssls.com
