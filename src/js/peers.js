import EventEmitter from 'events'
import { dht } from './dht'
import { listener } from './listener'
import { hash, fromBuffer, toBuffer } from './utils/system'
import net from 'net'

const hashOfPeers = hash('peers')
const hashOfKeys = hash('keys')

class Peers extends EventEmitter {
  constructor() {
    super()
    this.sockets = {}
    listener.on('peer:new', this.onPeer.bind(this))
    listener.on('peer:close', this.onDisconnect.bind(this))
    listener.on('data', this.onData.bind(this))
    dht.on('change', this.onChange.bind(this))
  }

  connect (address, bootstrap = false) {
    const hashOfAddress = hash(address)
    if (bootstrap) {
      this.bootstrapHash = hashOfAddress
    }

    const socket = net.createConnection(address, () => {
      socket.on('data', this.onData.bind(this, address))
      socket.on('close', this.onDisconnect.bind(this, address))
      this.sockets[hashOfAddress] = socket
      this.onPeer(address)
    })
  }

  onChange (key) {
    // announce
    const data = fromBuffer(dht.get(key)),
          message = { type: 'announce', key, data }

    console.log('peer:on change', message)
    const value = JSON.stringify(message)
    Object.values(this.sockets).forEach(socket => {
      socket.write(value, 'utf8')
    })
  }
  
  onData (address, value) {
    // process message
    let message = value
    try { message = JSON.parse(message) } catch (e) { }
    const hashOfAddress = hash(address),
          { type, key, data } = message

    if (type === 'announce') {
      this.update(address, key, data)
    } else if (type === 'request') {
      this.respond(address, key)
    }
  }

  onPeer (address) {
    // reconfigure 'peers'
    const hashOfAddress = hash(address),
          bufferOfPeers = dht.get(hashOfPeers)

    const peers = bufferOfPeers ? fromBuffer(bufferOfPeers) : {}

    peers[hashOfAddress] = { address, keys: {} }
    dht.post(hashOfPeers, toBuffer(peers))
  }

  onDisconnect (address) {
    const hashOfAddress = hash(address)
    delete this.sockets[hashOfAddress]

    if (this.bootstrapHash === hashOfAddress) {
      this.emit('bootstrap:disconnect')
      delete this.bootstrapHash
    }

    // reconfigure 'peers'
    const bufferOfPeers = dht.get(hashOfPeers)

    if (bufferOfPeers) {
      const peers = fromBuffer(bufferOfPeers)

      delete peers[hashOfAddress]

      dht.post(hashOfPeers, toBuffer(peers))
    }
  }

  respond (address, key) {
    if (dht.exists(key)) {
      const data = fromBuffer(dht.get(key)),
            message = { type: 'response', key, data },
            socket = this.sockets[hashOfAddress],
            value = JSON.stringify(message)
      if (socket) {
          socket.write(value, 'utf8')
      }
    }
  }

  update (addres, key, data) {
    const bufferOfPeers = dht.get(hashOfPeers)
    const peers = bufferOfPeers ? fromBuffer(bufferOfPeers) : {}

    if (key === hashOfKeys) {
      // add keys to peer for later retrieval upon request
      const peer = peers[hashOfAddress]

      if (peer.hasOwnProperty('keys')) {
        peer.keys[key] = data
      } else {
        const keys = {}

        keys[key] = data
        peer.keys = keys
      }
    } else if (key == hashOfPeers) {
      // update peers list of peers
      const socketPeerHashes = Object.keys(this.sockets),
            peerCandidateHashes = Object.keys(data)

      const unpeered = peerCandidateHashes.filter(p => socketPeerHashes.indexOf(p) === -1)

      unpeered.forEach(p => {
        try {
          this.connect(data[p].address)
        } catch (e) {
          console.log(e)
        }
      })
    //} else if (key === hashOfData) {
      // 
    }

    dht.post(key, toBuffer(peers))
  }
}

export const peers = new Peers

