

const { Keyboard } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const dotenv = require('dotenv');
dotenv.config();
puppeteer.use(StealthPlugin());
const GMAIL_SING_IN_URL = 'https://accounts.google.com/v3/signin/identifier?dsh=S1812383359%3A1680245566183107&continue=https%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3Dgmail%26rlz%3D1C1BNSD_enPK1051PK1051%26oq%3Dgmail%26aqs%3Dchrome..69i57.2239j0j1%26sourceid%3Dchrome%26ie%3DUTF-8&ec=GAZAAQ&hl=en&ifkv=AQMjQ7Q20T_1uBzWTC4zXRLE1ecy8Gs1iNOMdBXWCEb5rIu-QRNJP6XEROKk-NBpYasnb2Hhdvds&passive=true&flowName=GlifWebSignIn&flowEntry=ServiceLogin';
const GMAIL_SIGN_UP_URL = 'https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp';
const AT_SIGN = '@';
const DOT_SIGN = '.';
const SPACE_SIGN = ' ';
const UNDERSCORE_SIGN = '_';
const chromePath = process.env.CHROME_PATH;
//gmail crawl validate
async function gmail(email) {
  console.log('gmail called', email);
  const browser = await puppeteer.launch({
      headless: "new",
      executablePath: chromePath, 
      args: [
          '--no-sandbox',
          '--disable-gpu',
          '--enable-webgl',
          '--window-size=800,800'
      ]
  });
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36';
  const page = await browser.newPage();
  await page.setUserAgent(ua);
  await page.goto(GMAIL_SIGN_UP_URL);
  await page.click('span.VfPpkd-vQzf8d');
  await page.focus('#username');
  await page.keyboard.type(email);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(2000);
  const jibhHcElement = await page.$('.jibhHc');
  if(jibhHcElement){
    const text = await page.evaluate(() => {
      const span = document.querySelector('.jibhHc');
      const div = span.closest('div');
      return div.textContent.trim();
 
    });
    console.log('text',text);
          return text;

  }
else{
  return false;
}
   
 
  
 
}

async function checkGmail(email, input) {
    const axios = require('axios').default;
    const GLXU_PAGE = 'https://mail.google.com/mail/gxlu?email=';
    const url = `${GLXU_PAGE}${email}`;
    const headers = {
      'User-Agent': input.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };
    const options = {
      headers: headers,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 303,
      timeout: 3000 // increase the timeout value to 5 seconds
    };
    const response = await axios.head(url, options);
    const emailExists = response.headers.hasOwnProperty('set-cookie');
    //console.debug(`[email=${email}] gmail response: ${response.status}`);
    const Default = {
      property1: 'default value 1',
      property2: 'default value 2',
      // ...and so on
    };
    return {
      status: response.status,
      can_connect_smtp: true,
      is_deliverable: emailExists,
      ...Default,
    };
  }


function generateEmailVariationsRows(personName, domain) {
    const [first, last] = personName.toLowerCase().split(SPACE_SIGN);
    const f = first[0];
    const l = last[0];
  
    const atDomain = AT_SIGN + domain;
  
    const variations = [];
      
    //first@domain.com
    variations.push(first + atDomain);

    //first.last@domain.com
    variations.push(first + DOT_SIGN + last + atDomain);
  
    //flast@domain.com
    variations.push(f + last + atDomain);

   //firstlast@domain.com
    variations.push(first + last + atDomain);
  
    //last@domain.com
    variations.push(last + atDomain);
  
    //firstl@domain.com
    variations.push(first + l + atDomain);
  
    //last.first@domain.com
    variations.push(last + DOT_SIGN + first + atDomain);
  
    //lastfirst@domain.com
    variations.push(last + first + atDomain);
  
    //first_last@domain.com
    variations.push(first + UNDERSCORE_SIGN + last + atDomain);
  
    return variations.map(email => {
      return {
        first,
        last,
        domain,
        email
      };
    });
  }
  
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

  module.exports = {
    checkGmail,
    gmail,
    generateEmailVariationsRows,
  }