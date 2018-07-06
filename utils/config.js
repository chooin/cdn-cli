const fs = require('fs')

const config = () => {
  return new Promise((resolve, reject) => {
    try {
      let file = fs.readFileSync('./deploy-config/config.json', 'utf8')
      resolve(JSON.parse(file))
    } catch (e) {
      reject(new Error('解析配置文件出错'))
    }
  })
}

const env = () => {
  return new Promise((resolve, reject) => {
    config().then(res => {
      const CONFIG = res
      try {
        let file = fs.readFileSync(`./deploy-config/${CONFIG.type}/${process.env.DEPLOY_ENV}.json`, 'utf8')
        resolve(JSON.parse(file))
      } catch (e) {
        reject(new Error('解析配置文件出错'))
      }
    }).catch(_ => {
      reject(_.message)
    })
  })
}

module.exports.config = config
module.exports.env = env
