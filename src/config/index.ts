import * as path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import minimatch from 'minimatch';
import _ from 'lodash';
import { logger } from '../utils';
import { isFileSync } from '../utils/file';

export enum Types {
  Aliyun = 'aliyun',
  Qiniu = 'qiniu',
  Tencent = 'tencent',
}

const defaultConfig = (): Config => {
  return {
    ...require(path.resolve(process.cwd(), './cdn.config')),
  };
};

export const config = defaultConfig();

/**
 * 遍历目录
 * @param {string} from
 */
const walk = (from): Promise<string[]> => {
  return new Promise((resolve) => {
    glob(from, {}, (err, matches) => {
      if (err) {
        logger.error(err.message);
        process.exit(1);
      }
      resolve(matches);
    });
  });
};

// 配置 rules 的 files
const setFiles = async () => {
  await Promise.all(config.rules.map((rule) => walk(rule.from))).then((res) => {
    res.map((files, index) => {
      config.rules[index].files = files.map((file) => {
        const fullPath = path.resolve('.', file);
        // 判断是不是文件
        const isFile = isFileSync(fullPath);
        // ignore 处理
        const ignore = config.rules[index].ignore.some((i) =>
          minimatch(file, i),
        );
        // lastUpload 处理
        const lastUpload = config.rules[index].lastUpload.some((i) =>
          minimatch(file, i),
        );
        // noCache 处理
        const noCache = config.rules[index].noCache.some((i) =>
          minimatch(file, i),
        );
        let to = path.join(
          config.rules[index].to,
          file.replace(path.dirname(config.rules[index].from), ''),
        );
        if (to.indexOf('/') === 0) {
          to.replace('/', '');
        }
        return {
          from: fullPath,
          to,
          isFile,
          ignore,
          lastUpload,
          noCache,
        };
      }) as File[];
    });
  });
};

export const setConfig = async (environment) => {
  config.environment = config.environments[environment];
  if (config.environment) {
    delete config.environments;
    // 支持 Github
    if (config.environment.type === Types.Aliyun) {
      const { region, bucket, accessKeyId, accessKeySecret } =
        config.environment;
      config.environment = {
        ...config.environment,
        region: region ? region : process.env.region,
        bucket: bucket ? bucket : process.env.bucket,
        accessKeyId: accessKeyId ? accessKeyId : process.env.accessKeyId,
        accessKeySecret: accessKeySecret
          ? accessKeySecret
          : process.env.accessKeySecret,
      };
    }
    if (config.environment.type === Types.Qiniu) {
      const { region, bucket, accessKey, secretKey } = config.environment;
      config.environment = {
        ...config.environment,
        region: region ? region : process.env.region,
        bucket: bucket ? bucket : process.env.bucket,
        accessKey: accessKey ? accessKey : process.env.accessKey,
        secretKey: secretKey ? secretKey : process.env.secretKey,
      };
    }
    if (config.environment.type === Types.Tencent) {
      const { region, bucket, appId, secretId, secretKey } = config.environment;
      config.environment = {
        ...config.environment,
        region: region ? region : process.env.region,
        bucket: bucket ? bucket : process.env.bucket,
        appId: appId ? appId : process.env.appId,
        secretId: secretId ? secretId : process.env.secretId,
        secretKey: secretKey ? secretKey : process.env.secretKey,
      };
    }
  } else {
    logger.error('错误，请检查 cdn.config.js 中 environment 是否存在');
    process.exit(1);
  }
  config.rules = config.rules
    .filter((item) => {
      if (item.from && item.to) {
        return true;
      }
      logger.error('错误，必须配置 from 和 to');
      process.exit(1);
    })
    .map(({ from, to, ignore, lastUpload, noCache, ...args }) => {
      return {
        ...args,
        from: _.first(dirGlob.sync(from ?? [])),
        to,
        ignore: dirGlob.sync(ignore ?? []),
        lastUpload: dirGlob.sync(lastUpload ?? []),
        noCache: dirGlob.sync(noCache ?? []),
      };
    }) as Rule[];

  await setFiles();

  return config;
};
