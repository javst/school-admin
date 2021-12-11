import service from '@/utils/service'

const baseUrl = '/api/admin/instock'

const inStockApi = {}

inStockApi.getLatest = (start, top) => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top,
      start: start
    },
    method: 'get'
  })
}

inStockApi.countInStock = () => {
  return service({
    url: `${baseUrl}/countOrder`,
    method: 'post'
  })
}

inStockApi.queryOrder = (importPeople, datetime) => {
  return service({
    url: `${baseUrl}/queryOrder`,
    method: 'post',
    data: {
      importPeople: importPeople,
      createTime: datetime
    },
    params: {
      importPeople: importPeople,
      createTime: datetime
    }
  })
}
export default inStockApi
