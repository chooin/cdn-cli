import path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import minimatch from 'minimatch';
import _ from 'lodash';
import fs from 'fs-extra';
import { logger } from '../utils';
import { Types } from '../enums';

const defaultConfig = (): Config => {
  const configJsPath = path.resolve(process.cwd(), './cdn.config.js');
  const configMJsPath = path.resolve(process.cwd(), './cdn.config.mjs');
  if (fs.existsSync(configJsPath) && fs.statSync(configJsPath).isFile()) {
    return require(configJsPath);
  } else if (
    fs.existsSync(configMJsPath) &&
    fs.statSync(configMJsPath).isFile()
  ) {
    return require(configMJsPath);
  } else {
    logger.error(
      '请首先运行 npx cdn-cli init 来获取配置文件，然后进行 cdn.config.mjs 文件的配置',
    );
    process.exit(1);
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
const setFiles = async () => {
  await Promise.all(
    config.rules.map((rule) => walk(rule.from, rule.ignore)),
  ).then((res) => {
    res.map((files, index) => {
      config.rules[index].files = files
        .filter((file) => {
          return fs.statSync(path.resolve('.', file)).isFile();
        })
        .map((file) => {
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
      config.environment = {
        ...config.environment,
        region: config.environment.region ?? process.env.region,
        bucket: config.environment.bucket ?? process.env.bucket,
        accessKeyId: config.environment.accessKeyId ?? process.env.accessKeyId,
        accessKeySecret:
          config.environment.accessKeySecret ?? process.env.accessKeySecret,
        domain: config.environment.domain || process.env.domain || '',
      };
    }
    if (config.environment.type === Types.Qiniu) {
      config.environment = {
        ...config.environment,
        region: config.environment.region ?? process.env.region,
        bucket: config.environment.bucket ?? process.env.bucket,
        accessKey: config.environment.accessKey ?? process.env.accessKey,
        secretKey: config.environment.secretKey ?? process.env.secretKey,
        domain: config.environment.domain || process.env.domain || '',
      };
    }
    if (config.environment.type === Types.Tencent) {
      config.environment = {
        ...config.environment,
        region: config.environment.region ?? process.env.region,
        bucket: config.environment.bucket ?? process.env.bucket,
        appId: config.environment.appId ?? process.env.appId,
        secretId: config.environment.secretId ?? process.env.secretId,
        secretKey: config.environment.secretKey ?? process.env.secretKey,
        domain: config.environment.domain || process.env.domain || '',
      };
    }
  } else {
    logger.error(
      `请确认 cdn.config.mjs 文件中是否包含 environment 为 ${config.environment} 的配置`,
    );
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
