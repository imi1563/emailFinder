const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const emailVerifier = require('./Controller/mailController');
dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.render('emailFind', { info: '' });
});
app.post('/findEmail', async (req, res) => {
  const fullName = req.body.fullname;
  const domain = req.body.domain;
  console.log(domain);
  console.log(fullName);
  let result = await emailVerifier.generateEmailVariationsRows(fullName, domain);
  let valid = [];
  let inValid = [];
  const input = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
  };
  for (let i of result) {
    console.log(i.email);
    const isglx = await emailVerifier.checkGmail(i.email,input);
    console.log(isglx);
    if(isglx.can_connect_smtp && isglx.is_deliverable){
      valid.push(`${i.email} is Glxu Valid`);
      break;
    }
  }
  if (valid.length > 0) {
    res.render('emailFind', { info: valid });
  } else {
    for (let i of result) {
      console.log(i.email);
      const isUserName = await emailVerifier.gmail(i.email);
      console.log(isUserName);
      if(isUserName=='This email is already in use. Learn more'){
        valid.push(`${i.email} is UserName Valid`);
        break;
      }else{
        valid.push(``);
      }
    }
    
  }
  if(valid.length<=0){
    res.render('emailFind', { info: 'Valid Email not fount'});
  }

});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
