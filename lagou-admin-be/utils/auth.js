// Node.js require() 多个模块引用同一个模块，这个模块只被引用一次
const fs = require('fs')
const path = require('path')
// token 认证
const jwt = require('jsonwebtoken')
const auth = (token) => {
  let cert = fs.readFileSync(path.resolve(__dirname, '../keys/public.key'))
  return jwt.verify(token, cert, {
        algorithms: ['RS256']
      }, (err, decoded) => {
    return decoded
  })
}

module.exports = auth