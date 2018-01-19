var https  = require(`https`);
var querystring  = require(`querystring`);

function Bot(options) {
	this._peerId = options.peerId;
	this._count = options.count || 1;
	this._method = 'messages.getHistory';
	this._accessToken = options.accessToken;
	this._version = options.version;
	this._processed = [];
	this._patterns = {};
	this._intervalId = null;
};

Bot.prototype.sendMessage = function(message) {
	console.log('Было отправлено сообщение:');
	console.log(message);

	message = querystring.escape(message);
	var url = `https://api.vk.com/method/messages.send?user_id=${this._peerId}&message=${message}&access_token=${this._accessToken}&v=${this._version}`;

	https.get(url, (res) => {
  		res.resume();
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
};

Bot.prototype.sendSticker = function(stickerId) {
	console.log('Отправлен стикер с id ' + stickerId);

	var url = `https://api.vk.com/method/messages.send?user_id=${this._peerId}&sticker_id=${stickerId}&access_token=${this._accessToken}&v=${this._version}`;

	https.get(url, (res) => {
  		res.resume();
	}).on('error', (e) => {
		console.log(`Got error: ${e.message}`);
	});
}

Bot.prototype.addPattern = function(pattern, handler) {
	if(!this._patterns[pattern]) {
		this._patterns[pattern] = handler;
	}
};

Bot.prototype.start = function() {
	var intervalCallback = function() {
		var url = `https://api.vk.com/method/${this._method}?count=${this._count}&peer_id=${this._peerId}&access_token=${this._accessToken}&v=${this._version}`;

		https.get(url, (res) => {
			let data = ``;

			res.on(`data`, (chunk) => {
				data += chunk;
			});

			res.on(`end`, () => {
		  		console.log(`Got response: ${res.statusCode}`);

		  		var parsedData = JSON.parse(data);

		  		//Массив сообщений

	  			let messages = parsedData.response.items;
	  			console.log(messages);

	  			messages.forEach((item, index) => {
	  				let text = item.body.toLowerCase();

	  				if(this._processed.indexOf(item.id) >= 0) {
	  					return;
	  				}

	  				// if(item.from_id != this._peerId) {
	  				// 	return;
	  				// }

	  				console.log('Сообщение ' + index + ' - ' + item.body);
	  				console.log(this._processed);

	  				for(var pattern in this._patterns) {
	  					if(text.indexOf(pattern.toLowerCase()) >= 0) {
	  						let value = this._patterns[pattern];
	  						if(typeof this._patterns[pattern] === "function") {
	  							value = this._patterns[pattern]();
		  					}

		  					if(!isNaN(value)) {
	  							this.sendSticker(value);
	  						} else {
		  						this.sendMessage(value);
	  						}
	  						this._processed.push(item.id);
	  					}
	  				}
	  			});
			});

	  		res.resume();
		}).on('error', (e) => {
		  console.log(`Got error: ${e.message}`);
		});
	};

	this._intervalId = setInterval(intervalCallback.bind(this), 1000);
}

Bot.prototype.stop = function() {
	clearInterval(this._intervalId);
}


module.exports = Bot;