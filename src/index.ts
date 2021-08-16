import {setConfig, config} from './config'
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

  await upload(config.environment.type, {
    from: '',
    to: '',
    noCache: false,
  })
}

export {
  deploy
}
