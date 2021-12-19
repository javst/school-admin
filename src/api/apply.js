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
applyApi.passApply = (id, state) => {
  return service({
    url: `${baseUrl}/passApply`,
    method: 'post',
    data: { id: id },
    params: {
      id: id,
      state: state
    }
  })
}
applyApi.refuseApply = (id, state, advice) => {
  return service({
    url: `${baseUrl}/refuseApply`,
    method: 'post',
    data: {
      id: id,
      state: state,
      advice: advice
    },
    params: {
      id: id,
      state: state,
      advice: advice
    }
  })
}

export default applyApi
