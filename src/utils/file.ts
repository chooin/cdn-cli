import * as path from 'path'
import {existsSync, copySync, statSync} from 'fs-extra'

export const isFile = (path: string): boolean => {
  const stat = statSync(path)

  return stat.isFile()
}

export const isDirectory = (path: string): boolean => {
  const stat = statSync(path)

  return stat.isDirectory()
}


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
