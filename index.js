const express = require('express')
const nkjv = require('./nkjv.json')
const nasb = require('./nasb.json')
const esv = require('./esv.json')
const litv = require('./litv.json')
const geneva = require('./geneva.json')
require("dotenv").config()

const port = process.env.PORT || 8080
const app = express()
let bible = nkjv

// TODO wrap Obadiah, Philemon, 2 & 3 John, Jude in array for chapters

function getBibleVersion(version) {
  switch (version) {
    case 'esv':
      bible = esv 
      break
    case 'litv':
      bible = litv 
      break
    case 'geneva':
      bible = geneva 
      break
    case 'nasb':
      bible = nasb 
      break
    default:
      bible = nkjv
  }
}

app.get('/', (req, res) => {
  res.send('Please add the bible abbreviation /NKJV, /NASB, /LITV, /ESV, /GENEVA or (/GB)')
})

app.get('/:version', (req, res) => {
  res.json(bible)
})

app.get('/:version/:book', async (req, res) => {
  getBibleVersion(req.params.version)
  const bookName = req.params.book.toLowerCase().replace(' ', '')
  console.log(`Retrieving ${req.params.version.toUpperCase()} ${req.params.book}`)
  const json = await bible.books.filter(book => book.name.toLowerCase().replace(' ', '') === bookName)
  res.json(json[0])
 })
 
app.get('/:version/:book/:chapter', async (req, res) => {
  getBibleVersion(req.params.version)
  const bookName = req.params.book.toLowerCase().replace(' ', '')
  const chapter = Number(req.params.chapter)
  console.log(`Retrieving ${req.params.version.toUpperCase()} ${req.params.book} ${chapter}`)
  const json = await bible.books.filter(book => book.name.toLowerCase().replace(' ', '') === bookName)
  res.json(json[0].chapters[chapter - 1])
})

app.get('/:version/:book/:chapter/:verse', async (req, res) => {
  getBibleVersion(req.params.version)
  const bookName = req.params.book.toLowerCase().replace(' ', '')
  const chapter = Number(req.params.chapter)
  const verse = Number(req.params.verse)
  console.log(`Retrieving ${req.params.version.toUpperCase()} ${req.params.book} ${chapter}:${verse}`)
  const json = await bible.books.filter(book => book.name.toLowerCase().replace(' ', '') === bookName)
  res.json(json[0].chapters[chapter - 1].verses[verse - 1])
})


app.listen(port, () => {
  console.log(`Server is running on port :${port}`)
})

module.exports = app


