const co = require('co')
const walk = require('walk')
const chalk = require('chalk')
const ora = require('ora')

const aliyun = require('./utils/aliyun')
const qiniu = require('./utils/qiniu')
const tencent = require('./utils/tencent')
const {
  config
} = require('./utils/config')

module.exports = () => {
  config().then(CONFIG => {
    const upload = files => {
      co(function* () {
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
                yield aliyun.upload({
                  putPath,
                  getPath,
                  hasCache
                })
                break
              }
              case 'qiniu': {
                yield qiniu.upload({
                  putPath,
                  getPath,
                  hasCache
                })
                break
              }
              case 'tencent': {
                yield tencent.upload({
                  putPath,
                  getPath,
                  hasCache
                })
                break
              }
            }
          }
        }
      }).catch(console.log)
    }

    const isLastUpload = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.lastUpload.fileSuffix.find(suffix => suffix === fileSuffix) || CONFIG.lastUpload.fileName.find(file => fileName.indexOf(file) > -1)
        ? true
        : false
    }

    const hasCache = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.noCache.fileSuffix.find(suffix => suffix === fileSuffix) || CONFIG.noCache.fileName.find(file => fileName.indexOf(file) > -1)
        ? true
        : false
    }

    const isIgnore = ({
      fileName,
      fileSuffix
    }) => {
      return CONFIG.ignore.fileSuffix.find(suffix => suffix === fileSuffix) || CONFIG.ignore.fileName.find(file => fileName.indexOf(file) > -1)
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
      CONFIG.deploy.directories.map(directory => {
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
            let file = {
              getPath,
              putPath,
              hasCache: hasCache({
                fileName: putPath.split('/').pop(),
                fileSuffix
              }),
              ignore: isIgnore({
                fileName: putPath.split('/').pop(),
                fileSuffix
              })
            }
            if (
              isLastUpload({
                fileName: putPath.split('/').pop(),
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
      CONFIG.deploy.files.map(file => {
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
        let file = {
          getPath,
          putPath,
          hasCache: hasCache({
            fileName: putPath.split('/').pop(),
            fileSuffix
          })
        }
        if (
          isLastUpload({
            fileName: putPath.split('/').pop(),
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
      console.log(`${'Cloud Type:'.padStart(18)} ${chalk.yellow(CONFIG.type)}`)
      console.log(`${'Environment:'.padStart(18)} ${chalk.yellow(process.env.DEPLOY_ENV)}`)
      console.log()
      const spinner = ora('Loading files').start()
      walker.on('end', () => {
        spinner.stop()
        if (process.stdout.columns > 160) {
          console.log(`${'Status'.padStart(12)}   ${'Cache Status'.padStart(12)}   Local Asset -> Remote Asset`)
        } else {
          console.log(`${'Status'.padStart(12)}   ${'Cache Status'.padStart(12)}   Remote Asset`)
        }
        upload(files)
      })
    })()
  })
}
