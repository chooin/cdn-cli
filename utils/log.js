module.exports = ({
  status,
  hasCache,
  putPath
}) => {
  console.log(`${status ? '☘  ' : '❌  '}${hasCache ? '[No-cache]' : '          '} ${putPath}`)
}
