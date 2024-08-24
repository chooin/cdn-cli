import * as logger from '../logger';

class Debug implements Upload {
  constructor(environment: Environment.Debug) {}

  private put(file: File): Promise<void> {
    return new Promise((resolve) => {
      logger.uploadSuccess(file);
      return resolve();
    });
  }

  public upload(files: File[]): Promise<void> {
    return Promise.all(files.map((file) => this.put(file))).then(() => {});
  }
}

export default Debug;
