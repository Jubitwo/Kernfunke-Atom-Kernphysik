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

  const chainFactors = { decreasing: 0.5, steady: 1, growing: 2 };
  function chainGenerations(mode) {
    if (!Object.hasOwn(chainFactors, mode)) throw new RangeError('Unbekannter Modellfall.');
    return Array.from({ length: 6 }, (_, i) => 8 * Math.pow(chainFactors[mode], i));
  }

  function shellDistribution(electrons) {
    if (!Number.isInteger(electrons) || electrons < 0 || electrons > 20) {
      throw new RangeError('Das vereinfachte Schalenbild unterstützt 0 bis 20 Elektronen.');
    }
    let remaining = electrons;
    return [2, 8, 8, 2].map(capacity => {
      const count = Math.min(remaining, capacity);
      remaining -= count;
      return count;
    });
  }

  const uraniumSeries = [
    { symbol: 'U', mass: 238, charge: 92, decay: 'α' },
    { symbol: 'Th', mass: 234, charge: 90, decay: 'β⁻' },
    { symbol: 'Pa', mass: 234, charge: 91, state: 'm', decay: 'β⁻' },
    { symbol: 'U', mass: 234, charge: 92, decay: 'α' },
    { symbol: 'Th', mass: 230, charge: 90, decay: 'α' },
    { symbol: 'Ra', mass: 226, charge: 88, decay: 'α' },
    { symbol: 'Rn', mass: 222, charge: 86, decay: 'α' },
    { symbol: 'Po', mass: 218, charge: 84, decay: 'α' },
    { symbol: 'Pb', mass: 214, charge: 82, decay: 'β⁻' },
    { symbol: 'Bi', mass: 214, charge: 83, decay: 'β⁻' },
    { symbol: 'Po', mass: 214, charge: 84, decay: 'α' },
    { symbol: 'Pb', mass: 210, charge: 82, decay: 'β⁻' },
    { symbol: 'Bi', mass: 210, charge: 83, decay: 'β⁻' },
    { symbol: 'Po', mass: 210, charge: 84, decay: 'α' },
    { symbol: 'Pb', mass: 206, charge: 82, decay: null }
  ];
  const fissionReaction = {
    target: { symbol: 'U', mass: 235, charge: 92 },
    excited: { symbol: 'U', mass: 236, charge: 92 },
    products: [{ symbol: 'Ba', mass: 141, charge: 56 }, { symbol: 'Kr', mass: 92, charge: 36 }],
    neutrons: 3
  };
  const fissionDecayChains = [
    { id: 'barium', title: 'Barium-Reihe · A = 141', nuclides: [
      { symbol: 'Ba', mass: 141, charge: 56, halfLife: '18 min' },
      { symbol: 'La', mass: 141, charge: 57, halfLife: '3,9 h' },
      { symbol: 'Ce', mass: 141, charge: 58, halfLife: '32,5 d' },
      { symbol: 'Pr', mass: 141, charge: 59, halfLife: null }
    ] },
    { id: 'krypton', title: 'Krypton-Reihe · A = 92', nuclides: [
      { symbol: 'Kr', mass: 92, charge: 36, halfLife: '1,8 s' },
      { symbol: 'Rb', mass: 92, charge: 37, halfLife: '4,5 s' },
      { symbol: 'Sr', mass: 92, charge: 38, halfLife: '2,7 h' },
      { symbol: 'Y', mass: 92, charge: 39, halfLife: '3,5 h' },
      { symbol: 'Zr', mass: 92, charge: 40, halfLife: null }
    ] }
  ];
  function idealChain(generations = 5, factor = 3) {
    return Array.from({ length: generations }, (_, generation) => factor ** generation);
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
    { id: 'half-life', group: 'decay', prompt: 'Im Modell gilt 1 Messschritt = 1 s. Was bedeutet T = 4 s?',
      options: ['Nach vier Sekunden ist im Mittel etwa die Hälfte der Startmenge übrig.', 'Jeder Kern zerfällt exakt nach vier Sekunden.', 'Die Strahlung wird viermal stärker.'], answer: 0,
      explanation: 'Vier Sekunden sind hier vier gleich lange Zeitabstände seit dem Start. Das Zählintervall ist nicht die Halbwertszeit; erst vier Intervalle ergeben T = 4 s.' },
    { id: 'background', group: 'decay', prompt: 'Warum misst man die Nullrate?',
      options: ['Damit das Gerät keine Elektronen mehr zählt.', 'Um den Hintergrundbeitrag bei der Auswertung zu berücksichtigen.', 'Weil ohne Schulquelle keine Strahlung existiert.'], answer: 1,
      explanation: 'Natürliche Hintergrundstrahlung und Geräteeinflüsse liefern Impulse. Die mittlere Hintergrundzählrate wird separat bestimmt.' },
    { id: 'becquerel-unit', group: 'decay', prompt: 'Was bedeutet 1 Bq?',
      options: ['Eine sichere Aufenthaltsdauer von einer Sekunde.', 'Eine biologische Dosis von 1 Sv.', 'Im Mittel ein Kernzerfall pro Sekunde.'], answer: 2,
      explanation: 'Becquerel beschreibt Aktivität. Eine gemessene Impulszahl hängt auch vom Gerät und Versuchsaufbau ab; die Dosis ist eine andere Größe.' },
    { id: 'energy', group: 'energy', prompt: 'Welche Energieumwandlungskette passt zum Kernkraftwerk?',
      options: ['Kernenergie → Wärme → Bewegung → elektrische Energie.', 'Elektrische Energie → Kernenergie → Licht.', 'Kernenergie → direkt elektrische Energie ohne Wärme.'], answer: 0,
      explanation: 'Die Turbine nutzt Dampf, der Generator die Drehbewegung. Ein erheblicher Teil der Wärme wird als Abwärme abgegeben.' },
    { id: 'rods', group: 'energy', prompt: 'Was leisten Regelstäbe?',
      options: ['Sie sind der Generator.', 'Sie absorbieren Neutronen und beeinflussen die Kettenreaktion.', 'Sie beseitigen radioaktive Abfälle.'], answer: 1,
      explanation: 'Regelstäbe nehmen Neutronen auf. Das Abbremsen von Neutronen ist dagegen die Aufgabe des Moderators.' },
    { id: 'afterheat', group: 'energy', prompt: 'Warum muss ein abgeschalteter Reaktor weiter gekühlt werden?',
      options: ['Weil alle Kerne nun sofort fusionieren.', 'Weil elektrischer Strom den Kern heizt.', 'Weil radioaktive Spaltprodukte weiter zerfallen und Wärme abgeben.'], answer: 2,
      explanation: 'Die Kettenreaktion kann beendet sein, trotzdem bleibt Nachzerfallswärme. Kühlung und sicherer Einschluss sind weiterhin erforderlich.' },
    { id: 'waste', group: 'energy', prompt: 'Was gilt für radioaktive Abfälle nach einer Halbwertszeit?',
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
      explanation: 'Bewerten bedeutet: Kriterien nennen, Fakten verwenden und die eigene Gewichtung nachvollziehbar machen.' },
    { id: 'sodium-shells', group: 'atoms', prompt: 'Wie verteilen sich 11 Elektronen des neutralen Natriumatoms im vereinfachten Schalenbild?',
      options: ['Alle 11 auf einer Schale.', '2 | 8 | 1 von innen nach außen.', '8 | 2 | 1 von innen nach außen.'], answer: 1,
      explanation: 'Die K-Schale erhält 2, die L-Schale 8 und die M-Schale das verbleibende Elektron. Die Kreise stehen für Energieniveaus.' },
    { id: 'gamma-shield', group: 'radiation', prompt: 'Was bedeuten weniger Gamma-Spuren hinter Blei?',
      options: ['Gamma wird in Alpha umgewandelt.', 'Gamma ist vollständig verschwunden.', 'Ein Teil wird aus dem Strahl entfernt, ein Teil gelangt weiterhin hindurch.'], answer: 2,
      explanation: 'Gamma-Abschirmung ist eine Abschwächung. Eine dicke Schicht bedeutet nicht, dass gar keine Gamma-Strahlung mehr hindurchkommt.' },
    { id: 'distance-quarter', group: 'radiation', prompt: '100 Modelltreffer bei 1 m und 1 min: Wie viele erwarten wir bei 2 m und unveränderter Zeit?',
      options: ['25', '50', '200'], answer: 0,
      explanation: 'Doppelter Abstand bedeutet beim idealen Punktquellenmodell die vierfache Kugelfläche. 100 : 4 = 25; das ist keine reale Dosisberechnung.' },
    { id: 'dose-unit', group: 'decay', prompt: 'Sind Bq und Sv dieselbe Größe?',
      options: ['Ja, beide zählen nur Sekunden.', 'Nein. Bq beschreibt Aktivität, Sv eine strahlenschutzbezogene Dosisgröße.', 'Ja, 1 Bq ist immer 1 Sv.'], answer: 1,
      explanation: 'Aus Zerfällen pro Sekunde allein folgt noch keine biologische Wirkung. Aufnahmeweg, Energie und weitere Faktoren sind wichtig.' },
    { id: 'time-interval', group: 'decay', prompt: 'T = 2 s, Messabstand 1 s, Start 200 Kerne. Was erwarten wir bei t = 4 s?',
      options: ['100, weil erst eine Halbwertszeit vorbei ist.', '0, weil alle Kerne gleichzeitig zerfallen.', '50, weil zwei Halbwertszeiten vergangen sind.'], answer: 2,
      explanation: '4 s : 2 s = 2 Halbwertszeiten. 200 → 100 → 50. Ein Messschritt von 1 s ist hier nur halb so lang wie T.' },
    { id: 'fission-balance', group: 'fission', prompt: 'U-235 nimmt ein Neutron auf. Welche Massenzahl hat der angeregte Zwischenkern?',
      options: ['236', '235', '92'], answer: 0,
      explanation: 'Ein Neutron besitzt Massenzahl 1 und Ladungszahl 0. A = 235 + 1 = 236; Z bleibt 92. Das Sternchen in U-236* bedeutet angeregt.' },
    { id: 'excited-core', group: 'fission', prompt: 'Was ist an „U-235 wird erst durch Neutronenaufnahme radioaktiv“ falsch?',
      options: ['Uran hat keine Neutronen.', 'U-235 ist bereits radioaktiv; die Aufnahme erzeugt zusätzlich einen angeregten U-236-Kern.', 'Alle Kerne sind stabil.'], answer: 1,
      explanation: 'Radioaktive Instabilität und der zur Spaltung angeregte Zustand sind nicht dasselbe. Nicht jede Neutronenaufnahme führt zur Spaltung.' },
    { id: 'exponential', group: 'fission', prompt: '8 Startspaltungen, Faktor 2 je Generation: Wie viele Spaltungen hat Generation g = 3?',
      options: ['14', '24', '64'], answer: 2,
      explanation: '8 · 2³ = 64. Die Folge 8, 16, 32, 64 vervielfacht sich immer mit demselben Faktor und wächst deshalb exponentiell.' },
    { id: 'uranium-lead', group: 'fission', prompt: 'Wie führt der Hauptpfad von U-238 (Z = 92) zu Pb-206 (Z = 82)?',
      options: ['Durch 8 α- und 6 β⁻-Zerfälle.', 'Durch eine einzige Spaltung in Blei.', 'Durch 6 α- und 8 β⁻-Zerfälle.'], answer: 0,
      explanation: '8 α reduzieren A um 32 und Z um 16 auf 76. 6 β⁻ erhöhen Z auf 82. Das ist eine Zerfallsreihe, keine sich vervielfachende Kettenreaktion.' },
    { id: 'chain-three', group: 'fission', prompt: 'Idealfall: Jede Spaltung löst 3 weitere aus. Wie viele Spaltungen gibt es in Generation g = 3?',
      options: ['9', '12', '27'], answer: 2,
      explanation: '1 → 3 → 9 → 27: In jeder Generation wird mit 3 multipliziert, also 3³ = 27. 3 · 3 = 9 wäre erst g = 2; 3 + 3 + 3 + 3 = 12 wäre lineares Denken.' },
    { id: 'fission-products', group: 'fission', prompt: 'Was geschieht mit dem Spaltprodukt Ba-141?',
      options: ['Es wandelt sich über mehrere β⁻-Zerfälle bis zum stabilen Pr-141 um.', 'Es ist sofort stabil.', 'Es spaltet sich wieder in zwei gleich große Kerne.'], answer: 0,
      explanation: 'Ba-141 hat zu viele Neutronen. Über La-141 und Ce-141 entsteht nach drei β⁻-Zerfällen das stabile Pr-141. A bleibt 141, Z steigt von 56 auf 59.' },
    { id: 'beta-count', group: 'fission', prompt: 'Kr-92 (Z = 36) wird zum stabilen Zr-92 (Z = 40). Wie viele β⁻-Zerfälle sind nötig?',
      options: ['2', '4', '40'], answer: 1,
      explanation: 'Jeder β⁻-Zerfall erhöht Z um 1 und lässt A gleich: 40 − 36 = 4 Zerfälle (Kr → Rb → Sr → Y → Zr).' },
    { id: 'reactor-circuits', group: 'energy', prompt: 'Was wird im Dampferzeuger eines Druckwasserreaktors zwischen den Kreisläufen übertragen?',
      options: ['Das gesamte Primärwasser.', 'Wärme; das Wasser bleibt getrennt.', 'Die Brennelemente.'], answer: 1,
      explanation: 'Der Dampferzeuger ist ein Wärmetauscher: Primärwasser gibt Wärme an Sekundärwasser ab, ohne dass beide Wasserströme vermischt werden.' },
    { id: 'fusion-meaning', group: 'weapons', prompt: 'Zusatzwissen: Was bedeutet Kernfusion?',
      options: ['Ein schwerer Kern wird geteilt.', 'Ein Atom verliert ein Hüllenelektron.', 'Leichte Kerne verschmelzen zu einem schwereren Kern.'], answer: 2,
      explanation: 'Fusion ist Verschmelzen. Spaltung ist Teilen eines schweren Kerns. Diese Begriffe beschreiben verschiedene Kernreaktionen.' },
    { id: 'weapon-reactor', group: 'weapons', prompt: 'Was unterscheidet den stationären Reaktorbetrieb von einer Spaltungswaffe?',
      options: ['Geregelte, im Mittel gleichbleibende Kettenreaktion statt sehr schneller zerstörerischer Energiefreisetzung.', 'Ein Reaktorunfall ist immer eine Kernwaffenexplosion.', 'Im Reaktor gibt es keine Kernreaktionen.'], answer: 0,
      explanation: 'Zweck, physikalische Situation und Folgen unterscheiden sich. Ein schwerer Reaktorunfall ist nicht mit einer Kernwaffenexplosion gleichzusetzen.' },
    { id: 'supercritical', group: 'weapons', prompt: 'Was bedeutet „überkritisch“?',
      options: ['Es finden überhaupt keine Spaltungen statt.', 'Jede Spaltung löst im Mittel mehr als eine weitere aus; die Kettenreaktion wächst.', 'Das Material ist besonders kalt.'], answer: 1,
      explanation: 'Unterkritisch: Faktor kleiner 1, die Kettenreaktion erlischt. Kritisch: Faktor 1, gleichbleibend wie im Kraftwerk. Überkritisch: Faktor größer 1, exponentielles Wachstum.' },
    { id: 'bomb-ignition', group: 'weapons', prompt: 'Wie wird eine Atombombe im Prinzip ausgelöst?',
      options: ['Regelstäbe werden langsam herausgezogen.', 'Wasser wird erhitzt, bis Dampf entsteht.', 'Konventioneller Sprengstoff bringt unterkritisches Material sehr schnell in einen überkritischen Zustand.'], answer: 2,
      explanation: 'Beim Kanonenprinzip werden zwei Teilmassen zusammengeschoben, beim Implosionsprinzip wird eine Kugel zusammengepresst. In beiden Fällen entsteht schlagartig ein überkritischer Zustand.' },
    { id: 'hbomb-stages', group: 'weapons', prompt: 'Was zündet die Fusionsstufe einer Wasserstoffbombe?',
      options: ['Die Explosion einer Spaltungsstufe liefert extreme Hitze und Strahlung.', 'Ein elektrischer Funke wie im Automotor.', 'Sonnenlicht, das durch die Hülle fällt.'], answer: 0,
      explanation: 'Fusion braucht viele Millionen Grad und hohen Druck. Diese Bedingungen erzeugt zuerst eine Spaltungsexplosion; deshalb besteht eine Wasserstoffbombe aus zwei Stufen.' },
    { id: 'becquerel-finding', group: 'history', prompt: 'Was machte Becquerels Beobachtung besonders?',
      options: ['Uran musste zuerst mit Sonnenlicht aufgeladen werden.', 'Uranverbindungen schwärzten eine geschützte Fotoplatte auch ohne vorherige Beleuchtung.', 'Er beobachtete bereits eine Kernspaltung.'], answer: 1,
      explanation: 'Die Wirkung ging von den Uranverbindungen selbst aus. 1896 wurde damit natürliche Radioaktivität erkannt, nicht Kernspaltung.' },
    { id: 'discovery-date', group: 'history', prompt: 'Welche zeitliche Reihenfolge passt zur Kernspaltung?',
      options: ['1939 Deutung, erst 1945 Barium-Befund.', '1896 fand Hahn Barium.', 'Ende 1938 Barium-Befund; Anfang 1939 Veröffentlichung und physikalische Deutung.'], answer: 2,
      explanation: 'Der experimentelle Befund von Hahn/Straßmann und die Deutung von Meitner/Frisch gehören zu unterschiedlichen Schritten derselben Entdeckungsgeschichte.' },
    { id: 'chernobyl', group: 'history', prompt: 'Was geschah am 26. April 1986 in Tschernobyl?',
      options: ['Ein Tsunami überflutete das Kraftwerk.', 'Bei einem Test geriet Block 4 außer Kontrolle; Explosion und Graphitbrand setzten große Mengen radioaktiver Stoffe frei.', 'Eine Atombombe wurde gezündet.'], answer: 1,
      explanation: 'Während eines Sicherheitstests stieg die Leistung des RBMK-Reaktors unkontrollierbar an. Explosion und tagelanger Brand des Graphit-Moderators verteilten radioaktive Stoffe bis nach Deutschland.' },
    { id: 'fukushima', group: 'history', prompt: 'Womit begann der Unfall von Fukushima am 11. März 2011?',
      options: ['Mit einem Erdbeben und einem Tsunami; danach fiel die Stromversorgung für die Kühlung aus.', 'Mit einem Flugzeugabsturz.', 'Mit einem Test einer Wasserstoffbombe.'], answer: 0,
      explanation: 'Die Reaktoren wurden beim Erdbeben abgeschaltet. Der Tsunami zerstörte die Notstromversorgung; ohne Kühlung kam es in den Blöcken 1 bis 3 zu Kernschmelzen.' },
    { id: 'decay-heat-accident', group: 'history', prompt: 'Warum schmolzen in Fukushima Reaktorkerne, obwohl die Kettenreaktion gestoppt war?',
      options: ['Weil Uran dabei zu Blei wurde.', 'Weil Regelstäbe Wärme erzeugen.', 'Weil Spaltprodukte weiter zerfallen und Nachzerfallswärme abgeführt werden muss.'], answer: 2,
      explanation: 'Auch nach dem Abschalten zerfallen radioaktive Spaltprodukte und erzeugen Wärme. Fällt die Kühlung aus, steigt die Temperatur, bis Brennelemente schmelzen können.' }
  ];

  const finalTasks = [
    { id: 'models', station: 1, prompt: 'Die meisten α-Teilchen passieren eine dünne Goldfolie, wenige werden stark abgelenkt. Welche Folgerung zog Rutherford? Warum ist das Bohr-Bild kein Foto eines Atoms?',
      solution: 'Positive Ladung und fast die gesamte Masse sind in einem kleinen Kern konzentriert; die Hülle beansprucht viel größeren Raum. Bohrs Schalen stellen erlaubte Energieniveaus vereinfacht dar, nicht reale Planetenbahnen. Jedes Modell hat Grenzen.' },
    { id: 'atom', station: 2, prompt: 'Ein neutrales Na-23-Atom hat Z = 11. Bestimme Protonen, Neutronen und Elektronen und zeichne die Elektronen auf die Schalen.',
      solution: '11 Protonen, 23 − 11 = 12 Neutronen, 11 Elektronen. Von innen: K = 2, L = 8, M = 1. Beschriftete Schalen, keine Elektronen im Kern.' },
    { id: 'isotopes', station: 2, prompt: 'Erkläre den Unterschied zwischen C-12 und C-14 und zwischen einem neutralen Atom und einem positiven Ion.',
      solution: 'C-12/C-14 haben beide 6 Protonen, aber 6 bzw. 8 Neutronen. Beim positiven Ion fehlen gegenüber dem neutralen Atom Elektronen; die Protonenzahl und damit das Element bleiben gleich.' },
    { id: 'radiation', station: 3, prompt: 'Vergleiche α, β⁻ und γ: Art, Ladung und geeignete Abschirmung. Warum bedeutet Blei nicht „keine Gamma-Strahlung mehr“?',
      solution: 'α: Heliumkerne, 2+, Papier. β⁻: Elektronen aus Kernumwandlung, 1−, geeignetes Material wie Aluminium oder Kunststoff. γ: elektromagnetisch, ungeladen, dichte Schichten schwächen ab. Ein Teil der Gamma-Strahlung kann weiter durchdringen; Energie und Materialdicke sind entscheidend.' },
    { id: 'protection', station: 3, prompt: 'Was bedeutet Ionisation? Nenne drei Schutzmaßnahmen und unterscheide Bestrahlung und Kontamination.',
      solution: 'Zum Beispiel Herauslösen eines Elektrons aus einem Atom; ein Ion entsteht. Abstand vergrößern, Aufenthaltszeit verkürzen, geeignet abschirmen; zusätzlich Aufnahme vermeiden. Bestrahlung ist Einwirkung von Strahlung, Kontamination eine Verunreinigung mit radioaktivem Stoff.' },
    { id: 'distance', station: 3, prompt: 'Im idealen Punktquellenmodell: 100 Modelltreffer bei 1 m in 1 min. Wie viele bei 2 m in 1 min, wie viele bei 2 m in 2 min? Begründe.',
      solution: '25 bzw. 50. Doppelter Abstand bedeutet ein Viertel je gleicher Messfläche; doppelte Zeit verdoppelt die gesammelte Modellzahl. Das sind keine Dosiswerte oder sicheren Aufenthaltszeiten.' },
    { id: 'half', station: 4, prompt: '800 Anfangskerne, T = 4 s, Ablesung jede 1 s: Wie viele bleiben nach 4 s, 8 s und 12 s im Mittel übrig? Ist 1 Messschritt hier eine Halbwertszeit?',
      solution: '400, 200, 100. Nein: Ein Messschritt dauert 1 s; vier dieser Schritte ergeben eine Halbwertszeit. Einzelne Kerne zerfallen zufällig, Messreihen schwanken.' },
    { id: 'measure', station: 4, prompt: 'Erkläre Bq, Sv und Nullrate. Warum sind 100 Zählrohrimpulse nicht einfach „100 Bq“?',
      solution: 'Bq: im Mittel Zerfälle pro Sekunde. Sv: strahlenschutzbezogene Dosisgröße. Nullrate: Hintergrundzählrate ohne zusätzliche Quelle. Ein Zählrohr registriert abhängig von Zeit, Wirkungsgrad und Aufbau nur einen Teil der Strahlung; Hintergrund berücksichtigen.' },
    { id: 'fission', station: 5, prompt: 'Ergänze: U-235 + n → U-236* → Ba-141 + Kr-92 + ___ n + Energie. Erkläre n und *. Prüfe A und Z (U: 92, Ba: 56, Kr: 36).',
      solution: '3 Neutronen. n = ungeladenes Neutron (A = 1, Z = 0), * = angeregt. A: 235 + 1 = 141 + 92 + 3 = 236; Z: 92 = 56 + 36. Ein möglicher Spaltungskanal, nicht der einzige.' },
    { id: 'growth', station: 5, prompt: '8 Startspaltungen, jede Generation im Mittel doppelt so viele: Notiere g = 0 bis 4. Warum exponentiell? Muss jede Kettenreaktion so wachsen?',
      solution: '8, 16, 32, 64, 128. Gleicher Faktor 2 pro Generation, nicht gleicher Zuwachs. N(g) = 8 · 2^g. Bei Faktor 1 bleibt die Zahl gleich, bei Faktor kleiner 1 klingt sie ab.' },
    { id: 'chain-tree', station: 5, prompt: 'Idealfall: Jede Spaltung setzt 3 Neutronen frei, und jedes spaltet einen weiteren Kern. Notiere die Spaltungen für g = 0 bis 4 und die Gesamtzahl bis g = 3. Warum ist das ein Idealfall?',
      solution: '1, 3, 9, 27, 81; N(g) = 3^g. Bis g = 3 insgesamt 1 + 3 + 9 + 27 = 40. Real werden im Mittel 2 bis 3 Neutronen frei; viele entweichen oder werden ohne Spaltung absorbiert. Deshalb wächst eine reale Kette langsamer oder bleibt im Kraftwerk gleich (Faktor 1).' },
    { id: 'products', station: 5, prompt: 'Die Spaltprodukte Ba-141 (Z = 56) und Kr-92 (Z = 36) sind radioaktiv. Gib ihre β⁻-Zerfallsreihen bis zu den stabilen Kernen Pr-141 (Z = 59) und Zr-92 (Z = 40) an. Wie viele Zerfälle sind es jeweils?',
      solution: 'Ba-141 → La-141 → Ce-141 → Pr-141: 3 β⁻. Kr-92 → Rb-92 → Sr-92 → Y-92 → Zr-92: 4 β⁻. A bleibt gleich, Z steigt je Zerfall um 1. Halbwertszeiten reichen von Sekunden bis zu Wochen (Ce-141 ≈ 32,5 d); deshalb bleibt abgebrannter Brennstoff lange radioaktiv.' },
    { id: 'series', station: 5, prompt: 'U-238 (Z = 92) → … → Pb-206 (Z = 82): Bestimme die Anzahl der α- und β⁻-Zerfälle im Hauptpfad. Warum ist dies keine Spaltungskettenreaktion?',
      solution: '(238 − 206) : 4 = 8 α. Danach Z = 92 − 16 = 76; 82 − 76 = 6 β⁻. Aufeinanderfolgende natürliche Umwandlungen eines Kerns, keine Vervielfachung durch freigesetzte Neutronen.' },
    { id: 'power', station: 6, prompt: 'Beschreibe den Weg vom Reaktorkern zum Strom. Unterscheide Regelstab und Moderator. Warum nach Abschalten weiter kühlen?',
      solution: 'Spaltung → Wärme im Primärkreis → Dampferzeuger/sekundärer Dampf → Turbine → Generator/Strom; Kondensator und Kühlkreis führen Abwärme ab. Regelstäbe absorbieren, Moderator bremst Neutronen. Spaltprodukte erzeugen weiter Nachzerfallswärme.' },
    { id: 'evaluate', station: 6, prompt: 'Bewerte eine Anwendung von Kernenergie oder ionisierender Strahlung: Nenne Nutzen, Risiko und Schutzmaßnahme und begründe deine Abwägung.',
      solution: 'Zum Beispiel medizinisch nötige Diagnose versus zusätzliche Strahlenbelastung, mit Prüfung von Alternativen und Optimierung. Oder Stromerzeugung versus Unfall- und Abfallrisiken, mit Sicherheitskontrollen und langfristigem Einschluss. Eine begründete Gewichtung ist verlangt; kein pauschales Ja/Nein.' },
    { id: 'bomb', station: 7, prompt: 'Erkläre unterkritisch und überkritisch. Beschreibe das Grundprinzip einer Atombombe (Kanonen- oder Implosionsprinzip) und nenne vier Folgen einer Explosion.',
      solution: 'Unterkritisch: Zu viele Neutronen gehen verloren, die Kette erlischt. Überkritisch: Jede Spaltung löst im Mittel mehr als eine weitere aus. Konventioneller Sprengstoff schiebt zwei Teilmassen zusammen (Kanonenprinzip) oder presst eine Kugel zusammen (Implosionsprinzip). Folgen: Lichtblitz/Hitze, Druckwelle, ionisierende Strahlung, radioaktiver Fallout.' },
    { id: 'history', station: 8, prompt: 'Ordne Becquerel, Marie/Pierre Curie, Hahn/Straßmann und Meitner/Frisch jeweils einen Beitrag zu.',
      solution: 'Becquerel: natürliche Radioaktivität 1896. Curies: systematische Forschung, Polonium/Radium 1898. Hahn/Straßmann: Barium-Befund Ende 1938. Meitner/Frisch: physikalische Deutung der Kernspaltung 1939.' },
    { id: 'accidents', station: 8, prompt: 'Vergleiche die Reaktorunfälle von Tschernobyl 1986 und Fukushima 2011: Ursache, Ablauf, Folgen. Warum ist ein Reaktorunfall keine Atombombenexplosion?',
      solution: 'Tschernobyl: Bei einem Test geriet Block 4 (RBMK) außer Kontrolle; Explosion und Graphitbrand, radioaktive Wolke bis Deutschland, 30-km-Sperrzone. Fukushima: Erdbeben und Tsunami, Notstrom und Kühlung fallen aus, Nachzerfallswärme führt zu Kernschmelzen in den Blöcken 1–3, Wasserstoffexplosionen, rund 120 000 Menschen evakuiert. Beide: INES-Stufe 7. Im Reaktor fehlt die schlagartig überkritische Anordnung einer Bombe; Explosionen waren Dampf- bzw. Wasserstoffexplosionen.' },
    { id: 'fusion', station: 7, optional: true, prompt: 'Zusatz: Erkläre den Unterschied zwischen Spaltung und Fusion. Warum braucht eine Wasserstoffbombe zuerst eine Spaltungsstufe? Prüfe A und Z bei ²H + ³H → ⁴He + n.',
      solution: 'Spaltung teilt einen schweren Kern, Fusion verschmilzt leichte Kerne. Fusion braucht viele Millionen Grad und hohen Druck; diese Bedingungen liefert die Spaltungsexplosion der ersten Stufe. A: 2 + 3 = 4 + 1; Z: 1 + 1 = 2 + 0.' }
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
    const shells = shellDistribution(info.electrons);
    const names = ['K', 'L', 'M', 'N'];
    let content = '';
    shells.forEach((count, index) => {
      if (!count) return;
      const radius = 90 + index * 45;
      content += `<circle data-shell="${names[index]}" cx="350" cy="275" r="${radius}" fill="none" stroke="#789bb6" stroke-width="2"/>`;
      content += text(350 + radius * 0.72, 275 - radius * 0.72 - 12, `${names[index]}: ${count}`, 17);
      for (let i = 0; i < count; i++) {
        const angle = 2 * Math.PI * i / count - Math.PI / 2;
        content += `<g data-electron-shell="${names[index]}">${circle(350 + Math.cos(angle) * radius, 275 + Math.sin(angle) * radius, 10, '#92c5ed', '−', 'electron')}</g>`;
      }
    });
    const total = info.protons + info.neutrons;
    for (let i = 0; i < total; i++) {
      const columns = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / columns);
      const x = 350 + ((i % columns) - (columns - 1) / 2) * 15;
      const y = 275 + (Math.floor(i / columns) - (rows - 1) / 2) * 15;
      const proton = i < info.protons;
      content += circle(x, y, 7, proton ? '#edb078' : '#95bda0', proton ? '+' : '', proton ? 'proton' : 'neutron');
    }
    content += text(350, 25, `${info.symbol}-${info.mass} · ${info.protons} p⁺ · ${info.neutrons} n · ${info.electrons} e⁻`, 19);
    content += text(350, 540, `Ladung: ${info.chargeLabel} · Schalen ${shells.map((n, i) => `${names[i]} ${n}`).join(' | ')}`, 18);
    return svg(content, `Schalenbild mit ${info.protons} Protonen, ${info.neutrons} Neutronen und ${info.electrons} Elektronen. Schalenbesetzung ${shells.join(', ')}.`, 700, 565);
  }

  const shieldDescriptions = {
    none: 'Keine Materialschicht: Alle drei Arten erreichen in diesem kurzen Modell den Detektor.',
    paper: 'Erste Schicht, Papier: Alpha endet dort. Beta und Gamma gelangen hindurch.',
    aluminium: 'Papier bleibt stehen; Aluminium kommt hinzu. Alpha endet am Papier, Beta an der geeigneten Aluminiumplatte. Gamma kann weiterhin zum Detektor gelangen.',
    lead: 'Drei getrennte Schichten: Papier hält Alpha auf, Aluminium Beta. In der dicken Bleischicht enden viele Gamma-Beispielspuren; wenige laufen durch bis zum Detektor. Das zeigt Abschwächung, nicht vollständiges Abschalten.'
  };
  function shieldDrawing(key) {
    const stage = ['none', 'paper', 'aluminium', 'lead'].indexOf(key);
    if (stage < 0) throw new RangeError('Unbekannte Abschirmstufe.');
    const layers = [
      { name: 'Papier', id: 'paper', x: 200, width: 6, color: '#f5e8b3' },
      { name: 'Aluminium', id: 'aluminium', x: 340, width: 28, color: '#c5d3dc' },
      { name: 'Blei (dick)', id: 'lead', x: 500, width: 66, color: '#85939f' }
    ];
    let drawing = '';
    layers.slice(0, stage).forEach(layer => {
      drawing += `<g data-material="${layer.id}"><rect x="${layer.x}" y="75" width="${layer.width}" height="280" fill="${layer.color}" stroke="#53647a" stroke-width="2"/>`;
      if (layer.id === 'paper') drawing += `<path d="M 200 75 L 206 85 L 213 75" fill="none" stroke="#927a36"/>`;
      else {
        for (let x = layer.x + 5; x < layer.x + layer.width; x += 9) {
          drawing += `<path d="M ${x} 80 V 350" stroke="${layer.id === 'lead' ? '#667581' : '#edf4f9'}" stroke-width="2"/>`;
        }
      }
      drawing += text(layer.x + layer.width / 2, 50, layer.name, 18) + '</g>';
    });
    const stop = (x, y) => `<path d="M ${x - 5} ${y - 5} l 10 10 m -10 0 l 10 -10" stroke="#743b35" stroke-width="3"/>`;
    [['α', 135, '#af542c', stage >= 1 ? 200 : 705], ['β⁻', 225, '#236a9e', stage >= 2 ? 340 : 705]].forEach(([label, y, color, end]) => {
      drawing += text(45, y + 6, label, 24) + `<path d="M 85 ${y} H ${end}" stroke="${color}" stroke-width="4"/>`;
      if (end < 705) drawing += stop(end, y);
    });
    drawing += text(45, 316, 'γ', 24);
    for (let i = 0; i < 8; i++) {
      const y = 284 + i * 8;
      const transmitted = stage < 3 || i === 2 || i === 5;
      const end = transmitted ? 705 : 510 + (i % 3) * 15;
      drawing += `<path ${transmitted ? 'data-gamma-outgoing="true"' : 'data-gamma-stopped="true"'} d="M 85 ${y} H ${end}" stroke="#7150a2" stroke-width="2"/>`;
      if (!transmitted) drawing += circle(end, y, 3, '#7150a2');
    }
    drawing += '<rect x="710" y="100" width="20" height="240" rx="6" fill="#a6c1d3" stroke="#416d8b"/>';
    drawing += text(710, 70, 'Detektor', 17) + text(88, 70, 'Quelle', 17);
    drawing += text(390, 390, 'Kreuz: Spur endet · Gamma: weniger Spuren hinter Blei, aber nicht null', 17);
    return svg(drawing, shieldDescriptions[key], 800, 420);
  }

  function nucleusCloud(cx, cy, nucleus, stretch = 1) {
    const radius = 4.5 * Math.sqrt(nucleus.mass);
    let drawing = `<g data-nucleus="${nucleus.symbol}-${nucleus.mass}" data-mass="${nucleus.mass}" data-charge="${nucleus.charge}"><ellipse cx="${cx}" cy="${cy}" rx="${(radius + 7) * stretch}" ry="${(radius + 7) / stretch}" fill="#e9e0f3" stroke="#78618f" stroke-width="2"/>`;
    for (let i = 0; i < nucleus.mass; i++) {
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const distance = 4.5 * Math.sqrt(i + 0.5);
      const proton = Math.floor((i + 1) * nucleus.charge / nucleus.mass) > Math.floor(i * nucleus.charge / nucleus.mass);
      drawing += `<circle data-nucleon="${proton ? 'proton' : 'neutron'}" cx="${cx + Math.cos(angle) * distance * stretch}" cy="${cy + Math.sin(angle) * distance / stretch}" r="2.5" fill="${proton ? '#d48642' : '#579579'}"/>`;
    }
    return drawing + '</g>';
  }
  const fissionCaptions = [
    'Start: U-235 besitzt 92 Protonen und 143 Neutronen. Ein zusätzliches Neutron n trifft auf den schweren Kern. Die Zeichnung zeigt nur den Kern, nicht die Elektronenhülle.',
    'Aufnahme: 235 + 1 = 236 Kernteilchen. Es entsteht U-236* mit 92 Protonen und 144 Neutronen. Das Sternchen bedeutet angeregt: Der verformte Kern kann sich spalten; U-235 war bereits vorher radioaktiv.',
    'Ein möglicher Ausgang: Ba-141 (56 p, 85 n), Kr-92 (36 p, 56 n) und 3 freie Neutronen. Die Spaltprodukte fliegen auseinander. Bewegungsenergie wird im Material zu Wärme. Freie Neutronen können weitere Spaltungen auslösen. Aber: Ba-141 und Kr-92 haben zu viele Neutronen – sie sind radioaktiv.',
    '1. β⁻-Zerfall: Im Kern wandelt sich ein Neutron in ein Proton um, ein Elektron e⁻ wird ausgesandt. A bleibt gleich, Z steigt um 1. Ba-141 → La-141 (Halbwertszeit von Ba-141 ≈ 18 min), Kr-92 → Rb-92 (Halbwertszeit von Kr-92 ≈ 1,8 s).',
    '2. β⁻-Zerfall: La-141 → Ce-141 (≈ 3,9 h) und Rb-92 → Sr-92 (≈ 4,5 s). Die Massenzahlen bleiben 141 und 92, die Kernladungszahlen steigen auf 58 und 38. Beide Kerne sind weiterhin radioaktiv.',
    '3. β⁻-Zerfall: Ce-141 → Pr-141 (≈ 32,5 Tage). Pr-141 ist stabil – die Barium-Reihe ist zu Ende. Sr-92 → Y-92 (≈ 2,7 h): Y-92 ist noch radioaktiv.',
    '4. β⁻-Zerfall: Y-92 → Zr-92 (≈ 3,5 h). Zr-92 ist stabil. Nach 3 + 4 = 7 β⁻-Zerfällen sind aus Ba-141 und Kr-92 die stabilen Kerne Pr-141 und Zr-92 geworden: Von diesem Spaltungsweg bleibt kein radioaktives Material übrig.'
  ];
  const fissionStepLabels = ['Neutron trifft U-235', 'U-236* entsteht', 'Spaltung', '1. β⁻-Zerfall', '2. β⁻-Zerfall', '3. β⁻-Zerfall', '4. β⁻ · stabil'];
  function decayChainDrawing(stage) {
    let drawing = '<defs><marker id="decay-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#4a6d88"/></marker></defs>';
    let emitted = 0;
    fissionDecayChains.forEach((chain, row) => {
      const cy = row === 0 ? 120 : 290;
      const last = Math.min(stage, chain.nuclides.length - 1);
      drawing += `<text x="20" y="${cy - 78}" font-size="18" font-weight="700">${chain.title}</text>`;
      chain.nuclides.slice(0, last + 1).forEach((nuclide, index) => {
        const cx = 80 + index * 160;
        const stable = nuclide.halfLife === null;
        const current = index === last;
        const [fill, stroke] = !current ? ['#eef1f5', '#9aa7b4'] : stable ? ['#dcefdf', '#2f7a4a'] : ['#fde6cf', '#b8641d'];
        drawing += `<g data-nuclide="${nuclide.symbol}-${nuclide.mass}" data-stable="${stable}" data-current="${current}">`;
        drawing += `<rect x="${cx - 55}" y="${cy - 45}" width="110" height="90" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="${current ? 4 : 2}"/>`;
        drawing += text(cx, cy - 12, `${nuclide.symbol}-${nuclide.mass}`, 22) + text(cx, cy + 11, `Z = ${nuclide.charge} · N = ${nuclide.mass - nuclide.charge}`, 14);
        drawing += text(cx, cy + 33, stable ? 'stabil ✓' : current ? 'radioaktiv' : 'umgewandelt', 14) + '</g>';
        if (index > 0) {
          const parent = chain.nuclides[index - 1];
          const mid = cx - 80;
          emitted++;
          drawing += `<path d="M ${mid - 22} ${cy} H ${mid + 20}" stroke="#4a6d88" stroke-width="3" fill="none" marker-end="url(#decay-arrow)"/>`;
          drawing += `<g data-emitted-electron="true">${circle(mid, cy - 34, 9, '#92c5ed', '−')}</g>` + text(mid, cy - 50, 'β⁻', 15) + text(mid, cy + 24, parent.halfLife, 12);
        }
      });
    });
    drawing += text(400, 390, `${emitted} β⁻-Zerfälle bisher · A bleibt gleich, Z steigt je Zerfall um 1`, 17);
    drawing += text(400, 414, 'Orange: noch radioaktiv · Grün: stabil · Grau: schon umgewandelt · Zahl unter dem Pfeil: Halbwertszeit', 13);
    return drawing;
  }
  function fissionDrawing(step) {
    if (!Number.isInteger(step) || step < 0 || step >= fissionCaptions.length) throw new RangeError('Unbekannter Spaltungsschritt.');
    if (step >= 3) return svg(decayChainDrawing(step - 2), fissionCaptions[step], 800, 425);
    let drawing = '<defs><marker id="fission-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#4a6d88"/></marker></defs>';
    const arrow = (path) => `<path d="${path}" stroke="#4a6d88" stroke-width="3" fill="none" marker-end="url(#fission-arrow)"/>`;
    const neutron = (x, y) => `<g data-free-neutron="true">${circle(x, y, 12, '#9dc7b2', 'n')}</g>`;
    if (step === 0) {
      drawing += neutron(140, 170) + arrow('M 163 170 H 345') + nucleusCloud(455, 170, fissionReaction.target);
      drawing += text(140, 220, 'n: 1 Neutron', 19) + text(455, 280, 'U-235 · 92 p⁺ + 143 n', 21);
    } else if (step === 1) {
      drawing += nucleusCloud(400, 170, fissionReaction.excited, 1.5);
      drawing += text(400, 295, 'U-236* · angeregt und verformt', 23) + text(400, 327, '92 p⁺ + 144 n', 20);
    } else {
      drawing += nucleusCloud(200, 170, fissionReaction.products[0]) + nucleusCloud(580, 170, fissionReaction.products[1]);
      [[390, 80], [365, 170], [395, 265]].forEach(([x, y]) => { drawing += neutron(x, y); });
      drawing += arrow('M 125 170 H 65') + arrow('M 645 170 H 720') + arrow('M 390 60 L 405 25') + arrow('M 370 170 H 445') + arrow('M 400 282 L 425 320');
      drawing += text(200, 280, 'Ba-141', 23) + text(200, 310, '56 p⁺ + 85 n', 19);
      drawing += text(580, 280, 'Kr-92', 23) + text(580, 310, '36 p⁺ + 56 n', 19);
      drawing += text(390, 365, '3 freie Neutronen · Spaltprodukte bewegen sich auseinander', 19);
    }
    drawing += text(400, 400, 'Orange: Protonen · Grün: Neutronen · schematische Kernbilder', 16);
    return svg(drawing, fissionCaptions[step], 800, 425);
  }

  const chainTreeCaptions = [
    'Generation g = 0: Ein Neutron spaltet einen U-235-Kern. Dabei werden im Idealfall 3 Neutronen frei. Sie fliegen zu drei weiteren U-235-Kernen.',
    'Generation g = 1: 3 Spaltungen. Jede setzt wieder 3 Neutronen frei: 3 · 3 = 9 Neutronen fliegen zu neuen Kernen.',
    'Generation g = 2: 9 Spaltungen. 9 · 3 = 27 neue Neutronen. Der Zuwachs wird selbst immer größer.',
    'Generation g = 3: 27 Spaltungen, insgesamt schon 1 + 3 + 9 + 27 = 40. Als Nächstes könnten 81 Spaltungen folgen: N(g) = 3^g – exponentielles Wachstum.',
    'Vergleich Kraftwerk: Auch hier entstehen pro Spaltung 2 bis 3 Neutronen. Regelstäbe und Material nehmen einen Teil auf, andere entweichen. Nur im Mittel 1 Neutron löst die nächste Spaltung aus: 1 → 1 → 1 → 1, die Kettenreaktion bleibt gleichmäßig.'
  ];
  const chainStepLabels = ['g = 0 · 1', 'g = 1 · 3', 'g = 2 · 9', 'g = 3 · 27', 'Kraftwerk: Faktor 1'];
  function splitNucleus(x, y, radius, generation) {
    return `<g data-fission="${generation}"><circle cx="${x}" cy="${y}" r="${radius * 1.25}" fill="#ffe9a8"/><circle cx="${x - radius * 0.45}" cy="${y}" r="${radius * 0.6}" fill="#8264af"/><circle cx="${x + radius * 0.5}" cy="${y}" r="${radius * 0.5}" fill="#b59ad6"/></g>`;
  }
  function waitingNucleus(x, y, radius) {
    return `<circle data-waiting="true" cx="${x}" cy="${y}" r="${radius}" fill="#e9e0f3" stroke="#78618f" stroke-width="2"/>`;
  }
  function neutronPath(x1, y1, x2, y2, extra = '') {
    return `<path d="M ${x1} ${y1} L ${x2} ${y2}" stroke="#3f8f6b" stroke-width="2" fill="none"${extra}/><circle data-neutron="true" cx="${(x1 + x2) / 2}" cy="${(y1 + y2) / 2}" r="4" fill="#3f8f6b"/>`;
  }
  function chainTreeDrawing(step) {
    if (!Number.isInteger(step) || step < 0 || step >= chainTreeCaptions.length) throw new RangeError('Unbekannter Kettenschritt.');
    const rows = [60, 150, 240, 330];
    const radii = [18, 14, 11, 8];
    let drawing = '';
    if (step === 4) {
      rows.forEach((y, g) => {
        drawing += anchoredText(20, y + 5, `g = ${g} · 1 Spaltung`, 16, 'start', 700) + splitNucleus(450, y, 16, g);
        drawing += `<path d="M 432 ${y + 8} L 270 ${y + 40}" stroke="#7d8996" stroke-width="2" fill="none"/>${circle(270, y + 40, 6, '#7d8996')}`;
        drawing += `<path d="M 468 ${y + 8} L 640 ${y + 40}" stroke="#3f8f6b" stroke-width="2" stroke-dasharray="5 4" fill="none"/>${circle(640, y + 40, 5, '#3f8f6b')}`;
        if (g < 3) drawing += neutronPath(450, y + 18, 450, rows[g + 1] - 18);
      });
      drawing += `<rect x="242" y="40" width="22" height="340" rx="4" fill="#4b5563"/>` + anchoredText(140, 395, 'absorbiert (z. B. Regelstab)', 14);
      drawing += anchoredText(600, 395, 'entweicht aus dem Kern', 14) + anchoredText(700, 230, 'Faktor 1:', 17, 'start', 700) + anchoredText(700, 252, '1 → 1 → 1 → 1', 17);
    } else {
      for (let g = 0; g <= Math.min(step + 1, 3); g++) {
        const count = 3 ** g;
        const spacing = 730 / count;
        drawing += anchoredText(15, rows[g] + 5, g <= step ? `g = ${g}: ${count}` : `g = ${g}: wartet`, 16, 'start', 700);
        for (let i = 0; i < count; i++) {
          const x = 150 + (i + 0.5) * spacing;
          if (g > 0) {
            const parentX = 150 + (Math.floor(i / 3) + 0.5) * spacing * 3;
            drawing += neutronPath(parentX, rows[g - 1] + radii[g - 1], x, rows[g] - radii[g], g > step ? ' stroke-dasharray="5 4"' : '');
          }
          drawing += g <= step ? splitNucleus(x, rows[g], radii[g], g) : waitingNucleus(x, rows[g], radii[g]);
        }
      }
      const total = idealChain(step + 1).reduce((sum, value) => sum + value, 0);
      if (step === 3) drawing += text(515, 375, '→ 81 freie Neutronen für g = 4', 16);
      drawing += text(450, 405, `Spaltungen in g = ${step}: 3<tspan baseline-shift="super" font-size="12">${step}</tspan> = ${3 ** step} · insgesamt bisher ${total}`, 18);
    }
    drawing += text(450, 430, 'Gelb-violett: gespaltener Kern · hell: wartender U-235-Kern · grün: Neutron', 14);
    return svg(drawing, chainTreeCaptions[step], 900, 440);
  }

  const bombSteps = {
    gun: ['Aufbau: Zwei Teilmassen aus spaltbarem Material liegen getrennt. Jede ist für sich unterkritisch: Zu viele Neutronen entweichen, eine Kettenreaktion kann nicht anwachsen.',
      'Zündung: Konventioneller Sprengstoff schiebt eine Teilmasse sehr schnell auf die andere. Zusammen ist die Anordnung überkritisch.',
      'Kettenreaktion: Jede Spaltung löst im Mittel mehr als eine weitere aus (1 → 3 → 9 → …). In Bruchteilen einer Sekunde finden extrem viele Spaltungen statt.',
      'Folgen: Lichtblitz und Hitze, Druckwelle, ionisierende Strahlung und radioaktiver Fallout. So wurde Hiroshima am 6. August 1945 zerstört.'],
    implosion: ['Aufbau: Eine Kugel aus spaltbarem Material ist von konventionellem Sprengstoff umgeben. In diesem Zustand ist sie unterkritisch.',
      'Zündung: Der Sprengstoff zündet ringsum gleichzeitig. Die Druckwelle läuft nach innen und presst die Kugel zusammen: höhere Dichte → überkritisch.',
      'Kettenreaktion: In der dicht gepressten Kugel lösen Neutronen immer mehr Spaltungen aus – unkontrolliert und extrem schnell.',
      'Folgen: Lichtblitz und Hitze, Druckwelle, ionisierende Strahlung und radioaktiver Fallout. Nach diesem Prinzip wurde Nagasaki am 9. August 1945 zerstört.'],
    hydrogen: ['Aufbau: Zwei Stufen in einer Hülle. Stufe 1 ist eine Spaltungsbombe. Stufe 2 enthält Fusionsstoff mit schweren Wasserstoff-Isotopen (Deuterium, Tritium).',
      'Zündung Stufe 1: Die Spaltungsbombe explodiert wie eine Atombombe. Nur so entstehen die nötigen extremen Bedingungen.',
      'Übergang: Strahlung und Hitze der ersten Stufe pressen und erhitzen den Fusionsstoff auf viele Millionen Grad – ähnlich wie im Inneren der Sonne.',
      'Fusion: Wasserstoffkerne verschmelzen, z. B. ²H + ³H → ⁴He + n + Energie. Die Sprengkraft kann ein Vielfaches einer Spaltungsbombe betragen. Eine Wasserstoffbombe wurde nie im Krieg eingesetzt, aber vielfach getestet.']
  };
  const bombStepLabels = { gun: ['Aufbau', 'Zündung', 'Kettenreaktion', 'Folgen'], implosion: ['Aufbau', 'Zündung', 'Kettenreaktion', 'Folgen'], hydrogen: ['Aufbau', 'Stufe 1 zündet', 'Strahlung & Hitze', 'Fusion'] };
  function burst(cx, cy, radius, rays = 12) {
    let drawing = `<g data-burst="true"><circle cx="${cx}" cy="${cy}" r="${radius}" fill="#ffd35c" opacity=".85"/><circle cx="${cx}" cy="${cy}" r="${radius * 0.55}" fill="#fff4c2"/>`;
    for (let i = 0; i < rays; i++) {
      const angle = 2 * Math.PI * i / rays;
      drawing += `<path d="M ${cx + Math.cos(angle) * radius * 1.05} ${cy + Math.sin(angle) * radius * 1.05} L ${cx + Math.cos(angle) * radius * 1.35} ${cy + Math.sin(angle) * radius * 1.35}" stroke="#e08a1e" stroke-width="3" fill="none"/>`;
    }
    return drawing + '</g>';
  }
  function chainSparks(cx, cy, spread) {
    let drawing = '';
    [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.3], [0, 1.3], [-1.3, 0], [1.3, 0]].forEach(([dx, dy]) => {
      drawing += `<path d="M ${cx} ${cy} L ${cx + dx * spread} ${cy + dy * spread}" stroke="#3f8f6b" stroke-width="2" fill="none"/>${circle(cx + dx * spread, cy + dy * spread, 5, '#3f8f6b')}`;
    });
    return drawing;
  }
  function consequences(cx, cy) {
    let drawing = burst(cx, cy, 105, 16);
    [['Lichtblitz und Hitze', cx - 250, cy - 95], ['Druckwelle', cx + 250, cy - 95], ['ionisierende Strahlung', cx - 250, cy + 105], ['radioaktiver Fallout', cx + 250, cy + 105]].forEach(([label, x, y]) => {
      drawing += `<g data-consequence="true"><rect x="${x - 95}" y="${y - 22}" width="190" height="36" rx="18" fill="#fff" stroke="#8b3434" stroke-width="2"/>${text(x, y + 2, label, 16)}</g>`;
    });
    return drawing + `<circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="#8b3434" stroke-width="3" stroke-dasharray="10 8"/>`;
  }
  function bombDrawing(type, step) {
    if (!Object.hasOwn(bombSteps, type) || !Number.isInteger(step) || step < 0 || step > 3) throw new RangeError('Unbekanntes Bombenschema.');
    const purple = '#8264af';
    const explosive = '#e2894f';
    const arrowId = `bomb-arrow-${type}`;
    const arrowEnd = ` marker-end="url(#${arrowId})"`;
    let drawing = `<defs><marker id="${arrowId}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M 0 0 L 8 4 L 0 8 Z" fill="#4a6d88"/></marker></defs>`;
    if (type === 'gun') {
      drawing += '<rect x="60" y="120" width="680" height="110" rx="50" fill="#e7ebf0" stroke="#53647a" stroke-width="3"/>' + text(400, 105, 'Hülle', 15);
      if (step === 3) drawing += consequences(400, 175);
      else {
        drawing += step === 0 ? `<rect x="90" y="140" width="60" height="70" rx="6" fill="${explosive}"/>` : burst(120, 175, 32);
        drawing += text(120, 260, 'Sprengstoff', 15);
        const leftX = step === 0 ? 170 : 520;
        drawing += `<rect data-part="mass" x="${leftX}" y="140" width="80" height="70" rx="8" fill="${purple}"/><rect data-part="mass" x="600" y="140" width="80" height="70" rx="8" fill="${purple}"/>`;
        if (step === 0) {
          drawing += text(210, 260, 'Teilmasse 1', 15) + text(640, 260, 'Teilmasse 2', 15) + text(420, 182, 'getrennt → unterkritisch', 17);
        } else {
          drawing += `<path d="M 180 175 H 505" stroke="#4a6d88" stroke-width="3" stroke-dasharray="8 6" fill="none"${arrowEnd}/>` + text(340, 165, 'sehr schnell zusammengeschoben', 16);
          drawing += text(600, 260, 'zusammen → überkritisch', 16);
          if (step === 2) drawing += `<circle cx="600" cy="175" r="55" fill="#ffe9a8" opacity=".7"/>` + chainSparks(600, 175, 40) + text(600, 300, 'Kettenreaktion: 1 → 3 → 9 → 27 → …', 17);
        }
      }
    } else if (type === 'implosion') {
      drawing += `<circle cx="400" cy="175" r="150" fill="#e7ebf0" stroke="#53647a" stroke-width="3"/>`;
      if (step === 3) drawing += consequences(400, 175);
      else {
        for (let i = 0; i < 12; i++) {
          const angle = 2 * Math.PI * i / 12;
          const x = 400 + Math.cos(angle) * 115;
          const y = 175 + Math.sin(angle) * 115;
          drawing += step === 0 ? `<circle data-part="explosive" cx="${x}" cy="${y}" r="26" fill="${explosive}"/>` : burst(x, y, 16, 6);
          if (step >= 1) drawing += `<path d="M ${400 + Math.cos(angle) * 92} ${175 + Math.sin(angle) * 92} L ${400 + Math.cos(angle) * 62} ${175 + Math.sin(angle) * 62}" stroke="#4a6d88" stroke-width="3" fill="none"${arrowEnd}/>`;
        }
        const radius = step === 0 ? 55 : 36;
        drawing += `<circle data-part="core" cx="400" cy="175" r="${radius}" fill="${step === 0 ? purple : '#5b3f8a'}"/>`;
        if (step === 2) drawing += chainSparks(400, 175, 26);
        drawing += step === 0 ? text(660, 120, 'Sprengstoff ringsum', 16) + text(660, 230, 'Kugel: unterkritisch', 16)
          : step === 1 ? text(660, 120, 'Druck von allen Seiten', 16) + text(660, 230, 'dichter → überkritisch', 16)
          : text(660, 175, 'Kettenreaktion', 17);
      }
    } else {
      drawing += '<rect x="40" y="95" width="720" height="170" rx="70" fill="#e7ebf0" stroke="#53647a" stroke-width="3"/>' + text(400, 82, 'Hülle', 15);
      const squeezed = step >= 2;
      if (step >= 1) drawing += burst(185, 180, 58);
      else drawing += `<circle data-part="primary" cx="185" cy="180" r="55" fill="${purple}"/>`;
      drawing += `<rect data-part="secondary" x="360" y="${squeezed ? 150 : 125}" width="340" height="${squeezed ? 60 : 110}" rx="${squeezed ? 28 : 45}" fill="${step === 3 ? '#ffd35c' : squeezed ? '#f5c98a' : '#bfe3f0'}" stroke="#2c6d8f" stroke-width="2"/>`;
      if (step >= 2) {
        [[250, 135, 350, 140, 300, 110], [250, 225, 350, 220, 300, 250], [262, 180, 350, 180, 306, 180]].forEach(([x1, y1, x2, y2, cx, cy]) => {
          drawing += `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="#e08a1e" stroke-width="4" fill="none"${arrowEnd}/>`;
        });
        [450, 530, 610].forEach(x => { drawing += `<path d="M ${x} 108 V 142" stroke="#4a6d88" stroke-width="3" fill="none"${arrowEnd}/><path d="M ${x} 252 V 218" stroke="#4a6d88" stroke-width="3" fill="none"${arrowEnd}/>`; });
      }
      if (step === 3) drawing += burst(530, 180, 70, 14) + '<rect x="440" y="162" width="180" height="34" rx="17" fill="#fff" stroke="#e08a1e"/>' + text(530, 186, '²H + ³H → ⁴He + n', 18);
      drawing += text(185, 295, 'Stufe 1: Spaltung', 16) + text(530, 295, step === 3 ? 'Stufe 2: Fusion setzt riesige Energie frei' : 'Stufe 2: Fusionsstoff (²H, ³H)', 16);
      if (step === 0) drawing += text(530, 186, 'Deuterium, Tritium', 16);
      if (step === 2) drawing += text(530, 186, 'gepresst und erhitzt', 16);
    }
    drawing += text(400, 345, 'Stark vereinfachtes Prinzipbild – keine Maße, Mengen oder Bauanleitung', 14);
    return svg(drawing, bombSteps[type][step], 800, 360);
  }

  const decayHeatShare = 5;
  const plantEfficiency = 0.33;
  function reactorState(insertion) {
    if (!Number.isFinite(insertion) || insertion < 0 || insertion > 100) {
      throw new RangeError('Die Regelstabstellung muss zwischen 0 und 100 Prozent liegen.');
    }
    const fissionRate = 100 - insertion;
    const heat = Math.round(decayHeatShare + (100 - decayHeatShare) * fissionRate / 100);
    const electric = fissionRate > 0 ? Math.round(heat * plantEfficiency) : 0;
    const waste = heat - electric;
    return {
      insertion, fissionRate, heat, electric, waste,
      turbineRunning: electric > 0,
      hotLegTemp: Math.round(292 + 34 * heat / 100),
      coldLegTemp: 292,
      coolingOutTemp: Math.round(20 + 10 * waste / 67)
    };
  }
  function mixColor(from, to, share) {
    const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    const [a, b] = [channels(from), channels(to)];
    return `rgb(${a.map((value, i) => Math.round(value + (b[i] - value) * share)).join(',')})`;
  }
  function flowDuration(share) {
    return share > 0 ? Math.min(12, 1.1 / share).toFixed(2) : 0;
  }
  function pipe(path, color, width, share, marker = '') {
    const duration = flowDuration(share);
    let content = `<path d="${path}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linejoin="round"${marker ? ` marker-end="url(#${marker})"` : ''}/>`;
    if (duration) content += `<path class="flow" style="--flow-duration:${duration}s" d="${path}" stroke="#ffffff" stroke-opacity=".75" stroke-width="${Math.max(1.5, width / 3)}" fill="none" stroke-linejoin="round"/>`;
    return content;
  }
  function anchoredText(x, y, value, size = 13, anchor = 'start', weight = 400) {
    return `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" font-weight="${weight}">${value}</text>`;
  }
  function stepBadge(x, y, number) {
    return `<g data-heat-step="${number}"><circle cx="${x}" cy="${y}" r="11" fill="#1f4e79" stroke="#ffffff" stroke-width="2"/><text x="${x}" y="${y + 4.5}" font-size="13" text-anchor="middle" font-weight="700" style="fill:#ffffff">${number}</text></g>`;
  }
  function reactorDrawing(state) {
    const heatShare = state.heat / 100;
    const electricShare = state.electric / 100 / plantEfficiency;
    const wasteShare = state.waste / 67;
    const hotColor = mixColor('#f0b48a', '#d0312d', heatShare);
    const coldColor = mixColor('#f3c9a8', '#e0794a', heatShare);
    const steamColor = mixColor('#d7dde2', '#8e9cab', heatShare);
    let content = `<defs>
      <marker id="arrow-heat" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#d0312d"/></marker>
      <radialGradient id="core-glow"><stop offset="0" stop-color="#ffd166" stop-opacity="${(0.2 + 0.8 * heatShare).toFixed(2)}"/><stop offset="1" stop-color="#f07a2a" stop-opacity="0"/></radialGradient>
    </defs>`;
    content += '<path d="M 20 380 V 160 A 147.5 105 0 0 1 315 160 V 380 Z" fill="#eef3f7" stroke="#8fa3b5" stroke-width="4"/>';
    content += anchoredText(167, 68, 'Sicherheitsbehälter', 12, 'middle');
    content += '<rect x="340" y="120" width="285" height="260" rx="6" fill="#f6f3ec" stroke="#b5aa94" stroke-width="2"/>';
    content += anchoredText(482, 140, 'Maschinenhaus', 12, 'middle');
    content += '<path d="M 10 381 H 750" stroke="#9fb0bf" stroke-width="2"/>';

    content += pipe('M 245 100 V 82 H 360 V 190 H 376', steamColor, 4 + 6 * heatShare, state.turbineRunning ? heatShare : 0);
    content += anchoredText(300, 74, state.turbineRunning ? 'Dampf ca. 280 °C' : 'kein Dampf zur Turbine', 11, 'middle');
    content += pipe('M 440 226 V 282', steamColor, 4 + 4 * heatShare, state.turbineRunning ? heatShare : 0);
    if (!state.turbineRunning) {
      content += `<g data-cooling-bypass="true">${pipe('M 245 100 V 82 H 360 V 264 H 410 V 282', '#d58b57', 4, heatShare)}</g>`;
      content += anchoredText(305, 258, 'Restwärme →', 11, 'middle');
    }
    content += pipe('M 380 330 H 356 V 362 H 296 V 320 H 275', '#3f86c4', 5, heatShare);
    content += '<circle cx="328" cy="362" r="8" fill="#ffffff" stroke="#3f86c4" stroke-width="3"/>';

    content += pipe('M 170 175 H 219', hotColor, 9, heatShare);
    content += pipe('M 219 305 H 170', coldColor, 9, heatShare);
    content += '<circle cx="194" cy="305" r="10" fill="#ffffff" stroke="#8a5a44" stroke-width="3"/><path d="M 189 305 L 199 300 V 310 Z" fill="#8a5a44"/>';
    content += anchoredText(193, 194, `${state.hotLegTemp} °C`, 11, 'middle');
    content += anchoredText(193, 330, `${state.coldLegTemp} °C`, 11, 'middle');

    content += '<rect x="215" y="100" width="60" height="240" rx="26" fill="#f6efe6" stroke="#8a7458" stroke-width="3"/>';
    content += '<rect x="219" y="104" width="52" height="62" rx="22" fill="#e3e8ec"/>';
    content += '<rect x="219" y="165" width="52" height="171" rx="4" fill="#a9d3ee" fill-opacity=".75"/>';
    content += pipe('M 219 175 L 266 190 L 224 205 L 266 220 L 224 235 L 266 250 L 224 265 L 266 280 L 224 295 L 219 305', hotColor, 4, heatShare);
    const bubbleCount = state.fissionRate > 0 ? Math.round(2 + 10 * heatShare) : 1;
    for (let i = 0; i < bubbleCount; i++) {
      const x = 225 + ((i * 0.618) % 1) * 40;
      const y = 180 + ((i * 0.382 + 0.2) % 1) * 140;
      content += `<circle class="bubble" style="animation-delay:-${(i * 0.37).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#ffffff" stroke="#6aa6cf"/>`;
    }

    content += '<rect x="72" y="98" width="86" height="26" rx="4" fill="#7d8c99"/>';
    content += anchoredText(115, 92, 'Regelstab-Antriebe', 11, 'middle');
    content += '<rect x="60" y="124" width="110" height="216" rx="36" fill="#dfe7ee" stroke="#4e6375" stroke-width="4"/>';
    content += '<rect x="68" y="140" width="94" height="192" rx="26" fill="#cfe6f5"/>';
    content += '<ellipse cx="116" cy="273" rx="70" ry="66" fill="url(#core-glow)"/>';
    content += `<rect data-core="true" x="74" y="226" width="84" height="94" rx="4" fill="${mixColor('#f8e6cc', '#f2832f', heatShare)}" stroke="#b5651d"/>`;
    for (let i = 0; i < 7; i++) content += `<rect data-fuel="true" x="${78 + i * 12}" y="230" width="5" height="86" rx="2" fill="#a2561c"/>`;
    const rodTop = 112;
    const rodLength = 222 - rodTop + 94 * state.insertion / 100;
    [84.5, 108.5, 132.5].forEach(x => {
      content += `<rect data-rod="true" x="${x}" y="${rodTop}" width="5" height="${rodLength.toFixed(1)}" fill="#2f3f4f"/>`;
    });
    const neutronCount = state.fissionRate > 0 ? Math.round(2 + 16 * state.fissionRate / 100) : 0;
    for (let i = 0; i < neutronCount; i++) {
      const x = 80 + ((i * 0.7549 + 0.1) % 1) * 72;
      const y = 234 + ((i * 0.5698 + 0.3) % 1) * 78;
      content += `<circle data-neutron="true" class="neutron" style="animation-delay:-${(i * 0.23).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="#1d6fb8" stroke="#ffffff" stroke-width=".8"/>`;
    }
    content += `<path data-core-heat="true" d="M 116 222 V 190" stroke="${hotColor}" stroke-width="${1 + 2 * heatShare}" marker-end="url(#arrow-heat)"/>`;
    content += anchoredText(115, 356, 'Reaktordruck-', 12, 'middle') + anchoredText(115, 370, 'behälter', 12, 'middle');
    content += anchoredText(245, 356, 'Dampf-', 12, 'middle') + anchoredText(245, 370, 'erzeuger', 12, 'middle');

    const turbineDuration = state.turbineRunning ? Math.min(6, 0.35 / electricShare).toFixed(2) : 0;
    const spinStyle = turbineDuration ? ` class="spin" style="--spin-duration:${turbineDuration}s"` : '';
    content += '<polygon points="378,172 458,152 458,228 378,208" fill="#a9bccd" stroke="#4f6478" stroke-width="3"/>';
    content += `<g${spinStyle}>${[0, 30, 60, 90, 120, 150].map(angle => {
      const dx = Math.cos(angle * Math.PI / 180) * 26;
      const dy = Math.sin(angle * Math.PI / 180) * 26;
      return `<line x1="${(418 - dx).toFixed(1)}" y1="${(190 - dy).toFixed(1)}" x2="${(418 + dx).toFixed(1)}" y2="${(190 + dy).toFixed(1)}" stroke="#4f6478" stroke-width="3"/>`;
    }).join('')}</g>`;
    content += anchoredText(404, 250, 'Turbine', 13, 'middle');
    content += '<path d="M 458 190 H 515" stroke="#6b7785" stroke-width="6"/>';
    content += `<circle cx="545" cy="190" r="30" fill="${mixColor('#e3ece4', '#8fd19e', electricShare)}" stroke="#39794c" stroke-width="3"/>`;
    content += `<g${spinStyle}><rect x="531" y="184" width="28" height="12" rx="3" fill="#39794c"/></g>`;
    content += anchoredText(545, 240, 'Generator', 13, 'middle');
    content += pipe('M 545 160 V 52 H 612', state.turbineRunning ? '#e0a800' : '#c7ccd1', 2 + 5 * electricShare, state.turbineRunning ? electricShare : 0);
    content += anchoredText(578, 44, state.turbineRunning ? `Strom ≈ ${state.electric} %` : 'kein Strom', 12, 'middle', 700);
    content += '<path d="M 608 118 L 620 30 L 632 118 M 604 52 H 636 M 608 74 H 632 M 612 90 L 628 110 M 628 90 L 612 110" stroke="#59636e" stroke-width="2" fill="none"/>';
    content += anchoredText(660, 30, 'Netz', 12, 'middle');

    content += '<rect x="380" y="282" width="110" height="58" rx="8" fill="#d6e9f2" stroke="#6c93aa" stroke-width="2"/>';
    [298, 311, 324].forEach(y => { content += `<path d="M 384 ${y} H 486" stroke="#2f9c9c" stroke-width="3"/>`; });
    content += anchoredText(435, 358, 'Kondensator', 12, 'middle');
    content += anchoredText(328, 352, 'Pumpe', 10, 'middle');

    content += pipe('M 490 298 H 668', mixColor('#56b3b3', '#e0794a', wasteShare), 6, wasteShare);
    content += pipe('M 668 350 H 500 V 324 H 490', '#2f9c9c', 6, wasteShare);
    content += anchoredText(578, 292, `Kühlwasser ca. ${state.coolingOutTemp} °C`, 11, 'middle');
    content += anchoredText(578, 368, 'zurück ca. 20 °C', 11, 'middle');
    content += '<path d="M 650 380 Q 672 300 660 225 L 720 225 Q 708 300 730 380 Z" fill="#dfe3e6" stroke="#7d8790" stroke-width="3"/>';
    content += anchoredText(690, 280, 'Kühlturm', 12, 'middle');
    [[690, 205, 1], [672, 185, 0.8], [708, 175, 0.7]].forEach(([x, y, scale], i) => {
      const radius = (6 + 20 * wasteShare) * scale;
      content += `<ellipse class="plume" style="animation-delay:-${i}s" cx="${x}" cy="${y - 12 * wasteShare}" rx="${radius.toFixed(1)}" ry="${(radius * 0.7).toFixed(1)}" fill="#ffffff" fill-opacity="${(0.35 + 0.5 * wasteShare).toFixed(2)}" stroke="#c3ccd4"/>`;
    });

    [[40, 272, 1], [194, 155, 2], [245, 135, 3], [418, 136, 4], [545, 128, 5], [396, 270, 6], [690, 248, 7]]
      .forEach(([x, y, number]) => { content += stepBadge(x, y, number); });

    [['Wärmeleistung', state.heat, '#e8873a'], ['Elektrische Leistung', state.electric, '#e0a800'], ['Abwärme', state.waste, '#c8553d']]
      .forEach(([name, value, color], i) => {
        const y = 392 + i * 24;
        content += anchoredText(20, y + 13, name, 13);
        content += `<rect x="170" y="${y}" width="520" height="16" rx="4" fill="#e6ebf0"/>`;
        content += `<rect data-energy="${name}" x="170" y="${y}" width="${(5.2 * value).toFixed(1)}" height="16" rx="4" fill="${color}"/>`;
        content += anchoredText(700, y + 13, `${value} %`, 13, 'start', 700);
      });

    const label = `Druckwasserreaktor, Regelstäbe ${state.insertion} Prozent eingefahren. Modellwerte: Spaltrate ${state.fissionRate} Prozent, Wärmeleistung ${state.heat} Prozent, elektrische Leistung ${state.electric} Prozent, Abwärme ${state.waste} Prozent. Wärmeweg: Reaktorkern, Primärkreis, Dampferzeuger, Turbine, Generator, Kondensator, Kühlturm.`;
    return svg(content, label, 760, 470);
  }
  function reactorSummary(state) {
    const chain = `Regelstäbe ${state.insertion} % eingefahren → Spaltrate ≈ ${state.fissionRate} % → Wärmeleistung ≈ ${state.heat} % → Strom ≈ ${state.electric} % + Abwärme ≈ ${state.waste} %.`;
    if (state.fissionRate === 0) return `${chain} Die Kettenreaktion ist gestoppt, die Turbine steht. Der orange Kühlweg führt die Nachzerfallswärme an der Turbine vorbei ab (vereinfacht).`;
    if (state.insertion === 0) return `${chain} Stäbe ganz herausgezogen: Die Stäbe absorbieren kaum Neutronen, im Modell entsteht die meiste Wärme.`;
    return `${chain} Je tiefer die Stäbe, desto mehr Neutronen werden absorbiert und desto weniger Wärme entsteht.`;
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
      const requested = location.hash.slice(1);
      const id = tabs.some(tab => tab.dataset.tab === requested) ? requested : 'station1';
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
      if (key === 'bohr') {
        $('#model-picture').innerHTML = atomDrawing(atomInfo(11, 12, 11));
        $('#model-caption').textContent = 'Beispiel Natrium-23 im Bohr-Schalenbild: K = 2, L = 8, M = 1. Die Kreise bedeuten Energieniveaus, keine wirklichen Planetenbahnen.';
        return;
      }
      if (key === 'rutherford') {
        drawing = '<circle cx="300" cy="140" r="100" fill="#e0eefa" stroke="#779ab5" stroke-dasharray="6 5"/>';
        drawing += circle(300, 140, 16, '#c1addf', '+');
        drawing += circle(200, 140, 10, '#9dcbed', '−') + circle(400, 140, 10, '#9dcbed', '−');
        drawing += text(300, 265, 'Positiver Kern · negative Hülle');
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
      $('#shell-description').textContent = info ? `Schalenbesetzung von innen nach außen: ${shellDistribution(info.electrons).map((count, index) => `${['K', 'L', 'M', 'N'][index]} = ${count}`).join(' · ')}` : '';
      if (!info) return;
      $('#builder-picture').innerHTML = atomDrawing(info);
      $('#builder-hint').textContent = info.charge === 0
        ? 'Neutral: gleich viele Protonen wie Elektronen. Ändere nur die Neutronenzahl, um ein anderes Isotop desselben Elements zu bilden.'
        : `Ion: ${info.charge > 0 ? 'Es fehlen' : 'Es gibt zusätzlich'} ${Math.abs(info.charge)} Elektronen im Vergleich zum neutralen Atom. Die Protonenzahl bestimmt weiterhin das Element.`;
    }
    particleInputs.forEach(input => input.addEventListener('input', updateBuilder));
    const atomPresets = { carbon: [6, 6, 6], sodium: [11, 12, 11], calcium: [20, 20, 20] };
    document.querySelectorAll('[data-atom]').forEach(button => button.addEventListener('click', () => {
      atomPresets[button.dataset.atom].forEach((value, index) => { particleInputs[index].value = value; });
      updateBuilder();
    }));
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

    function updateShield() {
      const key = $('#shield').value;
      $('#shield-picture').innerHTML = shieldDrawing(key);
      $('#shield-result').textContent = shieldDescriptions[key];
    }
    $('#shield').addEventListener('change', updateShield);
    updateShield();
    function updateExposure() {
      const distance = Number($('#distance').value);
      const duration = Number($('#duration').value);
      const relative = relativeExposure(distance, duration);
      $('#distance').setAttribute('aria-valuetext', `${distance} Meter`);
      $('#duration').setAttribute('aria-valuetext', `${duration} Minuten`);
      $('#distance-output').value = `${distance} m`;
      $('#duration-output').value = `${duration} min`;
      const count = (100 * relative).toLocaleString('de-DE', { maximumFractionDigits: 1 });
      const result = `Bei ${distance} m und ${duration} min: ${count} Modelltreffer erwartet, also ${count} % der Referenz. ${distance === 2 && duration === 1 ? '100 : 2² = 25: Nur ein Viertel gelangt auf die gleiche Messfläche.' : 'Vergleiche zuerst bei gleicher Zeit, danach bei gleichem Abstand.'}`;
      $('#exposure-result').textContent = result;
      const scale = 450 / Math.max(1, relative);
      $('#exposure-picture').innerHTML = svg(
        text(360, 30, 'Gleiche Messfläche · Vergleich mit 100 Modelltreffern', 18) +
        text(110, 93, 'Referenz 1 m / 1 min', 15) +
        `<rect x="225" y="65" width="${scale}" height="35" fill="#a3b4c5"/>` +
        text(110, 173, `${distance} m / ${duration} min`, 17) +
        `<rect x="225" y="145" width="${relative * scale}" height="35" fill="#7253a2"/>` +
        text(360, 235, `Grau: 100 · Violett: ${count} Modelltreffer`, 19), result, 730, 265);
    }
    ['distance', 'duration'].forEach(id => $(`#${id}`).addEventListener('input', updateExposure));
    updateExposure();

    let decayCounts = [];
    function renderDecay(newSample = true) {
      const halfLife = Number($('#half-life').value);
      const observedTime = Number($('#decay-time').value);
      $('#half-output').value = `${halfLife} s`;
      $('#decay-time-output').value = `${observedTime} s`;
      if (newSample) decayCounts = simulateDecay(200, halfLife, 24);
      const counts = decayCounts;
      const x = time => 70 + time / 24 * 650;
      const y = count => 270 - count / 200 * 200;
      let drawing = '<path d="M 70 50 V 270 H 730" stroke="#53647a" fill="none"/>';
      [0, 50, 100, 150, 200].forEach(count => {
        drawing += `<path d="M 70 ${y(count)} H 720" stroke="#cedbe8"/>${text(40, y(count) + 5, count, 16)}`;
      });
      for (let time = 0; time <= 24; time += 2) drawing += text(x(time), 295, time, 16);
      [1, 2].forEach(multiple => {
        const time = multiple * halfLife;
        const count = expectedRemaining(200, time, halfLife);
        drawing += `<path data-half-marker="${multiple}" d="M 70 ${y(count)} H ${x(time)} V 270" fill="none" stroke="#aa6a13" stroke-width="2" stroke-dasharray="4 4"/>`;
        drawing += text(x(time), 330 + (multiple === 1 ? 0 : 22), `${multiple === 1 ? 'T' : '2T'} = ${time} s`, 16);
      });
      const points = counts.map((count, time) => `${x(time)},${y(count)}`).join(' ');
      const expected = counts.map((_, time) => `${x(time)},${y(expectedRemaining(200, time, halfLife))}`).join(' ');
      drawing += `<polyline points="${expected}" stroke="#135a91" stroke-width="2" stroke-dasharray="6 4" fill="none"/><polyline points="${points}" stroke="#624b9b" stroke-width="3" fill="none"/>`;
      drawing += `<path d="M ${x(observedTime)} 50 V 270" stroke="#172235" stroke-width="2"/>`;
      drawing += circle(x(observedTime), y(counts[observedTime]), 5, '#172235');
      drawing += text(400, 385, 'Zeit seit Start / s · 1 Messschritt = 1 s', 18) + text(220, 27, 'Noch nicht zerfallene Ausgangskerne', 18);
      $('#decay-chart').innerHTML = svg(drawing, `Zerfall von 200 Kernen bei Halbwertszeit ${halfLife} Sekunden, Ablesung jede Sekunde. Zeitpunkt ${observedTime} Sekunden markiert.`, 760, 410);
      $('#decay-table').replaceChildren();
      counts.forEach((count, time) => {
        const row = document.createElement('tr');
        row.dataset.time = time;
        if (time === observedTime) row.setAttribute('aria-current', 'true');
        [time, count, expectedRemaining(200, time, halfLife).toLocaleString('de-DE', { maximumFractionDigits: 1 })].forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        $('#decay-table').append(row);
      });
      $('#decay-description').textContent = `T = ${halfLife} s, also ${halfLife} Messschritte von je 1 s. Start: 200 Ausgangskerne. Nach ${halfLife} s: ${counts[halfLife]} in dieser Zufallsreihe, im Mittel erwartet 100. Nach ${2 * halfLife} s: ${counts[2 * halfLife]}, im Mittel 50. Die theoretische Kurve halbiert sich jeweils; einzelne Reihen schwanken.`;
      let particles = '';
      for (let i = 0; i < 200; i++) {
        const remaining = i < counts[observedTime];
        particles += `<circle data-remaining="${remaining}" cx="${55 + (i % 20) * 30}" cy="${35 + Math.floor(i / 20) * 21}" r="6" fill="${remaining ? '#7253a2' : '#c8d2dc'}"/>`;
      }
      particles += text(350, 270, `t = ${observedTime} s · violett: ursprünglicher Kern noch vorhanden`, 17);
      particles += text(350, 300, 'Grau: Ausgangskern bereits umgewandelt, Materie nicht verschwunden', 16);
      $('#decay-particles').innerHTML = svg(particles, `${counts[observedTime]} Ausgangskerne noch nicht zerfallen, ${200 - counts[observedTime]} bereits umgewandelt.`, 700, 325);
      $('#decay-observation').textContent = `Bei t = ${observedTime} s sind in dieser Reihe ${counts[observedTime]} Ausgangskerne übrig und ${200 - counts[observedTime]} bereits umgewandelt. Erwartungswert: ${expectedRemaining(200, observedTime, halfLife).toLocaleString('de-DE', { maximumFractionDigits: 1 })}. Die Punkte zeigen nur die Anzahl, nicht echte Positionen oder vorhersagbare Zerfallsreihenfolgen.`;
    }
    $('#half-life').addEventListener('input', () => renderDecay());
    $('#decay-time').addEventListener('input', () => renderDecay(false));
    $('#new-sample').addEventListener('click', () => renderDecay());
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

    function makeTable(selector, headers, rows) {
      const table = document.createElement('table');
      const head = document.createElement('thead');
      const headerRow = document.createElement('tr');
      headers.forEach(value => {
        const cell = document.createElement('th');
        cell.scope = 'col';
        cell.textContent = value;
        headerRow.append(cell);
      });
      head.append(headerRow);
      const body = document.createElement('tbody');
      rows.forEach(values => {
        const row = document.createElement('tr');
        values.forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        body.append(row);
      });
      table.append(head, body);
      $(selector).replaceChildren(table);
    }
    makeTable('#uranium-series', ['Schritt', 'Ausgangskern (A, Z)', 'Zerfall', 'Folgekern (A, Z)'], uraniumSeries.slice(0, -1).map((nucleus, index) => {
      const next = uraniumSeries[index + 1];
      return [index + 1, `${nucleus.symbol}-${nucleus.mass}${nucleus.state || ''} (${nucleus.mass}, ${nucleus.charge})`, nucleus.decay,
        `${next.symbol}-${next.mass}${next.state || ''} (${next.mass}, ${next.charge})${next.decay ? '' : ' · stabil'}`];
    }));
    function updateChain() {
      const mode = $('#chain-mode').value;
      const values = chainGenerations(mode);
      let drawing = '';
      values.forEach((value, i) => {
        const height = value / 256 * 200;
        drawing += `<rect x="${85 + i * 100}" y="${250 - height}" width="55" height="${height}" fill="#8264af"/>`;
        drawing += text(112 + i * 100, 275, i, 17) + text(112 + i * 100, 237 - height, value.toLocaleString('de-DE', { maximumFractionDigits: 2 }), 17);
      });
      drawing += '<path d="M 70 35 V 250 H 690" fill="none" stroke="#53647a"/>';
      [0, 64, 128, 192, 256].forEach(count => { drawing += text(38, 255 - count / 256 * 200, count, 15); });
      drawing += text(375, 315, 'Generation g · Start bei g = 0', 18) + text(250, 23, 'Spaltungen in dieser Generation, nicht Gesamtsumme', 16);
      $('#chain-picture').innerHTML = svg(drawing, `Spaltungen pro Generation: ${values.join(', ')}. Alle Modellfälle haben dieselbe Skala.`, 740, 345);
      $('#chain-result').textContent = mode === 'steady' ? 'Faktor 1: 8, 8, 8, 8 … Jede Spaltung bewirkt im Mittel eine Folgespaltung. Kein exponentieller Anstieg.' : mode === 'growing' ? 'Faktor 2: 8, 16, 32, 64, 128, 256. Die Zuwächse 8, 16, 32, 64, 128 werden selbst größer: exponentielles Wachstum, keine gerade Linie.' : 'Faktor 0,5: 8, 4, 2, 1, 0,5, 0,25. Das sind statistische Mittelwerte über viele Wiederholungen, keine halben echten Spaltungen. Die Kettenreaktion klingt ab.';
      makeTable('#chain-table', ['Generation g', 'Modellzahl der Spaltungen N(g)'], values.map((value, i) => [i, value.toLocaleString('de-DE', { maximumFractionDigits: 2 })]));
    }
    $('#chain-mode').addEventListener('change', updateChain);
    updateChain();
    function createStepper(selector, labels, onChange) {
      const host = $(selector);
      const previous = document.createElement('button');
      const next = document.createElement('button');
      previous.type = next.type = 'button';
      previous.className = next.className = 'secondary step-nav';
      previous.textContent = '← Zurück';
      next.textContent = 'Weiter →';
      const list = document.createElement('div');
      list.className = 'step-list';
      let current = 0;
      const buttons = labels.map((label, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'step-button';
        button.dataset.step = index;
        button.textContent = `${index + 1} · ${label}`;
        button.addEventListener('click', () => show(index));
        list.append(button);
        return button;
      });
      function show(index) {
        current = index;
        buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
        previous.disabled = index === 0;
        next.disabled = index === labels.length - 1;
        onChange(index);
      }
      previous.addEventListener('click', () => show(Math.max(0, current - 1)));
      next.addEventListener('click', () => show(Math.min(labels.length - 1, current + 1)));
      host.replaceChildren(previous, list, next);
      show(0);
      return { show };
    }
    createStepper('#fission-steps', fissionStepLabels, step => {
      $('#fission-output').textContent = `Bildschritt ${step + 1} von ${fissionStepLabels.length}: ${fissionStepLabels[step]}`;
      $('#fission-picture').innerHTML = fissionDrawing(step);
      $('#fission-result').textContent = fissionCaptions[step];
    });
    createStepper('#chain-steps', chainStepLabels, step => {
      $('#chain-step-output').textContent = `Bildschritt ${step + 1} von ${chainStepLabels.length}`;
      $('#chain-tree').innerHTML = chainTreeDrawing(step);
      $('#chain-tree-result').textContent = chainTreeCaptions[step];
    });
    let atomBombType = 'gun';
    let atomBombStep = 0;
    function renderAtomBomb() {
      $('#abomb-picture').innerHTML = bombDrawing(atomBombType, atomBombStep);
      $('#abomb-result').textContent = bombSteps[atomBombType][atomBombStep];
    }
    const atomBombStepper = createStepper('#abomb-steps', bombStepLabels.gun, step => {
      atomBombStep = step;
      renderAtomBomb();
    });
    document.querySelectorAll('[data-bomb-type]').forEach(button => button.addEventListener('click', () => {
      atomBombType = button.dataset.bombType;
      document.querySelectorAll('[data-bomb-type]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      atomBombStepper.show(0);
    }));
    createStepper('#hbomb-steps', bombStepLabels.hydrogen, step => {
      $('#hbomb-picture').innerHTML = bombDrawing('hydrogen', step);
      $('#hbomb-result').textContent = bombSteps.hydrogen[step];
    });
    function updateReactor() {
      const state = reactorState(Number($('#control-rods').value));
      $('#rods-output').value = state.insertion;
      $('#reactor-picture').innerHTML = reactorDrawing(state);
      $('#power-text').textContent = reactorSummary(state);
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
    finalTasks.forEach((task, index) => {
      const article = document.createElement('section');
      article.className = 'final-task';
      article.dataset.finalTask = task.id;
      const heading = document.createElement('h4');
      heading.textContent = `${index + 1} · ${task.optional ? 'Zusatz (freiwillig)' : 'Grundwissen'}`;
      const prompt = document.createElement('p');
      prompt.id = `final-prompt-${task.id}`;
      prompt.textContent = task.prompt;
      const answer = document.createElement('textarea');
      answer.rows = task.id === 'atom' ? 6 : 4;
      answer.setAttribute('aria-labelledby', prompt.id);
      const printAnswer = document.createElement('div');
      printAnswer.className = `written-answer${task.id === 'atom' ? ' drawing-answer' : ''}`;
      answer.addEventListener('input', () => { printAnswer.textContent = answer.value; });
      article.append(heading, prompt, answer, printAnswer);
      $('#final-test-tasks').append(article);
      const solution = document.createElement('section');
      solution.className = 'final-solution';
      const title = document.createElement('h4');
      title.textContent = `${index + 1} · ${task.optional ? 'Zusatz' : 'Vergleichskriterien'}`;
      const content = document.createElement('p');
      content.textContent = task.solution;
      const back = document.createElement('a');
      back.href = `#station${task.station}`;
      back.textContent = `Nacharbeiten in Station ${task.station}`;
      back.className = 'no-print';
      solution.append(title, content, back);
      $('#final-test-answers').append(solution);
    });
    document.querySelectorAll('.figure').forEach(figure => {
      figure.tabIndex = 0;
      figure.setAttribute('role', 'group');
      figure.setAttribute('aria-label', 'Schaubild, auf kleinen Bildschirmen horizontal verschiebbar');
    });
    let solutionsWereOpen = false;
    function printDocument(mode) {
      solutionsWereOpen = $('#test-solutions').open;
      document.body.dataset.printMode = mode;
      if (mode === 'solutions') $('#test-solutions').open = true;
      window.print();
    }
    window.addEventListener('afterprint', () => {
      if (document.body.dataset.printMode === 'solutions') $('#test-solutions').open = solutionsWereOpen;
      delete document.body.dataset.printMode;
    });
    $('#print-lab').addEventListener('click', () => printDocument('all'));
    document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => printDocument(button.dataset.print)));
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      atomInfo, atomDrawing, shellDistribution, simulateDecay, expectedRemaining, relativeExposure,
      chainGenerations, uraniumSeries, fissionReaction, fissionDrawing, shieldDrawing,
      fissionDecayChains, idealChain, chainTreeDrawing, bombDrawing, bombSteps,
      reactorState, reactorDrawing, reactorSummary, questions, finalTasks, gradeQuestion, models
    };
  }
  if (typeof document !== 'undefined') initLab();
})();
