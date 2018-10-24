
// var self = null;

AFRAME.registerComponent('gif', {
    schema: {
        src: { type: 'string', default: '' },
        marker: { default: '' },
        position: { default: '' },
        rotation: { default: '' },
    },

    init: function() {
        this.gifPlaying = false;
        this.gif = fetch(this.data.src)
        .then(resp => resp.arrayBuffer())
        .then(buff => new GIF(buff));
        
        this.frames = this.gif.then(gif => gif.decompressFrames(true))
        this.canvas = document.createElement('canvas');

        this.el.setAttribute('draw-canvas', this.canvas)
        this.el.setAttribute('material', {src: this.canvas})
        this.el.setAttribute('rotation', '270 0 0')
        this.el.setAttribute('position', '0 0 0')

        this.marker = document.querySelector(this.data.marker);
        var self = this        
        
        this.marker.addEventListener('markerFound', function(e) {
            console.log('found')
            self.playGIF()
        })

        this.marker.addEventListener('markerLost', function(e) {
            console.log('lost')
            self.stopGIF()
        })
    },

    playGIF : function() {
        this.gifPlaying = true;
        this.frames.then(frames => this.renderGIF(frames, 0));
        // this.render(this.frames, 0);
    },

    stopGIF : function() {
        this.gifPlaying = false;
    },

    renderGIF : function(frames, frameIndex) {
        if(this.gifPlaying) {
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
        
            var self = this
            // setTimeout(this.render(frames, frameIndex+1),
                // Math.max(0, Math.floor(frame.delay - timeDiff)))
            setTimeout(function() {
                self.renderGIF(frames, frameIndex+1);
            }, Math.max(0, Math.floor(frame.delay - timeDiff)));
        }
    },
    
    drawGIF : function(frame) {
        var tmpCanvas = document.createElement('canvas');
        var tmpCtx = tmpCanvas.getContext('2d');
        var mainCtx = this.canvas.getContext('2d');

        this.canvas.width = tmpCanvas.width = frame.dims.width;
        this.canvas.height = tmpCanvas.height = frame.dims.height;

        var frameImageData = tmpCtx.createImageData(frame.dims.width, frame.dims.height);
        frameImageData.data.set(frame.patch);

        tmpCtx.putImageData(frameImageData, 0, 0);

        mainCtx.drawImage(tmpCanvas, frame.dims.left, frame.dims.top);
    }
})