export type Aliyun = {
  type: 'aliyun';
  region: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
}

export type Qiniu = {
  type: 'qiniu';
  region: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
}

export type Tencent = {
  type: 'tencent';
  region: string;
  bucket: string;
  secretId: string;
  secretKey: string;
}

export type Environments = Aliyun | Qiniu | Tencent

export default (): Promise<Environments> => {
  return new Promise((resolve) => {
    resolve(require('./deploy.config').environments)
  })
}
