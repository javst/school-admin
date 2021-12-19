import service from '@/utils/service'
import postApi from '@/api/post'

const baseUrl = '/api/admin/hero'

const heroApi = {}

heroApi.getLatest = (start, top) => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top,
      start: start
    },
    method: 'get'
  })
}
heroApi.passHero = (id, state) => {
  return service({
    url: `${baseUrl}/passHero`,
    method: 'post',
    data: { id: id },
    params: {
      id: id,
      state: state
    }
  })
}
heroApi.refuseHero = (id, state, advice) => {
  return service({
    url: `${baseUrl}/refuseHero`,
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
heroApi.deleteHero = id => {
  return service({
    url: `${baseUrl}/deleteHero`,
    method: 'post',
    data: { id: id },
    params: {
      id: id
    }
  })
}

heroApi.countHero = () => {
  return service({
    url: `${baseUrl}/countHero`,
    method: 'post'
  })
}

heroApi.queryHero = (username, state, datetime) => {
  return service({
    url: `${baseUrl}/queryHero`,
    method: 'post',
    data: {
      username: username,
      state: state,
      createTime: datetime
    },
    params: {
      username: username,
      state: state,
      createTime: datetime
    }
  })
}

postApi.update = (orderId, orderToUpdate, autoSave) => {
  return service({
    url: `${baseUrl}/${orderId}`,
    method: 'post',
    data: orderToUpdate,
    params: {
      autoSave: autoSave
    }
  })
}

export default heroApi
