'use strict';
const Joi = require('joi'),
    Hapi = require('hapi'),
    stream = require('stream'),
    Jimp = require("jimp");

//lwip = require('lwip');

var schema = {
    size: Joi.number().integer().min(1).max(5000),
    text: Joi.string()
}

const server = new Hapi.Server();
server.connection({
    port: 3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{square}',
    handler: function(request, reply) {
        var width = request.params.square,
            height = request.params.square,
            bg_color_hex = request.query.bg_color;
        //reply(image.getBlob()).type("image/png");;
        /*
        if (bg_color_hex) {
            bg_color_hex = hexToRgb(bg_color_hex);
        } else {
            bg_color_hex = {
                r: 128,
                g: 128,
                b: 128
            };
        }
        */
        bg_color_hex = parseInt(bg_color_hex);
        console.log(bg_color_hex);

        var image = new Jimp(width, height,bg_color_hex, function(err, image) {
            image.rgba(false);
            image.quality( 70 );
            image.getBuffer(Jimp.MIME_JPEG, function(a, b) {
                console.log(b);
                reply(b).type("image/jpeg");
            });
            /*
            var bufferStream = new stream.PassThrough();
                    bufferStream.end(image.bitmap.data);
                    reply(bufferStream).type("image/png");
                    */
            //reply(image.bitmap.data).type("image/jpg");


            // this image is 256 x 256, every pixel is set to 0x00000000
        });
        /*
        lwip.create(width, height, bg_color_hex, function(err, image) {
            // check err
            // 'image' is a 500X500 solid yellow canvas.
            image
                .batch()
                .toBuffer('jpg', function(err, buffer) {

                    var bufferStream = new stream.PassThrough();
                    bufferStream.end(buffer);
                    reply(bufferStream).type("image/jpg");
                    // bufferStream.pipe( process.stdout );

                });
        });*/

    },
    config: {
        validate: {
            params: {
                square: schema.size //,
                    //bg_color_hex: schema.text
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/{width}x{height}',
    handler: function(request, reply) {
        reply(request.params.width + 'x' + request.params.height);
    },
    config: {
        validate: {
            params: {
                width: schema.size,
                height: schema.size
            }
        }
    }
});
server.route({
    method: 'GET',
    path: '/{width}x{height}/{caption}',
    handler: function(request, reply) {
        reply(request.params.width + 'x' + request.params.height + request.params.captio);
    },
    config: {
        validate: {
            params: {
                width: schema.size,
                height: schema.size,
                text: schema.text
            }
        }
    }
});

function generate_image(width, height) {

}

function generate_image(width, height, caption) {

}

function generate_image(width, height, caption, color) {

}

function generate(width, height) {

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
    //console.log(Joi);
});