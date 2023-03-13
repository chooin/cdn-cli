import path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import minimatch from 'minimatch';
import _ from 'lodash';
import fs from 'fs-extra';
import { logger } from '../utils';
import { Types } from '../enums';

const defaultConfig = (): Config => {
  const configPath = path.resolve(process.cwd(), './cdn.config.js');
  if (fs.statSync(configPath).isFile()) {
    return require(configPath);
  } else {
    logger.error(
      '请先执行 npx cdn-cli init 获取配置文件，并配置 cdn.config.js 文件',
    );
  }
};

export const config = defaultConfig();

const walk = (from: string, ignore: string[] = []): Promise<string[]> => {
  return fs
    .stat(path.resolve(from))
    .then((stats) => {
      if (stats.isFile()) {
        return [from];
      } else {
        return [];
      }
    })
    .catch(() => {
      return glob(from, {
        ignore,
      });
    });
};

// 配置 rules 的 files
const setFiles = () => {
  return Promise.all(
    config.rules.map((rule) => walk(rule.from, rule.ignore)),
  ).then((res) => {
    res.map((files, index) => {
      return files.map((file) => {
        const from = path.resolve('.', file);
        const isLastUpload = config.rules[index].lastUpload.some((i) =>
          minimatch(file, i),
        );
        const isNoCache = config.rules[index].noCache.some((i) =>
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
          from,
          to,

          isLastUpload,
          isNoCache,
        };
      });
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
    logger.error('请检查 cdn.config.js 文件中 environment 是否存在');
    process.exit(1);
  }
  config.rules = config.rules
    .filter((item) => item.from && item.to)
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
