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

待完善...

## 开通CDN

待完善...

## 项目编译完成后自动上传到OSS

1. 安装依赖包

``` sh
yarn add co ali-oss walk --dev
# or
npm install co ali-oss walk --save-dev
```

2. 将 [deploy.js](https://github.com/Chooin/aliyun-cdn-deploy-front-end-project/blob/master/deploy.js) 拷贝到项目根目录下，编辑 [deploy.js](https://github.com/Chooin/aliyun-cdn-deploy-front-end-project/blob/master/deploy.js) 以下内容

``` js
// 建议使用 AccessKey 子用户
let config = {
  deployDir: '', // 部署以下文件夹里面的内容，如：./dist
  OSS: {
    region: '', // OSS 所在的区域，如：oss-cn-hangzhou
    bucket: '' // 填写你在阿里云申请的 Bucket，如：movin-h5
  },
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
    "build": "node build/build.js && node deploy.js",
    ...
  }
}
```

## 让项目支持支持https

1. 如何获得 SSL 证书

阿里云可以申请时长为1年的免费证书，我一般去这里购买 https://www.ssls.com
