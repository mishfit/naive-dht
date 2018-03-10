import EventEmitter from 'events'

class DistributedHashTable extends EventEmitter {
  constructor () {
    super()
    this.hashTable = {}
    this.Store = this.post.bind(this)
    this.KeyExists = this.exists.bind(this)
    this.Retrieve = this.get.bind(this)
  }

  get (key) { return this.hashTable[key] }
  
  post (key, data) {
    if (data && Buffer.isBuffer(data) && typeof key === 'string') {
      const oldData = this.hashTable[key]
      this.hashTable[key] = data

      if (oldData === undefined || !data.equals(oldData)) {
        this.emit('change', key)
      }
    }
  }

  exists (key) { return this.hashTable.hasOwnProperty(key) }
}

export const dht = new DistributedHashTable
