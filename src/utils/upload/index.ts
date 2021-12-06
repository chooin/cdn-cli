import aliyun from './aliyun';
import qiniu from './qiniu';
import tencent from './tencent';

interface Options {
  to: string;
  from: string;
  noCache: boolean;
}

export default async (type: Types, options: Options): Promise<void> => {
  switch (type) {
    case Types.Aliyun: {
      await aliyun(options);
      break;
    }
    case Types.Qiniu: {
      await qiniu(options);
      break;
    }
    case Types.Tencent: {
      await tencent(options);
      break;
    }
  }
};
