const RespondObject = require('./RespondObject');

// 读取osuToken
const osuToken = require('./osuToken.json').osuToken;


// 引入osuAPI
// https://github.com/brussell98/node-osu
// https://github.com/ppy/osu-api/wiki
const osu = require('node-osu');
const osuApi = new osu.Api(osuToken, {
	// baseUrl: sets the base api url (default: https://osu.ppy.sh/api)
	notFoundAsError: true, // Throw an error on not found instead of returning nothing. (default: true)
	completeScores: true, // When fetching scores also fetch the beatmap they are for (Allows getting accuracy) (default: false)
	parseNumeric: false // Parse numeric values into numbers/floats, excluding ids
});


const nedb = require('./database/nedb')(__dirname + '/database/data/save.db');



function meta(qqId) {
	this.userId = qqId;
}
meta.prototype.$send = function (s) { console.log(s); };
meta.prototype.$ban = function (t) { console.log("你已被禁言 " + t + " 秒"); };

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.on('line', async function (line) {
	let myQQ = 45818;
    if (line === "qq2") {
        myQQ = 2;
        console.log("你的QQ号是2了");
    }
    else if (line === "qq1") {
        myQQ = 1;
        console.log("你的QQ号是1了");
    }
	let respondObject = new RespondObject(new meta(myQQ), nedb, osuApi, line);
	await respondObject.sendReply();
});