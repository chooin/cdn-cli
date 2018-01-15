module.exports = ({
  status,
  hasCache,
  putPath
}) => {
  console.log(`${status ? '☘  ' : '❌  '}${hasCache ? '       ' : '[Cache]'}    ${putPath}`)
}
