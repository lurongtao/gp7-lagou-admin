const sign = ({url, data}) => {
  return $.ajax({
    url,
    data,
    type: 'POST',
    success: (result) => {
      return result
    }
  })
}

export default {
  sign
}