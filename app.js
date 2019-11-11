const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer')
const app = express();

//view engine handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//bodyparser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//set static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  const output = `
<p>You have a new contact request</p>
<h3>Contact details</h3>
<ul>
  <li>Name: ${req.body.name}</li>
  <li>Company: ${req.body.company}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone: ${req.body.phone}</li>
</ul>

<h3>Message</h3>
<p>${req.body.message}</p>

 `;

  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'mail.stect.vot.pl',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'admin@bestcodes.pl', // generated ethereal user
        pass: 'KKKemot7901$' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"kursywfs.com 👻" <admin@bestcodes.pl>', // sender address
      to: 'tomeczekstecc@gmail.com', // list of receivers
      subject: 'NodeTest ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    res.render('contact', { msg: 'Email has been send.' });
  }
  main().catch(console.error);
});

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}. Do to http://localhost:${PORT}`);
});
