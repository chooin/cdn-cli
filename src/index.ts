import { setConfig, config } from './config';
import { upload } from './utils';

const deploy = async (environment) => {
  await setConfig(environment);

  console.log(
    `${'状态'.padStart(4)}${'缓存'.padStart(
      16,
    )}${'本地资源 -> 远端资源'.padStart(24)}`,
  );

  let files: File[] = config.rules.map((rule) => rule.files).flat();

  await Promise.all(
    files
      .filter((file) => !file.isLastUpload)
      .map((file) => upload(config.environment.type, files)),
  );
  await Promise.all(
    files
      .filter((file) => file.isLastUpload)
      .map((file) => upload(config.environment.type, files)),
  );
};

export { deploy };
