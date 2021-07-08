import aliyun from './aliyun'
import qiniu from './qiniu'
import tencent from './tencent'

export type Vendor = 'aliyun' | 'qiniu' | 'tencent';

interface Options {
  type: string;
  putPath: string;
  getPath: string;
  hasCache: boolean;
}

export default (vendor: Vendor, options: Options): void => {
  switch (vendor) {
    case 'aliyun': {
      aliyun(options)
      break
    }
    case 'qiniu': {
      qiniu(options)
      break
    }
    case 'tencent': {
      tencent(options)
      break
    }
  }
}
