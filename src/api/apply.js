import service from '@/utils/service'

const baseUrl = '/api/admin/compete'

const applyApi = {}

applyApi.getLatest = (start, top) => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top,
      start: start
    },
    method: 'get'
  })
}

applyApi.countOrder = () => {
  return service({
    url: `${baseUrl}/countCompete`,
    method: 'post'
  })
}

applyApi.queryOrder = (username, datetime) => {
  return service({
    url: `${baseUrl}/queryCompete`,
    method: 'post',
    data: {
      username: username,
      createTime: datetime
    },
    params: {
      username: username,
      createTime: datetime
    }
  })
}

export default applyApi
