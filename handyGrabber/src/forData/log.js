const { debug, sleep, ...util } = require('../util')(module)

module.exports = {
    init(state) {
        this.state = {
            ...util.getObjectForKeys(['stage', 'entity', 'deleted'], state),
            logStart: new Date(),
        }
        this.switchFuncsOnce(state)
    },

    switchFuncsOnce(state) {
        for(const [funcName, func] of Object.entries(this.switchedFuncs)) {
            if (this[funcName]) 
                throw Error(`'${funcName}' property already exist on main object.`)

            this[funcName] = state.log ? func : this.emptyAsyncFunc
        }
        
        this.switchFuncsOnce = this.emptyFunc
    },

    emptyFunc() { },
    async emptyAsyncFunc() { },

    switchedFuncs: {
        async updateState() {
            // TODO:
        },

        async done() {
            // TODO:
        },
    },

}