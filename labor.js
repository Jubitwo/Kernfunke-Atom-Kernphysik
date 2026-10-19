(() => {
  'use strict';

  const elements = [
    '', 'Wasserstoff', 'Helium', 'Lithium', 'Beryllium', 'Bor', 'Kohlenstoff',
    'Stickstoff', 'Sauerstoff', 'Fluor', 'Neon', 'Natrium', 'Magnesium',
    'Aluminium', 'Silicium', 'Phosphor', 'Schwefel', 'Chlor', 'Argon', 'Kalium', 'Calcium'
  ];
  const symbols = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];

  function atomInfo(protons, neutrons, electrons) {
    if (![protons, neutrons, electrons].every(Number.isInteger) ||
        protons < 1 || protons > 20 || neutrons < 0 || neutrons > 25 || electrons < 0 || electrons > 20) {
      throw new RangeError('Teilchenzahlen müssen ganzzahlig im angegebenen Bereich liegen.');
    }
    const charge = protons - electrons;
    return {
      protons, neutrons, electrons, mass: protons + neutrons, charge,
      name: elements[protons], symbol: symbols[protons],
      chargeLabel: charge === 0 ? '0' : `${Math.abs(charge)}${charge > 0 ? '+' : '−'}`
    };
  }

  function simulateDecay(initial, halfLife, steps, random = Math.random) {
    if (!Number.isInteger(initial) || initial < 0 || !Number.isFinite(halfLife) || halfLife <= 0 ||
        !Number.isInteger(steps) || steps < 0) {
      throw new RangeError('Zerfallsmodell: ungültige Anfangsmenge, Halbwertszeit oder Schrittzahl.');
    }
    const survival = Math.pow(0.5, 1 / halfLife);
    const counts = [initial];
    for (let time = 1; time <= steps; time++) {
      let remaining = 0;
      for (let nucleus = 0; nucleus < counts[time - 1]; nucleus++) {
        if (random() < survival) remaining++;
      }
      counts.push(remaining);
    }
    return counts;
  }

  function expectedRemaining(initial, time, halfLife) {
    return initial * Math.pow(0.5, time / halfLife);
  }

  function relativeExposure(distance, duration) {
    if (!Number.isFinite(distance) || distance <= 0 || !Number.isFinite(duration) || duration < 0) {
      throw new RangeError('Abstand muss positiv und Zeit nichtnegativ sein.');
    }
    return duration / (distance * distance);
  }

  const chainFactors = { decreasing: 0.5, steady: 1, growing: 1.5 };
  function chainGenerations(mode) {
    if (!Object.hasOwn(chainFactors, mode)) throw new RangeError('Unbekannter Modellfall.');
    return Array.from({ length: 6 }, (_, i) => 8 * Math.pow(chainFactors[mode], i));
  }

  const questions = [
    { id: 'rutherford', group: 'models', prompt: 'Was folgerte Rutherford aus den seltenen starken Ablenkungen?',
      options: ['Positive Ladung und fast die gesamte Masse sitzen im kleinen Kern.', 'Alle Atome sind radioaktiv.', 'Elektronen sind größer als Atomkerne.'], answer: 0,
      explanation: 'Die meisten α-Teilchen passieren die Folie. Nur bei großer Nähe zum positiv geladenen Kern werden sie stark abgelenkt.' },
    { id: 'model-limit', group: 'models', prompt: 'Welche Aussage über Atommodelle stimmt?',
      options: ['Ein Modell ist ein Foto des Atoms.', 'Ein Modell hat Grenzen und muss zu Beobachtungen passen.', 'Ein neues Modell macht alle früheren Experimente falsch.'], answer: 1,
      explanation: 'Ein Modell vereinfacht. Das Schalenbild hilft bei Energieniveaus, zeigt aber keine realen kleinen Planetenbahnen.' },
    { id: 'isotope', group: 'atoms', prompt: 'C-12 und C-14: Was ist gleich?',
      options: ['Die Neutronenzahl.', 'Die Massenzahl.', 'Die Protonenzahl.'], answer: 2,
      explanation: 'Beide sind Kohlenstoff mit Z = 6. C-12 hat 6, C-14 hat 8 Neutronen.' },
    { id: 'mass', group: 'atoms', prompt: 'Ein Kern hat 8 Protonen und 10 Neutronen. Wie groß ist A?',
      options: ['18', '8', '2'], answer: 0,
      explanation: 'Die Massenzahl zählt die Kernteilchen: A = 8 + 10 = 18. Elektronen zählen nicht dazu.' },
    { id: 'ion', group: 'atoms', prompt: 'Ein neutrales Atom verliert zwei Elektronen. Welche Ladung hat es dann?',
      options: ['2−', '2+', '0'], answer: 1,
      explanation: 'Zwei negative Ladungen fehlen. Die Protonenzahl bleibt gleich; die Gesamtladung beträgt +2 Elementarladungen.' },
    { id: 'gamma', group: 'radiation', prompt: 'Welche der drei Strahlungsarten ist ungeladen?',
      options: ['Alpha.', 'Beta-minus.', 'Gamma.'], answer: 2,
      explanation: 'Gamma-Strahlung ist elektromagnetische Strahlung. Alpha-Teilchen sind positiv, Beta-minus-Teilchen negativ geladen.' },
    { id: 'beta-origin', group: 'radiation', prompt: 'Woher stammt das Elektron beim β⁻-Zerfall?',
      options: ['Es entsteht bei der Umwandlung eines Neutrons im Kern.', 'Es fällt aus einer äußeren Schale.', 'Es besteht aus zwei Protonen.'], answer: 0,
      explanation: 'Ein Neutron wird zu einem Proton; dabei entstehen ein Elektron und ein Antineutrino. A bleibt gleich, Z steigt um 1.' },
    { id: 'alpha-change', group: 'radiation', prompt: 'Ein Kern mit A = 238 und Z = 92 sendet ein α-Teilchen aus. Was bleibt?',
      options: ['A = 238, Z = 93.', 'A = 234, Z = 90.', 'A = 236, Z = 92.'], answer: 1,
      explanation: 'Das Alpha-Teilchen nimmt 2 Protonen und 2 Neutronen mit. Daher: A − 4 und Z − 2.' },
    { id: 'ionisation', group: 'radiation', prompt: 'Was bedeutet Ionisation?',
      options: ['Ein Stoff wird warm, ohne Ladungsänderung.', 'Ein Atom verschwindet.', 'Ein Elektron wird zum Beispiel aus einem Atom gelöst; ein Ion entsteht.'], answer: 2,
      explanation: 'Ionisierende Strahlung kann Elektronen aus Atomen oder Molekülen lösen. In Gewebe können dadurch wichtige Moleküle geschädigt werden.' },
    { id: 'protection', group: 'radiation', prompt: 'Welche Kombination verringert die äußere Bestrahlung?',
      options: ['Mehr Abstand, kürzere Zeit, passende Abschirmung.', 'Weniger Abstand, längere Zeit.', 'Nur die Augen schließen.'], answer: 0,
      explanation: 'Abstand, Aufenthaltszeit und geeignete Abschirmung sind Grundregeln. Zusätzlich muss die Aufnahme radioaktiver Stoffe verhindert werden.' },
    { id: 'contamination', group: 'radiation', prompt: 'Was ist ein Beispiel für Kontamination?',
      options: ['Ein Röntgenbild wurde aufgenommen.', 'Radioaktiver Staub haftet an der Kleidung.', 'Eine Lampe beleuchtet einen Tisch.'], answer: 1,
      explanation: 'Kontamination bedeutet Verunreinigung mit radioaktiven Stoffen. Bestrahlung allein bedeutet nicht, dass ein Stoff radioaktiv wird.' },
    { id: 'medical-benefit', group: 'radiation', prompt: 'Wie sollte eine medizinische Strahlenanwendung bewertet werden?',
      options: ['Jede Anwendung ist immer harmlos.', 'Jede Anwendung ist ohne Ausnahme abzulehnen.', 'Diagnostischen oder therapeutischen Nutzen gegen Risiken und Alternativen abwägen.'], answer: 2,
      explanation: 'Eine medizinisch begründete Anwendung kann großen Nutzen haben. Strahlenschutz verlangt, unnötige Exposition zu vermeiden.' },
    { id: 'half-life', group: 'decay', prompt: 'Was bedeutet Halbwertszeit 4 Messschritte?',
      options: ['Nach vier Schritten ist im Mittel etwa die Hälfte der Startmenge übrig.', 'Jeder Kern zerfällt exakt nach vier Schritten.', 'Die Strahlung wird viermal stärker.'], answer: 0,
      explanation: 'Die Aussage ist statistisch. Der Zeitpunkt für einen einzelnen Kern ist nicht vorhersagbar.' },
    { id: 'background', group: 'decay', prompt: 'Warum misst man die Nullrate?',
      options: ['Damit das Gerät keine Elektronen mehr zählt.', 'Um den Hintergrundbeitrag bei der Auswertung zu berücksichtigen.', 'Weil ohne Schulquelle keine Strahlung existiert.'], answer: 1,
      explanation: 'Natürliche Hintergrundstrahlung und Geräteeinflüsse liefern Impulse. Die mittlere Hintergrundzählrate wird separat bestimmt.' },
    { id: 'becquerel-unit', group: 'decay', prompt: 'Was bedeutet 1 Bq?',
      options: ['Eine sichere Aufenthaltsdauer von einer Sekunde.', 'Eine biologische Dosis von 1 Sv.', 'Im Mittel ein Kernzerfall pro Sekunde.'], answer: 2,
      explanation: 'Becquerel beschreibt Aktivität. Eine gemessene Impulszahl hängt auch vom Gerät und Versuchsaufbau ab; die Dosis ist eine andere Größe.' },
    { id: 'energy', group: 'fission', prompt: 'Welche Energieumwandlungskette passt zum Kernkraftwerk?',
      options: ['Kernenergie → Wärme → Bewegung → elektrische Energie.', 'Elektrische Energie → Kernenergie → Licht.', 'Kernenergie → direkt elektrische Energie ohne Wärme.'], answer: 0,
      explanation: 'Die Turbine nutzt Dampf, der Generator die Drehbewegung. Ein erheblicher Teil der Wärme wird als Abwärme abgegeben.' },
    { id: 'rods', group: 'fission', prompt: 'Was leisten Regelstäbe?',
      options: ['Sie sind der Generator.', 'Sie absorbieren Neutronen und beeinflussen die Kettenreaktion.', 'Sie beseitigen radioaktive Abfälle.'], answer: 1,
      explanation: 'Regelstäbe nehmen Neutronen auf. Das Abbremsen von Neutronen ist dagegen die Aufgabe des Moderators.' },
    { id: 'afterheat', group: 'fission', prompt: 'Warum muss ein abgeschalteter Reaktor weiter gekühlt werden?',
      options: ['Weil alle Kerne nun sofort fusionieren.', 'Weil elektrischer Strom den Kern heizt.', 'Weil radioaktive Spaltprodukte weiter zerfallen und Wärme abgeben.'], answer: 2,
      explanation: 'Die Kettenreaktion kann beendet sein, trotzdem bleibt Nachzerfallswärme. Kühlung und sicherer Einschluss sind weiterhin erforderlich.' },
    { id: 'waste', group: 'fission', prompt: 'Was gilt für radioaktive Abfälle nach einer Halbwertszeit?',
      options: ['Im Mittel ist noch die Hälfte der betreffenden Ausgangskerne vorhanden.', 'Alle radioaktiven Stoffe sind verschwunden.', 'Abschirmung ist grundsätzlich unnötig.'], answer: 0,
      explanation: 'Eine Halbwertszeit halbiert die Anzahl eines Radionuklids, beseitigt es aber nicht. Tochterkerne können ebenfalls radioaktiv sein.' },
    { id: 'discovery', group: 'history', prompt: 'Welche Zuordnung zur Kernspaltung ist richtig?',
      options: ['Becquerel baute Kernkraftwerke; Curie erklärte die Spaltung.', 'Hahn/Straßmann: chemischer Befund; Meitner/Frisch: physikalische Deutung.', 'Hahn erledigte Nachweis und Erklärung allein.'], answer: 1,
      explanation: 'Der Barium-Befund von Ende 1938 und die Deutung von 1939 ergänzten sich. Die alleinige Nobelpreisvergabe an Hahn bildet diese Zusammenarbeit nicht vollständig ab.' },
    { id: 'curie', group: 'history', prompt: 'Was gehört zu Marie Curies Arbeit?',
      options: ['Die erste Regelstabsteuerung eines Kraftwerks.', 'Die Entdeckung des Neutrons.', 'Systematische Radioaktivitätsforschung und Entdeckung von Polonium und Radium mit Pierre Curie.'], answer: 2,
      explanation: 'Marie Curie erhielt 1903 den Physik-Nobelpreis gemeinsam mit Pierre Curie und Becquerel sowie 1911 den Chemie-Nobelpreis.' },
    { id: 'responsibility', group: 'history', prompt: 'Was kennzeichnet eine begründete Bewertung der Kernenergie?',
      options: ['Nutzen, Unfallrisiken, Klimawirkung, Abfälle und langfristige Verantwortung gegeneinander abwägen.', 'Nur eine einzige Zahl betrachten.', 'Eine persönliche Meinung ohne Begründung nennen.'], answer: 0,
      explanation: 'Bewerten bedeutet: Kriterien nennen, Fakten verwenden und die eigene Gewichtung nachvollziehbar machen.' }
  ];

  function gradeQuestion(id, answer) {
    const question = questions.find(item => item.id === id);
    if (!question || !Number.isInteger(answer) || answer < 0 || answer >= question.options.length) {
      throw new RangeError('Unbekannte Aufgabe oder ungültige Antwort.');
    }
    return answer === question.answer;
  }

  const models = {
    demokrit: { title: 'Demokrit · etwa 400 v. Chr.', text: 'Die Idee unteilbarer Bausteine war ein philosophischer Anfang, kein experimentell geprüftes Atommodell. Heute wissen wir, dass Atome selbst aus Teilchen bestehen.', caption: 'Idee eines unteilbaren Bausteins – keine Darstellung von Kern oder Elektronen.' },
    dalton: { title: 'Dalton · um 1803', text: 'Dalton beschrieb Elemente durch gleichartige Atome und Reaktionen als Umordnung dieser Atome. Das Kugelmodell erklärt einfache Mengenverhältnisse. Die Annahme gleicher Atommassen eines Elements gilt wegen der Isotope nicht allgemein.', caption: 'Kugelmodell: Unterschiedliche Farben stehen für unterschiedliche Elemente.' },
    thomson: { title: 'Thomson · 1904', text: 'Nach der Entdeckung des Elektrons 1897 schlug Thomson ein Modell mit negativen Elektronen in einer verteilten positiven Grundmasse vor. Die seltenen großen Ablenkungen im Streuversuch ließen sich damit nicht erklären.', caption: 'Positive Grundmasse mit eingebetteten Elektronen – noch kein Atomkern.' },
    rutherford: { title: 'Rutherford · 1911', text: 'Aus den Streuversuchen folgte ein winziger positiver Kern mit fast der gesamten Masse, umgeben von der Elektronenhülle. Das Modell allein erklärt noch keine stabilen Energieniveaus.', caption: 'Kern-Hülle-Modell; der Kern ist zur Sichtbarkeit stark vergrößert.' },
    bohr: { title: 'Bohr · 1913', text: 'Bohr ergänzte bestimmte erlaubte Energien. Bei Energieübergängen kann Licht aufgenommen oder abgegeben werden. Heute werden Elektronen mit Aufenthaltswahrscheinlichkeiten beschrieben, nicht als Kugeln auf festen Kreisbahnen.', caption: 'Schalen als vereinfachte Energieniveaus, nicht als reale Flugbahnen.' }
  };

  function svg(content, label, width = 600, height = 280) {
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${content}</svg>`;
  }
  function text(x, y, value, size = 16) {
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle">${value}</text>`;
  }
  function circle(x, y, radius, color, label = '', particle = '') {
    return `<g${particle ? ` data-particle="${particle}"` : ''}><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>${label ? text(x, y + 5, label, 15) : ''}</g>`;
  }
  function atomDrawing(info) {
    let content = `<circle cx="300" cy="145" r="110" fill="#e3f0fa" stroke="#789bb6" stroke-dasharray="5 4"/>`;
    const total = info.protons + info.neutrons;
    for (let i = 0; i < total; i++) {
      const columns = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / columns);
      const x = 300 + ((i % columns) - (columns - 1) / 2) * 15;
      const y = 145 + (Math.floor(i / columns) - (rows - 1) / 2) * 15;
      const proton = i < info.protons;
      content += circle(x, y, 7, proton ? '#edb078' : '#95bda0', proton ? '+' : '', proton ? 'proton' : 'neutron');
    }
    for (let i = 0; i < info.electrons; i++) {
      const angle = 2 * Math.PI * i / info.electrons;
      content += circle(300 + Math.cos(angle) * 110, 145 + Math.sin(angle) * 110, 9, '#92c5ed', '−', 'electron');
    }
    content += text(300, 20, `${info.symbol}-${info.mass} · ${info.protons} p⁺ · ${info.neutrons} n · ${info.electrons} e⁻`);
    content += text(300, 278, `Ladung: ${info.chargeLabel} · Kernteilchen innen, Elektronen außen`);
    return svg(content, `Zählbild mit ${info.protons} Protonen, ${info.neutrons} Neutronen und ${info.electrons} Elektronen`, 600, 295);
  }

  function initLab() {
    const $ = selector => document.querySelector(selector);
    const solved = new Set();
    const taskCount = questions.length + 2;
    function markSolved(id, correct) {
      if (correct) solved.add(id);
      else solved.delete(id);
      $('#learning-progress').textContent = `Lerncheck: ${solved.size} von ${taskCount} Aufgaben richtig gelöst. Freie Antworten: Selbstvergleich. Fortschritt gilt bis zum Neuladen.`;
    }
    function feedback(selector, message, correct) {
      const element = $(selector);
      element.textContent = message;
      element.className = `feedback ${correct === true ? 'ok' : correct === false ? 'bad' : ''}`;
    }
    markSolved('', false);

    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const panels = [...document.querySelectorAll('.panel')];
    function showTab(id) {
      tabs.forEach((tab, i) => {
        const selected = tab.dataset.tab === id;
        tab.id = `tab-${i + 1}`;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        panels[i].setAttribute('aria-labelledby', tab.id);
        panels[i].hidden = !selected;
      });
    }
    function navigate(id) {
      showTab(id);
      if (location.hash !== `#${id}`) location.hash = id;
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => navigate(tab.dataset.tab));
      tab.addEventListener('keydown', event => {
        const offsets = { ArrowRight: 1, ArrowLeft: -1, Home: -i, End: tabs.length - 1 - i };
        if (!Object.hasOwn(offsets, event.key)) return;
        event.preventDefault();
        const next = tabs[(i + offsets[event.key] + tabs.length) % tabs.length];
        next.focus();
        navigate(next.dataset.tab);
      });
    });
    function syncHash() {
      const id = /^#station[1-6]$/.test(location.hash) ? location.hash.slice(1) : 'station1';
      showTab(id);
      if (location.hash === `#${id}`) $(`#${id}`).scrollIntoView({ block: 'start' });
    }
    window.addEventListener('hashchange', syncHash);
    syncHash();

    document.querySelectorAll('[data-quiz]').forEach(host => {
      questions.filter(q => q.group === host.dataset.quiz).forEach(question => {
        const form = document.createElement('form');
        form.className = 'quiz';
        form.dataset.question = question.id;
        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = question.prompt;
        fieldset.append(legend);
        question.options.forEach((option, i) => {
          const label = document.createElement('label');
          const radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = question.id;
          radio.value = String(i);
          label.append(radio, document.createTextNode(option));
          fieldset.append(label);
        });
        const button = document.createElement('button');
        button.className = 'primary';
        button.textContent = 'Antwort prüfen';
        const output = document.createElement('p');
        output.className = 'feedback';
        output.setAttribute('aria-live', 'polite');
        form.append(fieldset, button, output);
        form.addEventListener('submit', event => {
          event.preventDefault();
          const selected = form.querySelector('input:checked');
          if (!selected) {
            output.textContent = 'Bitte wähle zuerst eine Antwort.';
            output.className = 'feedback bad';
            return;
          }
          const correct = gradeQuestion(question.id, Number(selected.value));
          markSolved(question.id, correct);
          output.className = `feedback ${correct ? 'ok' : 'bad'}`;
          output.textContent = `${correct ? 'Richtig.' : 'Noch nicht.'} ${question.explanation}`;
        });
        form.addEventListener('change', () => {
          markSolved(question.id, false);
          output.textContent = 'Antwort geändert. Bitte erneut prüfen.';
          output.className = 'feedback';
        });
        host.append(form);
      });
    });

    function showModel(key) {
      const model = models[key];
      document.querySelectorAll('[data-model]').forEach(button => {
        const current = button.dataset.model === key;
        button.setAttribute('aria-pressed', String(current));
        button.closest('.model').classList.toggle('current', current);
      });
      $('#model-title').textContent = model.title;
      $('#model-text').textContent = model.text;
      $('#model-caption').textContent = model.caption;
      let drawing = '';
      if (key === 'demokrit') drawing = circle(300, 140, 70, '#a1b9ce') + text(300, 245, 'Unteilbarer Baustein?');
      if (key === 'dalton') drawing = circle(190, 130, 55, '#96bba5') + circle(320, 130, 55, '#96bba5') + circle(450, 130, 40, '#c2b0df') + text(300, 235, 'Gleiche Elemente: gleiche Kugelart');
      if (key === 'thomson') {
        drawing = circle(300, 140, 95, '#efb58e');
        [[260, 95], [340, 95], [260, 180], [340, 180]].forEach(([x, y]) => { drawing += circle(x, y, 12, '#a5cef0', '−'); });
        drawing += text(300, 145, 'positive Grundmasse');
      }
      if (key === 'rutherford' || key === 'bohr') {
        drawing = `<circle cx="300" cy="140" r="100" fill="#e0eefa" stroke="#779ab5" ${key === 'rutherford' ? 'stroke-dasharray="6 5"' : ''}/>`;
        if (key === 'bohr') drawing += '<circle cx="300" cy="140" r="55" fill="none" stroke="#779ab5"/>';
        drawing += circle(300, 140, 16, '#c1addf', '+');
        drawing += circle(200, 140, 10, '#9dcbed', '−') + circle(400, 140, 10, '#9dcbed', '−');
        drawing += text(300, 265, key === 'bohr' ? 'Energiezustände: innen / außen' : 'Positiver Kern · negative Hülle');
      }
      $('#model-picture').innerHTML = svg(drawing, model.caption);
    }
    document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => showModel(button.dataset.model)));
    showModel('demokrit');
    $('#scatter').addEventListener('click', () => {
      let traces = '<rect x="310" y="20" width="8" height="210" fill="#d3ac50"/>';
      for (let i = 0; i < 6; i++) traces += `<path d="M 30 ${50 + i * 28} H 570" stroke="#276da3" stroke-width="3" fill="none"/>`;
      traces += '<path d="M 30 130 H 310 L 490 30 M 30 145 H 310 L 190 230" stroke="#9d4776" stroke-width="4" fill="none"/>';
      $('#scatter-picture').innerHTML = svg(traces + text(315, 255, 'Goldfolie · meiste Spuren gerade, wenige stark abgelenkt'), 'Schematische gerade und stark abgelenkte Teilchenspuren');
      $('#scatter-result').textContent = 'Beobachtung im Modell: Die meisten Teilchen passieren, einzelne werden abgelenkt oder zurückgestreut. Schlussfolgerung: Die Ladung ist nicht gleichmäßig im Atom verteilt.';
    });

    const particleInputs = ['protons', 'neutrons', 'electrons'].map(id => $(`#${id}`));
    function readAtom() {
      if (particleInputs.some(input => input.value === '' || !input.validity.valid || !Number.isInteger(Number(input.value)))) return null;
      return atomInfo(...particleInputs.map(input => Number(input.value)));
    }
    function updateBuilder() {
      feedback('#builder-feedback', '');
      markSolved('magnesium-task', false);
      const info = readAtom();
      $('#builder-picture').hidden = !info;
      $('#builder-error').textContent = info ? '' : 'Bitte ganze Teilchenzahlen innerhalb der angegebenen Grenzen eingeben. Das Modell ist bis dahin ausgeblendet.';
      $('#nuclide').textContent = info ? `${info.name}-${info.mass}` : 'Eingabe korrigieren';
      $('#nuclide-text').textContent = info ? `Z = ${info.protons} · A = ${info.mass} · Ladung ${info.chargeLabel} (in Elementarladungen)` : '';
      if (!info) return;
      $('#builder-picture').innerHTML = atomDrawing(info);
      $('#builder-hint').textContent = info.charge === 0
        ? 'Neutral: gleich viele Protonen wie Elektronen. Ändere nur die Neutronenzahl, um ein anderes Isotop desselben Elements zu bilden.'
        : `Ion: ${info.charge > 0 ? 'Es fehlen' : 'Es gibt zusätzlich'} ${Math.abs(info.charge)} Elektronen im Vergleich zum neutralen Atom. Die Protonenzahl bestimmt weiterhin das Element.`;
    }
    particleInputs.forEach(input => input.addEventListener('input', updateBuilder));
    updateBuilder();
    $('#builder-check').addEventListener('click', () => {
      const info = readAtom();
      const correct = Boolean(info && info.protons === 12 && info.electrons === 10);
      markSolved('magnesium-task', correct);
      feedback('#builder-feedback', correct ? 'Richtig: 12 Protonen und 10 Elektronen ergeben Mg²⁺. Die Neutronenzahl entscheidet über das Isotop, nicht die Ionenladung.' : 'Noch nicht: Stelle 12 Protonen ein und entferne gegenüber dem neutralen Atom zwei Elektronen.', correct);
    });
    $('#magnesium').addEventListener('click', () => {
      [12, 12, 10].forEach((value, i) => { particleInputs[i].value = value; });
      updateBuilder();
      feedback('#builder-feedback', 'Musterlösung: Mg-24 mit Ladung 2+. Das Anzeigen allein zählt nicht als gelöste Aufgabe.');
    });

    const shields = {
      none: { lengths: [475, 475, 475], result: 'Ohne Abschirmung erreichen in diesem kompakten Modell alle drei Arten den Detektor. Unterschiedliche Luftreichweiten sind hier nicht abgebildet.' },
      paper: { lengths: [220, 475, 475], result: 'Papier hält Alpha zurück. Beta und Gamma können das Papier durchdringen.' },
      aluminium: { lengths: [220, 235, 475], result: 'Die gewählte Aluminiumplatte hält Alpha und in diesem Modell Beta zurück. Gamma wird nur wenig abgeschwächt.' },
      lead: { lengths: [220, 225, 475], result: 'Die dicke Bleischicht hält Alpha und Beta zurück und schwächt Gamma deutlich ab. Ein Teil der Gamma-Strahlung kann weiterhin durchdringen.' }
    };
    function updateShield() {
      const key = $('#shield').value;
      const shield = shields[key];
      let drawing = key === 'none' ? '' : '<rect x="265" y="25" width="28" height="180" fill="#a4afba"/>';
      ['α', 'β⁻', 'γ'].forEach((label, i) => {
        const y = 65 + i * 60;
        const faded = i === 2 && key === 'lead';
        drawing += text(35, y + 5, label, 21);
        drawing += `<path d="M 65 ${y} H ${65 + shield.lengths[i]}" stroke="${['#b5572d', '#286b9d', '#6c4ba3'][i]}" stroke-width="${faded ? 2 : 5}" ${faded ? 'stroke-dasharray="5 5"' : ''}/>`;
      });
      drawing += '<rect x="545" y="35" width="20" height="170" rx="6" fill="#91a9bd"/>';
      drawing += text(300, 250, 'Quelle → Abschirmung → Detektor (qualitativ)');
      $('#shield-picture').innerHTML = svg(drawing, shield.result);
      $('#shield-result').textContent = shield.result;
    }
    $('#shield').addEventListener('change', updateShield);
    updateShield();
    function updateExposure() {
      const distance = Number($('#distance').value);
      const duration = Number($('#duration').value);
      const relative = relativeExposure(distance, duration);
      $('#distance').setAttribute('aria-valuetext', `${distance} Meter`);
      $('#duration').setAttribute('aria-valuetext', `${duration} Minuten`);
      $('#exposure-result').textContent = `Abstand ${distance} m · Zeit ${duration} min · relativer Wert ${relative.toLocaleString('de-DE', { maximumFractionDigits: 3 })}. Referenz: 1 m und 1 min ergeben den Wert 1.`;
      $('#exposure-picture').innerHTML = svg(
        circle(55, 70, 18, '#d5ad63') + `<path d="M 85 70 H ${120 + distance * 65}" stroke="#326b98" stroke-width="3"/>` +
        circle(120 + distance * 65, 70, 18, '#9bc1df') +
        text(290, 120, `${distance} m Abstand · ${duration} min Aufenthaltszeit`), 'Abstand zwischen Quelle und Beobachtungsort', 600, 145);
    }
    ['distance', 'duration'].forEach(id => $(`#${id}`).addEventListener('input', updateExposure));
    updateExposure();

    function renderDecay() {
      const halfLife = Number($('#half-life').value);
      $('#half-output').value = halfLife;
      const counts = simulateDecay(200, halfLife, 24);
      const x = time => 60 + time / 24 * 490;
      const y = count => 230 - count / 200 * 190;
      let drawing = '<path d="M 60 25 V 230 H 565" stroke="#53647a" fill="none"/>';
      [0, 50, 100, 150, 200].forEach(count => {
        drawing += `<path d="M 60 ${y(count)} H 550" stroke="#cedbe8"/>${text(33, y(count) + 5, count, 13)}`;
      });
      [0, 4, 8, 12, 16, 20, 24].forEach(time => { drawing += text(x(time), 250, time, 13); });
      const points = counts.map((count, time) => `${x(time)},${y(count)}`).join(' ');
      const expected = counts.map((_, time) => `${x(time)},${y(expectedRemaining(200, time, halfLife))}`).join(' ');
      drawing += `<polyline points="${expected}" stroke="#135a91" stroke-width="2" stroke-dasharray="6 4" fill="none"/><polyline points="${points}" stroke="#624b9b" stroke-width="3" fill="none"/>`;
      drawing += text(305, 278, 'Zeit / Messschritte', 15) + text(125, 18, 'Übrige Kerne', 14);
      $('#decay-chart').innerHTML = svg(drawing, `Zerfall von 200 Kernen bei Halbwertszeit ${halfLife}. Daten in der folgenden Tabelle.`, 600, 295);
      $('#decay-table').replaceChildren();
      counts.forEach((count, time) => {
        const row = document.createElement('tr');
        [time, count, expectedRemaining(200, time, halfLife).toLocaleString('de-DE', { maximumFractionDigits: 1 })].forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        $('#decay-table').append(row);
      });
      $('#decay-description').textContent = `Start: 200 Kerne. Nach einer Halbwertszeit (${halfLife} Messschritte): ${counts[halfLife]} Kerne in dieser Zufallsreihe; theoretisch im Mittel 100. Nach zwei Halbwertszeiten: ${counts[2 * halfLife]}, theoretisch 50. Ein bereits zerfallener Kern kann nicht zur Ausgangsmenge zurückkehren.`;
    }
    $('#half-life').addEventListener('input', renderDecay);
    $('#new-sample').addEventListener('click', renderDecay);
    renderDecay();
    $('#half-check').addEventListener('click', () => {
      const input = $('#half-answer');
      const valid = input.value !== '' && input.validity.valid && Number.isInteger(Number(input.value));
      const correct = valid && Number(input.value) === 100;
      markSolved('half-number', correct);
      feedback('#half-feedback', !valid ? 'Bitte eine nichtnegative ganze Anzahl eingeben.' : correct ? 'Richtig: 800 → 400 → 200 → 100. Drei Halbwertszeiten bedeuten dreimal halbieren.' : 'Noch nicht: Halbiere 800 dreimal nacheinander. Nicht durch 3 teilen!', correct);
    });
    $('#half-answer').addEventListener('input', () => {
      markSolved('half-number', false);
      feedback('#half-feedback', '');
    });

    function updateChain() {
      const mode = $('#chain-mode').value;
      const values = chainGenerations(mode);
      let drawing = '';
      values.forEach((value, i) => {
        const height = value / 61 * 160;
        drawing += `<rect x="${40 + i * 90}" y="${195 - height}" width="48" height="${height}" fill="#8264af"/>`;
        drawing += text(64 + i * 90, 220, i, 14) + text(64 + i * 90, 185 - height, value.toLocaleString('de-DE', { maximumFractionDigits: 1 }), 14);
      });
      drawing += text(300, 255, 'Generation (Start = 0) · Zahlen: relative Spaltungszahl');
      $('#chain-picture').innerHTML = svg(drawing, `Kettenreaktion: ${mode === 'steady' ? 'gleichbleibend' : mode === 'growing' ? 'anwachsend' : 'abklingend'}`);
      $('#chain-result').textContent = mode === 'steady' ? 'Im Mittel löst jede Spaltung genau eine weitere aus. Die Zahl bleibt über Generationen gleich.' : mode === 'growing' ? 'Im Mittel entsteht mehr als eine Folgespaltung je Spaltung. Die Zahl wächst von Generation zu Generation.' : 'Im Mittel entsteht weniger als eine Folgespaltung je Spaltung. Die Reaktion klingt ab.';
    }
    $('#chain-mode').addEventListener('change', updateChain);
    updateChain();
    function updateFission() {
      const step = Number($('#fission-step').value);
      const captions = [
        'Ein Neutron wird von einem geeigneten schweren Kern aufgenommen. Dadurch kann der Kern instabil werden.',
        'Der angeregte Kern verformt sich und kann in zwei leichtere Kerne zerfallen. Nicht jede Neutronenaufnahme führt zur Spaltung.',
        'Spaltprodukte bewegen sich auseinander. Freie Neutronen können weitere Spaltungen auslösen; Bewegungsenergie wird im Material zu Wärme.'
      ];
      $('#fission-output').value = `${step + 1} von 3`;
      let drawing;
      if (step === 0) {
        drawing = circle(100, 125, 12, '#8db69b', 'n') +
          '<path d="M 125 125 H 230" stroke="#486a86" stroke-width="3"/>' +
          circle(310, 125, 55, '#b8a4d8') + text(310, 205, 'schwerer Kern');
      } else if (step === 1) {
        drawing = '<ellipse cx="300" cy="125" rx="95" ry="40" fill="#c7b4e0"/>' +
          text(300, 205, 'angeregter, verformter Kern');
      } else {
        drawing = circle(190, 125, 36, '#c4b0df') + circle(385, 125, 43, '#c4b0df') +
          circle(295, 65, 10, '#8db69b', 'n') + circle(310, 170, 10, '#8db69b', 'n') +
          '<path d="M 145 125 H 80 M 435 125 H 510 M 295 50 L 295 25 M 320 180 L 350 215" stroke="#486a86" stroke-width="3"/>' +
          text(300, 255, 'Spaltprodukte + freie Neutronen + Energie');
      }
      $('#fission-picture').innerHTML = svg(drawing, captions[step]);
      $('#fission-result').textContent = captions[step];
    }
    $('#fission-step').addEventListener('input', updateFission);
    updateFission();
    function updateReactor() {
      const insertion = Number($('#control-rods').value);
      $('#rods-output').value = insertion;
      const rodLength = 8 + insertion * 0.75;
      let drawing = '<rect x="25" y="60" width="115" height="150" rx="24" fill="#dbe6ed" stroke="#5a7992" stroke-width="3"/>';
      drawing += '<rect x="48" y="135" width="65" height="52" fill="#edb078"/>';
      [55, 80, 105].forEach(x => { drawing += `<rect data-rod="true" x="${x}" y="63" width="8" height="${rodLength}" fill="#526b80"/>`; });
      drawing += '<path d="M 140 90 H 210 V 175 H 140 M 140 185 H 190 V 200 H 140" stroke="#bd6540" stroke-width="7" fill="none"/>';
      drawing += '<rect x="205" y="80" width="40" height="135" rx="12" fill="#e8cfb5" stroke="#91734b"/>';
      drawing += '<path d="M 245 100 H 325 V 175 H 365 V 220 H 250 V 185" stroke="#448bb5" stroke-width="6" fill="none"/>';
      drawing += '<path d="M 300 80 L 350 100 L 300 120 Z" fill="#94b1c8"/><circle cx="398" cy="100" r="28" fill="#b4d4b8" stroke="#39794c"/>';
      drawing += '<path d="M 350 100 H 370 M 425 100 H 480" stroke="#556b7f" stroke-width="4"/>';
      drawing += '<rect x="315" y="165" width="105" height="45" rx="6" fill="#c6dfeb" stroke="#7097ae"/>';
      drawing += '<path d="M 420 180 H 500 V 235 H 420" stroke="#58a4a4" stroke-width="6" fill="none"/>';
      drawing += text(82, 36, 'Reaktor', 16) + text(82, 240, 'Regelstäbe / Kern', 13) + text(225, 55, 'Dampferzeuger', 13);
      drawing += text(315, 55, 'Turbine', 14) + text(399, 55, 'Generator', 14) + text(490, 100, 'Strom →', 14);
      drawing += text(366, 155, 'Kondensator', 13) + text(486, 263, 'Kühlkreislauf', 13);
      drawing += text(175, 285, 'Primärkreis: warm', 13) + text(365, 285, 'Sekundärkreis: Dampf/Wasser', 13);
      $('#reactor-picture').innerHTML = svg(drawing, `Druckwasserreaktor mit ${insertion} Prozent eingefahrenen Regelstäben, getrennten Wasserkreisläufen, Turbine, Generator und Kondensator.`, 570, 310);
      $('#power-text').textContent = `Regelstäbe ${insertion} % eingefahren: ${insertion === 0 ? 'keine Absorption durch diese Stäbe dargestellt' : insertion === 100 ? 'größte dargestellte Absorption durch die Stäbe' : 'mehr eingefahren bedeutet mehr Neutronenabsorption'}. Die Stellung ist kein Prozentwert der Kraftwerksleistung.`;
    }
    $('#control-rods').addEventListener('input', updateReactor);
    updateReactor();

    $('#history-check').addEventListener('click', () => {
      if (!$('#history-answer').value.trim()) {
        feedback('#history-feedback', 'Schreibe zunächst einen eigenen Antwortversuch.', false);
        return;
      }
      $('#history-solution').open = true;
      feedback('#history-feedback', 'Vergleiche deinen Entwurf mit den Kriterien unten. Dies ist keine automatische Inhaltsbewertung; besprich offene Fragen mit deiner Lehrkraft.');
    });
    document.querySelectorAll('.figure').forEach(figure => {
      figure.tabIndex = 0;
      figure.setAttribute('role', 'group');
      figure.setAttribute('aria-label', 'Schaubild, auf kleinen Bildschirmen horizontal verschiebbar');
    });
    $('#print-lab').addEventListener('click', () => window.print());
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { atomInfo, atomDrawing, simulateDecay, expectedRemaining, relativeExposure, chainGenerations, questions, gradeQuestion, models };
  }
  if (typeof document !== 'undefined') initLab();
})();
