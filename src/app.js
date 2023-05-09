const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const emailVerifier = require('./controller/email');
dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.render('finder', { info: '' });
});
app.post('/findEmail', async (req, res) => {
    const fullName = req.body.fullname;
    const domain = req.body.domain;
    console.log(domain);
    console.log(fullName);
    const valid = [];
    const invalid = [];
    const input = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    };
    let emailArray = emailVerifier.generateEmailVariationsRows(fullName, domain);
 
    const emails = emailArray.map(obj => obj.email);
    for (const email of emails) {
      try {
        let isGlxu = await emailVerifier.checkGmail(email,input);
            if(isGlxu.can_connect_smtp && isGlxu.is_deliverable){
              valid.push(`${email} is Glxu Valid`);
              break;  
            }else{
                invalid.push(email);
            }
      
      } catch (err) {
        console.error(`Error verifying email ${email}: ${err}`);
      }
    }
    if(valid.length>0){
        res.render('finder', { info: valid });
    }else{
        for (const email of emails) {
            try {
              let isUser = await emailVerifier.gmail(email);
              if(isUser=='This email is already in use. Learn more'){
                valid.push(`${email} is UserName Valid`);
                break;
              }else{
                invalid.push(`${email} is is not valid`);
              }
            
            } catch (err) {
              console.error(`Error verifying email ${email}: ${err}`);
            }
          }
          console.log(valid.length);
          console.log(invalid.length);
          if(valid.length>0){
            res.render('finder', { info: valid });

          }else{
            res.render('finder', { info: 'Valid Email not found' });
          }

    }


  
  })


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
