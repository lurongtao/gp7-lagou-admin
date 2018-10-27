const sign = ({url, data}) => {
  return $.ajax({
    url,
    data,
    type: 'POST'
  })
    .then((result, status, xhr) => {
      return {
        result,
        token: xhr.getResponseHeader('x-access-token')
      }
    })
}

const isSignin = ({token}) => {
  return $.ajax({
    url: '/api/user/isSignin',
    headers: {
      'X-Access-Token': token
    },
    success: (result) => {
      return result
    }
  })
}

const signout = () => {
  return $.ajax({
    url: '/api/user/signout',
    dataType: 'json',
    success: (result) => {
      return result
    }
  })
}

export default {
  sign,
  isSignin,
  signout
}