let co = require('co')
let OSS = require('ali-oss')
let walk = require('walk')

let config = {
  deploy: {
    dirs: ['./docs'], // 部署以下文件夹里面的内容，如：./dist
    files: ['./index.html'] // 部署以下文件，如：index.html
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
      if (file.fileSuffix !== 'html') {
        let res = yield client.put(file.putPath, file.getPath, {})
        consoleUploadStatus(res)
      }
    }
    for (let file of files) {
      if (file.fileSuffix === 'html') {
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
  let walker  = walk.walk('.', { followLinks: false })
  let files = []
  walker.on('file', (root, stat, next) => {
    if (config.deploy.dirs.includes(root)) {
      files.push({
        getPath: `${root}/${stat.name}`,
        putPath: `${root}/${stat.name}`.substring(1),
        fileSuffix: stat.name.split('.').pop().toLowerCase()
      })
    }
    next()
  })
  for (let file of config.deploy.files) {
    files.push({
      getPath: file,
      putPath: file.substring(1),
      fileSuffix: file.split('.').pop().toLowerCase()
    })
  }
  walker.on('end', () => {
    upload(files)
  })
})()
