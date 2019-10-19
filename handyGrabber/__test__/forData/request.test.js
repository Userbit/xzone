const request = require('request')
const req = require('../../src/forData/request')

const entities = ['movie', 'torrent']

afterEach(() => {
    jest.restoreAllMocks()
    req.baseRequest = {}
})

describe('testing forData/request.js', () => {
    it('request.js should be required', () => {
        expect(req).toBeTruthy()
    })

    test('init() should call request.defaults(opts), getOptsFor:movie|torrent()', async () => {
        for(const entity of entities) {
            const getOptsFor = 'getOptsFor:' + entity
            const mockObj = { mockProp: 'mockVal' }
            const state = { entity, stage: 'some stage', log: 1, deleted: true }
            jest.spyOn(request, 'defaults').mockReturnValueOnce(mockObj)
            jest.spyOn(req, getOptsFor).mockImplementationOnce(() => {})

            req.init(state)

            expect(request.defaults).toBeCalledWith(expect.toContainAllKeys([
                'baseUrl',
                'json',
                'method',
                'headers',
                'gzip',
                'uri',
                'qs',
            ]))
            expect(req[getOptsFor]).toBeCalledWith(state)
            expect(req.baseRequest).toStrictEqual(mockObj)

            jest.restoreAllMocks()
        }
    })

    test('getUri(entity) should return correct uri string for entity', () => {
        const entity = 'movie'
        const expectedUri = '/movie/select/'

        expect(req.getUri(entity)).toBe(expectedUri)
    })

    test('getOptsFor:movie() should correct opts', async () => {
        const state = { entity: 'movie', stage: 'some stage', log: 1 }
        const expectedOpts = { uri: '/movie/select/' }

        expect(req["getOptsFor:movie"](state)).toStrictEqual(expectedOpts)
    })

    test('getOptsFor:torrent() should call baseRequest.defaults(opts) correctly', async () => {
        for(const deleted of [true, false]) {
            const state = { entity: 'torrent', deleted, stage: 'some stage', log: 1 }
            const expectedOpts = { uri: '/torrent/select/', qs: { fq: 'deleted:' + deleted } }
            
            expect(req["getOptsFor:torrent"](state)).toStrictEqual(expectedOpts)
        }
    })

})