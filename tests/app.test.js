const { escapeHtml, getWeatherSymbol, getValuePath, stripHtml, parseConfig, buildRssHtml } = require('../app.module');
describe('escapeHtml', () => {
    test('escapes ampersands', () => {
        expect(escapeHtml('cats & dogs')).toBe('cats &amp; dogs');
    });
    test('escapes < and >', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
    });

    test('escapes double quotes', () => {
        expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
    });

    test('escapes single quotes', () => {
        expect(escapeHtml("it's")).toBe('it&#39;s');
    });

    test('returns plain text unchanged', () => {
        expect(escapeHtml('hello world')).toBe('hello world');
    });
});