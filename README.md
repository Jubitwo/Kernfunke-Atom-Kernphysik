# Kernfunke – Lernlabor Atom- und Kernphysik

Interaktive Lernstrecke für die Realschule Baden-Württemberg (Klasse 10, M-Niveau) zu Atomen, Radioaktivität, Kernspaltung und Kernenergie.

**Kernfunke** verbindet anschauliche Modelle, sichere Gedankenexperimente, historische Quellenfragen und kurze Selbsttests. Die Seite ist als Vorbereitung und Wiederholung gedacht – nicht als Ersatz für beaufsichtigte Schulexperimente.

## Öffnen

**[Lernlabor online öffnen](https://jubitwo.github.io/Kernfunke-Atom-Kernphysik/)** · [Repository](https://github.com/Jubitwo/Kernfunke-Atom-Kernphysik) · [Lernlabor lokal öffnen](./index.html)

**Einordnung:** Unterrichtsmaterialien → **Physik** → Struktur der Materie → Atom- und Kernphysik. Das Projekt bleibt unabhängig von den Mathematik-Lernseiten.

| Datei | Zweck |
|---|---|
| [index.html](./index.html) | Interaktive Lernstrecke mit sechs Stationen |
| [labor.js](./labor.js) | Modelle, Visualisierungen und 22 Auswahlaufgaben mit Erklärungen |
| [labor.css](./labor.css) | Ergänzende Gestaltung und Druckansicht |
| [labor.test.cjs](./labor.test.cjs) | Tests der Physikmodelle, Aufgaben und Verdrahtung |
| [docs/README.md](./docs/README.md) | Lehrplanbezug, Unterrichtsvorschlag, Sicherheit und Pflege |

## Lernstrecke

1. **Atomdetektive:** Fünf Atommodelle von Demokrit über Thomson bis Bohr vergleichen; Rutherfords Streuversuch auswerten.
2. **Baumeister:** Protonen, Neutronen und Elektronen zählen; Isotope und Ionen bilden. Die Grafik zeigt die tatsächlich gewählten Teilchenzahlen.
3. **Strahlungsfinder:** Alpha-, Beta- und Gammastrahlung sowie Kernänderungen unterscheiden; Abschirmung virtuell untersuchen. Ionisation, Zellschäden, Kontamination, medizinische Anwendungen und Strahlenschutz kennenlernen. Abstand und Zeit relativ vergleichen.
4. **Messlabor:** Zufälligen Kernzerfall mit theoretischem Erwartungswert und Datentabelle vergleichen. Halbwertszeit berechnen, Nullrate und Geiger-Müller-Zählrohr verstehen. Aktivität (Bq) und Dosis (Sv) unterscheiden.
5. **Kernspaltung:** Spaltung in drei Bildschritten, abklingende/gleichbleibende/anwachsende Kettenreaktion und ein Druckwasserreaktor mit getrennten Kreisläufen. Regelstäbe bewegen, Nachzerfallswärme und radioaktive Abfälle einordnen.
6. **Geschichte & Verantwortung:** Becquerel, Marie und Pierre Curie, Hahn, Straßmann, Meitner und Frisch historisch einordnen. Kernwaffenfolgen sowie Nutzen und Risiken bewerten.

22 Auswahlaufgaben, eine Zahlenaufgabe und eine Einstellaufgabe bieten automatische Rückmeldung. Schriftliche Forscheraufträge, ein sicheres Münzexperiment und freie Bewertungsaufgaben ergänzen die Lernstrecke. Freitext wird anhand von Vergleichskriterien selbst geprüft, nicht automatisch benotet.

## Lokal starten

Es werden keine Pakete und kein Build-Schritt benötigt. Den gesamten Ordner herunterladen und [index.html](./index.html) direkt in einem aktuellen Browser öffnen. Alle Funktionen und Schriftarten arbeiten ohne Internet; nur die weiterführenden Quellenlinks benötigen eine Verbindung.

Die Inhaltslinks, Stationsreiter und Browser-Zurück funktionieren zusammen. Die Reiter unterstützen Pfeiltasten sowie Pos1/Ende. Die Druckansicht zeigt alle Stationen. Antworten und Fortschritt werden nicht gespeichert oder übertragen und gehen beim Neuladen verloren. Es gibt keine Werbung, Analysewerkzeuge oder extern geladenen Schriftarten.

## Prüfen

```sh
node --test labor.test.cjs
```

Die Tests benötigen nur Node.js und prüfen unter anderem exakte Teilchenzahlen, hohe Ionenladungen, monotone Zufallszerfälle, die Halbwertszeit statistisch bei großer Stichprobe, Abstandsverhältnisse und alle hinterlegten Antwortschlüssel. Ergänzend müssen Navigation, Bedienung, Mobil- und Druckansicht im Browser geprüft werden.

## Fachliche Grenzen

Die Simulationen sind Modelle. Sie zeigen keine realen Dosiswerte und ersetzen keine Messung mit einem geeigneten, geprüften Schulmessgerät. Die Station zur Atombombe erklärt ausschließlich das naturwissenschaftliche Prinzip und die historischen Folgen auf hoher Ebene. Es werden keine Bauanleitungen, Konstruktionsdetails oder Optimierungshinweise gegeben.

Die Lernstrecke deckt die sechs Inhaltskompetenzen des [Bildungsplans 3.3.4, M-Niveau](https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/SEK1/PH/IK/10/04) ab. Der explizite Abgleich steht in der [Lehrkraft-Dokumentation](./docs/README.md). Eine Erprobung mit einer realen Lerngruppe steht noch aus; technische Prüfungen garantieren keine individuelle Prüfungsvorbereitung.
