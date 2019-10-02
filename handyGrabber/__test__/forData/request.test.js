const request = require('../../src/forData/request')

describe('testing forData/request.js', () => {
    it('jrequest.js should be required', () => {
        expect(request).toBeTruthy()
    })
})