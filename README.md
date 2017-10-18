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
yarn add co ali-oss walk --dev
# or
npm install co ali-oss walk --save-dev
```

2. 将 [aliyun-cdn-deploy](https://github.com/Chooin/aliyun-cdn-deploy-front-end-project/blob/master/aliyun-cdn-deploy) 拷贝到项目根目录下，编辑 [aliyun-cdn-deploy](https://github.com/Chooin/aliyun-cdn-deploy-front-end-project/blob/master/aliyun-cdn-deploy) 以下内容

``` js
let config = {
  deploy: {
    dirs: ['./docs'], // 部署以下文件夹里面的内容，如：./dist
    files: ['./index.html'] // 部署以下文件，如：index.html
  },
  OSS: {
    region: '', // OSS 所在的区域，如：oss-cn-hangzhou
    bucket: '' // 填写你在阿里云申请的 Bucket，如：movin-h5
  },
  // 建议使用 AccessKey 子用户
  accessKey: {
    id: '', // 填写阿里云提供的 Access Key ID，如：LTAIR1m312sdawwq
    secret: '' // 填写阿里云提供的 Access Key Secret，如：v96wAI0Gkx2qVcEO2F1V31231
  }
}
```

3. 修改 package.json

``` js
// 修改前
{
  "scripts": {
    ...
    "build": "node build/build.js",
    ...
  }
}

// 修改后
{
  "scripts": {
    ...
    "build": "node build/build.js && node aliyun-cdn-deploy/index.js",
    ...
  }
}
```

## 让项目支持支持https

1. 如何获得 SSL 证书

阿里云可以申请时长为1年的免费证书

我一般去这里购买 https://www.ssls.com
