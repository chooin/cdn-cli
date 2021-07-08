import glob from 'glob'
import minimatch from 'minimatch'
import kleur from 'kleur'
import ora from 'ora'
import {join} from 'path'
import config from './config'
import {file} from './utils'

interface File {
  from: string;
  to?: string;
  ignore?: boolean;
  lastUpload?: boolean;
  hasCache?: boolean;
}

const walk = (from, options = {}) => {
  return new Promise((resolve, reject) => {
    glob(from, options, (err, matches) => {
      if (err !== null) {
        console.log(err)
        process.exit(1)
      }
      resolve(matches)
    })
  })
}

const deploy = async (environment) => {
  config.environment = config.environments[environment]
  if (!config.environment) {
    console.log(kleur.red('错误，请检查 deploy.config.js 中 environment 是否存在'))
    process.exit(1)
  }
  config.rules = config
    .rules
    .filter(item => item.from)
    .map(item => {
      return Object.assign(
        {
          to: '.',
          ignore: [],
          noCache: [],
          lastUpload: [],
        },
        item
      )
    })
    .map((item) => {
      // from: 直接是目录
      if (item.from.indexOf('*') === -1) {
        if (file.isDirectory(item.from)) {
          item.to = join(item.from, item.to)
          item.from = `${item.from}/**/*`
        }
      }
      return item
    })
}

export {
  deploy
}
