const co = require('co')
const walk = require('walk')
const config = require('./deploy-config/config')
const aliyun = require('./utils/aliyun')

const upload = files => {
  co(function* () {
    for (let file of files) {
      switch (config.type) {
        case 'aliyun': {
          yield aliyun.upload({
            putPath: file.putPath,
            getPath: file.getPath,
            hasCache: file.hasCache
          })
          break
        }
      }
    }
  }).catch(_ => console.log(_))
}

const isLastUpload = ({
  fileName,
  fileSuffix
}) => {
  return config.lastUpload.fileSuffix.find(suffix => suffix === fileSuffix) ||config.lastUpload.fileName.find(name => fileName.indexOf(name) > -1)
  ? true
  : false
}

const hasCache = ({
  fileName,
  fileSuffix
}) => {
  return config.noCache.fileSuffix.find(suffix => suffix === fileSuffix) || config.noCache.fileName.find(name => fileName.indexOf(name) > -1)
  ? true
  : false
}

(() => {
  let walker  = walk.walk('.', { followLinks: false })
  let files = []

  // <!-- 文件夹上传
  let getDirs = []
  let putDirs = []
  config.deploy.dirs.map(d => {
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
  config.deploy.files.map(f => {
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
