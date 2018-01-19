var https  = require(`https`);
var querystring  = require(`querystring`);
var vkBot = require(`./bot`);

//https://oauth.vk.com/authorize?client_id=6333105&display=page&scope=friends,messages,docs&response_type=token&v=5.52

var bot = new vkBot({
	peerId: 254918773,
	count: 1,
	accessToken: '4e02d711d629f43093d7a0bd27da392c402913f643e7e56b639f81a59a46fa71d063d021b667cdf2bb418',
	version: '5.69'
});

bot.addPattern("☕", 55);

bot.addPattern("какой сегодня день?", function() {
	let date = new Date();
	var options = {
	  day: 'numeric'
	};

	return date.toLocaleDateString("ru", options);
});

bot.addPattern("спокойной ночи", function() {
	let date = new Date();
	let hours = date.getHours();

	return "Уж " + hours + " часа, чего не спишь";
});

bot.addPattern("😴", "👆");

bot.addPattern("конфету, пожалуйста", "🍬");

bot.addPattern("расписание сегодня", function() {
	let result = "";

	let day = {
		"10:15": "Информационная безопасность",
		"12:30": "Математическое моделирование",
		"14:00": "Мультимедиа системы"
	}

	for(var time in day) {
		result += time + " - " + day[time] + "\n";
	}

	return result;
});

bot.start();