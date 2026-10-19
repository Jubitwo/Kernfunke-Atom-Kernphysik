const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  atomInfo, atomDrawing, simulateDecay, expectedRemaining, relativeExposure,
  chainGenerations, questions, gradeQuestion, models
} = require('./labor.js');

test('Atome, Isotope und Ionen: Element, A und Ladung bleiben konsistent', () => {
  assert.deepEqual(atomInfo(6, 8, 6), {
    protons: 6, neutrons: 8, electrons: 6, mass: 14, charge: 0,
    name: 'Kohlenstoff', symbol: 'C', chargeLabel: '0'
  });
  assert.equal(atomInfo(12, 12, 10).chargeLabel, '2+');
  assert.equal(atomInfo(20, 25, 0).chargeLabel, '20+');
  assert.equal(atomInfo(1, 0, 20).chargeLabel, '19−');
  for (const values of [[0, 0, 0], [21, 0, 0], [1, -1, 1], [1, 26, 1], [1, 0, 21], [1.2, 0, 0], [NaN, 0, 0]]) {
    assert.throws(() => atomInfo(...values), RangeError);
  }
});

test('Zählbilder enthalten exakt die gewählten Teilchenzahlen, auch an den Rändern', () => {
  for (const [p, n, e] of [[1, 0, 0], [6, 8, 6], [12, 12, 10], [20, 25, 20]]) {
    const drawing = atomDrawing(atomInfo(p, n, e));
    for (const [particle, count] of [['proton', p], ['neutron', n], ['electron', e]]) {
      assert.equal((drawing.match(new RegExp(`data-particle="${particle}"`, 'g')) || []).length, count);
    }
    assert.match(drawing, /role="img" aria-label=/);
  }
});

test('Zerfallsmodell: korrekter Start, ganzzahlig, nicht zunehmend, Null ist absorbierend', () => {
  for (const halfLife of [2, 4, 8]) {
    const counts = simulateDecay(200, halfLife, 24);
    assert.equal(counts.length, 25);
    assert.equal(counts[0], 200);
    counts.forEach((count, i) => {
      assert.ok(Number.isInteger(count) && count >= 0);
      if (i) assert.ok(count <= counts[i - 1]);
    });
  }
  assert.deepEqual(simulateDecay(3, 4, 3, () => 0.999), [3, 0, 0, 0]);
  assert.deepEqual(simulateDecay(3, 4, 3, () => 0), [3, 3, 3, 3]);
  assert.throws(() => simulateDecay(-1, 4, 24), RangeError);
  assert.throws(() => simulateDecay(200, 0, 24), RangeError);
});

test('Zerfallsmodell erfüllt die Halbwertszeit statistisch, nicht nur grafisch', () => {
  let state = 123456;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  for (const halfLife of [2, 4, 8]) {
    const counts = simulateDecay(100000, halfLife, 3 * halfLife, random);
    assert.ok(Math.abs(counts[halfLife] - 50000) < 1000);
    assert.ok(Math.abs(counts[2 * halfLife] - 25000) < 1000);
    assert.ok(Math.abs(counts[3 * halfLife] - 12500) < 1000);
  }
  assert.equal(expectedRemaining(800, 12, 4), 100);
  assert.equal(expectedRemaining(200, 0, 4), 200);
});

test('Abstands- und Zeitvergleich prüfen die exakten physikalischen Verhältnisse', () => {
  assert.equal(relativeExposure(1, 1), 1);
  assert.equal(relativeExposure(2, 1), 0.25);
  assert.equal(relativeExposure(1, 2), 2);
  assert.equal(relativeExposure(5, 10), 0.4);
  assert.throws(() => relativeExposure(0, 1), RangeError);
});

test('Kettenreaktion zeigt Abklingen, Konstanz und Wachstum über alle Generationen', () => {
  const steady = chainGenerations('steady');
  assert.deepEqual(steady, [8, 8, 8, 8, 8, 8]);
  for (const [mode, factor] of [['decreasing', 0.5], ['growing', 1.5]]) {
    const counts = chainGenerations(mode);
    counts.slice(1).forEach((value, i) => assert.equal(value / counts[i], factor));
  }
  assert.throws(() => chainGenerations('unknown'), RangeError);
});

test('Alle 22 Auswahlaufgaben haben genau eine richtige Option und eine fachliche Erklärung', () => {
  assert.equal(questions.length, 22);
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const question of questions) {
    assert.ok(question.prompt.trim());
    assert.ok(question.explanation.trim());
    assert.equal(question.options.length, 3);
    assert.equal(new Set(question.options).size, 3);
    question.options.forEach((_, index) => assert.equal(gradeQuestion(question.id, index), index === question.answer));
  }
  assert.throws(() => gradeQuestion('rutherford', 5), RangeError);
  assert.throws(() => gradeQuestion('missing', 0), RangeError);
});

test('Alle Stationen, Bedienelemente, Dateien und Modellbezeichnungen sind verdrahtet', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const script = fs.readFileSync(path.join(__dirname, 'labor.js'), 'utf8');
  for (let index = 1; index <= 6; index++) {
    assert.equal((html.match(new RegExp(`id="station${index}"`, 'g')) || []).length, 1);
    assert.match(html, new RegExp(`data-tab="station${index}"`));
  }
  for (const group of ['models', 'atoms', 'radiation', 'decay', 'fission', 'history']) {
    assert.match(html, new RegExp(`data-quiz="${group}"`));
    assert.ok(questions.some(q => q.group === group));
  }
  for (const key of Object.keys(models)) assert.match(html, new RegExp(`data-model="${key}"`));
  const selectors = [...script.matchAll(/\$\('#([a-z-]+)'\)/g)].map(match => match[1]);
  for (const id of new Set(selectors)) assert.match(html, new RegExp(`id="${id}"`));
  for (const asset of ['labor.css', 'labor.js']) assert.ok(fs.existsSync(path.join(__dirname, asset)));
  assert.doesNotMatch(html, /fonts\.googleapis\.com/);
  assert.match(script, /addEventListener\('hashchange'/);
  assert.match(script, /ArrowRight/);
});
