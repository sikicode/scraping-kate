const openai = require('openai')
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

// scrape google search results
async function scrape_google(url, query) {
    //await page.screenshot({path: 'screenshot.png'});

    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('span.titleline a');
                console.log(items);
                items.forEach((item) => {
                    results.push({
                        url:  item.getAttribute('href'),
                        text: item.innerText,
                    });
                });
                return results;
            });
            browser.close();
            return resolve(urls);
        } catch (e) {
            console.log(reject(e));
            return reject(e);
        }
    })
};

// input query from terminal
const query = process.argv[2];
if (!query) {
    throw "Please provide a search query as the first argument";
}
const scrape_url = "https://news.ycombinator.com/";
//const scrape_url = `${process.env.BASE_URL}` + query;

scrape_google(scrape_url, query).then(console.log).catch(console.error);