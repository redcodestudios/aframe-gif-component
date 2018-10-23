                
var canvas = document.getElementById('mycanvas')
canvas.width = 600
canvas.height = 800
var promisedGif = fetch('/tokusatsu.gif')
        .then(resp => resp.arrayBuffer())
        .then(buff => new GIF(buff))
        .then(gif => playGIF(gif, canvas))
// console.log(gif)
// gif.then(function (){
//     console.log(this)
//     var canvas = document.getElementById('mycanvas')
//     playGIF(this, canvas);
// })
// playGIF(gif, canvas);