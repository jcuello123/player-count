const cheerio = require('cheerio');
const express = require('express');
const request = require('request-promise');
const app = express();
const exphbs = require('express-handlebars');
const { get } = require('request-promise');

//Body parsers
app.use(express.json());

//View engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Static folder
app.use(express.static(__dirname + '/public'));

//Server Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/count', async(req, res) => {
    const playerCount = await getData();
    res.json(playerCount);
});

async function getData() {
    const osrsPlayerCount = await getOsrsPlayerCount();
    const gtaPlayerCount = await getGTAPlayerCount();
    const pubgPlayerCount = await getPUBGPlayerCount();
    const lolPlayerCount = await getLOLPlayerCount();
    const fortnitePlayerCount = await getFortnitePlayerCount();
    const minecraftPlayerCount = await getMinecraftPlayerCount();

    const playerCount = {
        osrs: osrsPlayerCount,
        gta: gtaPlayerCount,
        pubg: pubgPlayerCount,
        lol: lolPlayerCount,
        fortnite: fortnitePlayerCount,
        minecraft: minecraftPlayerCount
    }
    return playerCount;
}

//OSRS scrape
async function getOsrsPlayerCount() {
    const result = await request.get('https://oldschool.runescape.com');
    const $ = cheerio.load(result);
    const osrsPlayerCount = parseInt($('.player-count').text().split(' ')[3].replace(',', ''));
    return osrsPlayerCount;
}

//GTA V scrape
async function getGTAPlayerCount() {
    const result = await request.get('https://steamcharts.com/app/271590');
    const $ = cheerio.load(result);
    const gtaPlayerCount = parseInt($('.num').first().text());
    return gtaPlayerCount;
}

//PUBG scrape
async function getPUBGPlayerCount() {
    const result = await request.get('https://steamcharts.com/app/578080');
    const $ = cheerio.load(result);
    const pubgPlayerCount = parseInt($('.num').first().text());
    return pubgPlayerCount;
}

//League of Legends scrape
async function getLOLPlayerCount() {
    const result = await request.get('https://playercounter.com/league-of-legends/');
    const $ = cheerio.load(result);
    const lolPlayerCount = parseInt($('h2').first().text().split(' ')[0].replace(',', '').replace(',', ''));
    return lolPlayerCount;
}

//Fortnite scrape
async function getFortnitePlayerCount() {
    const result = await request.get('https://playercounter.com/fortnite/');
    const $ = cheerio.load(result);
    const fortnitePlayerCount = parseInt($('h2').first().text().split(' ')[0].replace(',', '').replace(',', ''));
    return fortnitePlayerCount;
}

//Minecraft scrape
async function getMinecraftPlayerCount() {
    const result = await request.get('https://playercounter.com/minecraft/');
    const $ = cheerio.load(result);
    const minecraftPlayerCount = parseInt($('h2').first().text().split(' ')[0].replace(',', '').replace(',', ''));
    return minecraftPlayerCount;
}