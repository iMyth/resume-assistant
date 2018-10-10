let fs = require('fs')
let path = require('path')
let i
let count = 0
let _getAllFilesFromFolder = function (dir) {
  let filesystem = require('fs')
  let results = []

  filesystem.readdirSync(dir).forEach(function (file) {
    file = dir + '/' + file
    let stat = filesystem.statSync(file)

    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file))
    } else results.push(file)
  })
  return results
}

function readFiles (dir, onFileContent, onError) {
  let length = _getAllFilesFromFolder(dir).length
  // console.log('文件总数：', length)
  let counted = 0
  _getAllFilesFromFolder(dir).forEach(function (filename) {
    fs.createReadStream(filename)
    .on('data', function (chunk) {
      for (i = 0; i < chunk.length; ++i) {
        if (chunk[i] === 10) count++
      }
    })
    .on('end', function () {
      counted++
      if (counted === length) {
        console.log('代码总行数：' + count)
      }
    })
  })
}
readFiles(path.resolve(__dirname, ''), () => {}, err => console.log(err))
