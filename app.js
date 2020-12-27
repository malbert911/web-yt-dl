const express = require('express')
const app = express()
const fs = require('fs')
const youtubedl = require('youtube-dl')


//set the template engine ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))






//routes
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/download', (req, res) => {
    let url = req.query.url;
    let type = req.query.type;
    res.render('index');

    switch(type){
        case 'mp4':
            downloadVideo(url);
            break;
    }
})

function downloadVideo(url){
    const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname })

    //filename will be the Youtube video id for now
    let filename = url.substring(url.indexOf('v=') + 2) + ".mp4";
  
  // Will be called when the download starts.
  
  video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
    //filename = info._filename
  })
  
  video.pipe(fs.createWriteStream(filename))
}

//Listen on port 3000
server = app.listen(3000)

