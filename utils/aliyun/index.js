let co = require('co')
let OSS = require('ali-oss')
let walk = require('walk')

const client = new OSS({
  region: config.OSS.region,
  bucket: config.OSS.bucket,
  accessKeyId: config.accessKey.id,
  accessKeySecret: config.accessKey.secret
})

const upload = files => {
  co(function* () {
    for (let file of files) {
      if (
        config.noCache.fileSuffix.find(suffix => suffix !== file.fileSuffix) &&
        config.noCache.fileName.find(name => file.putPath.split('/').indexOf(name) === -1)
      ) {
        let res = yield client.put(file.putPath, file.getPath, {})
        if (res.res.status === 200) {
          console.log(`☘️  [Cache]：${res.name}`)
        } else {
          console.log(`❌  [Cache]：${res.name}`)
        }
      }
    }
    for (let file of files) {
      if (
        config.noCache.fileSuffix.find(suffix => suffix === file.fileSuffix) &&
        config.noCache.fileName.find(name => file.putPath.split('/').indexOf(name) > -1)
      ) {
        let res = yield client.put(file.putPath, file.getPath, {
                    headers: {
                      'Cache-Control': 'no-cache, private'
                    }
                  })
        if (res.res.status === 200) {
          console.log(`☘️  [No cache]${res.name}`)
        } else {
          console.log(`❌  [No cache]${res.name}`)
        }
      }
    }
  }).catch(_ => {
    console.log(_)
  })
}

(() => {
  let walker  = walk.walk('.', { followLinks: false })
  let files = []
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
        files.push({
          getPath: `${root}/${stat.name}`,
          putPath: `${root.replace(putDirs[i].s, putDirs[i].e)}/${stat.name}`.substring(1),
          fileSuffix: stat.name.split('.').pop().toLowerCase()
        })
      }
    }
    next()
  })
  let getFiles = []
  let putFiles = []
  config.deploy.files.map(f => {
    let s = f.split('->')
    getFiles.push(s[0])
    putFiles.push(s[1] || s[0])
  })
  for (let i in getFiles) {
    files.push({
      getPath: getFiles[i],
      putPath: putFiles[i].substring(1),
      fileSuffix: getFiles[i].split('.').pop().toLowerCase()
    })
  }
  walker.on('end', () => {
    upload(files)
  })
})()
