let co = require('co')
let OSS = require('ali-oss')
let walk = require('walk')
let files = []

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: ''
})

const upload = files => {
  files.map(file => {
    co(function* () {
      let result = yield client.put(file.replace('./dist/', ''), file)
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
  let walker  = walk.walk('./dist', { followLinks: false })
  walker.on('file', (root, stat, next) => {
    files.push(`${root}/${stat.name}`)
    next()
  })
  walker.on('end', () => {
    upload(files)
  })
})()
