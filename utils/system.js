import crypto from 'crypto'
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const pad = (n, width = 4) => {
  n = n + ''
  const padding = new Array(Math.max(width - n.length, 0)).fill('0').join('')
  return padding + n
}

export const hash = (value) => {
    const hash = crypto.createHash('sha1'),
          text = typeof value === 'string' ?
            value : JSON.stringify(value)

  hash.update(text)

  return hash.digest('hex')
}

export const toBuffer = (value) => {
  const text = typeof value === 'string' ? value : JSON.stringify(value)

  return Buffer.from(text, 'utf8')
}

export const fromBuffer = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return buffer
  let value = buffer.toString()
  try { value = JSON.parse(value) } catch (e) { }
  return value
}

