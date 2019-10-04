const soap = require('soap')
const express = require('express')
const path = require('path')

class Book {
  constructor(name = '', year = 0) {
    this.name = name
    this.year = year
  }
}

let myService = {
  Library: {
    BookLibrary: {
      bookYear: args => {
        let book = args.book
        books = [
          new Book('test 1', 2011),
          new Book('test 2', 2012),
          new Book('test 3', 2013)
        ]

        findBook = bookk => {
          return bookk.name == book.name
        }

        return { year: books.find(findBook).year }
      }
    }
  }
}

var xml = require('fs').readFileSync('Library.wsdl', 'utf8')

var app = express()

app.set('port', process.env.PORT || 3000)

app.use(express.json())

app.use(express.static(path.join(__dirname, 'public')))

app.listen(app.get('port'), function() {
  soap.listen(app, '/Library', myService, xml, function() {
    console.log(`server initialized on port ${app.get('port')}`)
  })
})
