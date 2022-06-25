// const Parser = require('../src/parser');
import Parser from '/src/parser.js';


function testParser(input, output) {
	Parser.parse(input);
	const values = Parser.getValues();
	if (values.length !== output.length) {
		throw Error('Failed test for: ' + input);
	}
	for (let i = 0; i < values.length; ++i) {
		if (values[i] !== output[i]) {
			throw Error('Failed test for: ' + input);
		}
	}
}


testParser('1fr repeat(3, 6em) 2fr', ['1fr', '6em', '6em', '6em', '2fr']);
testParser('repeat(auto-fit, minmax(6em, 1fr))', ['auto-fit/minmax(6em, 1fr)']);
testParser('50%', ['50%']);
testParser('1fr 1fr 2fr 1fr 10%', ['1fr', '1fr', '2fr', '1fr', '10%']);
testParser('minmax(100px, 1fr) minmax(200px, 2fr) 1px', ['minmax(100px, 1fr)', 'minmax(200px, 2fr)', '1px']);
