import Aliyun from './aliyun';
import Qiniu from './qiniu';
import Tencent from './tencent';
import { config } from '../../config';

export const upload = (type: Types, files: File[]): Promise<void> => {
  switch (type) {
    case Types.Aliyun: {
      return new Aliyun(config.environment as Environment.Aliyun).upload(files);
    }
    case Types.Qiniu: {
      return new Qiniu(config.environment as Environment.Qiniu).upload(files);
    }
    case Types.Tencent: {
      return new Tencent(config.environment as Environment.Tencent).upload(
        files,
      );
    }
  }
};
