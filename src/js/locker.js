import { pad } from './utils/system'
import fs from 'fs'

class Locker {
  constructor () {
    this.locks = {}
    process.on('exit', this.unlock.bind(this))
  }

  lock (index = 0) {
    const path = `./.data/naive-dht-${pad(index)}.lock`

    fs.open(path, 'wx', (e, fd) => {
      if (!e) {
        this.locks[path] = fd
      } else {
        if (e.code !== 'EEXIST') console.error(e)
        this.lock(index + 1)
      }
    })
  }

  unlock () {
    Object.keys(this.locks).forEach(path => {
    try { 
      fs.closeSync(this.locks[path])
      fs.unlinkSync(path)
    } catch (err) { console.error(err) }
    })
  }

  write (value) {
    Object.values(this.locks).forEach(fd => {
      try {
        const text = typeof value === 'string' ?
          value : JSON.stringify(value)

        fs.write(fd, text, (e) => { console.error(e) })
      } catch (err) { console.error(err) }
    })
  }
}

export const locker = new Locker

