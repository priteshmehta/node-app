const rateLimit = require('express-rate-limit')

//rate limit by ip
const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hrs in milliseconds
    max: 1000,
    message: 'You have exceeded the 1000 requests in 1 hrs limit!', 
    headers: true,
  });

  module.exports = rateLimiter