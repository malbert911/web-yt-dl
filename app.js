const express = require('express')
const app = express()
const fs = require('fs')
const { type } = require('os')
const youtubedl = require('youtube-dl')
const path = require('path'); 
const baseDownloadPath = __dirname + "/public/tmp/"
const ffmpeg = require('ffmpeg');


//set the template engine ejs
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));

//routes
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/downloaded', (req, res) => {
    res.render('downloaded')

})

app.get('/get-download', (req, res) => {
    let file = req.query.f;
    res.sendFile(`${baseDownloadPath + file}`);
})

app.get('/downloading', (req, res) => {
    res.render('downloading')
})

app.get('/downloading-check', (req, res) => {
    let file = req.query.f;
    let stats = fs.statSync(baseDownloadPath + file);
    if(stats.size > 0)
        res.json({"downloaded": true});
    else
        res.json({"downloaded": false});

})

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
    //res.render('index');
})

function downloadVideo(url, format){
    let param;
    

    switch(format){
        case 'mp4':
            param = ['-f', 'best'];
            break;
        case 'mp3':
            //param = ['-x', '--audio-format', 'mp3'];
            param = ['-f', 'bestaudio', '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0', '-o', 'C:\\Users\\malbert\\source\\web-yt-dl\\public\\tmp\\', '--prefer-ffmpeg', '--ffmpeg-location', ffmpeg.path]
            break;
    }
    
    const video = youtubedl(url,
    // Optional arguments passed to youtube-dl.
    param
    //,
    // Additional options can be given for calling `child_process.execFile()`.
    //{ cwd: __dirname }
    )

    //filename will be the Youtube video id for now
    let filename = url.substring(url.indexOf('v=') + 2) + "." + format;
  
  // Will be called when the download starts.
  
  video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
    //filename = info._filename
  })
  
  video.on('end', function() {
    console.log("done");
  })

  video.pipe(fs.createWriteStream(baseDownloadPath + filename))

  return filename;
  
}

//Listen on port 3000
server = app.listen(3000)

