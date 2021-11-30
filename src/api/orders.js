import service from '@/utils/service'
import postApi from '@/api/post'

const baseUrl = '/api/admin/orders'

const orderApi = {}

orderApi.getLatest = (start, top) => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top,
      start: start
    },
    method: 'get'
  })
}
orderApi.passOrder = (id, state) => {
  return service({
    url: `${baseUrl}/passOrder`,
    method: 'post',
    data: { id: id },
    params: {
      id: id,
      state: state
    }
  })
}

orderApi.deleteOrder = id => {
  return service({
    url: `${baseUrl}/deleteOrder`,
    method: 'post',
    data: { id: id },
    params: {
      id: id
    }
  })
}

orderApi.countOrder = () => {
  return service({
    url: `${baseUrl}/countOrder`,
    method: 'post'
  })
}

orderApi.queryOrder = (username, state, datetime) => {
  return service({
    url: `${baseUrl}/queryOrder`,
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

export default orderApi
