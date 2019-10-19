const request = require('request')
const { debug, sleep, ...util } = require('../util')


const defaultOptions = {
    baseUrl: 'some_valid_url',
    json: true,
    method: 'GET',
    gzip: true,
    headers: {
        'User-Agent': 'Java/1.8.0_212',
        'Accept-Encoding': 'gzip, deflate',
        'Host': 'some_valid_url',
        'Accept': 'text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2',
        'Connection': 'keep-alive',
    },
}

const queryOptions = {
    uri: '/{movie|torrent}/select/',
    qs: {
        q: '(*:*)',
        sort: '',
        // sort: 'id asc',
        // sort: 'add_date desc',
        fl: '*',
        fq: '',
        start: 0,
        rows: 0,
        version: '2.2',
        wt: 'json1',
    }
}


module.exports = {

    baseRequest: {},

    init(state) {
        const entityOptions = this['getOptsFor:' + state.entity](state)
        this.baseRequest = request.defaults({ 
            ...defaultOptions, 
            ...queryOptions,
            ...entityOptions,
        })
    },

    'getOptsFor:movie': function(state) {
        return { 
            uri: this.getUri(state.entity),
        }
    },

    'getOptsFor:torrent': function(state) {
        return {
            uri: this.getUri(state.entity),
            qs: {
                fq: 'deleted:' + state.deleted,
            },
        }
    },

    getUri(entity) {
        return `/${entity}/select/`
    }

}