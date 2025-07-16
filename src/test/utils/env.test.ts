import test from 'node:test';
import assert from 'node:assert/strict';
import { parseEnvLines, getMissingEnvEntries } from '../../utils/env';

test('parseEnvLines - simple key=value pairs', () => {
  const input = `
    FOO=bar
    BAZ=qux
  `;

  const result = parseEnvLines(input);
  assert.deepEqual(result, { FOO: 'bar', BAZ: 'qux' });
});

test('parseEnvLines - ignores comments and blank lines', () => {
  const input = `
    # Comment line
    FOO=bar

    BAZ=qux
  `;

  const result = parseEnvLines(input);
  assert.deepEqual(result, { FOO: 'bar', BAZ: 'qux' });
});

test('parseEnvLines - supports export syntax', () => {
  const input = `
    export FOO=bar
    export BAZ=qux
  `;

  const result = parseEnvLines(input);
  assert.deepEqual(result, { FOO: 'bar', BAZ: 'qux' });
});

test('getMissingEnvEntries - finds only missing keys', () => {
  const base = { FOO: '1', BAZ: '2' };
  const incoming = { FOO: '1', BAZ: '2', NEW: '3' };

  const result = getMissingEnvEntries(base, incoming);
  assert.deepEqual(result, [['NEW', '3']]);
});

test('getMissingEnvEntries - no missing keys', () => {
  const base = { A: '1', B: '2' };
  const incoming = { A: 'x', B: 'y' };

  const result = getMissingEnvEntries(base, incoming);
  assert.deepEqual(result, []);
});
