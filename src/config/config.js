const config = {
    development: {
        baseUrl: 'http://127.0.0.1:5500',
        apiUrl: 'http://127.0.0.1:5500/api',
        assetsUrl: 'http://127.0.0.1:5500/assets',
    },
    production: {
        baseUrl: 'https://jdlegaltranscripts.com',
        apiUrl: 'https://api.jdlegaltranscripts.com',
        assetsUrl: 'https://assets.jdlegaltranscripts.com',
    }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];