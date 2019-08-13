const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const chalk = require('chalk')
const inquirer = require('inquirer')

module.exports.createFile = ({
  from,
  to,
  replace = [],
  tip = true
}) => {
  fse.copy(from, to).then(() => {
    fs.readFile(to, 'utf8', (err, data) => {
      if (data) {
        for (let i in replace) {
          data = data.replace(
            new RegExp(`\\[${replace[i].from}\\]`, 'g'),
            replace[i].to
          )
        }
        fs.writeFile(to, data, 'utf8', err => {
          if (err) {
            console.log(`- ${chalk.red(`失败 `)}`)
          } else {
            if (tip) {
              console.log(`- ${chalk.green(`完成 `)}${path.resolve(to)}`)
            } else {
              console.log(`- ${chalk.green(`完成 `)}`)
            }
          }
        })
      } else {
        if (tip) {
          console.log(`- ${chalk.green(`完成 `)}${path.resolve(to)}`)
        } else {
          console.log(`- ${chalk.green(`完成 `)}`)
        }
      }
    })
  })
}

module.exports.canCreateFile = ({
  to
}) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path.resolve(to))) {
      inquirer.prompt([{
        type: 'confirm',
        message: '文件已存在，继续？',
        name: 'ok',
        default: false
      }]).then(answers => {
        if (answers.ok) {
          resolve()
        } else {
          reject()
        }
      }).catch(console.log)
    } else {
      resolve()
    }
  })
}