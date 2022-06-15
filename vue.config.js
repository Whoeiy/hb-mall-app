module.exports = {
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        proxy: {
            '/api': {
                target: 'http://101.133.131.175:8080/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''//请求的时候使用这个api就可以
                }
            }
        }
    }
}