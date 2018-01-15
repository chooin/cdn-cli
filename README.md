# 使用 Aliyun CDN 部署前端项目

使用 cdn 部署项目的好处:

1. 无带宽上限
2. 无需租用虚拟主机/虚拟服务器
3. 无需担心恶意流量攻击
4. 访问速度快
5. ...

### 目录：
- [创建OSS](#创建OSS)
- [开通CDN](#开通CDN)
- [项目编译完成后自动上传到OSS](项目编译完成后自动上传到OSS)
- [让项目支持https](#让项目支持支持https)

## 创建OSS

设置默认首页：OSS->选择部署的Bucket->进入Bucket属性->静态网站->配置默认首页(index.html)

绑定域名：OSS->选择部署的Bucket->进入Bucket属性->绑定域名

## 开通CDN

https: CDN->CDN域名列表->管理->HTTPS安全加速->配置ssl信息->将CNAME修改成CDN的

SSL 证书拼接顺序

www.example.cn.crt

COMODORSADomainValidationSecureServerCA.crt

COMODORSAAddTrustCA.crt

AddTrustExternalCARoot.crt

## 项目编译完成后自动上传到OSS

1. 安装依赖包

``` sh
yarn global add cdn-deploy-cli # or npm install cdn-deploy-cli -g
```

2. 初始化项目

``` sh
cdn-deploy init
```

3. 配置

deploy-config/aliyun.config.json

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

4. 发布项目

``` sh
cdn-deploy deploy
```

## 让项目支持支持https

1. 如何获得 SSL 证书

阿里云可以申请时长为1年的免费证书

我一般去这里购买 https://www.ssls.com
