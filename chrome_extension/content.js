async function postToMiddleServer(obj, apiPath) {
  const proxyServerUrl = 'https://cors-anywhere-jcpr.herokuapp.com'
  const middleServerUrl = 'https://cloze-naver-middle.herokuapp.com'
  
  if (apiPath[0] === '/') {
      apiPath = apiPath.slice(1)
  }

  const fetchUrl = `${proxyServerUrl}/${middleServerUrl}/${apiPath}`

  const response = await fetch(fetchUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj),
  })

  if (!response.ok) {
    const restError = await response.json()
    throw Error(restError.message)
  }
}

function closeTab() {
  chrome.runtime.sendMessage('closeTab')
}

function getContentElement() {
  const content = document.getElementById('searchPage_example')
  return content
}

async function onDataReady() {
  const contentElement = getContentElement()
  const contentHtml = contentElement.outerHTML
  const htmlUpdate = {
    content: contentHtml
  }
  await postToMiddleServer(htmlUpdate, '/api/htmlContent')
  closeTab()
}

let checkDataInterval = setInterval(() => {
  const isDataReady = getContentElement() !== null
  if (isDataReady) {
    clearInterval(checkDataInterval)
    onDataReady()
  }
}, 300)