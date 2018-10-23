
function test () {
    console.log('test')
}

AFRAME.registerComponent('gif', {
    schema: {
        src: { type: 'string', default: '' },
        marker: { default: '' },
    },

    init: function() {
        this.isPlaying = false;
        this.gif = fetch(this.data.src)
                    .then(resp => resp.arrayBuffer())
                    .then(buff => new GIF(buff));
        
        this.frames = this.gif.then(gif => gif.decompressFrames(true))
        this.canvas = document.createElement('canvas');

        this.marker = document.querySelector(this.data.marker);
        
        this.marker.addEventListener('markerFound', function(e) {
            this.data.test();
        })

        this.marker.addEventListener('markerLost', function(e) {
            this.stopGIF();
        })
    },

    playGIF : function() {
        this.isPlaying = true;
        this.frames.then(frames => this.renderGIF(frames, 0));
        // this.render(this.frames, 0);
    },

    stopGIF : function() {
        this.isPlaying = false;
    },

    renderGIF : function(frames, frameIndex) {
        if(this.isPlaying) {
            console.log('rendering')
            if (frameIndex >= frames.length) {
                frameIndex = 0;
            }
            var frame = frames[frameIndex]
            var start = new Date().getTime();
        
            if(frameIndex != 0) {
                var lastFrame = frames[frameIndex - 1]
                if(lastFrame.disposalType == 2) {
                    canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
        
                }
            }
        
            this.drawGIF(frame);
        
            var end = new Date().getTime();
        
            var timeDiff = end - start;
        
            // setTimeout(this.render(frames, frameIndex+1),
                // Math.max(0, Math.floor(frame.delay - timeDiff)))
            setTimeout(function() {
                this.render(frames, frameIndex+1);
            }, Math.max(0, Math.floor(frame.delay - timeDiff)));
        }
    },
    
    drawGIF : function(frame) {
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');
        var mainCtx = this.canvas.getContext('2d');

        tmpCanvas.width = frame.dims.width;
        tmpCanvas.height = frame.dims.height;

        var frameImageData = tmpCtx.createImageData(frame.dims.width, frame.dims.height);
        frameImageData.data.set(frame.patch);

        tmpCtx.putImageData(frameImageData, 0, 0);

        mainCtx.drawImage(tmpCanvas, frame.dims.left, frame.dims.top);
    }
})