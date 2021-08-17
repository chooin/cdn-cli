import {setConfig, config} from './config'
import _ from 'lodash'
import {upload} from './utils'

const deploy = async (environment) => {
  await setConfig(environment)

  // 删除目录
  config.rules = config.rules.map((rule) => {
    return {
      ...rule,
      files: rule.files
      .filter((file) => file.isFile)
    }
  })

  // 删除 ignore
  config.rules = config.rules.map((rule) => {
    return {
      ...rule,
      files: rule.files
        .filter((file) => !file.ignore)
    }
  })

  console.log(`${'状态'.padStart(4)}${'缓存'.padStart(16)}${'本地资源 -> 远端资源'.padStart(24)}`)

  let files = _.flatten([...config.rules.map(({files}) => files)])

  await Promise.all(files.filter((file) => !file.lastUpload).map((file) => upload(config.environment.type, file)))
  await Promise.all(files.filter((file) => file.lastUpload).map((file) => upload(config.environment.type, file)))
}

export {
  deploy
}
