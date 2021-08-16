import aliyun from './aliyun'
import qiniu from './qiniu'
import tencent from './tencent'

export type Types = 'aliyun' | 'qiniu' | 'tencent';

interface Options {
  to: string;
  from: string;
  noCache: boolean;
}

export default async (type: Types, options: Options): Promise<void> => {
  switch (type) {
    case 'aliyun': {
      await aliyun(options)
      break
    }
    case 'qiniu': {
      await qiniu(options)
      break
    }
    case 'tencent': {
      await tencent(options)
      break
    }
  }
}
