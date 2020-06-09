const puppeteer = require('puppeteer');
const path = require('path');
const cheerio = require('cheerio');
const moment = require('moment');

const config = require('../../config/environment');
const url = 'https://pendataan.baliprov.go.id/';

const Bali = require('../models/bali');

const scraper = async () => {
    const browser = await puppeteer.launch({
        headless: config.app.env === 'production',
        userDataDir: path.join(__dirname, '/../../temp')
    });

    landingPageToday(await browser.newPage());
    
    try {
        const pages = await browser.pages();
        pages[0].close();
    } catch (error) {
        console.log(error);
    }
}

const landingPageToday = async (page) => {
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    const body = await page.$eval('body', element => element.innerHTML);
    const data = getData(body);       
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const datetime = moment(new Date);
            const element = {...data[key],...{
                date: datetime.format("YYYY-MM-DD")
            }};
            
            Bali.updateOrCreate(element, {
                date: element.date,
                kabupaten: element.kabupaten
            });
        }
    }

    await page.goto('about:blank', {
        waitUntil: 'networkidle2'
    });

    await page.close();
}

const landingPageDate = (page, startDate) => {
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });


}

const getData = (html) => {
    const $ = cheerio.load(html);
    let match;

    const tag = $('script');
    for (let index = 0; index < tag.length; index++) {
        const element = tag[index];
        match = findVariable($(element).html(), /var data_kabupaten = (.*);/);
        if (match) break;
    }
    let text = match[0];
    text = text.substr(text.indexOf('{'), text.indexOf(';'));
    
    return JSON.parse(text.replace(';', ''));
}

const findVariable = (text, variable) => text.match(variable);

scraper();