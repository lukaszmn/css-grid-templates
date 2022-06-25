export const Parser = {

	tokens: [],

	parse: function (s) {
		this.tokens = [{ name: 'text', value: s.trim() }];
		this._tokenize()
		return this.tokens;
	},

	getValues: function () {
		return this.tokens.map(token => {
			switch (token.name) {
				case 'text': return token.value;
				case 'repeat': return token.count + '/' + token.value;
			}
		});
	},

	_tokenize: function () {
		let index;
		while ((index = this.tokens.findIndex(this._isRepeat)) > -1) {
			this._convertRepeats(index);
		}

		this._expandRepeats();

		this._splitTexts();
	},

	_isRepeat: function (token) {
		return token.name === 'text' && token.value.indexOf('repeat(') > -1;
	},

	_convertRepeats: function (index) {
		const s = this.tokens[index].value;

		const start = s.indexOf('repeat(');

		const rightBracket = this._findRightBracket(s, start);
		if (rightBracket < 0)
			throw Error('Missing right bracket');

		const comma = s.indexOf(',', start);

		const count = s.substring(start + 7, comma).trim();
		const value = s.substring(comma + 1, rightBracket).trim();

		const repeat = {
			name: 'repeat',
			count: count,
			value: value,
			integerCount: Number.isInteger(+count) ? +count : 0
		};

		const before = { name: 'text', value: s.substring(0, start).trim() };
		const after = { name: 'text', value: s.substring(rightBracket + 1).trim() };

		const newTokens = [before, repeat, after]
			.filter(item => item.value.length > 0);

		this.tokens.splice(index, 1, ...newTokens);
	},

	_findRightBracket: function (string, pos) {
		let counter = 0;
		while (pos < string.length) {
			if (string[pos] === '(') {
				++counter;
			} else if (string[pos] === ')') {
				--counter;
				if (counter === 0)
					return pos;
			}
			++pos;
		}

		return -1;
	},

	_expandRepeats: function () {
		for (let i = 0; i < this.tokens.length; ++i) {
			const token = this.tokens[i];

			if (token.name === 'repeat' && token.integerCount > 0) {
				const newTokens = Array(token.integerCount).fill({
					name: 'text',
					value: token.value
				});

				this.tokens.splice(i, 1, ...newTokens);
			}
		}
	},

	_splitTexts: function () {
		for (let i = this.tokens.length - 1; i >= 0; --i) {
			const token = this.tokens[i];

			if (token.name === 'text') {
				const newTokens = this._splitText(token.value);
				this.tokens.splice(i, 1, ...newTokens);
			}
		}
	},

	_splitText: function (s) {
		const newTokens = [];

		let start = 0;
		let inBracket = false;
		for (let i = 0; i < s.length; ++i) {
			switch (s[i]) {

				case ' ':
					if (!inBracket) {
						newTokens.push({ name: 'text', value: s.substring(start, i).trim() });
						start = i + 1;
					}
					break;

				case '(':
					inBracket = true;
					break;

				case ')':
					inBracket = false;
					break;
			}
		}

		if (start < s.length - 1) {
			newTokens.push({ name: 'text', value: s.substring(start, s.length).trim() });
		}

		return newTokens;
	}

};

//module.exports = Parser;
