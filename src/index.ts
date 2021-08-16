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

  if (process.stdout.columns > 160) {
    console.log(`${'状态'.padStart(4)}${'缓存'.padStart(16)}${'本地资源 -> 远端资源'.padStart(24)}`)
  } else {
    console.log(`${'状态'.padStart(4)}${'缓存'.padStart(16)}${'远端资源'.padStart(16)}`)
  }

  config.rules.forEach((rule) => {
    rule.files.forEach((file) => {
      upload(config.environment.type, {
        from: file.from,
        to: file.to,
        noCache: file.noCache,
      })
    })
  })
}

export {
  deploy
}
