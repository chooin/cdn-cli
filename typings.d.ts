declare enum Types {
  Aliyun = 'aliyun',
  Qiniu = 'qiniu',
  Tencent = 'tencent',
  Debug = 'debug',
}

declare interface Config {
  rules: Rule[];
  environment:
    | Environment.Aliyun
    | Environment.Qiniu
    | Environment.Tencent
    | Environment.Debug;
  environments?: {
    [k: string]:
      | Environment.Aliyun
      | Environment.Qiniu
      | Environment.Tencent
      | Environment.Debug;
  };
}

declare interface File {
  from: string;
  to: string;
  isLastUpload: boolean;
  isNoCache: boolean;
}

declare interface Rule {
  from: string;
  to: string;
  ignore: string[];
  noCache: string[];
  lastUpload: string[];
  files: File[];
}

declare namespace Environment {
  type Aliyun = {
    type: Types.Aliyun;
    region: string;
    bucket: string;
    accessKeyId: string;
    accessKeySecret: string;
    domain: string;
  };
  type Qiniu = {
    type: Types.Qiniu;
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    domain: string;
  };
  type Tencent = {
    type: Types.Tencent;
    region: string;
    bucket: string;
    appId: string;
    secretId: string;
    secretKey: string;
    domain: string;
  };
  type Debug = {
    type: Types.Debug;
    domain: string;
  };
}

declare interface Upload {
  upload(files: File[]): Promise<void>;
}
