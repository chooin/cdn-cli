import walk from 'walk'
const chalk = require('chalk')
const ora = require('ora')

const aliyun = require('./types/aliyun')
const qiniu = require('./types/qiniu')
const tencent = require('./types/tencent')
const {
  config
} = require('./utils/config')

module.exports = () => {
  config().then(CONFIG => {
    const upload = async (files) => {
      for (let file of files) {
        let {
          putPath,
          getPath,
          hasCache,
          ignore
        } = file
        if (ignore) {
          // 忽略文件
        } else {
          switch (CONFIG.type) {
            case 'aliyun': {
              await aliyun.upload({
                putPath,
                getPath,
                hasCache
              })
              break
            }
            case 'qiniu': {
              await qiniu.upload({
                putPath,
                getPath,
                hasCache
              })
              break
            }
            case 'tencent': {
              await tencent.upload({
                putPath,
                getPath,
                hasCache
              })
              break
            }
          }
        }
      }
    }

    const isLastUpload = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.lastUpload.fileSuffix.includes(fileSuffix) || CONFIG.lastUpload.fileName.find(file => fileName.indexOf(file) > -1)
        ? true
        : false
    }

    const hasCache = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.noCache.fileSuffix.includes(fileSuffix) || CONFIG.noCache.fileName.find(file => fileName.indexOf(file) > -1)
        ? true
        : false
    }

    const isIgnore = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.ignore.fileSuffix.includes(fileSuffix) || CONFIG.ignore.fileName.find(file => fileName.indexOf(file) > -1)
        ? true
        : false
    }

    (() => {
      let walker  = walk.walk('.', {
        followLinks: false
      })
      let files = []

      // <!-- 文件夹上传
      let getDirectories = []
      let putDirectories = []
      CONFIG.deploy.directories.forEach(directory => {
        let from
        let to
        if (typeof directory === 'string') {
          to = from = directory
        } else {
          from = directory.from
          to = directory.to
        }
        getDirectories.push(from)
        putDirectories.push({
          from,
          to
        })
      })
      walker.on('file', (root, stat, next) => {
        for (let i in getDirectories) {
          if (root.indexOf(getDirectories[i]) === 0) {
            let fileSuffix = stat.name.split('.').pop().toLowerCase()
            let getPath = `${root}/${stat.name}`
            let putPath = `${root.replace(putDirectories[i].from, putDirectories[i].to)}/${stat.name}`.substring(1)
            let fileName = putPath.split('/').pop()
            let file = {
              getPath,
              putPath,
              hasCache: hasCache({
                fileName,
                fileSuffix
              }),
              ignore: isIgnore({
                fileName,
                fileSuffix
              })
            }
            if (
              isLastUpload({
                fileName,
                fileSuffix
              })
            ) {
              files.push(file)
            } else {
              files.unshift(file)
            }
          }
        }
        next()
      })
      // 文件夹上传 -->

      // <!-- 制定文件上传
      let getFiles = []
      let putFiles = []
      CONFIG.deploy.files.forEach(file => {
        let from
        let to
        if (typeof file === 'string') {
          to = from = file
        } else {
          from = file.from
          to = file.to
        }
        getFiles.push(from)
        putFiles.push(to)
      })
      for (let i in getFiles) {
        let fileSuffix = putFiles[i].split('.').pop().toLowerCase()
        let getPath = getFiles[i]
        let putPath = putFiles[i].substring(1)
        let fileName = putPath.split('/').pop()
        let file = {
          getPath,
          putPath,
          hasCache: hasCache({
            fileName,
            fileSuffix
          })
        }
        if (
          isLastUpload({
            fileName,
            fileSuffix
          })
        ) {
          files.push(file)
        } else {
          files.unshift(file)
        }
      }
      // 制定文件上传 -->

      console.log()
      console.log(`${'服务商:'.padStart(19)} ${chalk.yellow(CONFIG.type)}`)
      console.log(`${'发布环境:'.padStart(18)} ${chalk.yellow(process.env.DEPLOY_ENV)}`)
      console.log()
      const spinner = ora('处理中..').start()
      walker.on('end', () => {
        spinner.stop()
        if (process.stdout.columns > 160) {
          console.log(`${'状态'.padStart(5)}${'缓存'.padStart(16)}${'本地资源 -> 远端资源'.padStart(26)}`)
        } else {
          console.log(`${'状态'.padStart(5)}${'缓存'.padStart(16)}${'远端资源'.padStart(18)}`)
        }
        upload(files)
      })
    })()
  })
}
