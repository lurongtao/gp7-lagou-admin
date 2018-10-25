const userModel = require('../models/user')

const signup = async (req, res, next) => {
  let result = await userModel.signup(req.body)
  if (!!result) {
    res.render('user', {
      ret: true,
      data: JSON.stringify({
        msg: '注册成功~'
      })
    })
  }
}

module.exports = {
  signup
}