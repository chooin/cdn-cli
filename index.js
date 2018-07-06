const co = require('co')
const walk = require('walk')
const fs = require('fs')

const aliyun = require('./utils/aliyun')
const qiniu = require('./utils/qiniu')
const {
  config
} = require('./utils/config')

config().then(res => {
  const CONFIG = res
  const upload = files => {
    co(function* () {
      for (let file of files) {
        let {
          putPath,
          getPath,
          hasCache
        } = file

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
        }
      }
    }).catch(console.log)
  }

  const isLastUpload = ({
    fileName,
    fileSuffix
  }) => {
    return CONFIG.lastUpload.fileSuffix.find(suffix => suffix === fileSuffix) || CONFIG.lastUpload.fileName.find(name => fileName.indexOf(name) > -1)
      ? true
      : false
  }

  const hasCache = ({
    fileName,
    fileSuffix
  }) => {
    return CONFIG.noCache.fileSuffix.find(suffix => suffix === fileSuffix) || CONFIG.noCache.fileName.find(name => fileName.indexOf(name) > -1)
      ? true
      : false
  }

  (() => {
    let walker  = walk.walk('.', {
      followLinks: false
    })
    let files = []

    // <!-- 文件夹上传
    let getDirs = []
    let putDirs = []
    CONFIG.deploy.dirs.map(dir => {
      let from
      let to
      if (typeof dir === 'string') {
        to = from = dir
      } else {
        from = dir.from
        to = dir.to
      }
      getDirs.push(from)
      putDirs.push({
        from,
        to
      })
    })
    walker.on('file', (root, stat, next) => {
      for (let i in getDirs) {
        if (root.indexOf(getDirs[i]) === 0) {
          let fileSuffix = stat.name.split('.').pop().toLowerCase()
          let getPath = `${root}/${stat.name}`
          let putPath = `${root.replace(putDirs[i].from, putDirs[i].to)}/${stat.name}`.substring(1)
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

    walker.on('end', () => {
      upload(files)
    })
  })()
})
