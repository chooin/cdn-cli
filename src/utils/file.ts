import * as path from 'path'
import {existsSync, copySync, statSync} from 'fs-extra'

export const isFileSync = (path: string): boolean => {
  const stat = statSync(path)

  return stat.isFile()
}

export const isDirectorySync = (path: string): boolean => {
  const stat = statSync(path)

  return stat.isDirectory()
}

export const copyFileSync = (from: string, to: string) => {
  copySync(from, to)
}

export const canCopyFile = (to: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (existsSync(to)) {
      reject()
    } else {
      resolve()
    }
  })
}
