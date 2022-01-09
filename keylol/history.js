// ==UserScript==
// @name         history
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add history feature for Keylol
// @author       yuyinws
// @include      https://keylol.com/t*
// @icon         https://keylol.com/favicon.ico
// @grant        unsafeWindow
// ==/UserScript==
class DB {
  constructor() {
    this.initDB()
  }

  initDB() {
    let request = window.indexedDB.open('history_view')
    request.onsuccess = (event) => {
      this.db = event.target.result
      console.log('数据库打开成功')
    }
    request.onupgradeneeded = function (event) {
      this.db = event.target.result
      var objectStore
      if (!this.db.objectStoreNames.contains('history')) {
        objectStore = this.db.createObjectStore('history', {
          keyPath: 'id',
          autoIncrement: true,
        })
        objectStore.createIndex('titleIndex', 'tid', { unique: false })
      }
      console.log('数据库升级成功')
    }
  }

  async addHistory(tid, title) {
    try {
      const findOne = await this.findOneByTID(tid)
      console.log(findOne)
      if (findOne) {
        await this.deleteOneByID(findOne.id)
      }
      this.addOne(tid, title)
    } catch (error) {
      console.log(error)
    }
  }

  async addOne(tid, title) {
    return new Promise((resolve, reject) => {
      let request = this.db
        .transaction(['history'], 'readwrite')
        .objectStore('history')
        .add({
          tid: tid,
          title: title,
        })
      request.onsuccess = (event) => {
        resolve(event)
        console.log('数据写入成功')
      }

      request.onerror = (event) => {
        reject(event)
        console.log('数据写入失败', event)
      }
    })
  }

  async deleteOneByID(id) {
    return new Promise((resolve, reject) => {
      let request = this.db
        .transaction(['history'], 'readwrite')
        .objectStore('history')
        .delete(id)

      request.onsuccess = (event) => {
        resolve(event)
        console.log('数据删除成功')
      }
      request.onerror = (error) => {
        reject(error)
      }
    })
  }

  async findOneByTID (tid) {
    let transaction = this.db.transaction(['history'])
    let objectStore = transaction.objectStore('history')
    let index = objectStore.index('titleIndex')
    let request = index.get(tid)
    return new Promise((resolve, reject) => {
      request.onsuccess = (event) => {
        resolve(event.target.result)
      }
      request.onerror = (event) => {
        reject(event)
      }
    })
  }

  async readAll () {
    let objectStore = this.db.transaction('history_view').objectStore('history')
    objectStore.openCursor().onsuccess = (event) => {
      let cursor = event.target.result;
      if (cursor) {
        console.log(cursor)
        cursor.continue()
      } else {
        console.log('没有更多数据了！');
      }
    }
  }
}

;(function () {
  'use strict'
  const tID = window.location.pathname.split('t')[1].split('-')[0]
  const title = document.querySelector('#thread_subject').title
  console.log(tID, title)
  let db = new DB()
  setTimeout(() => {
    db.addHistory(tID, title)
    db.readAll()
  }, 3000)
})()

