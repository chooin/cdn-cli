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
    CONFIG.deploy.dirs.map(d => {
      let s = d.split('->')
      getDirs.push(s[0])
      putDirs.push({
        s: s[0],
        e: s[1] || s[0]
      })
    })
    walker.on('file', (root, stat, next) => {
      for (let i in getDirs) {
        if (root.indexOf(getDirs[i]) === 0) {
          let fileSuffix = stat.name.split('.').pop().toLowerCase()
          let getPath = `${root}/${stat.name}`
          let putPath = `${root.replace(putDirs[i].s, putDirs[i].e)}/${stat.name}`.substring(1)
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
    CONFIG.deploy.files.map(f => {
      let s = f.split('->')
      getFiles.push(s[0])
      putFiles.push(s[1] || s[0])
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
