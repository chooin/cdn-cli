import glob from 'glob'
import kleur from 'kleur'
import ora from 'ora'
import config from './config'

interface File {
  from: string;
  to?: string;
  ignore?: boolean;
  lastUpload?: boolean;
  hasCache?: boolean;
}

const walk = () => {

}

const deploy = (environment) => {
  config.environment = config.environments[environment]
  if (!config.environment) {
    console.log(kleur.red('错误，请检查 deploy.config.js 中 environment 是否存在'))
    process.exit(1)
  }
}

export {
  deploy
}
