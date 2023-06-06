const PROXY_CONFIG = [
  {
    context: ['/v1'],
    target: 'http://localhost:3000',
    secure: true,
    logLevel: 'debug'
  }
]

module.exports = PROXY_CONFIG;
