const puppeteer = require('puppeteer');
const path = require('path');
const cheerio = require('cheerio');
const moment = require('moment');

const config = require('../../config/environment');
const url = 'https://pendataan.baliprov.go.id/';

const Bali = require('../models/bali');

const scraper = async (startDate = new Date) => {
    const browser = await puppeteer.launch({
        headless: config.app.env === 'production',
        userDataDir: path.join(__dirname, '/../../temp')
    });

    if (moment(startDate).isBefore(moment(new Date), 'day')) {
        landingPageDate(await browser.newPage(), startDate);
    } else {
        landingPageToday(await browser.newPage());
    }

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

    const data = getData(await page.$eval('body', element => element.innerHTML));
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

const landingPageDate = async (page, date) => {
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    const startDate = moment(date);
    const endDate = moment(new Date);

    for (let i = moment(startDate); i.isBefore(endDate); i.add(1, 'days')) {
        const filterDate = i.format('MM/DD/YYYY');

        await page.focus('#tanggal');
        await page.keyboard.type(filterDate);

        await Promise.all([
            page.click('input.btn.btn-success'),
            page.waitForNavigation({
                waitUntil: 'networkidle2'
            }),
        ]);

        if (await page.$('.ui-exception-class') === null) {
            const data = getData(await page.$eval('body', element => element.innerHTML));
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = {...data[key],...{
                        date: i.format("YYYY-MM-DD")
                    }};
                    
                    Bali.updateOrCreate(element, {
                        date: element.date,
                        kabupaten: element.kabupaten
                    });
                }
            }
        }

        await page.goto(url, {
            waitUntil: 'networkidle2'
        });
    }

    await page.goto('about:blank', {
        waitUntil: 'networkidle2'
    });

    await page.close();
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

module.exports = {
    scraper
}