var nodemon = require('nodemon');
process.env.running =  process.argv[2];
nodemon({ script: 'backend/apiFakeDB/serverApi.js' }).on('start', function () {
}).on('crash', function () {
}).on('restart', function () {
    process.env.running = true;
}).on('quit', function () {
});

process.stdin.resume();
