# Kernfunke – Lernlabor Atom- und Kernphysik

Interaktive Lernstrecke für die Realschule Baden-Württemberg (Klasse 10, M-Niveau) zu Atomen, Radioaktivität, Kernspaltung und Kernenergie.

**Kernfunke** verbindet anschauliche Modelle, sichere Gedankenexperimente, historische Quellenfragen und kurze Selbsttests. Die Seite ist als Vorbereitung und Wiederholung gedacht – nicht als Ersatz für beaufsichtigte Schulexperimente.

## Öffnen

**[Lernlabor online öffnen](https://jubitwo.github.io/Kernfunke-Atom-Kernphysik/)** · [Repository](https://github.com/Jubitwo/Kernfunke-Atom-Kernphysik) · [Lernlabor lokal öffnen](./index.html)

**Einordnung:** Unterrichtsmaterialien → **Physik** → Struktur der Materie → Atom- und Kernphysik. Das Projekt bleibt unabhängig von den Mathematik-Lernseiten.

| Datei | Zweck |
|---|---|
| [index.html](./index.html) | Interaktive Lernstrecke mit neun Stationen |
| [labor.js](./labor.js) | Modelle, Visualisierungen, 36 Auswahlaufgaben und Abschlusstest |
| [labor.css](./labor.css) | Ergänzende Gestaltung und Druckansicht |
| [labor.test.cjs](./labor.test.cjs) | Tests der Physikmodelle, Aufgaben und Verdrahtung |
| [docs/README.md](./docs/README.md) | Lehrplanbezug, Unterrichtsvorschlag, Sicherheit und Pflege |

## Lernstrecke

1. **Atomdetektive:** Fünf Atommodelle von Demokrit über Thomson bis Bohr vergleichen; Rutherfords Streuversuch auswerten.
2. **Baumeister:** Bohr-Schalen statt einer einzigen Elektronenebene. Für neutrale Atome der ersten 20 Elemente: Besetzungsfolge 2 | 8 | 8 | 2, mit C-, Na- und Ca-Beispielen. Isotope und Ionen bilden; jede gewählte Teilchenzahl wird tatsächlich gezeichnet.
3. **Strahlungsfinder:** Beschriftete, unterschiedlich gestaltete Schichten Papier → zusätzlich Aluminium → zusätzlich Blei. Gamma-Abschwächung durch wenige weiterlaufende Beispielspuren verstehen. Ionisation, Zellschäden, Kontamination, Anwendungen und Schutz; Abstand/Zeit anhand von 100 Modelltreffern vergleichen.
4. **Messlabor:** 1 Messschritt = 1 Sekunde. Halbwertszeit in Sekunden, Zeitmarke zum Ablesen, 200 Kernpunkte, Zufallskurve, Erwartungswert und Datentabelle. Nullrate, Zählrohr und Unterschied Bq/Sv.
5. **Kernspaltung:** U-235 + n → U-236* → Ba-141 + Kr-92 + 3 n, mit Teilchenbildern und A-/Z-Bilanz. Exponentielles Wachstum bei Faktor 2 je Generation klar von gleichbleibenden und abklingenden Kettenreaktionen unterscheiden. Die natürliche U-238-Zerfallsreihe bis Pb-206 separat bilanzieren (8 α, 6 β⁻).
6. **Kernenergie & Kraftwerk:** Eigene Station mit Druckwasserreaktor, getrennten Kreisläufen, Regelstäben, Energieumwandlung, Nachzerfallswärme und Abfällen.
7. **Kernwaffen & Verantwortung:** Kontrollierte Nutzung und zerstörerische Energiefreisetzung unterscheiden. Kurzer zusätzlicher Hinweis auf Fusion und Wasserstoffbombe, ausschließlich auf Prinzipienebene.
8. **Geschichte:** Becquerel, Marie und Pierre Curie, Hahn, Straßmann, Meitner und Frisch historisch einordnen, mit erweiterten Fragen.
9. **Lernzettel & Abschlusstest:** Merkwissen, Selbstcheck, 14 offene Grundaufgaben und ein freiwilliger Zusatz. Lernzettel, Test ohne Lösungen und Vergleichslösungen sind einzeln druckbar.

36 Auswahlaufgaben, eine Zahlenaufgabe und eine Einstellaufgabe bieten automatische Rückmeldung (38 Lernchecks). Schriftliche Forscheraufträge, ein sicheres Münzexperiment und freie Bewertungsaufgaben ergänzen die Lernstrecke. Der separate Abschlusstest wird anhand von Vergleichskriterien selbst geprüft, nicht automatisch benotet.

## Lokal starten

Es werden keine Pakete und kein Build-Schritt benötigt. Den gesamten Ordner herunterladen und [index.html](./index.html) direkt in einem aktuellen Browser öffnen. Alle Funktionen und Schriftarten arbeiten ohne Internet; nur die weiterführenden Quellenlinks benötigen eine Verbindung.

Die Inhaltslinks, Stationsreiter und Browser-Zurück funktionieren zusammen. Die Reiter unterstützen Pfeiltasten sowie Pos1/Ende. „Gesamtes Labor drucken“ zeigt alle neun Stationen ohne Lösungsanhang. Station 9 bietet zusätzlich drei gezielte Druckschaltflächen. Eingetippte Abschlusstest-Antworten werden mitgedruckt, ansonsten erscheint Schreibraum. Antworten und Fortschritt werden nicht gespeichert oder übertragen und gehen beim Neuladen verloren. Es gibt keine Werbung, Analysewerkzeuge oder extern geladenen Schriftarten.

**Geänderte Direktlinks:** Station 6 ist jetzt Kernenergie, Station 7 Kernwaffen, Station 8 Geschichte und Station 9 Lernzettel/Test. Ein alter Link auf `#station6` öffnet deshalb jetzt die Kraftwerksstation.

## Prüfen

```sh
node --test labor.test.cjs
```

Die Tests benötigen nur Node.js und prüfen unter anderem exakte Teilchenzahlen, hohe Ionenladungen, monotone Zufallszerfälle, die Halbwertszeit statistisch bei großer Stichprobe, Abstandsverhältnisse und alle hinterlegten Antwortschlüssel. Ergänzend müssen Navigation, Bedienung, Mobil- und Druckansicht im Browser geprüft werden.

## Fachliche Grenzen

Die Simulationen sind Modelle. Sie zeigen keine realen Dosiswerte und ersetzen keine Messung mit einem geeigneten, geprüften Schulmessgerät. Die Station zur Atombombe erklärt ausschließlich das naturwissenschaftliche Prinzip und die historischen Folgen auf hoher Ebene. Es werden keine Bauanleitungen, Konstruktionsdetails oder Optimierungshinweise gegeben.

Die Lernstrecke deckt die sechs Inhaltskompetenzen des [Bildungsplans 3.3.4, M-Niveau](https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/SEK1/PH/IK/10/04) ab. Der explizite Abgleich steht in der [Lehrkraft-Dokumentation](./docs/README.md). Eine Erprobung mit einer realen Lerngruppe steht noch aus; technische Prüfungen garantieren keine individuelle Prüfungsvorbereitung.
