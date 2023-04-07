import Cos from 'cos-nodejs-sdk-v5';
import fs from 'fs-extra';
import * as logger from '../logger';

class Tencent {
  private client: Cos;
  private readonly bucket: string;
  private readonly region: string;

  constructor(environment: Environment.Tencent) {
    this.client = new Cos({
      SecretId: environment.secretId,
      SecretKey: environment.secretKey,
    });
    this.bucket = environment.bucket;
    this.region = environment.region;
  }

  put(file: File): Promise<void> {
    return new Promise((resolve) => {
      this.client.putObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: file.to,
          Body: fs.createReadStream(file.from),
          ContentLength: fs.statSync(file.from).size,
          CacheControl: file.isNoCache ? 'no-cache, private' : undefined,
        },
        (_, data) => {
          if (data.statusCode === 200) {
            logger.uploadSuccess(file);
            resolve();
            return;
          }
          logger.uploadFail(file);
          logger.error(_.message);
          process.exit(1);
        },
      );
    });
  }

  public upload(files: File[]): Promise<void> {
    return Promise.all(files.map((file) => this.put(file))).then(() => {});
  }
}

export default Tencent;
