const sgMail = require('@sendgrid/mail')
const { getMaxListeners } = require('../models/user')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
    if(!email.includes("example.com")) {
        try {
            const msg = {
                    to: email,
                    from: 'priteshonmobile@gmail.com', 
                    subject: 'Welcome email ' + name,
                    //text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>Welcome to Nodejs App</strong>',
            }
            await sgMail.send(msg);
        } catch (error) {
            console.error(error)
            if (error.response) {
                console.error(error.response.body)
            }
        }
    }
}

const sendStats = async (stats) => {
    if(!email.includes("example.com")) {
        try {
            const msg = {
                    to: 'mehta.pritesh@gmail.com',
                    from: 'priteshonmobile@gmail.com', 
                    subject: 'Nodejs: Daily Stats',
                    text: stats,
                    //html: 'stats', 
            }
            await sgMail.send(msg);
        } catch (error) {
            console.error(error)
            if (error.response) {
                console.error(error.response.body)
            }
        }
    }
}

  module.exports = {
    sendWelcomeEmail: sendWelcomeEmail,
    sendStats: sendStats
  }