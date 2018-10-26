const userTpl = require('../views/user.html')
const userBtnTpl = require('../views/user.btn.html')

import userModel from '../models/user'

let signupClicked = true
let isSignin = false

// 给登录注册按钮绑定事件
const _bindUserInfoEvents = () => {
  // 编程思想：
  // 以数据来驱动页面的更新，不再进行DOM操作
  $('.userinfo-btn').on('click', 'span', function () {
    let type = $(this).attr('type')
    if (type === 'signin') {
      signupClicked = false
    }
    
    // 注册逻辑
    if (type === 'signup') {
      signupClicked = true
    }
    
    $('#userbtn').html(template.render(userBtnTpl, {
      signupClicked
    }))

    $('#userform').get(0).reset()

    $('#sign').on('click', async function () {
      let url = signupClicked ? '/api/user/signup' : '/api/user/signin'
      let data = $('#userform').serialize()
      let result = await userModel.sign({
        url,
        data
      })

      // 用户登录或注册成功处理
      if (signupClicked) {
        alert(result.data.msg)
      } else {
        isSignin = true
        $('#user').html(template.render(userTpl, {
          isSignin,
          username: result.data.username
        }))
      }
    })
  })
}

const render = () => {
  // 渲染：判断用户是否登录
  // todo
  // 开始渲染

  $('#user').html(template.render(userTpl, {
    isSignin
  }))

  $('#userbtn').html(template.render(userBtnTpl, {
    signupClicked
  }))
  

  // 如果用户没有登录，再去绑定显示用户登录信息的窗口，为了减少不必要的事件绑定
  if (!isSignin) {
    _bindUserInfoEvents()
  }
}

export default {
  render
}