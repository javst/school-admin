export const setDocumentTitle = function(title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
    const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function() {
      setTimeout(function() {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

export const domTitle = '阜阳师范大学计算机与信息工程学院实验室'
