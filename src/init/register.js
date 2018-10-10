import bridge from 'bridge'

bridge.config({
  app_id: 'wps',
  access_key: '123456'
}).then(() => {
  return bridge.loadModule({
    module: 'wps_office'
  })
})
