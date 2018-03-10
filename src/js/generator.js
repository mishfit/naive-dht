import { dht } from './dht'
import { uuidv4, hash, toBuffer } from './utils/system'

const timeouts = [10000, 15000, 20000]

class Generator {
  constructor () {
      this.timeout = timeouts[Math.floor(Math.random() * timeouts.length)]
  }

  start () {
    setInterval(this.generate.bind(this), this.timeout)
  }

  generate () {
    const data = uuidv4(),
          key = hash(data)

    if (!dht.exists(key)) {
      dht.post(key, toBuffer(data))
    }
  }
}

export const generator = new Generator
