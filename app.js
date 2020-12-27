const express = require('express')
const app = express()
const fs = require('fs')
const { type } = require('os')
const youtubedl = require('youtube-dl')
const path = require('path'); 
const baseDownloadPath = __dirname + "/public/tmp/"
const ffmpeg = require('ffmpeg-static');


//set the template engine ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));

//=========ROUTES============
app.get('/', (req, res) => {
    res.render('index')
})

//view when the users file is ready
app.get('/downloaded', (req, res) => {
    res.render('downloaded')

})

//fetch call from the user to get the downloaded file
app.get('/get-download', (req, res) => {
    let file = req.query.f;
    res.sendFile(`${baseDownloadPath + file}`);
})

//view for the user while it is downloading
app.get('/downloading', (req, res) => {
    res.render('downloading')
})

//fetch call from the user to check if it is ready while they are on /downloading
app.get('/downloading-check', (req, res) => {
    let file = req.query.f;
    let stats = fs.statSync(baseDownloadPath + file);
    if(stats.size > 0)
        res.json({"downloaded": true});
    else
        res.json({"downloaded": false});

})

//start a download
app.get('/download', (req, res) => {
    let url = req.query.url;
    let type = req.query.type;
    let filename = url.substring(url.indexOf('v=') + 2) + "." + type;
    res.redirect("/downloading?" + filename)
    switch(type){
        case 'mp4':
            downloadVideo(url, type);
            break;
        case 'mp3':
            downloadVideo(url, type);
            break;
    }
})

function downloadVideo(url, format){
    let param;
    switch(format){
        case 'mp4':
            param = ['-f', 'best'];
            break;
        case 'mp3':
            param = ['-f', 'bestaudio', '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0', '--prefer-ffmpeg', '--ffmpeg-location', ffmpeg]
            break;
    }
    
    const video = youtubedl(url, param )

    //filename will be the Youtube video id for now
    let filename = url.substring(url.indexOf('v=') + 2) + "." + format;
  
    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started')
        console.log('filename: ' + info._filename)
        console.log('size: ' + info.size)
  })
  
  //Called when download is completed
  video.on('end', function() {
    console.log("Done!");
  })

  //Save the file
  video.pipe(fs.createWriteStream(baseDownloadPath + filename))  
}

//Listen on port 3000
server = app.listen(3000)

