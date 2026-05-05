const { escapeHtml, getWeatherSymbol, getValuePath, stripHtml, parseConfig, buildRssHtml } = require('../app.module');
describe('escapeHtml', () => {
    test('escapes ampersands', () => {
      expect(escapeHtml('cats & dogs')).toBe('cats &amp; dogs');
    });
  });