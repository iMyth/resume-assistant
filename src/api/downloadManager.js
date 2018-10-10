import bridge from 'bridge'

export const download = tpl => {
  return bridge.download({
    'download_id': tpl.mb_id,
    'name': tpl.name,
    'price': tpl.price,
    'template_id': tpl.mb_id,
    'template_type': 'wps',
    thumbUrls: [ tpl.thumb_big_url ],
    'thumb_big_url': tpl.thumb_big_url,
    'thumb_small_url': tpl.thumb_small_url
  })
}
