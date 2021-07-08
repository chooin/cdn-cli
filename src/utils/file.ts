import * as path from 'path'
import {existsSync, copySync} from 'fs-extra'

export const copyFile = (from, to) => {
  copySync(from, to)
}

export const canCopyFile = (to): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (existsSync(path.resolve(to))) {
      reject()
    } else {
      resolve()
    }
  })
}
