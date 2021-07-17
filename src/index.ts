import glob from 'glob'
import minimatch from 'minimatch'
import kleur from 'kleur'
import ora from 'ora'
import {join} from 'path'
import {config, setConfig, Rule} from './config'
import {file} from './utils'

const deploy = async (environment) => {
  await setConfig(environment)

  console.log(config)
}

export {
  deploy
}
