import { setConfig, config } from './config';
import { upload } from './utils';

const deploy = async (environment): Promise<any> => {
  await setConfig(environment);

  console.log(
    `${'状态'.padStart(4)}${'缓存'.padStart(
      16,
    )}${'本地资源 -> 远端资源'.padStart(24)}`,
  );

  let files: File[] = config.rules.map((rule) => rule.files).flat();

  return Promise.all(
    files
      .sort((a, b) =>
        a.isLastUpload === a.isLastUpload ? 0 : a.isLastUpload ? 1 : -1,
      )
      .map((file) => upload(config.environment.type, files)),
  );
};

export { deploy };
