import {join, resolve} from 'path';
import {file, logger} from "../utils";
import glob from "glob";

export interface File {
  from: string;
  to?: string;
  ignore?: boolean;
  lastUpload?: boolean;
  hasCache?: boolean;
}

export interface Rule {
  from: string;
  to?: string;
  ignore?: string[];
  noCache?: string[];
  lastUpload?: string[];
  files: File[];
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
  environments?: {
    [k: string]: Environment;
  };
}

const defaultConfig = (): Config => {
  return {
    ...require(resolve(process.cwd(), './deploy.config'))
  }
}

const walk = (from, options = {}) => {
  return new Promise((resolve, reject) => {
    glob(
      from,
      options,
      (err, matches) => {
        if (err !== null) {
          console.log(err)
          process.exit(1)
        }
        resolve(matches)
      }
    )
  })
}

export const config = defaultConfig()

export const setConfig = async (environment) => {
  config.environment = config.environments[environment]
  if (config.environment) {
    delete config.environments
  } else {
    console.log(logger.error('错误，请检查 deploy.config.js 中 environment 是否存在'))
    process.exit(1)
  }
  config.rules = config
    .rules
    .filter(item => item.from)
    .map(item => {
      return Object.assign(
        {
          to: '.',
          ignore: [],
          noCache: [],
          lastUpload: [],
          files: [],
        },
        item
      )
    })
    .map((item) => {
      // from: 是目录
      if (item.from.indexOf('*') === -1) {
        if (file.isDirectorySync(item.from)) {
          item.to = join(item.from, item.to)
          item.from = `${item.from}/**/*`
        }
      }
      return item
    })
  await Promise.all(config.rules.map((rule) => {
    return walk(rule.from, {
      ignore: rule.ignore
    })
  })).then(files => {
    config.rules = config.rules.map((rule, index) => {
      return {
        ...rule,
        files: files[index],
      }
    })
  })
}
