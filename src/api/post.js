import service from '@/utils/service'

const baseUrl = '/api/admin/posts'

const postApi = {}

postApi.listLatest = top => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top
    },
    method: 'get'
  })
}

postApi.query = params => {
  return service({
    url: baseUrl,
    params: params,
    method: 'get'
  })
}

postApi.get = postId => {
  return service({
    url: `${baseUrl}/${postId}`,
    method: 'get'
  })
}

postApi.inStock = (categories, inStock) => {
  return service({
    url: baseUrl + '/inStock',
    method: 'post',
    data: inStock,
    params: {
      categories: categories
    }
  })
}
postApi.inStockAll = inStock => {
  return service({
    url: baseUrl + '/inStockAll',
    method: 'post',
    data: inStock
  })
}

postApi.create = (postToCreate, autoSave) => {
  return service({
    url: baseUrl,
    method: 'post',
    data: postToCreate,
    params: {
      autoSave: autoSave
    }
  })
}

postApi.update = (postId, postToUpdate, autoSave) => {
  return service({
    url: `${baseUrl}/${postId}`,
    method: 'put',
    data: postToUpdate,
    params: {
      autoSave: autoSave
    }
  })
}

postApi.updateDraft = (postId, content) => {
  return service({
    url: `${baseUrl}/${postId}/status/draft/content`,
    method: 'put',
    data: {
      content: content
    }
  })
}

postApi.updateStatus = (postId, status) => {
  return service({
    url: `${baseUrl}/${postId}/status/${status}`,
    method: 'put'
  })
}

postApi.updateStatusInBatch = (ids, status) => {
  return service({
    url: `${baseUrl}/status/${status}`,
    data: ids,
    method: 'put'
  })
}

postApi.delete = postId => {
  return service({
    url: `${baseUrl}/${postId}`,
    method: 'delete'
  })
}

postApi.deleteInBatch = ids => {
  return service({
    url: `${baseUrl}`,
    data: ids,
    method: 'delete'
  })
}

postApi.preview = postId => {
  return service({
    url: `${baseUrl}/preview/${postId}`,
    method: 'get'
  })
}

postApi.postStatus = {
  PUBLISHED: {
    value: 'PUBLISHED',
    color: 'green',
    status: 'success',
    text: '?????????'
  },
  DRAFT: {
    value: 'DRAFT',
    color: 'yellow',
    status: 'warning',
    text: '??????'
  },
  RECYCLE: {
    value: 'RECYCLE',
    color: 'red',
    status: 'error',
    text: '?????????'
  },
  INTIMATE: {
    value: 'INTIMATE',
    color: 'blue',
    status: 'success',
    text: '??????'
  }
}

postApi.permalinkType = {
  DEFAULT: {
    type: 'DEFAULT',
    text: '??????'
  },
  YEAR: {
    type: 'YEAR',
    text: '?????????'
  },
  DATE: {
    type: 'DATE',
    text: '?????????'
  },
  DAY: {
    type: 'DAY',
    text: '????????????'
  },
  ID: {
    type: 'ID',
    text: 'ID ???'
  },
  ID_SLUG: {
    type: 'ID_SLUG',
    text: 'ID ?????????'
  }
}
export default postApi
