let co = require('co')
let OSS = require('ali-oss')
let walk = require('walk')

let config = {
  deploy: {
    dirs: [], // 上传以下文件夹里面的内容，如：./dist，`->` 重命名文件夹
    files: [] // 上传以下文件，如：index.html，`->` 重命名文件
  },
  OSS: {
    region: '', // OSS 所在的区域，如：oss-cn-hangzhou
    bucket: '' // 填写你在阿里云申请的 Bucket，如：movin-h5
  },
  // 建议使用 AccessKey 子用户
  accessKey: {
    id: '', // 填写阿里云提供的 Access Key ID，如：LTAIR1m312sdawwq
    secret: '' // 填写阿里云提供的 Access Key Secret，如：v96wAI0Gkx2qVcEO2F1V31231
  }
}

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
        file.fileSuffix !== 'html' &&
        file.putPath.indexOf('service-worker.js') === -1
      ) {
        let res = yield client.put(file.putPath, file.getPath, {})
        if (res.res.status === 200) {
          console.log(`☘️  [有缓存文件]：${res.name}`)
        } else {
          console.log(`❌  [有缓存文件]：${res.name}`)
        }
      }
    }
    for (let file of files) {
      if (
        file.fileSuffix === 'html' ||
        file.putPath.indexOf('service-worker.js') > -1
      ) {
        let res = yield client.put(file.putPath, file.getPath, {
                    headers: {
                      'Cache-Control': 'no-cache, private'
                    }
                  })
        if (res.res.status === 200) {
          console.log(`☘️  [无缓存文件]${res.name}`)
        } else {
          console.log(`❌  [无缓存文件]${res.name}`)
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
