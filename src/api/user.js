import service from '@/utils/service'

const baseUrl = '/api/admin/users'

const userApi = {}

userApi.getLatest = (start, top) => {
  return service({
    url: `${baseUrl}/latest`,
    params: {
      top: top,
      start: start
    },
    method: 'get'
  })
}

userApi.deleteUser = id => {
  return service({
    url: `${baseUrl}/deleteUser`,
    params: {
      id: id
    },
    data: {
      id: id
    },
    method: 'post'
  })
}

userApi.updateUser = user => {
  return service({
    url: `${baseUrl}/updateUser`,
    params: {
      user: user,
      userId: user.id
    },
    data: {
      user: user,
      userId: user.id
    },
    method: 'post'
  })
}
userApi.queryUser = (username, student_num) => {
  return service({
    url: `${baseUrl}/queryUser`,
    method: 'post',
    data: {
      username: username,
      student_num: student_num
    },
    params: {
      username: username,
      student_num: student_num
    }
  })
}
userApi.countUser = () => {
  return service({
    url: `${baseUrl}/countUser`,
    method: 'post'
  })
}

userApi.getProfile = () => {
  return service({
    url: `${baseUrl}/profiles`,
    method: 'get'
  })
}

userApi.updateProfile = profile => {
  return service({
    url: `${baseUrl}/profiles`,
    method: 'put',
    data: profile
  })
}

userApi.updatePassword = (oldPassword, newPassword) => {
  return service({
    url: `${baseUrl}/profiles/password`,
    method: 'put',
    data: {
      oldPassword: oldPassword,
      newPassword: newPassword
    }
  })
}

userApi.mfaGenerate = mfaType => {
  return service({
    url: `${baseUrl}/mfa/generate`,
    method: 'put',
    data: {
      mfaType: mfaType
    }
  })
}

userApi.mfaUpdate = (mfaType, mfaKey, authcode) => {
  return service({
    url: `${baseUrl}/mfa/update`,
    method: 'put',
    data: {
      mfaType: mfaType,
      mfaKey: mfaKey,
      authcode: authcode
    }
  })
}

userApi.mfaCheck = authcode => {
  return service({
    url: `${baseUrl}/mfa/check`,
    method: 'put',
    data: {
      authcode: authcode
    }
  })
}

export default userApi
