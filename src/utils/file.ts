import * as path from 'path'
import {existsSync, copySync} from 'fs-extra'

export const createFile = ({
  from,
  to,
}) => {
  copySync(from, to)
}

export const canCreateFile = ({
  to
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (existsSync(path.resolve(to))) {
      reject()
    } else {
      resolve()
    }
  })
}
