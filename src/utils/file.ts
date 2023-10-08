import { existsSync, copySync, statSync } from 'fs-extra';

export const copyFileSync = (from: string, to: string) => {
  copySync(from, to);
};

export const canCopyFile = (to: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (existsSync(to)) {
      reject();
    } else {
      resolve();
    }
  });
};
