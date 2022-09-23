const auth = require('../auth.json')

function fileWrite(fileName, file) {
    const fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(file, null, 2), function (err) {
        if (err) return console.log(err)
        console.log(JSON.stringify(file))
        console.log('writing to ' + fileName)

    })
}
// Create blizzard access token function
module.exports = function createBlizzToken() {
    return new Promise((resolve, reject) => {
        let credentials = Buffer.from(`${auth.blizzard_client_id}:${auth.blizzard_client_secret}`);
        const requestOptions = {
            host: `oauth.battle.net`,
            path: '/token',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials.toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let responseData = '';

        function requestHandler(res) {
            const filename = '../auth.json';
            const file = require(filename);
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                let data = JSON.parse(responseData);
                resolve(data)
                file.blizzard_bearer_token = data.access_token // Store Bearer Token for d3 functions
                fileWrite(filename, file)
            });
        }
        let request = require('https').request(requestOptions, requestHandler);
        request.write('grant_type=client_credentials');
        request.end();
        request.on('error', (error) => {
            reject(error);
        });
    });
}
