import { red, yellow, green, white } from 'kleur';
import { config } from '../config';

export const uploadSuccess = (file: Omit<File, 'isLastUpload'>) => {
  const status = green('[成功]'.padEnd(8));
  const isNoCache = file.isNoCache
    ? yellow('[不支持]'.padEnd(7))
    : '[支持]'.padEnd(8);
  const arrow = yellow(' -> ');
  console.log(
    `${status}${isNoCache}${file.from}${arrow}${config.environment.domain}/${file.to}`,
  );
};

export const uploadFail = (file: Omit<File, 'isLastUpload'>) => {
  const status = red('[失败]'.padEnd(8));
  const isNoCache = file.isNoCache
    ? yellow('[不支持]'.padEnd(7))
    : '[支持]'.padEnd(8);
  const arrow = yellow(' -> ');
  console.log(
    `${status}${isNoCache}${file.from}${arrow}${config.environment.domain}/${file.to}`,
  );
};

export const error = (message: string) => {
  console.log(white().bgRed(message));
};
