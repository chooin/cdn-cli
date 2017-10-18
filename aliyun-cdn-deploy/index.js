let co = require('co')
let OSS = require('ali-oss')
let walk = require('walk')

let config = {
  deployDir: '', // 部署以下文件夹里面的内容，如：./dist
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

let files = []

const client = new OSS({
  region: config.OSS.region,
  bucket: config.OSS.bucket,
  accessKeyId: config.accessKey.id,
  accessKeySecret: config.accessKey.secret
})

const consoleUploadStatus = res => {
  if (res.res.status === 200) {
    console.log(`☘️  上传资源文件成功：${res.name}`)
  } else {
    console.log(`❌  上传资源文件失败：${res.name}`)
  }
}

const upload = files => {
  co(function* () {
    for (let file of files) {
      if (file.fielSuffix !== 'html') {
        let res = yield client.put(file.putPath, file.getPath, {})
        consoleUploadStatus(res)
      }
    }
    for (let file of files) {
      if (file.fielSuffix === 'html') {
        let res = yield client.put(file.putPath, file.getPath, {
                    headers: {
                      'Cache-Control': 'no-cache, private'
                    }
                  })
        consoleUploadStatus(res)
      }
    }
  }).catch(_ => {
    console.log(_)
  })
}

(() => {
  let walker  = walk.walk(config.deploy.dir, { followLinks: false })
  walker.on('file', (root, stat, next) => {
    files.push({
      getPath: `${root}/${stat.name}`,
      putPath: `${root}/${stat.name}`.replace(config.deploy.dir, ''),
      fielSuffix: stat.name.split('.').pop().toLowerCase()
    })
    next()
  })
  walker.on('end', () => {
    upload(files)
  })
})()

(() => {
  let walker  = walk.walk(config.deployDir, {followLinks: false })
  walker.on('file', (root, stat, next) => {
    files.push(`${root}/${stat.name}`)
    next()
  })
  walker.on('end', () => {
    upload(files)
  })
})()
