export const capitalize = string =>
  string
    .split(' ')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')

export const toPrice = num => `$${Number(num).toFixed(2)}`

export const formatPhone = number => {
  var x = number.replace(/\D/g, '').match(/(\d{3})(\d{3})(\d{4})/)
  return '(' + x[1] + ') ' + x[2] + '-' + x[3]
}

export const pad = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
