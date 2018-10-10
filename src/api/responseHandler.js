export function defaultHandler (resp, resolve, reject) {
  if (typeof resp === 'string') {
    resp = JSON.parse(resp)
  }
  if (!resp.result || !resp.data) {
    return reject(resp)
  }
  if (resp.data && resp.result === 'ok') {
    return resolve(resp.data)
  }
  return reject(resp)
}
