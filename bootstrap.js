import fs from 'fs'

const path = './.data/bootstrap.json'

class Boostrapper {
  constructor () {
    process.on('exit', this.unset.bind(this))
  }

  get () {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf8', (e, data) => {
        if (!e) {
          const address = JSON.parse(data)
          resolve(address)
        } else {
          reject(e)
        }
      })
    })
  }

  set (address) {
    return new Promise((resolve, reject) => {
      const text = JSON.stringify(address)
      fs.writeFile(path, text, { flag: 'wx' }, (e) => {
        if (!e) {
          resolve(true)
        } else {
          if (e.code !== 'EEXIST') console.error(e)
          reject(e)
        }
      })
    })
  }

  unset () {
    try {
      fs.unlinkSync(path)
    } catch (err) { console.error(err) }
  }
}

export const bootstrap = new Boostrapper
