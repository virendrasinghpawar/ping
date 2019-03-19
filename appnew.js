var app = require('http').createServer(handler)
var io = require('socket.io')(app)
var fs = require('fs')

app.listen(3000)

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading index.html')
    }

    res.writeHead(200)
    res.end(data)
  })
}


let visitorsData = {}
io.on('connection', function (socket) {
// setInterval(function(){sendmessage(socket)},1000)
  socket.on('addMessage', function (data) {
    data.socketId = socket.id
    console.log('data from socket.io', data)
  })

  socket.on('visitorData', function (visitorData) {
    // visitorsData.push(visitorData);
    console.log('insert record for the visitor')
    visitorsData[socket.id] = visitorData
    // console.log("from server",visitorData)
    // printArray()
    io.emit('computedData', visitorComputation())
  })
  socket.on('disconnect', () => {
    console.log('deleting record')
    delete visitorsData[socket.id]
    io.emit('computedData', visitorComputation())
  })
})
function computeUser () {
  return Object.keys(visitorsData).length
}
// get the total number of users on each page of our site
function computePageCounts () {
  // sample data in pageCounts object:
  // { "/": 13, "/about": 5 }
  var pageCounts = {}
  for (var key in visitorsData) {
    var page = visitorsData[key].page
    if (page in pageCounts) {
      pageCounts[page]++
    } else {
      pageCounts[page] = 1
    }
  }
  return pageCounts
}
function computeBrowsercount () {
  // sample data in pageCounts object:
  // { "/": 13, "/about": 5 }
  var browserCounts = {}
  for (var key in visitorsData) {
    var browser = visitorsData[key].browser.name
    // browserCounts.hasOwnProperty(browser)
    if (browser in browserCounts) {
      browserCounts[browser]++
    } else {
      browserCounts[browser] = 1
    }
  }
// browserData=[
//   {"key":"Chrome","y":0}
// ]

  return browserCounts
}

// get the total number of users per referring site
function computeRefererCounts () {
  // sample data in referrerCounts object:
  // { "http://twitter.com/": 3, "http://stackoverflow.com/": 6 }
  var referrerCounts = {}
  for (var key in visitorsData) {
    var referringSite = visitorsData[key].referringSite || '(direct)'
    if (referringSite in referrerCounts) {
      referrerCounts[referringSite]++
    } else {
      referrerCounts[referringSite] = 1
    }
  }
  return referrerCounts
}
function visitorComputation () {
  return {
    browser: computeBrowsercount(),
    referrer: computeRefererCounts(),
    page: computePageCounts(),
    // browser:computeBrowser(),
    usersTotal: computeUser()
  }
}
// function printArray(){
//   // this.visitorsData.forEach(function(visitorData) {
//   //   console.log(visitorData);
//   // }, this);
// for (var key in visitorsData) {
//   if (visitorsData.hasOwnProperty(key)) {
//     var element = visitorsData[key];
//     // console.log("inside for in llop")
//     console.log(key,element);
//   }
// }
// }
function sendmessage (socket) {
  socket.emit('message', 'lorem ipsum dolar')
}
function computeData () {
  return this.visitorsData
}
