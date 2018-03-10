import net from 'net'
import EventEmitter from 'events'

class Listener extends EventEmitter {
  constructor () {
    super()
    this.server = net.createServer((socket) => {
      socket.setEncoding('utf8')
      socket.on('close', this.onClose.bind(this, socket.address()))
      socket.on('data', this.onData.bind(this, socket.address()))

      this.emit('peer:new', socket.address())
    }).on('error', this.onError.bind(this))
  }

  address () {
    if (this.server.listening) return this.server.address()
  }

  start () {
    if (this.server.listening) return Promise.resolve(true)

    return new Promise((resolve, reject) => {
       const callback = (e) => {
        reject(e)
       }

       this.server.once('error', callback)

       this.server.listen(() => {
        this.server.removeListener('error', callback)
        console.log('opened server on', this.server.address())

        this.emit('listening')
        resolve(true)
      })
    })
  }

  stop () {
    this.server.close()
  }

  onError (e) { this.emit('error', e) }
  onClose (address) { this.emit('peer:close', address) }
  onData (address, data) {
    this.emit('data', address, data)
  }
}

export const listener = new Listener
