import path from 'path';

export interface Rule {
  from: string;
  to: string;
  ignore: string[];
  noCache: string[];
  lastUpload: string[];
}

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

export type Environment = Aliyun | Qiniu | Tencent

export interface Config {
  rules: Rule[];
  environment: Environment;
  environments: {
    [k: string]: Environment;
  }
}

const config = (): Config => {
  return {
    ...require(path.resolve(process.cwd(), './deploy.config'))
  }
}

export default config();
