import { spawnAndExit } from './subprocess'
import { locker } from './locker'
import { listener } from './listener'
import { generator } from './generator'
import bootstrap from './bootstrap'
import { peers } from './peers'

if (!spawnAndExit(__filename)) {
  console.log('running as child')
  locker.lock()
  listener.start()
  .then(() => {
    locker.write({
      pid: process.pid,
      listener: listener.address()
    })

    bootstrap.set(listener.address())
      .catch(() => {
        bootstrap.get()
        .then(address => {
          peers.connect(address, true)
        })
      })
    generator.start()
  })

  peers.on('bootstrap:disconnect', () => {
    bootstrap.set(listener.address())
      .catch(() => { /* someone else got there first */ })
  })
}

