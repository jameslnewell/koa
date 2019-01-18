
module.exports = process.env.NODE_ENV === 'production' ? require('./src/index.prod') : require('./src/index.dev');
