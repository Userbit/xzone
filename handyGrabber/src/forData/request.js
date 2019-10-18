const request = require('request')
const { debug } = require('../util')


const defaultOptions = {
    baseUrl: 'some_valid_url',
    json: true,
    method: 'GET',
    headers: {
        'User-Agent': 'Java/1.8.0_212',
        'Accept-Encoding': 'gzip, deflate',
        'Host': 'some_valid_url',
        'Accept': 'text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2',
        'Connection': 'keep-alive',
    },
    gzip: true,
};

const baseRequest = request.defaults(defaultOptions)

module.exports = {
    init(state) {

    },
}