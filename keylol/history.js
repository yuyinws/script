// ==UserScript==
// @name         history
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add history feature for Keylol
// @author       yuyinws
// @include      https://keylol.com/*
// @icon         https://keylol.com/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==

class History {
  constructor(url) {
    this.history = JSON.parse(window.localStorage.getItem('history')) || []
    if (url.indexOf('https://keylol.com/t') > -1) {
      this.tID = url.split('t')[3].split('-')[0]
      this.tTitle = document.querySelector('#thread_subject').title
      this.add()
    }
  }

  add() {
    this.history.forEach((item, index) => {
      if (item.tID === this.tID) {
        this.history.splice(index, 1)
        return
      }
    })

    this.history.unshift({
      tID: this.tID,
      tTitle: this.tTitle,
    })

    window.localStorage.setItem('history', JSON.stringify(this.history))
  }

  get() {
    return this.history
  }
}

const render = (_hisList) => {
  let ref = document.querySelector('.list-inline').childNodes[4]
  let father = document.querySelector('.list-inline')
  let historyDom = document.createElement('div')
  let historyCard = document.createElement('div')
  let clearHistory = document.createElement('button')
  clearHistory.id = 'clearHistory'
  clearHistory.innerHTML = '清除'
  clearHistory.style.margin = '4px 0 4px 5px'
  clearHistory.style.padding = '4px 8px'
  clearHistory.style.background = '#74bcff'
  clearHistory.style.border = 'none'
  clearHistory.style.color = '#fff'

  historyDom.style.position = 'relative'
  historyDom.id = 'history'
  historyDom.style.height = '30px'
  historyDom.style.lineHeight = '27px'
  historyDom.style.display = 'inline-block'
  historyDom.style.padding = '0 10px'

  historyCard.id = 'historyCard'
  historyCard.style.width = '200px'
  historyCard.style.minHeight = '50px'
  historyCard.style.maxHeight = '200px'
  historyCard.style.overflowY = 'auto'
  historyCard.style.border = '1px solid #D1D5DB'
  historyCard.style.position = 'absolute'
  historyCard.style.left = '-70px'
  historyCard.style.zIndex = '999'
  historyCard.style.backgroundColor = '#fff'
  historyCard.style.display = 'none'

  historyDom.innerHTML =
    '<span id="historyText" style="cursor: pointer;">历史记录</span>'
  father.insertBefore(historyDom, ref)
  historyDom.appendChild(historyCard)
  historyCard.appendChild(clearHistory)

  historyDom.addEventListener('mouseover', () => {
    historyCard.style.display = 'block'
  })
  historyDom.addEventListener('mouseout', () => {
    historyCard.style.display = 'none'
  })

  let historyText = document.querySelector('#historyText')
  historyText.addEventListener('mouseover', () => {
    historyDom.style.backgroundColor = '#74bcff'
    historyText.style.color = '#fff'
  })
  historyText.addEventListener('mouseout', () => {
    historyDom.style.backgroundColor = '#f7f7f7'
    historyText.style.color = '#000'
  })

  clearHistory.addEventListener('click', () => {
    window.localStorage.removeItem('history')
    historyCard.innerHTML = ''
  })

  _hisList.forEach((item) => {
    let historyCardItem = document.createElement('div')
    historyCardItem.style.padding = '5px'
    historyCardItem.style.cursor = 'pointer'
    historyCardItem.style.borderBottom = '1px solid #D1D5DB'
    historyCardItem.style.fontSize = '12px'
    historyCardItem.style.color = '#000'
    historyCardItem.style.lineHeight = '20px'
    historyCardItem.innerHTML = `<a id="aTag" href="https://keylol.com/t${item.tID}-1-1">${item.tTitle}</a>`
    historyCard.appendChild(historyCardItem)
  })
}

;(() => {
  const history = new History(window.location.href)
  render(history.get())
})()
