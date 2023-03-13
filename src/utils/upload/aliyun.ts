import Oss from 'ali-oss';
import type { PutObjectOptions } from 'ali-oss';
import * as logger from '../logger';
import OSS from 'ali-oss';

class Aliyun {
  private client: OSS;

  constructor(environment: Environment.Aliyun) {
    this.client = new Oss({
      region: environment.region,
      bucket: environment.bucket,
      accessKeyId: environment.accessKeyId,
      accessKeySecret: environment.accessKeySecret,
    });
  }

  private put(file: File): Promise<void> {
    return new Promise((resolve) => {
      const putObjectOptions: PutObjectOptions = file.isNoCache
        ? {
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        : {};
      this.client.put(file.to, file.from, putObjectOptions).then((result) => {
        if (result.res.status === 200) {
          logger.uploadSuccess(file);
          return resolve();
        }
        logger.uploadFail(file);
        console.log(result);
        process.exit(1);
      });
    });
  }

  public upload(files: File[]): Promise<void> {
    return Promise.all(files.map((file) => this.put(file))).then(() => {});
  }
}

export default Aliyun;
