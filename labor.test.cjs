const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  atomInfo, atomDrawing, simulateDecay, expectedRemaining, relativeExposure,
  chainGenerations, questions, gradeQuestion, models, shellDistribution,
  uraniumSeries, fissionReaction, fissionDrawing, shieldDrawing, finalTasks
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

test('Bohr-Schalen werden von innen besetzt, nicht alle Elektronen auf einen Kreis gesetzt', () => {
  for (const [electrons, expected] of [
    [0, [0, 0, 0, 0]], [2, [2, 0, 0, 0]], [6, [2, 4, 0, 0]],
    [10, [2, 8, 0, 0]], [11, [2, 8, 1, 0]], [18, [2, 8, 8, 0]], [20, [2, 8, 8, 2]]
  ]) {
    assert.deepEqual(shellDistribution(electrons), expected);
    const drawing = atomDrawing(atomInfo(20, 20, electrons));
    ['K', 'L', 'M', 'N'].forEach((shell, index) => {
      assert.equal((drawing.match(new RegExp(`data-electron-shell="${shell}"`, 'g')) || []).length, expected[index]);
      assert.equal((drawing.match(new RegExp(`data-shell="${shell}"`, 'g')) || []).length, expected[index] ? 1 : 0);
    });
  }
  assert.throws(() => shellDistribution(21), RangeError);
  assert.throws(() => shellDistribution(-1), RangeError);
  assert.throws(() => shellDistribution(1.5), RangeError);
});

test('Abschirmbilder behalten vorherige Schichten und zeigen Gamma-Restspuren statt unklarer Striche', () => {
  ['none', 'paper', 'aluminium', 'lead'].forEach((stage, index) => {
    const drawing = shieldDrawing(stage);
    assert.equal((drawing.match(/data-material=/g) || []).length, index);
    if (index >= 1) assert.match(drawing, /data-material="paper"/);
    if (index >= 2) assert.match(drawing, /data-material="aluminium"/);
    if (index === 3) {
      assert.match(drawing, /data-material="lead"/);
      assert.equal((drawing.match(/data-gamma-outgoing=/g) || []).length, 2);
      assert.equal((drawing.match(/data-gamma-stopped=/g) || []).length, 6);
    } else assert.equal((drawing.match(/data-gamma-outgoing=/g) || []).length, 8);
    assert.doesNotMatch(drawing, /stroke-dasharray/);
  });
  assert.throws(() => shieldDrawing('unknown'), RangeError);
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
  for (const [mode, factor] of [['decreasing', 0.5], ['growing', 2]]) {
    const counts = chainGenerations(mode);
    counts.slice(1).forEach((value, i) => assert.equal(value / counts[i], factor));
  }
  assert.throws(() => chainGenerations('unknown'), RangeError);
  assert.deepEqual(chainGenerations('growing'), [8, 16, 32, 64, 128, 256]);
});

test('Spaltungsbeispiel erhält A und Z und zeichnet alle Kernteilchen und freien Neutronen', () => {
  const { target, excited, products, neutrons } = fissionReaction;
  assert.equal(target.mass + 1, excited.mass);
  assert.equal(target.charge, excited.charge);
  assert.equal(products.reduce((sum, product) => sum + product.mass, neutrons), excited.mass);
  assert.equal(products.reduce((sum, product) => sum + product.charge, 0), excited.charge);
  const counts = (drawing, pattern) => (drawing.match(pattern) || []).length;
  const start = fissionDrawing(0);
  assert.equal(counts(start, /data-nucleon="proton"/g), 92);
  assert.equal(counts(start, /data-nucleon="neutron"/g), 143);
  assert.equal(counts(start, /data-free-neutron=/g), 1);
  const captured = fissionDrawing(1);
  assert.equal(counts(captured, /data-nucleon="neutron"/g), 144);
  const result = fissionDrawing(2);
  assert.equal(counts(result, /data-nucleon="proton"/g), 92);
  assert.equal(counts(result, /data-nucleon="neutron"/g), 141);
  assert.equal(counts(result, /data-free-neutron=/g), 3);
  assert.match(result, /data-nucleus="Ba-141"/);
  assert.match(result, /data-nucleus="Kr-92"/);
  assert.throws(() => fissionDrawing(3), RangeError);
});

test('Jeder Schritt der Uran-Radium-Reihe erfüllt die Alpha- oder Beta-Bilanz', () => {
  assert.deepEqual([uraniumSeries[0].mass, uraniumSeries[0].charge], [238, 92]);
  assert.equal(uraniumSeries.filter(n => n.decay === 'α').length, 8);
  assert.equal(uraniumSeries.filter(n => n.decay === 'β⁻').length, 6);
  uraniumSeries.slice(0, -1).forEach((nucleus, index) => {
    const next = uraniumSeries[index + 1];
    assert.equal(next.mass, nucleus.mass - (nucleus.decay === 'α' ? 4 : 0));
    assert.equal(next.charge, nucleus.charge + (nucleus.decay === 'α' ? -2 : 1));
  });
  assert.deepEqual(uraniumSeries.at(-1), { symbol: 'Pb', mass: 206, charge: 82, decay: null });
});

test('Alle 36 Auswahlaufgaben haben genau eine richtige Option und eine fachliche Erklärung', () => {
  assert.equal(questions.length, 36);
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
  for (let index = 1; index <= 9; index++) {
    assert.equal((html.match(new RegExp(`id="station${index}"`, 'g')) || []).length, 1);
    assert.match(html, new RegExp(`data-tab="station${index}"`));
  }
  for (const group of ['models', 'atoms', 'radiation', 'decay', 'fission', 'energy', 'weapons', 'history']) {
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

test('Abschlusstest enthält 14 Grundaufgaben, einen freiwilligen Zusatz und getrennte Lösungen', () => {
  assert.equal(finalTasks.length, 15);
  assert.equal(finalTasks.filter(task => task.optional).length, 1);
  assert.equal(new Set(finalTasks.map(task => task.id)).size, finalTasks.length);
  for (const task of finalTasks) {
    assert.ok(task.prompt.trim());
    assert.ok(task.solution.trim());
    assert.ok(task.station >= 1 && task.station <= 8);
  }
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, 'labor.css'), 'utf8');
  for (const target of ['sheet', 'test', 'solutions']) {
    assert.match(html, new RegExp(`data-print="${target}"`));
    assert.ok(css.includes(`body[data-print-mode="${target}"]`));
  }
  assert.match(html, /id="study-sheet"/);
  assert.match(html, /id="final-test"/);
  assert.match(html, /id="test-solutions"/);
});
