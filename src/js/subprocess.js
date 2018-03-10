import { spawn } from 'child_process'

const indexOfChildOption = process.argv.indexOf('--children'),
      indexOfChildOptionValue = indexOfChildOption !== -1 && process.argv.length > (indexOfChildOption + 1) ? indexOfChildOption + 1: -1,
      valueOfChildOption = indexOfChildOptionValue !== -1 ? process.argv[indexOfChildOptionValue] : undefined

let countOfChildren

if (valueOfChildOption) {
  countOfChildren = parseInt(valueOfChildOption)
}

if (isNaN(countOfChildren)) {
  countOfChildren = 0
}

export const spawnAndExit = (path) => {
  if (countOfChildren > 0) {

    console.log(`spawning ${countOfChildren} child(ren)`)
    console.log(process.argv[0])
    console.log(path)

    for (let i = 0; i < countOfChildren; i++) {
      const subprocess = spawn(process.argv[0], [path], {
        detached: true
      })

      console.log('pid of child: ', subprocess.pid)
      subprocess.unref()
    }
    process.exit()
  } else return false
}
