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

const upload = files => {
  files.map(file => {
    co(function* () {
      // 所有文件名以 .html 结尾的设置不带缓存
      let option = file.replace(config.deployDir, '').includes('.html')
                   ? {
                       headers: {
                          'Cache-Control': 'no-cache, private'
                       }
                     }
                   : {}
      let result = yield client.put(file.replace(config.deployDir, ''), file, option)
      if (result.res.status === 200) {
        console.log(`☘️  上传成功：${result.name}`)
      } else {
        console.log(`❌  上传失败：${result.name}`)
      }
    }).catch(err => {
      console.log(err)
    })
  })
}

(() => {
  let walker  = walk.walk(config.deployDir, { followLinks: false })
  walker.on('file', (root, stat, next) => {
    files.push(`${root}/${stat.name}`)
    next()
  })
  walker.on('end', () => {
    upload(files)
  })
})()
