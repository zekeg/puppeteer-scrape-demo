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
  //A quick prompt to continue
  const answer = await askQuestion("Press return to continue with scraping data from https://www.q2developer.com/marketplace");
  //ask for our Puppeteer functionality
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //use our new browser to go to the website
  await page.goto("https://www.q2developer.com/marketplace");
  //use $$eval to select relevant app links and collect data about them
  const titles = await page.$$eval('.app-link', appLinks => appLinks.map(appLink => {
    return {
      link: appLink.href,
      title: appLink.querySelector("h1").innerText,
      comingSoon: appLink.querySelector('.coming-soon') ? "true" : "false",
      logoImageAddress: appLink.querySelector('.avatar-img').src
    }
  }))
  //close the browser, store the data in a variable and show the user
  await browser.close();
  appObjs = titles;
  console.log("app objects", appObjs);
  //create an HTML document with the HTML app data we've collected
  fs.writeFileSync("names.html", appObjs
    .map(obj => `<div class="app-box"><a href="${obj.link}"><img src="${obj.logoImageAddress}" style="height: 100px;"/><br><h1>${obj.title}</h1></a></div>`).join(' '));
    
  console.log("an HTML file has been created in the current directory with all valid apps and their links");  
  //disconnect and exit the Node program
  browser.on('disconnected', process.exit(1));
}
)();

