const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const csvWriter = require('csv-writer').createObjectCsvWriter;

const URL = "http://www.values.com/inspirational-quotes";

axios.get(URL)
    .then(response => {
        const html = response.data; 
        const $ = cheerio.load(html);  // loading the HTML content into a cheerio instance
        const quotes = []; // array to store the quotes

        $('.col-6.col-lg-4.text-center.margin-30px-bottom.sm-margin-30px-top').each((i, element) => {
            const theme = $(element).find('h5').text().trim();
            const url = $(element).find('a').attr('href');
            const img = $(element).find('img').attr('src');
            const lines = $(element).find('img').attr('alt').split(" #")[0];
            const author = $(element).find('img').attr('alt').split(" #")[1];

            quotes.push({ theme, url, img, lines, author });
        });

        console.log("Number of quotes scraped:", quotes.length);

        // storing the result in a JSON file

        const filename = 'inspirational_quotes.json';
        fs.writeFile(filename, JSON.stringify(quotes, null, 2), err => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("Quotes saved to", filename);
            }
        });

        // storing the result in a CSV file

        const csvWriterInstance = csvWriter({
            path: 'inspirational_quotes.csv',
            header: [
                { id: 'theme', title: 'Theme' },
                { id: 'url', title: 'URL' },
                { id: 'img', title: 'Image URL' },
                { id: 'lines', title: 'Lines' },
                { id: 'author', title: 'Author' }
            ]
        });

        csvWriterInstance.writeRecords(quotes)
            .then(() => console.log('Quotes saved to inspirational_quotes.csv'));
    })
    .catch(error => {
        console.error("Error fetching website:", error);
    });

