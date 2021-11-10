console.log ('Ready')
// const children = document.body.childNodes
// console.log(children.length)
// for (const child of children) {
//     console.log(child)
// }

// setTimeout(() => {
//     const items = []

//     const content = document.getElementById('content')
//     const section = content.children[2]
//     const component = section.children[2]
//     const rows = component.children

//     const sampleRow = rows[1]
//     const sampleRowChildren = sampleRow.children

//     const translation = sampleRowChildren[0]
//     const translationCont = translation.children[0]
//     items.push(translationCont.outerHTML)

//     const sentence = sampleRowChildren[1]
//     const sentenceText = sentence.children[0]
//     items.push(sentenceText.outerHTML)

//     const source = sampleRowChildren[2]
//     items.push(source.outerHTML)
// }, 5 * 1000)

// const html = document.documentElement.outerHTML

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
    const json = await response.json()
    const restError = json
    throw Error(restError.message)
  } else {
    const json = await response.json()
    const successObj = json
    console.log(successObj.message)
  }

  closeTab()
}

function closeTab() {
  chrome.runtime.sendMessage('closeTab')
}

function getContentElement() {
  const content = document.getElementById('searchPage_example')
  return content
}

function onDataReady() {
  const contentElement = getContentElement()
  const contentHtml = contentElement.outerHTML
  const htmlUpdate = {
    content: contentHtml
  }
  postToMiddleServer(htmlUpdate, '/api/htmlContent')
}

let checkDataInterval = setInterval(() => {
  const isDataReady = getContentElement() !== null
  if (isDataReady) {
    clearInterval(checkDataInterval)
    onDataReady()
  }
}, 300)