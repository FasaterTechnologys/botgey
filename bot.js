console.log("Загрузка библиотек 1%")
const { VK, Keyboard } = require('vk-io');
console.log("Загрузка библиотек 45%")
const vk = new VK();
console.log("Загрузка библиотек 65%")
const commands = [];
console.log("Загрузка библиотек 100%")
const request = require('prequest');
console.log("Библиотеки загружены")



const utils = {
	sp: (int) => {
		int = int.toString();
		return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join('.').split('').reverse().join('');
	},
	rn: (int, fixed) => {
		if (int === null) return null;
		if (int === 0) return '0';
		fixed = (!fixed || fixed < 0) ? 0 : fixed;
		let b = (int).toPrecision(2).split('e'),
			k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3),
			c = k < 1 ? int.toFixed(0 + fixed) : (int / Math.pow(10, k * 3)).toFixed(1 + fixed),
			d = c < 0 ? c : Math.abs(c),
			e = d + ['', ' тыс', ' млн', ' млрд', ' трлн'][k];

		e = e.replace(/e/g, '');
		e = e.replace(/\+/g, '');
		e = e.replace(/Infinity/g, 'ДОХЕРА');

		return e;
	},
	gi: (int) => {
		int = int.toString();

		let text = ``;
		for (let i = 0; i < int.length; i++) {
			text += `${int[i]}&#8419;`;
		}

		return text;
	},
	decl: (n, titles) => { return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2] },
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
	pick: (array) => {
		return array[utils.random(array.length - 1)];
	}
}



let users = require('./users.json');
let bd = require('./bd.json');
let ref = require('./ref.json');
let perevod = require('./perevod.json');

let buttons = [];





setInterval(async () => {
	await saveUsers();
}, 100);





async function saveUsers() {
	require('fs').writeFileSync('./users.json', JSON.stringify(users, null, '\t'));
	require('fs').writeFileSync('./bd.json', JSON.stringify(bd, null, '\t'));
	require('fs').writeFileSync('./ref.json', JSON.stringify(ref, null, '\t'));
	require('fs').writeFileSync('./perevod.json', JSON.stringify(perevod, null, '\t'));
	return true;
}

vk.setOptions({ token: 'хуй', pollingGroupId: залупа });
const { updates, snippets } = vk;


updates.startPolling();
updates.on('message', async (message) => {
	if (Number(message.senderId) <= 0) return;
	if (/\[clubзалупа\|(.*)\]/i.test(message.text)) message.text = message.text.replace(/\[clubзалупа\|(.*)\]/ig, '').trim();

	if (!users.find(x => x.id === message.senderId)) {
		const [user_info] = await vk.api.users.get({ user_id: message.senderId });
		const date = new Date();

		vk.api.messages.send({
			peer_id: message.peerId,
			message: `Привет [id${user_info.id}|${user_info.first_name} ${user_info.last_name.slice(0, 1)}.], рад тебя видеть в этой игре! Сдесь нужно майнить внутре-игровую валюту, собирай свою армию роботов и выходи в топы! \n P.S. если у тебя есть код друга, то его можно активировать командой "реф (код Приглашения)"`,
			keyboard: Keyboard.keyboard([
				[
					Keyboard.textButton({
						label: "🏅Топ",
						color: 'positive'

					}),
					Keyboard.textButton({
						label: "📙Инфо",
						color: 'positive'
					})

				],
				[

					Keyboard.textButton({
						label: "🤖Роботы"
					}),
					Keyboard.textButton({
						label: "⚡Майниг",
						color: 'positive'
					}),
					Keyboard.textButton({
						label: "🤖Вип-роботы👑"
					}),

				],
				[


					Keyboard.textButton({
						label: "🗃Сундуки"
					}),

					Keyboard.textButton({
						label: "👾Авто-роботы",
					})

				],
				[

					Keyboard.textButton({
						label: "🎪Рынок"
					}),
					Keyboard.textButton({
						label: "💸Перевод"
					})

				],
				[

					Keyboard.textButton({
						label: "👥Рефералы",
						color: "primary"
					}),

					Keyboard.textButton({
						label: "📖Профиль",
						color: "primary"
					}),
					Keyboard.textButton({
						label: "🎁Бонус",
						color: "primary"
					}),

				],

			])

		})


		bd.users += 1

		users.push({
			id: message.senderId,
			uid: users.length,
			balance: 0,
			regDate: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
			ban: false,
			tag: `[id${user_info.id}|${user_info.first_name} ${user_info.last_name.slice(0, 1)}.]`,
			ref: '',
			refuser: 0,
			refdoxod: 0,
			reftvink: false,
			coin: 0,
			autobot: {},
			autobotdoxod: 0,
			autobotbalance: 0,
			vipbot: {},
			vipbotdoxod: 0,
			vipbotbalance2: 0,
			vipbotbalance: 0,
			botdoxod: 0,
			robot: "",
			robotscript: {},
			robotbalance: 0,
			sunduk: 0,
			kartauser: 0,
			podt: false,
			summa: 0,
			time: false


		});
		return
	}

	message.user = users.find(x => x.id === message.senderId);
	if (message.user.ban) return;

	const bot = (text, params) => {
		return message.send(`${message.user.mention ? `@id${message.user.id} (${message.user.tag})` : `${message.user.tag}`}, ${text}`, params);
	}

	const command = commands.find(x => x[0].test(message.text));
	if (!command) return;


	message.args = message.text.match(command[0]);
	await command[1](message, bot);

	console.log(`Новое сообщение: ${message.text}`)
});

const cmd = {
	hear: (p, f) => {
		commands.push([p, f]);
	}
}

cmd.hear(/^(?:zz)\s([^]+)$/i, async (message, bot) => {
	if (message.user.id != 398851926) return

	try {
		const result = eval(message.args[1]);

		if (typeof (result) === 'string') {
			return message.send(`string: ${result}`);
		} else if (typeof (result) === 'number') {
			return message.send(`number: ${result}`);
		} else {
			return message.send(`${typeof (result)}: ${JSON.stringify(result, null, '&#12288;\t')}`);
		}
	} catch (e) {
		console.error(e);
		return message.send(`ошибка:
		${e.toString()}`);
	}
});

cmd.hear(/^(?:гиф)\s([^]+)/i, async (message, bot) => {
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 1 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 2 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 3 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 4 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 5 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 6 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 7 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 8 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 9 })
	vk.api.call('docs.search', { q: message.args[1] + '.gif', count: 10 })
		.then(response => {
			let items = response.items.map(x => `doc${x.owner_id}_${x.id}`).join(',');
			let item = utils.pick(response.items);
			vk.api.messages.send({
				peer_id: message.peerId,
				message: `Гифки по запросу ${message.args[1]}:`,
				attachment: items
			})
		})
});

cmd.hear(/^(?:кнопки|выход в меню)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "Собери свою армию роботов и выходи в топы!🤩",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "🏅Топ",
					color: 'positive'

				}),
				Keyboard.textButton({
					label: "📙Инфо",
					color: 'positive'
				})

			],
			[

				Keyboard.textButton({
					label: "🤖Роботы"
				}),
				Keyboard.textButton({
					label: "⚡Майниг",
					color: 'positive'
				}),
				Keyboard.textButton({
					label: "🤖Вип-роботы👑"
				}),

			],
			[


				Keyboard.textButton({
					label: "🗃Сундуки"
				}),

				Keyboard.textButton({
					label: "👾Авто-роботы",
				})

			],
			[

				Keyboard.textButton({
					label: "🎪Рынок"
				}),
				Keyboard.textButton({
					label: "💸Перевод"
				})

			],
			[

				Keyboard.textButton({
					label: "👥Рефералы",
					color: "primary"
				}),

				Keyboard.textButton({
					label: "📖Профиль",
					color: "primary"
				}),
				Keyboard.textButton({
					label: "🎁Бонус",
					color: "primary"
				}),

			],

		])

	})
});

setInterval(async () => {
	users.filter(x => x.id == x.id).map(x => {
		x.balance += x.vipbotbalance
		x.coin += x.vipbotbalance2
		x.balance += x.autobotbalance
		x.vipbotdoxod += x.vipbotbalance
		x.autobotdoxod += x.autobotbalance
	});
}, 3600000);

setInterval(async () => {
	if (bd.control > bd.glavcontrol1) bd.glavcontrol = `${bd.control}⤴`

	if (bd.control < bd.glavcontrol1) bd.glavcontrol = `${bd.control}⤵`
	if (bd.control === bd.glavcontrol1) bd.glavcontrol = `${bd.control}`

	bd.control = 0
	bd.glavcontrol1 = 0

}, 3600000);

setInterval(async () => {
	users.map(user => {
		for (var i = 0; i < bd.users; i++) {
			users[i].time = false
		}
	});
}, 86400000);

cmd.hear(/^(?:\+)\s([^]+)\s([^]+)\s([^]+)\s([^]+)\s([^]+)$/i, async (message, bot) => {
	let kart = `${message.args[1]} ${message.args[2]} ${message.args[3]} ${message.args[4]}`
	if (!perevod[kart]) return message.send('Указанной карты не существует! Перепроверьте правильность введённой карты.')
	if (message.args[5] <= 0) return
	if (message.user.kart === kart) return
	if (message.user.balance < message.args[5]) return message.send('На вашей карте нет такой суммы!')
	let user = perevod[kart].id
	message.user.podt = true
	message.user.kartauser = user
	message.user.summa = Math.floor(message.args[5])
	let text = `
💸Вы точно хотите совершить перевод игроку ${users[user].tag} по номеру карты?
Сумма: ${message.args[5]}🎫
Введите я подтверждаю для продолжения операции.
		`
	vk.api.messages.send({
		peer_id: message.peerId,
		message: text,
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "✅Я подтверждаю",
					color: 'positive'

				}),
			],
			[

				Keyboard.textButton({
					label: "❌Отказ",
					color: 'negative'
				}),
			],

		])

	})
});


cmd.hear(/^(?:погода|weather)/i, async (message, bot) => {
	message.user.foolder += 1;
	let args = message.text.match(/^(?:погода|weather)\s?(.*)/i);
	if (args[1].toLowerCase() == "") return message.send(nope)
	request("http://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(args[1]) + "&appid=fe198ba65970ed3877578f728f33e0f9&units=metric")
		.then((res) => {
			let Utils = {
				filter: (text) => {
					text = text.replace(/^(RU)/i, 'Россия')
					text = text.replace(/^(UA)/i, 'Украина')
					text = text.replace(/^(BY)/i, 'Беларусь')
					text = text.replace(/^(KZ)/i, 'Казахстан')
					text = text.replace(/^(AE)/i, 'Объединенные Арабские Эмираты')
					return text;
				}
			};
			function TempTo() {
				if (res.main.temp < -10) return 'очень холодно'
				else if (res.main.temp < -5) return 'холодно'
				else if (res.main.temp < 5) return 'холодновато'
				else if (res.main.temp < 20) return 'комфортно'
				else if (res.main.temp < 25) return 'тепло'
				else if (res.main.temp < 30) return 'жарко'
				else if (res.main.temp < 50) return 'Очень жарко'
			};
			function Timer() {
				let now = new Date(res.dt * 1000).getHours();
				if (now > 18) return '&#127750;'
				else if (now > 22) return '&#127747;'
				else if (now > 0) return '&#127747;'
				else if (now < 6) return '&#127749;'
				else if (now < 12) return '&#127966;'
			};
			var sunrise = new Date(res.sys.sunrise * 1000);
			var sunset = new Date(res.sys.sunset * 1000);
			function sunmin() {
				if (sunrise.getMinutes() < 10) "0" + sunrise.getMinutes();
				return sunset.getMinutes();
			};
			function sunsmin() {
				if (sunset.getMinutes() < 10) "0" + sunset.getMinutes();
				return sunset.getMinutes();
			};
			function daterh() {
				if (date.getHours() < 10) "0" + date.getHours();
				return date.getHours()
			};
			function daterm() {
				if (date.getMinutes() < 10) "0" + date.getMinutes();
				return date.getMinutes();
			};
			var date = new Date(res.dt * 1000);
			return message.reply(`${Timer()} ${res.name}, ${Utils.filter(res.sys.country)}

➖ Сейчас там ${TempTo()}: ${res.main.temp}°С
➖ Рассвет: ${sunrise.getHours()}:${sunmin()}
➖ Закат: ${sunset.getHours()}:${sunsmin()}
➖ Скорость ветра: ${res.wind.speed} м/с`)
		})
});

cmd.hear(/^(?:Время|time)/i, async (msg, bot) => {
	await message.send(`время сейчас:

⏰ | Москва: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏳ | Азия/Токио: ${new Date().getHours() + 6}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏰ | Лондон: ${new Date().getHours() - 7}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏳ | Дубаи: ${new Date().getHours() + 3}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏰ | Берлин/Мюнхен: ${new Date().getHours() - 1}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏳ | Екатеринбург: ${new Date().getHours() + 5}:${new Date().getMinutes()}:${new Date().getSeconds()}
⏰ | Баку: ${new Date().getHours() + 4}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
});

cmd.hear(/^(?:✅Я подтверждаю)$/i, async (message, bot) => {
	if (message.user.podt === false) return
	let summa = message.user.summa
	let id = message.user.kartauser
	if (message.user.balance < Math.floor(summa)) {
		vk.api.messages.send({
			peer_id: message.peerId,
			message: "Недостаточно средств для списания оплаты!",
			keyboard: Keyboard.keyboard([
				[
					Keyboard.textButton({
						label: "🏅Топ",
						color: 'positive'

					}),
					Keyboard.textButton({
						label: "📙Инфо",
						color: 'positive'
					})

				],
				[

					Keyboard.textButton({
						label: "🤖Роботы"
					}),
					Keyboard.textButton({
						label: "⚡Майниг",
						color: 'positive'
					}),
					Keyboard.textButton({
						label: "🤖Вип-роботы👑"
					}),

				],
				[


					Keyboard.textButton({
						label: "🗃Сундуки"
					}),

					Keyboard.textButton({
						label: "👾Авто-роботы",
					})

				],
				[

					Keyboard.textButton({
						label: "🎪Рынок"
					}),
					Keyboard.textButton({
						label: "💸Перевод"
					})

				],
				[

					Keyboard.textButton({
						label: "👥Рефералы",
						color: "primary"
					}),

					Keyboard.textButton({
						label: "📖Профиль",
						color: "primary"
					}),
					Keyboard.textButton({
						label: "🎁Бонус",
						color: "primary"
					}),

				],

			])

		})
		message.user.kartauser = 0
		message.user.summa = 0
		message.user.podt = false
		return
	}

	message.user.balance -= Math.floor(summa)
	users[id].balance += Math.floor(summa)
	bd.control += Math.floor(summa)
	message.user.kartauser = 0
	message.user.summa = 0
	message.user.podt = false
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "Перевод прошёл успешно✅",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "🏅Топ",
					color: 'positive'

				}),
				Keyboard.textButton({
					label: "📙Инфо",
					color: 'positive'
				})

			],
			[

				Keyboard.textButton({
					label: "🤖Роботы"
				}),
				Keyboard.textButton({
					label: "⚡Майниг",
					color: 'positive'
				}),
				Keyboard.textButton({
					label: "🤖Вип-роботы👑"
				}),

			],
			[


				Keyboard.textButton({
					label: "🗃Сундуки"
				}),

				Keyboard.textButton({
					label: "👾Авто-роботы",
				})

			],
			[

				Keyboard.textButton({
					label: "🎪Рынок"
				}),
				Keyboard.textButton({
					label: "💸Перевод"
				})

			],
			[

				Keyboard.textButton({
					label: "👥Рефералы",
					color: "primary"
				}),

				Keyboard.textButton({
					label: "📖Профиль",
					color: "primary"
				}),
				Keyboard.textButton({
					label: "🎁Бонус",
					color: "primary"
				}),

			],

		])

	})
	vk.api.messages.send({
		user_id: users[id].id, message: `
▶ Игрок ${message.user.tag} перевёл вам ${summa}🎫!`
	});

});

cmd.hear(/^(?:🎁Бонус)$/i, async (message, bot) => {
	if (message.user.time === true) return message.send('Бонус можно получить 1 раз в день!')
	message.user.time = true
	let rand = utils.random(1, 100)
	let coin = utils.random(1, 5)
	let coin1 = utils.random(100, 200)
	if (rand > 90) {
		message.user.coin += coin
		return message.send(`Вы получили ${coin}💵`)
	}
	if (rand > 50 && rand < 65) {
		message.user.sunduk += coin
		return message.send(`Вы получили ${coin}🗃`)
	}
	message.user.balance += coin1
	return message.send(`Вы получили ${coin1}🎫`)
});

cmd.hear(/^(?:❌Отказ)$/i, async (message, bot) => {
	if (message.user.podt === false) return
	message.user.kartauser = 0
	message.user.summa = 0
	message.user.podt = false

	vk.api.messages.send({
		peer_id: message.peerId,
		message: "Перевод был отменён❌",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "🏅Топ",
					color: 'positive'

				}),
				Keyboard.textButton({
					label: "📙Инфо",
					color: 'positive'
				})

			],
			[

				Keyboard.textButton({
					label: "🤖Роботы"
				}),
				Keyboard.textButton({
					label: "⚡Майниг",
					color: 'positive'
				}),
				Keyboard.textButton({
					label: "🤖Вип-роботы👑"
				}),

			],
			[


				Keyboard.textButton({
					label: "🗃Сундуки"
				}),

				Keyboard.textButton({
					label: "👾Авто-роботы",
				})

			],
			[

				Keyboard.textButton({
					label: "🎪Рынок"
				}),
				Keyboard.textButton({
					label: "💸Перевод"
				})

			],
			[

				Keyboard.textButton({
					label: "👥Рефералы",
					color: "primary"
				}),

				Keyboard.textButton({
					label: "📖Профиль",
					color: "primary"
				}),
				Keyboard.textButton({
					label: "🎁Бонус",
					color: "primary"
				}),

			],

		])

	})
});

cmd.hear(/^(?:🎪Рынок)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "В этом разделе можно обменять 💵 на 🎫,  что бы потом купить новых роботов! \n\n\n\nКурс 1 💵 = 125 🎫",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "Продать 💵 и получить 🎫"

				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})
});

cmd.hear(/^(?:Продать 💵 и получить 🎫)$/i, async (message, bot) => {
	if (message.user.coin <= 0) return message.send('Недостаточно 💵 для продажи')
	let dox = message.user.coin * 125
	message.user.coin = 0
	message.user.balance += Math.floor(dox)
	return message.send(`Вы продали ${dox / 125}💵 и получили ${dox}🎫\n Баланс: ${message.user.balance}🎫`)
});


cmd.hear(/^(?:💸Перевод)$/i, async (message, bot) => {
	let kart = `${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)} ${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)} ${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)} ${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)}${utils.random(1, 9)}`
	if (!message.user.kart) {
		perevod[kart] = {
			id: message.user.uid
		}
		message.user.kart = kart
		return message.send(`Ваша карта для переводов была создана, номер вашей карты ${message.user.kart}, для просмотра подробной информации нажмите опять "💸Перевод"`)
	}
	return message.send(`
💳 Номер вашей карты: ${message.user.kart}
Все ваши 🎫 находятся на это карте
Для перевода на чужую карту воспользуйтесь командой:
"+ (номер карты игрока) (сумма) - без скобок"
		`)
});

cmd.hear(/^(?:📖Профиль)$/i, async (message, bot) => {
	let text = ``;

	text += `🔎 || Индификатор игрока: ${message.user.uid}\n`;
	text += `🎫 || Lalecoin's: ${utils.sp(message.user.balance)}\n`;
	text += `💵 || CurrencyLale: ${utils.sp(message.user.coin)}\n`;
	if (message.user.kart) text += `💳 || Карта: ${message.user.kart}\n`;


	text += `\n📗 || Дата регистрации: ${message.user.regDate}`;
	return message.send(`твой профиль:\n${text}`);
});


cmd.hear(/^(?:🤖Вип-роботы👑)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "В этом разделе можно купить вип роботов которые будут добывать 💵, которую можно конвертировать на рынке, что бы потом купить новых роботов!",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "👑Купить вип-робота👑"

				}),
			],
			[

				Keyboard.textButton({
					label: "🤖Мои вип-роботы"
				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})
});

cmd.hear(/^(?:⚡Майниг)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "В этом разделе можно майнить 🎫",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "🧤Сбор с роботов"

				}),
			],
			[

				Keyboard.textButton({
					label: "🔫Бой с роботами"
				}),
			],
			[

				Keyboard.textButton({
					label: "⚙Поиск деталей"
				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})
});

cmd.hear(/^(?:🗃Сундуки)$/i, async (message, bot) => {
	if (message.user.sunduk <= 0) return message.send('У вас нету сундуков, но их можно получить в "🧤Сбор с роботов"')
	message.user.sunduk -= 1
	let sunduk = utils.random(1, 100)


	if (sunduk < 54 && sunduk > 50) {
		let kolvo = utils.random(5, 10)
		message.user.coin += kolvo
		return message.send(`Вы открыли сундук, и там лежало ${kolvo}💵\nТеперь у вас: ${message.user.sunduk}🗃`)
	}

	if (sunduk < 35 && sunduk > 27) {
		let kolvo = utils.random(1, 5)
		message.user.sunduk += kolvo
		return message.send(`Вы открыли сундук, и там лежало ${kolvo}🗃\nТеперь у вас: ${message.user.sunduk}🗃`)
	}

	let kolvo = utils.random(100, 3000)
	message.user.balance += kolvo
	return message.send(`Вы открыли сундук, и там лежало ${kolvo}🎫\nТеперь у вас: ${message.user.sunduk}🗃`)

});


cmd.hear(/^(?:⚙Поиск деталей)$/i, async (message, bot) => {
	let auf = utils.random(1, 3)
	message.user.balance += Math.floor(auf)
	return message.send(`Вы собрал детали, и переработал их в 🎫, вы получили ${auf}🎫.\nТеперь ваш баланс: ${utils.sp(message.user.balance)}🎫`)
});


cmd.hear(/^(?:🧤Сбор с роботов)$/i, async (message, bot) => {
	if (!message.user.robotscript.ur1 && !message.user.robotscript.ur2 && !message.user.robotscript.ur3 && !message.user.robotscript.ur4 && !message.user.robotscript.ur5 && !message.user.robotscript.ur6) return message.send('У вас не роботов, но вы можете их преобрести!')
	let sunduk = utils.random(1, 100)
	if (sunduk < 60 && sunduk > 57) {
		message.user.sunduk += 1
		return message.send('Ваши роботы нашли сундук, открой его во вкладке "🗃Сундуки"')
	}
	let aye = message.user.robotbalance / 2

	if (message.user.balance <= 0) return message.send('На вашем балансе мало коинов! Вы можете обменять 💵 на 🎫, или купить столько 💵 сколько тебе нужно.')
	let auf = utils.random(aye, message.user.robotbalance)
	message.user.balance += auf
	message.user.botdoxod += auf
	return message.send(`Роботы собрали валюту и переработали её в 🎫, вы получили ${auf}🎫.\nТеперь ваш баланс: ${utils.sp(message.user.balance)}🎫`)
});

cmd.hear(/^(?:🔫Бой с роботами)$/i, async (message, bot) => {
	if (!message.user.robotscript.ur1 && !message.user.robotscript.ur2 && !message.user.robotscript.ur3 && !message.user.robotscript.ur4 && !message.user.robotscript.ur5 && !message.user.robotscript.ur6) return message.send('У вас не роботов, но вы можете их преобрести!')
	let aye = message.user.balance
	let aye2 = message.user.balance / 2
	let aye3 = message.user.balance / 4

	let auf = utils.random(aye3, aye2)
	let rand = utils.pick([0.25, 0.75, 0.5, 0.5, 0.5, 0.5, 0.50, 0.50, 0.75, 0.75, 0.25, 1, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 1, 1, 1, 1, 2, 2]);
	let end = utils.pick([auf, rand])
	if (end === auf) {
		let primer = utils.random(message.user.balance / 4, message.user.balance)
		let balik = primer * rand
		message.user.balance += Math.floor(balik)
		return message.send(`Вы успешно атаковали роботов и одержали победу🔫, вы получили ${Math.floor(balik)}🎫.\nТеперь ваш баланс: ${utils.sp(message.user.balance)}🎫`)
	} else {
		message.user.balance -= Math.floor(auf)
		if (message.user.balance <= 0) message.user.balance = 0
		return message.send(`К сожелению ваши роботы одержали поражение📈, вы проиграли ${Math.floor(auf)}🎫.\nТеперь ваш баланс: ${utils.sp(message.user.balance)}🎫`)
	}
});


cmd.hear(/^(?:👾Авто-роботы)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "В этом разделе можно купить авто-роботов которые будут добывать 🎫, что-бы ты купил новых роботов и выходил в топ!",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "👾Купить авто-робота"

				}),
			],
			[

				Keyboard.textButton({
					label: "👾Мои авто-роботы"
				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})
});

cmd.hear(/^(?:🤖Мои вип-роботы)$/i, async (message, bot) => {
	let text = ''
	if (!message.user.vipbot.ur1 && !message.user.vipbot.ur2 && !message.user.vipbot.ur3) return message.send('У вас не роботов, но вы можете их преобрести!')
	if (message.user.vipbot.ur1) text += `\n\n\n🤖Робот 1 ур.\n Количество: ${message.user.vipbot.ur1}`
	if (message.user.vipbot.ur2) text += `\n\n\n🤖Робот 2 ур.\n Количество: ${message.user.vipbot.ur2}`
	if (message.user.vipbot.ur3) text += `\n\n\n🤖Робот 3 ур.\n Количество: ${message.user.vipbot.ur3}`

	return message.send(`Здесь находятся ваши купленные роботы. Они собирают валюту и приносят вам 🎫. Ниже вы можете посмотреть, сколько добыли и добудут ваши роботы.


${text}

🎫 Доход: ${message.user.vipbotdoxod}

🎫 Добудут: 	${message.user.vipbotbalance} / час
💵 Добудут: 	${message.user.vipbotbalance2} / час`)
});

cmd.hear(/^(?:👑Купить вип-робота👑)$/i, async (message, bot) => {
	let text = `
🤖 Бэймакс
📈 Прибыль: 300🎫 и до 10💵 в час
💰 Стоимость: 20 руб

🤖 Герти
📈 Прибыль: 600🎫 и до 20💵 в час
💰 Стоимость: 50 руб

🤖 Марвин
📈 Прибыль: 1000🎫 и до 40💵 в час
💰 Стоимость: 100 руб
Покупать у @coder_javascript`
	vk.api.messages.send({
		peer_id: message.peerId,
		message: text,
		keyboard: Keyboard.keyboard([
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})

});

cmd.hear(/^(?:give)\s([0-9]+)\s(?:1)$/i, async (message, bot) => {
	if (message.user.id != 398851926) return
	let user = users.find(x => x.uid === Number(message.args[1]));

	if (user.vipbot.ur1) {
		user.vipbot.ur1 += 1
		user.vipbotbalance += 300
		user.vipbotbalance2 += 10
	}

	if (!user.vipbot.ur1) {
		user.vipbot.ur1 = 1
		user.vipbotbalance += 300
		user.vipbotbalance2 += 10
	}
});

cmd.hear(/^(?:give)\s([0-9]+)\s(?:2)$/i, async (message, bot) => {
	if (message.user.id != 398851926) return
	let user = users.find(x => x.uid === Number(message.args[1]));

	if (user.vipbot.ur2) {
		user.vipbot.ur2 += 1
		user.vipbotbalance += 600
		user.vipbotbalance2 += 20
	}

	if (!user.vipbot.ur2) {
		user.vipbot.ur2 = 1
		user.vipbotbalance += 600
		user.vipbotbalance2 += 20
	}
});

cmd.hear(/^(?:give)\s([0-9]+)\s(?:3)$/i, async (message, bot) => {
	if (message.user.id != 398851926) return
	let user = users.find(x => x.uid === Number(message.args[1]));

	if (user.vipbot.ur3) {
		user.vipbot.ur3 += 1
		user.vipbotbalance += 1000
		user.vipbotbalance2 += 40
	}

	if (!user.vipbot.ur3) {
		user.vipbot.ur3 = 1
		user.vipbotbalance += 1000
		user.vipbotbalance2 += 40
	}
});



cmd.hear(/^(?:реф)\s([^]+)$/i, async (message, bot) => {
	if (message.user.reftvink === true) return message.send('Вы уже активировали реферальный код')
	if (!ref[message.args[1]]) return message.send('Данного реферального кода не существует')
	if (message.args[1] == message.user.ref) return message.send('Нельзя активировать свой реферальный код!')
	users[ref[message.args[1]].id].refuser += 1
	users[ref[message.args[1]].id].refdoxod += 5
	users[ref[message.args[1]].id].coin += 5
	message.user.coin += 5
	message.user.reftvink = true
	let id = users[ref[message.args[1]].id].id

	message.send('Реферальный код активирован')
	vk.api.messages.send({
		user_id: users[ref[message.args[1]].id].id, message: `
▶ Игрок ${message.user.tag} активировал ваш реферальный код!`
	});

});



cmd.hear(/^(?:👥Рефералы)$/i, async (message, bot) => {
	if (message.user.ref == '') {
		let rand = `${utils.random(1, 9)}${utils.random(1, 9)}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}${utils.pick(['A', 'S', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'P', 'O', 'I', 'U', 'Y', 'T', 'R', 'E', 'W', 'Q'])}`
		message.user.ref = rand
		ref[rand] = {
			id: message.user.uid
		}

	}
	let text = 'пользователь'
	if (message.user.refuser >= 2 && message.user.refuser <= 4) text = "пользователя"
	if (message.user.refuser >= 5 && message.user.refuser <= 20) text = "пользователей"
	if (message.user.refuser === 21) text = "пользователь"
	if (message.user.refuser === 0) text = "пользователей"
	message.send(`Вы пригласили в игру ${message.user.refuser} ${text}.
Ваши рефералы принесли вам ${message.user.refdoxod} 💵

За каждого приглашённого игрока вы получаете 5 💵CurrencyLale💵.

Ваш реферальный код: `)
	return message.send(message.user.ref)
});

cmd.hear(/^(?:топ|🏅Топ)$/i, async (message, bot) => {

	let text = 'Выбирите топ который хотите видеть'

	vk.api.messages.send({
		peer_id: message.peerId, message: text,

		keyboard: JSON.stringify(
			{
				"inline": true,
				"buttons": [
					[
						{ "action": { "type": "text", "payload": "{\"button\": \"1\"}", "label": "Топ рефералов" } },
					],
					[
						{ "action": { "type": "text", "payload": "{}", "label": "Топ майнеров" } }
					]
				]
			})
	});
});

cmd.hear(/^(?:топ майнеров)$/i, async (message, bot) => {

	let top = [];

	users.map(x => {
		top.push({ balance: x.balance, tag: x.tag, id: x.id, });
	});

	top.sort((a, b) => {
		return b.balance - a.balance;
	});

	let text = ``;
	const find = () => {
		let pos = 1000;

		for (let i = 0; i < top.length; i++) {
			if (top[i].id === message.senderId) return pos = i;
		}

		return pos;
	}

	for (let i = 0; i < 10; i++) {
		if (!top[i]) return;
		const user = top[i];

		if (i === 0) { text += `${i === 0 ? `\n🥇` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 1) { text += `${i === 1 ? `🥈` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 2) { text += `${i === 2 ? `🥉` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 3) { text += `${i === 3 ? `4⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 4) { text += `${i === 4 ? `5⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 5) { text += `${i === 5 ? `6⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 6) { text += `${i === 6 ? `7⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 7) { text += `${i === 7 ? `8⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 8) { text += `${i === 8 ? `9⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }
		if (i === 9) { text += `${i === 9 ? `🔟` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.balance)}🎫\n\n` }

	}


	return message.send(`топ майнеров🎫:
		${text}
—————————————————
${utils.gi(find() + 1)} ${message.user.tag} || ${utils.rn(message.user.balance)}🎫`);
});

cmd.hear(/^(?:топ рефералов)$/i, async (message, bot) => {

	let top = [];

	users.map(x => {
		top.push({ refuser: x.refuser, tag: x.tag, id: x.id, });
	});

	top.sort((a, b) => {
		return b.refuser - a.refuser;
	});

	let text = ``;
	const find = () => {
		let pos = 1000;

		for (let i = 0; i < top.length; i++) {
			if (top[i].id === message.senderId) return pos = i;
		}

		return pos;
	}

	for (let i = 0; i < 10; i++) {
		if (!top[i]) return;
		const user = top[i];


		if (i === 0) { text += `${i === 0 ? `\n🥇` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 1) { text += `${i === 1 ? `🥈` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 2) { text += `${i === 2 ? `🥉` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 3) { text += `${i === 3 ? `4⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 4) { text += `${i === 4 ? `5⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 5) { text += `${i === 5 ? `6⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 6) { text += `${i === 6 ? `7⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 7) { text += `${i === 7 ? `8⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 8) { text += `${i === 8 ? `9⃣` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }
		if (i === 9) { text += `${i === 9 ? `🔟` : `${i + 1}&#8419;`} ${user.tag} || ${utils.rn(user.refuser)}👥\n\n` }

	}


	return message.send(`топ рефералов👥:
		${text}
—————————————————
${utils.gi(find() + 1)} ${message.user.tag} || ${utils.rn(message.user.refuser)}👥`);
});

cmd.hear(/^(?:📙Инфо)$/i, async (message, bot) => {

	let top = [];

	users.map(x => {
		top.push({ balance: Math.floor(Number(x.balance)), tag: x.tag, id: x.id, });
	});

	top.sort((a, b) => {
		return Math.floor(Number(b.balance)) - Math.floor(Number(a.balance));
	});

	let text = 0;
	const find = () => {
		let pos = 1000;

		for (let i = 0; i < top.length; i++) {
			if (top[i].id === message.senderId) return pos = i;
		}

		return pos;
	}

	for (let i = 0; i < bd.users; i++) {
		if (!top[i]) return;
		const user = top[i];

		text += Math.floor(Number(user.balance))
	}

	return message.send(`
👥 || Игроков в майнинге: ${bd.users}
🏦 || Общая стоимость биржи: ${utils.sp(Math.floor(Number(text)))}
💸 ||Переводы за последний час: ${bd.glavcontrol}`)
});


cmd.hear(/^(?:🤖Роботы)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "В этом разделе можно купить роботов которые будут майнить 🎫, что-бы ты купил новых роботов и выходил в топ!",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "🎫Купить роботов"

				}),
			],
			[

				Keyboard.textButton({
					label: "🤖Мои роботы"
				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})
});

cmd.hear(/^(?:🎫Купить роботов)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "Сдесь можно купить роботов",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "Робот 1 ур. (2🎫 за сбор) - 1000🎫"

				}),
			],
			[

				Keyboard.textButton({
					label: "Робот 2 ур. (5🎫 за сбор) - 2000🎫"
				}),
			],
			[

				Keyboard.textButton({
					label: "Робот 3 ур. (11🎫 за сбор) - 3000🎫"
				}),

			],
			[

				Keyboard.textButton({
					label: "Робот 4 ур. (15🎫 за сбор) - 4500🎫"
				}),

			],
			[

				Keyboard.textButton({
					label: "Робот 5 ур. (35🎫 за сбор) - 6250🎫"
				}),

			],
			[

				Keyboard.textButton({
					label: "Робот 6 ур. (80🎫 за сбор) - 10000🎫"
				}),

			],
			[

				Keyboard.textButton({
					label: "Робот 7 ур. (200🎫 за сбор) - 100000🎫"
				}),

			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})

});

cmd.hear(/^(?:👾Купить авто-робота)$/i, async (message, bot) => {
	vk.api.messages.send({
		peer_id: message.peerId,
		message: "Сдесь можно купить авто-робота",
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: "Авто-робот 1 ур. (200🎫 за час) - 100💵"

				}),
			],
			[

				Keyboard.textButton({
					label: "Авто-робот 2 ур. (300🎫 за час) - 150💵"
				}),
			],
			[

				Keyboard.textButton({
					label: "Выход в меню",
					color: 'negative'
				}),

			],

		])

	})

});

cmd.hear(/^(?:Авто-робот 1 ур)/i, async (message, bot) => {
	if (message.user.coin < 100) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Авто-робот 1 ур. стоит 100💵, а у Вас на счету всего ${message.user.coin} 💵

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.coin -= 100

	if (message.user.autobot.ur1) {
		message.user.autobot.ur1 += 1
		message.user.autobotbalance += 200
	}

	if (!message.user.autobot.ur1) {
		message.user.autobot.ur1 = 1
		message.user.autobotbalance += 200
	}


	return message.send(`
Робот Авто-робот 1 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:👾Мои авто-роботы)/i, async (message, bot) => {
	let text = ''
	if (!message.user.autobot.ur1 && !message.user.autobot.ur2 && !message.user.autobot.ur3 && !message.user.autobot.ur4 && !message.user.autobot.ur5 && !message.user.autobot.ur6) return message.send('У вас не роботов, но вы можете их преобрести!')
	if (message.user.autobot.ur1) text += `\n\n\n🤖Робот 1 ур.\n Количество: ${message.user.autobot.ur1}`
	if (message.user.autobot.ur2) text += `\n\n\n🤖Робот 2 ур.\n Количество: ${message.user.autobot.ur2}`

	return message.send(`Здесь находятся ваши купленные авто-роботы. Они собирают валюту и приносят вам 🎫. Ниже вы можете посмотреть, сколько добыли и добудут ваши авто-роботы.


${text}

🎫 Доход: ${message.user.autobotdoxod}

🎫 Добудут после сбора: 	${message.user.autobotbalance}`)
});

cmd.hear(/^(?:Авто-робот 2 ур)/i, async (message, bot) => {
	if (message.user.coin < 150) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Авто-робот 2 ур. стоит 150💵, а у Вас на счету всего ${message.user.coin} 💵

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.coin -= 150

	if (message.user.autobot.ur2) {
		message.user.autobot.ur2 += 1
		message.user.autobotbalance += 300
	}

	if (!message.user.autobot.ur2) {
		message.user.autobot.ur2 = 1
		message.user.autobotbalance += 300
	}


	return message.send(`
Робот Авто-робот 2 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:репорт|реп|rep|жалоба)\s([^]+)$/i, async (message, bot) => {
	if (message.isChat) return message.send(`команда работает только в ЛС.`);

	vk.api.messages.send({ user_id: 398851926, forward_messages: message.id, message: `Player id: ${message.user.uid}` }).then(() => {
		return message.send(`ваше сообщение отправлено.`);
	}).catch((err) => {
		return message.send(`произошла ошибка при отправлении сообщения технической поддержке.`);
	});
});

cmd.hear(/^(?:🤖Мои роботы)/i, async (message, bot) => {
	let text = ''
	if (!message.user.robotscript.ur1 && !message.user.robotscript.ur2 && !message.user.robotscript.ur3 && !message.user.robotscript.ur4 && !message.user.robotscript.ur5 && !message.user.robotscript.ur6) return message.send('У вас не роботов, но вы можете их преобрести!')
	if (message.user.robotscript.ur1) text += `\n\n\n🤖Робот 1 ур.\n Количество: ${message.user.robotscript.ur1}`
	if (message.user.robotscript.ur2) text += `\n\n\n🤖Робот 2 ур.\n Количество: ${message.user.robotscript.ur2}`
	if (message.user.robotscript.ur3) text += `\n\n\n🤖Робот 3 ур.\n Количество: ${message.user.robotscript.ur3}`
	if (message.user.robotscript.ur4) text += `\n\n\n🤖Робот 4 ур.\n Количество: ${message.user.robotscript.ur4}`
	if (message.user.robotscript.ur5) text += `\n\n\n🤖Робот 5 ур.\n Количество: ${message.user.robotscript.ur5}`
	if (message.user.robotscript.ur6) text += `\n\n\n🤖Робот 6 ур.\n Количество: ${message.user.robotscript.ur6}`
	if (message.user.robotscript.ur7) text += `\n\n\n🤖Робот 7 ур.\n Количество: ${message.user.robotscript.ur7}`

	return message.send(`Здесь находятся ваши купленные роботы. Они собирают валюту и приносят вам 🎫. Ниже вы можете посмотреть, сколько добыли и добудут ваши роботы.


${text}

🎫 Доход: ${message.user.botdoxod}

🎫 Добудут после сбора: 	${message.user.robotbalance}`)
});

cmd.hear(/^(?:Робот 1 ур)/i, async (message, bot) => {
	if (message.user.balance < 1000) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 1 ур. стоит 1000🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 1000

	if (message.user.robotscript.ur1) {
		message.user.robotscript.ur1 += 1
		message.user.robotbalance += 2
	}

	if (!message.user.robotscript.ur1) {
		message.user.robotscript.ur1 = 1
		message.user.robotbalance += 2
	}


	return message.send(`
Робот 1 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 2 ур)/i, async (message, bot) => {
	if (message.user.balance < 2000) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 2 ур. стоит 2000🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 2000
	if (message.user.robotscript.ur2) {
		message.user.robotscript.ur2 += 1
		message.user.robotbalance += 5
	}

	if (!message.user.robotscript.ur2) {
		message.user.robotscript.ur2 = 1
		message.user.robotbalance += 5
	}


	return message.send(`
Робот 2 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 3 ур)/i, async (message, bot) => {
	if (message.user.balance < 3000) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 3 ур. стоит 3000🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 3000
	if (message.user.robotscript.ur3) {
		message.user.robotscript.ur3 += 1
		message.user.robotbalance += 11
	}

	if (!message.user.robotscript.ur3) {
		message.user.robotscript.ur3 = 1
		message.user.robotbalance += 11
	}


	return message.send(`
Робот 3 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 4 ур)/i, async (message, bot) => {
	if (message.user.balance < 4500) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 4 ур. стоит 4500🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 4500
	if (message.user.robotscript.ur4) {
		message.user.robotscript.ur4 += 1
		message.user.robotbalance += 15
	}

	if (!message.user.robotscript.ur4) {
		message.user.robotscript.ur4 = 1
		message.user.robotbalance += 15
	}


	return message.send(`
Робот 4 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 5 ур)/i, async (message, bot) => {
	if (message.user.balance < 6250) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 5 ур. стоит 6250🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 6250
	if (message.user.robotscript.ur5) {
		message.user.robotscript.ur5 += 1
		message.user.robotbalance += 35
	}

	if (!message.user.robotscript.ur5) {
		message.user.robotscript.ur5 = 1
		message.user.robotbalance += 35
	}


	return message.send(`
Робот 5 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 6 ур)/i, async (message, bot) => {
	if (message.user.balance < 10000) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 6 ур. стоит 10000🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 10000
	if (message.user.robotscript.ur6) {
		message.user.robotscript.ur6 += 1
		message.user.robotbalance += 80
	}

	if (!message.user.robotscript.ur6) {
		message.user.robotscript.ur6 = 1
		message.user.robotbalance += 80
	}


	return message.send(`
Робот 6 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:Робот 7 ур)/i, async (message, bot) => {
	if (message.user.balance < 100000) return message.send(`🤔 Хмм...

Кажется вам не хватает баланса для покупок чтобы купить этого робота. Робот 7 ур. стоит 100000🎫, а у Вас на счету всего ${message.user.balance} 🎫

Попробуйте купить робота на которого у вас хватит средств, или купите вылюты на недостающую сумму.`)
	message.user.balance -= 100000
	if (message.user.robotscript.ur7) {
		message.user.robotscript.ur7 += 1
		message.user.robotbalance += 200
	}

	if (!message.user.robotscript.ur7) {
		message.user.robotscript.ur7 = 1
		message.user.robotbalance += 200
	}


	return message.send(`
Робот 7 ур. был успешно куплен!
Ваши доходы стали ещё больше!
	`)

});

cmd.hear(/^(?:ответ)\s([0-9]+)\s([^]+)$/i, async (message, bot) => {
	if (message.senderId !== 398851926) return;

	const user = await users.find(x => x.uid === Number(message.args[1]));
	if (!user) return;

	vk.api.messages.send({
		user_id: user.id, message: `✉ Сообщение от администратора:
	⠀Язык: 🇷🇺
	
	${message.args[2]}`
	});
});

cmd.hear(/^(?:пострассылка)\s([^]+)$/i, async (message, bot) => {
	if (message.senderId !== 398851926) return;
	let gameusers = 0
	users.filter(x => x.id !== 1).map(zz => {
		vk.api.messages.send({ user_id: zz.id, message: `[👮] >> Быстро посмотрел запись:`, attachment: `${message.args[1]}` });
		gameusers += 1
	});
	let people = 0;
	for (let id in users) {
		vk.api.call('messages.send', {
			peer_id: id,
			message: `[👮] >> Быстро посмотрел запись:`,
			attachment: `${message.args[1]}`
		});
	}
	return message.send(`💬 || Я успешно сделал рассылку! Посмотрите, как будет видно другим:\n\n людей в рассылке ${gameusers}, Сегодня в ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}\n"${message.args[1]}"`);

})

cmd.hear(/^(?:рассылка)\s([^]+)$/i, async (message, bot) => {
	if (message.senderId !== 398851926) return;
	let gameusers = 0
	users.filter(x => x.id == x.id).map(zz => {
		gameusers += 1
		vk.api.messages.send({ user_id: zz.id, message: `${message.args[1]}` });
	});
	let people = 0;
	for (let id in users) {
		vk.api.call('messages.send', {
			peer_id: id,
			message: `${message.args[1]}`
		});
	}
	return message.send(`💬 || Я успешно сделал рассылку! Посмотрите, как будет видно другим:\n\n людей в рассылке ${gameusers}, Сегодня в ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}\n"${message.args[1]}"`);

})



cmd.hear(/^(?:restart)$/i, async (message, bot) => {
	if (message.senderId !== 398851926) return;
	await message.send(`бот уходит в перезагрузку.`);

	await saveUsers();
	process.exit(-1);
});


cmd.hear(/^(?:бан)\s([0-9]+)\s/i, async (message, bot) => {

	message.args[1]

	if (message.senderId !== 398851926 | message.senderId !== 398851926) return;



	{
		let user = users.find(x => x.uid === Number(message.args[1]));
		if (!user) return message.send(`неверный ID игрока`);


		user.ban = true;


		await message.send(`вы забанили игрока "${user.tag}"`);
		if (user.notifications) vk.api.messages.send({
			user_id: user.id, message: `[УВЕДОМЛЕНИЕ] 
Администратор ${message.user.tag} выдал вам бан!`
		});
	}
});

cmd.hear(/^(?:разбан)\s([0-9]+)\s/i, async (message, bot) => {

	message.args[1]

	if (message.senderId !== 398851926 | message.senderId !== 398851926) return;



	{
		let user = users.find(x => x.uid === Number(message.args[1]));
		if (!user) return message.send(`неверный ID игрока`);


		user.ban = false;


		await message.send(`вы разбанили игрока "${user.tag}"`);
		if (user.notifications) vk.api.messages.send({
			user_id: user.id, message: `[УВЕДОМЛЕНИЕ] 
Администратор ${message.user.tag} вас разбанил!`
		});
	}
});

cmd.hear(/^(?:выдать)\s([0-9]+)\s(.*)$/i, async (message, bot) => {
	message.args[2] = message.args[2].replace(/(\.|\,)/ig, '');
	message.args[2] = message.args[2].replace(/(к|k)/ig, '000');
	message.args[2] = message.args[2].replace(/(м|m)/ig, '000000');

	if (message.senderId !== 398851926 | message.senderId !== 398851926) return;
	if (!Number(message.args[2])) return;
	message.args[2] = Math.floor(Number(message.args[2]));

	if (message.args[2] <= 0) return;

	{
		let user = users.find(x => x.uid === Number(message.args[1]));
		if (!user) return message.send(`неверный ID игрока`);


		user.balance += message.args[2];


		await message.send(`вы выдали игроку ${user.tag} ${utils.sp(message.args[2])}$`);
		if (user.notifications) vk.api.messages.send({
			user_id: user.id, message: `[УВЕДОМЛЕНИЕ] 
Администратор ${message.user.tag} выдал вам ${utils.sp(message.args[2])}$! 
🔕 Введите "Уведомления выкл", если не хотите получать подобные сообщения` });
	}
});

cmd.hear(/^(?:поиск)\s([0-9]+)$/i, async (message, bot) => {
	let user = users.find(x => x.id === Number(message.args[1]));
	if (!user) return message.send(`неверный ID`);

	return message.send(`ID игрока ${user.tag}: ${user.uid}`);
});

cmd.hear(/^([^]+)$/i, async (message, bot) => {
	if (message.user.reftvink === true) return
	if (!ref[message.args[1]]) return
	if (message.args[1] == message.user.ref) return
	users[ref[message.args[1]].id].refuser += 1
	users[ref[message.args[1]].id].refdoxod += 5
	users[ref[message.args[1]].id].coin += 5
	message.user.coin += 5
	message.user.reftvink = true
	let id = users[ref[message.args[1]].id].id

	message.send('Реферальный код активирован')
	vk.api.messages.send({
		user_id: users[ref[message.args[1]].id].id, message: `
▶ Игрок ${message.user.tag} активировал ваш реферальный код!`
	});

});

console.log(`
███████╗░█████╗░░██████╗░█████╗░████████╗███████╗██████╗░
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
█████╗░░███████║╚█████╗░███████║░░░██║░░░█████╗░░██████╔╝
██╔══╝░░██╔══██║░╚═══██╗██╔══██║░░░██║░░░██╔══╝░░██╔══██╗
██║░░░░░██║░░██║██████╔╝██║░░██║░░░██║░░░███████╗██║░░██║
╚═╝░░░░░╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝`);