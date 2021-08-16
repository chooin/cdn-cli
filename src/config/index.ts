import * as path from 'path';
import glob from 'glob'
import dirGlob from 'dir-glob'
import _ from 'lodash'
import {logger} from '../utils';
import {isFileSync} from '../utils/file';
import minimatch from 'minimatch';

export interface File {
  from: string;
  to: string;
  isFile: boolean;
  ignore: boolean;
  lastUpload: boolean;
  noCache: boolean;
}

export interface Rule {
  from: string;
  to: string;
  ignore: string[];
  noCache: string[];
  lastUpload: string[];
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
    ...require(path.resolve(process.cwd(), './cdn.config'))
  }
}

export const config = defaultConfig()

/**
 * 遍历目录
 * @param {string} from
 */
const walk = (from): Promise<string[]> => {
  return new Promise((resolve) => {
    glob(
      from,
      {},
      (err, matches) => {
        if (err) {
          logger.error(err.message)
          process.exit(1)
        }
        resolve(matches)
      }
    )
  })
}

// 配置 rules 的 files
const setFiles = async () => {
  await Promise.all(config.rules.map((rule) => walk(rule.from))).then((res) => {
    res.map((files, index) => {
      config.rules[index].files = files.map((file) => {
        const fullPath = path.resolve('.', file)
        // 判断是不是文件
        const isFile = isFileSync(fullPath)
        // ignore 处理
        const ignore = config.rules[index].ignore.some(i => minimatch(file, i))
        // lastUpload 处理
        const lastUpload = config.rules[index].lastUpload.some(i => minimatch(file, i))
        // noCache 处理
        const noCache = config.rules[index].noCache.some(i => minimatch(file, i))
        return {
          from: fullPath,
          to: path.join(config.rules[index].to, file).replace(path.dirname(config.rules[index].from), '').replace('/', ''),
          isFile,
          ignore,
          lastUpload,
          noCache,
        }
      }) as File[]
    })
  })
}

export const setConfig = async (environment) => {
  config.environment = config.environments[environment]
  if (config.environment) {
    delete config.environments;
  } else {
    logger.error('错误，请检查 cdn.config.js 中 environment 是否存在')
    process.exit(1)
  }
  config.rules = config
    .rules
    .filter(item => {
      if (item.from && item.to) {
        return true;
      }
      logger.error('错误，必须配置 from 和 to')
      process.exit(1)
    })
    .map(({from, to, ignore, lastUpload, noCache, ...args}) => {
      return {
        ...args,
        from: _.first(dirGlob.sync(from ?? [])),
        to,
        ignore: dirGlob.sync(ignore ?? []),
        lastUpload: dirGlob.sync(lastUpload ?? []),
        noCache: dirGlob.sync(noCache ?? []),
      }
    }) as Rule[]

  await setFiles();

  return config;
}
