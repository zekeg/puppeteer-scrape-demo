//Hello! I wanted to create this to demonstrate some basic competencies with Puppeteer, JS and Node
//This will scrape the provided website and then use the data it collects to create a reduced HTML document
//Get Puppeteer, initiate readline for asking the user questions
const puppeteer = require('puppeteer');
fs = require('fs');
var readline = require('readline');


function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
//This returns a promise so we can query the user then use await in the asynchronus statement
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }))
}

let appObjs = [];
(async () => {
  const answer = await askQuestion("Press return to continue with scraping data from https://www.q2developer.com/marketplace")
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.q2developer.com/marketplace");

  await page.screenshot({ path: 'example.png' });
  const titles = await page.$$eval('.app-link', appLinks => appLinks.map(appLink => {
    return {
      link: appLink.href,
      title: appLink.querySelector("h1").innerText,
      comingSoon: appLink.querySelector('.coming-soon') ? "true" : "false",
      logoImageAddress: appLink.querySelector('.avatar-img').src
    }
  }))
  await browser.close();
  appObjs = titles;
  console.log("app objects", appObjs);
  fs.writeFileSync("names.html", appObjs.map(obj => `<div class="app-box"><a href="${obj.link}"><img src="${obj.logoImageAddress}" style="height: 100px;"/><br><h1>${obj.title}</h1></a></div>`).join(' '));
  browser.on('disconnected', process.exit(1));
}
)();

