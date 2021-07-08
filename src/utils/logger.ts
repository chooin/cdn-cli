import kleur from 'kleur'

export const success = ({
  hasCache,
  getPath,
  putPath
}) => {
  const status = kleur.green('[成功]'.padEnd(16))
  hasCache = hasCache
    ? kleur.yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16)
  const arrow = kleur.yellow(' -> ')
  console.log(`${status}${hasCache}${getPath}${arrow}${putPath}`)
}

export const fail = ({
  hasCache,
  getPath,
  putPath
}) => {
  const status = kleur.red('[失败]'.padEnd(16))
  hasCache = hasCache
    ? kleur.yellow('[不支持]'.padEnd(15))
    : '[支持]'.padEnd(16)
  const arrow = kleur.yellow(' -> ')
  console.log(`${status}${hasCache}${getPath}${arrow}${putPath}`)
}
