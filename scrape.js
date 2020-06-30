const cheerio = require('cheerio');
const express = require('express');
const request = require('request-promise');
const app = express();
const exphbs = require('express-handlebars');

var osrsPlayerCount = 0;

//Body parsers
app.use(express.json());

//View engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    //getOsrsPlayerCount();
    res.render('index');
});

app.get('/count', (req, res) => {
    res.json('5');
});

//OSRS Scrape
async function getOsrsPlayerCount() {
    const result = await request.get("https://oldschool.runescape.com");
    const $ = cheerio.load(result);
    osrsPlayerCount = parseInt($('.player-count').text().split(' ')[3].replace(',', ''));
}