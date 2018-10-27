const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../utils/auth')
const userModel = require('../models/user')
const fs = require('fs')
const path = require('path')

const signup = async (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  // 从前端获取到username, password
  let {username,password} = req.body

  // 根据用户名，查找用户是否注册过
  let isSigned = !!(await userModel.findone({
    username
  }))

  if (isSigned) {
    res.render('user', {
      ret: true,
      data: JSON.stringify({
        msg: '用户名已经存在！'
      })
    })
  // 当用户没有注册时，首先将密码加密，再将用户名和加密后的密码入库
  } else {
    let result = await userModel.signup({
      username,
      password: await _doCrypto(password)
    })
    if (!!result) {
      res.render('user', {
        ret: true,
        data: JSON.stringify({
          msg: '注册成功~'
        })
      })
    }
  }
}

// 登录
const signin = async (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  // 此处password 明文传输过来
  let {username, password} = req.body

  // 根据用户名查找用户信息
  let result = await userModel.findone({
    username
  })

  // 如果能查到信息，说明用户存在
  if (!!result) {
    // 密码认证
    let isCorrect = await _comparePwd(password, result.password)

    // 如果密码正确，构建用户登录成功的状态
    if (isCorrect) {
      // 基于jwt 的认证机制
      // 1、生成token
      // 方法一：对称加密

      // 签名
      let cert = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'))
      // 载荷
      let payload = {
        username,
        // 过期时间
        iat: 24 * 60 * 60
      }

      let token = jwt.sign(payload, cert, {
        algorithm: 'RS256'
      })
      res.header('X-Access-Token', token)

      // 将用户名和token给前端
      res.render('position', {
        ret: true,
        data: JSON.stringify({
          username
        })
      })
    } else {
      res.render('user', {
        ret: false,
        data: JSON.stringify({
          msg: '密码错误！'
        })
      })
    }
  } else {
    res.render('user', {
      ret: false,
      data: JSON.stringify({
        msg: '查无此人！'
      })
    })
  }
}

// 判断用户是否登录
const isSignin = async (req, res, next) => {
  res.header('Content-Type', 'application/json; charset=utf-8')

  // 认证过程
  let encoded = await auth(req.header('X-Access-Token'))
  
  if (!!encoded) {
    res.render('user', {
      ret: true,
      data: JSON.stringify({
        username: encoded.username
      })
    })
  } else {
    res.render('user', {
      ret: false,
      data: JSON.stringify({
        msg: '没有权限!'
      })
    })
  }
}

const _doCrypto = (password) => {
  return new Promise((resolve) => {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        resolve(hash)
      });
    });
  })
}

const _comparePwd = (fromUser, fromDatabase) => {
  return new Promise((resolve) => {
    bcrypt.compare(fromUser, fromDatabase, (err, res) => {
      resolve(res)
    })
  })
}

module.exports = {
  signup,
  signin,
  isSignin
}