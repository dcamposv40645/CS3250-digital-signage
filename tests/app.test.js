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
describe('getWeatherSymbol', () => {
    test('code 0 returns clear', () => {
        expect(getWeatherSymbol(0)).toBe('☀️ Clear');
    });

    test('code 1 returns mostly clear', () => {
        expect(getWeatherSymbol(1)).toBe('🌤️ Mostly Clear');
    });

    test('code 3 returns overcast', () => {
        expect(getWeatherSymbol(3)).toBe('☁️ Overcast');
    });

    test('code 45 returns foggy', () => {
        expect(getWeatherSymbol(45)).toBe('🌫️ Foggy');
    });

    test('unknown code returns fallback', () => {
        expect(getWeatherSymbol(999)).toBe('🌡️ Unknown');
    });
});
describe('getValuePath', () => {
    test('returns top level value', () => {
        expect(getValuePath({ joke: 'why so serious' }, 'joke')).toBe('why so serious');
    });

    test('returns nested value', () => {
        expect(getValuePath({ data: { price: 42 } }, 'data.price')).toBe(42);
    });

    test('returns undefined for missing key', () => {
        expect(getValuePath({}, 'missing')).toBeUndefined();
    });

    test('returns undefined when intermediate key is missing', () => {
        expect(getValuePath({ a: {} }, 'a.b.c')).toBeUndefined();
    });

    test('handles falsy value 0 correctly', () => {
        expect(getValuePath({ count: 0 }, 'count')).toBe(0);
    });
});
describe('stripHtml', () => {
    test('removes a simple tag', () => {
        expect(stripHtml('<p>Hello</p>')).toBe('Hello');
    });

    test('removes nested tags', () => {
        expect(stripHtml('<div><b>Bold</b> and <i>italic</i></div>')).toBe('Bold and italic');
    });

    test('returns plain text unchanged', () => {
        expect(stripHtml('No tags here')).toBe('No tags here');
    });

    test('handles empty string', () => {
        expect(stripHtml('')).toBe('');
    });

    test('strips script tags', () => {
        const result = stripHtml('<script>alert("xss")</script>');
        expect(result).not.toContain('<script>');
    });
});
describe('parseConfig', () => {
    test('reads cycleTime from first element', () => {
        const config = [{ cycle: 10 }, { type: 'Clock' }];
        expect(parseConfig(config).cycleTime).toBe(10);
    });

    test('separates RSS items correctly', () => {
        const config = [{ cycle: 10 }, { type: 'RSS' }, { type: 'Weather' }];
        expect(parseConfig(config).rssItems).toHaveLength(1);
    });

    test('excludes RSS from staticItems', () => {
        const config = [{ cycle: 10 }, { type: 'RSS' }, { type: 'Weather' }];
        expect(parseConfig(config).staticItems.every(i => i.type !== 'RSS')).toBe(true);
    });

    test('defaults staticRefreshTime to 60 when no cycles set', () => {
        const config = [{ cycle: 10 }, { type: 'Clock' }];
        expect(parseConfig(config).staticRefreshTime).toBe(60);
    });

    test('picks the minimum cycle from static items', () => {
        const config = [{ cycle: 10 }, { type: 'API', cycle: 15 }, { type: 'Crypto', cycle: 20 }];
        expect(parseConfig(config).staticRefreshTime).toBe(15);
    });
});