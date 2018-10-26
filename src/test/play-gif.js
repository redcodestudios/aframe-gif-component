

// var gif = null;

function playGIF(gif, canvas) {
    var frames = gif.decompressFrames(true);
    render(frames, 0, canvas);
}

function stopGIF(gif) {
    console.log('not implemented')
}

/* aux */
function render(frames, frameIndex, canvas) {
    if (frameIndex >= frames.length) {
        frameIndex = 0;
    }
    var frame = frames[frameIndex]
    var start = new Date().getTime();

    // console.log(frame.disposalType);
    if(frameIndex != 0) {
        var lastFrame = frames[frameIndex - 1]
        if(lastFrame.disposalType == 2) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        }
        // console.log("clean")
        // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }
    if(frame.disposalType != 2 && frame.disposalType != 1) {
        console.log(frame.disposalType)
    }

    draw(frame, canvas);

    var end = new Date().getTime();

    var timeDiff = end - start;

    setTimeout(function() {
        render(frames, frameIndex+1, canvas);
    }, Math.max(0, Math.floor(frame.delay - timeDiff)));
}

function draw(frame, canvas) {
    var tmpCanvas = document.createElement('canvas');
    var tmpCtx = tmpCanvas.getContext('2d');
    var mainCtx = canvas.getContext('2d');

    tmpCanvas.width = frame.dims.width;
    tmpCanvas.height = frame.dims.height;

    var frameImageData = tmpCtx.createImageData(frame.dims.width, frame.dims.height);
    frameImageData.data.set(frame.patch);

    tmpCtx.putImageData(frameImageData, 0, 0);

    mainCtx.drawImage(tmpCanvas, frame.dims.left, frame.dims.top);
}
