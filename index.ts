import {readdir, stat} from 'fs-extra'
import * as path from 'path'

async function walk(dir) {
  let files: any = await readdir(dir);
  files = await Promise.all(files.map(async file => {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);
    if (stats.isDirectory()) return walk(filePath);
    else if(stats.isFile()) return filePath;
  }));

  return files.reduce((all, folderContents) => all.concat(folderContents), []);
}

walk('./dist/*').then((res) => {
  console.log(res)
})
