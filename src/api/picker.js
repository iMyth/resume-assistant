const picker = weex.requireModule('picker')

export function pickDate (options) {
  return new Promise((resolve, reject) => {
    picker.pickDate(options || {}, event => {
      if (event.result === 'success') {
        resolve(event.data)
      } else {
        reject(new Error('picke date error'))
      }
    })
  })
}

export function pickTime (options) {
  return new Promise((resolve, reject) => {
    picker.pickTime(options || {}, event => {
      if (event.result === 'success') {
        resolve(event.data)
      } else {
        reject(new Error('picke time error'))
      }
    })
  })
}

export function pick (options) {
  return new Promise((resolve, reject) => {
    picker.pick(options, event => {
      console.log('picker.pickDate====>', event)
      if (event.result === 'success') {
        resolve(event.data || event.multiple_data || 0)
      } else {
        reject(new Error('picke error'))
      }
    })
  })
}
