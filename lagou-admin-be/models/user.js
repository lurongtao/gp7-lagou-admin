const mongoose = require('../utils/database')

// 创建Schema，创建集合
const userSchema = new mongoose.Schema({
  username: String,
  password: String
})
const UserModel = mongoose.model('users', userSchema)

const signup = (data) => {
  let userModel = new UserModel(data)
  return userModel
    .save()
    .then((result) => {
      return result
    })
}

module.exports = {
  signup
}