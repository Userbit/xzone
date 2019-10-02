module.exports = {
    mongodbMemoryServerOptions: {
        instance: {
            port: 27017,
            ip: 'localhost',
            dbName: 'handyData'
        },
        binary: {
            version: '4.0.12',
            skipMD5: true
        },
        autoStart: false
    }
};