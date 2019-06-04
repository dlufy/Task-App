const sgMail = require('@sendgrid/mail')
const SENDGRIDAPIKEY =process.env.SENDGRID_APIKEY

sgMail.setApiKey(SENDGRIDAPIKEY)

const fun = (email, name) =>{
    sgMail.send({
        to : email,
        from : 'ajayynitkkr@gmail.com',
        subject:'This is my first email using API',
        text : `Welcome ${name}. This is a test email hi from my side`
    })
}

const sendCanelMail = (email, name ) =>{
    sgMail.send({
        to : email,
        from : 'ajayynitkkr@gmail.com',
        subject:'This is Last email',
        text : `GoodBye ${name}. This is the last mail from my side`
    })
}
//sendWelcomeMail('himanshu123001@gmail.com', 'himanshu')
module.exports = {
    fun,
    sendCanelMail
}