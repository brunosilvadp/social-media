const nodeMailer = require('nodemailer');
const mailConfig = require('../../config/mail')
const EmailTemplate = require('email-templates');
const path = require('path');

class Mail{
    
    constructor(){
        this.transporter = nodeMailer.createTransport({...mailConfig})
    }

    async accountConfirmation(data, token){
        const email = new EmailTemplate({
            transport: this.transporter,
            send: true,
            preview: false,
          });
          email.send({
              template: path.resolve('src/emails/templates/account-confirmation'),
              message: {
                from: data.from,
                to: data.to,
              },
              locals: {
                token: token,
                name: data.name
              }
          }).then()
            .catch((e) => {
                console.log(e);
            });

    }
}

module.exports = new Mail();