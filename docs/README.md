# Dokumentation: Kernfunke

[Projektübersicht](../README.md) · [Online lernen](https://jubitwo.github.io/Kernfunke-Atom-Kernphysik/)

## Lehrplanbezug

Das Lernlabor orientiert sich am Bildungsplan 2016 Baden-Württemberg, Physik Sekundarstufe I, Realschule, M-Niveau, Klasse 10, insbesondere am Inhaltsbereich **3.3.4 Struktur der Materie**. Die Lernenden arbeiten mit Modellen, beschreiben Radioaktivität, unterscheiden Strahlungsarten, erklären Kernspaltung und beurteilen Anwendungen sowie Risiken.

Quelle: [Original: 3.3.4 Struktur der Materie](https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/SEK1/PH/IK/10/04). Am 19.10.2026 direkt mit der **M-Niveau-Spalte** abgeglichen:

| M-Niveau-Kompetenz | Umsetzung |
|---|---|
| (1) Atomaufbau, Kernladungszahl, Massenzahl und Isotope erläutern | Station 2: Teilchen-Zählbild, Atom-/Isotopenbau und Aufgaben |
| (2) Kernzerfälle und ionisierende Strahlung, α/β/γ, Halbwertszeit beschreiben | Stationen 3/4: Kernänderungen, Abschirmversuch, Zufallsmodell und Berechnung |
| (3) Biologische Wirkungen, gesundheitliche Folgen, medizinische und technische Anwendungen beschreiben/nennen | Station 3: Ionisation, DNA, Gewebeschäden, Medizin und Materialprüfung |
| (4) Kernspaltung beschreiben | Station 5: Bildfolge, Bindung/Energie und Kettenreaktion |
| (5) Nutzen und Risiken der Anwendungen von Strahlung und Kernspaltung beschreiben und bewerten | Stationen 3/5/6: Medizin, Stromerzeugung und schriftliche Kriterienabwägung |
| (6) Gesundheitsgefahren und Schutzmaßnahmen einschließlich Abschirmung und Endlagerung beschreiben | Stationen 3/5: Schutzregeln, Aufnahmeweg, Abfälle und langfristiger Einschluss |

Atommodellgeschichte, Ionen, Messverfahren und Einheiten dienen als hilfreiche Grundlagen beziehungsweise Vertiefung. Kernfusion ist ausdrücklich als Zusatz markiert. Quarks und Fusion werden nicht als M-Niveau-Pflichtstoff ausgegeben.

## Kompetenzen

- Atome als Kern-Hülle-System mit Protonen, Neutronen und Elektronen beschreiben.
- Ordnungszahl, Massenzahl, Isotope und Ionen unterscheiden.
- Radioaktiven Zerfall als zufälligen Prozess und Halbwertszeit als statistische Größe erklären.
- Alpha-, Beta- und Gammastrahlung nach Teilchenart beziehungsweise elektromagnetischer Strahlung, Ladung, Reichweite und Abschirmung vergleichen.
- Kernspaltung als Energie freisetzenden Prozess und Kettenreaktion als kontrollierbar oder unkontrolliert beschreiben.
- Aufbau eines Kernkraftwerks als Energieumwandlungskette erklären: Kernenergie → Wärme → Bewegung → elektrische Energie.
- Atombombe und Kernkraftwerk fachlich unterscheiden und die Folgen der militärischen Nutzung historisch sowie ethisch reflektieren.
- Experimente modellieren, Daten auswerten, Unsicherheiten benennen und Sicherheitsregeln begründen.

## Unterrichtsvorschlag (4–6 Schulstunden)

| Stunde | Schwerpunkt | Tätigkeit |
|---|---|---|
| 1 | Atommodelle, Atomaufbau | Vorwissen, Modelle vergleichen, Isotope/Ionen bauen, Ergebnisse erklären |
| 2 | Strahlungsarten und Wirkung | Virtuell abschirmen, Kernänderungen, Ionisation und Schutz begründen |
| 3 | Zerfall und Messen | Münzexperiment, Zufallskurve/Tabelle, Halbwertszeit und Einheiten |
| 4 | Kernspaltung und Kraftwerk | Spaltungsbildfolge, Kettenreaktion, Energieumwandlung und Kreisläufe |
| 5 (optional) | Geschichte und Quellen | Rollen der Beteiligten, Quellenvergleich, historische Verantwortung |
| 6 (optional) | Bewerten und Sichern | Medizin, Energieversorgung, Abfälle; individuelle Lernlücken nacharbeiten |

Für eine 90-minütige Wiederholung nur ausgewählte Experimente und Aufgaben einsetzen. Das vollständige Labor ist kein realistisch in 90 Minuten zu erarbeitender Neukurs.

## Bedienung und Rückmeldungen

- Inhaltslinks und Reiter öffnen dieselben sechs Stationen; Direktlinks reichen von `#station1` bis `#station6`. Browser-Zurück sowie Pfeiltasten und Pos1/Ende in der Reiterleiste werden unterstützt.
- Die fünf historischen Bilder wechseln passend zum Modell. Das Atom-Zählbild zählt jedes Proton, Neutron und Elektron; es ist ausdrücklich kein maßstabsgerechtes Schalenmodell und prüft keine Kernstabilität.
- Bei ungültigen Teilchenzahlen erscheint eine Meldung statt einer stillen Korrektur. Positive Ladungen werden vollständig angezeigt, etwa `20+`.
- Das Zerfallsmodell simuliert für jeden noch vorhandenen Kern pro Schritt eine Überlebensentscheidung mit Wahrscheinlichkeit `(1/2)^(1/T)`. Bereits zerfallene Kerne bleiben entfernt. Der Start beträgt exakt 200 Kerne; eine neue Reihe zieht neue Zufallsentscheidungen.
- Diagramm und Datentabelle zeigen dieselben Werte. Die theoretische Kurve ist gesondert markiert. Beide Achsen und ihre Bedeutung sind beschriftet.
- Das Abstandsgesetz gilt nur für das genannte idealisierte Punktquellenmodell. Es berechnet keine realen Dosen oder sicheren Zeiten.
- Der Stabregler verändert die eingezeichnete Einfahrtiefe, nicht eine erfundene Prozentleistung. Sicherheit oder konkrete Kraftwerksleistung lassen sich aus der Stellung allein nicht ableiten.
- 22 Auswahlaufgaben, eine Zahlenaufgabe und die Magnesium-Einstellung zählen zum Lerncheck. Eine geänderte Antwort muss erneut geprüft werden. Das Anzeigen der Magnesium-Musterlösung gibt allein keinen Punkt.
- Fortschritt, Antworten und Freitext existieren nur bis zum Neuladen. Es gibt keine personenbezogene Auswertung oder Übertragung.
- Freitext wird **nicht automatisch inhaltlich bewertet**. Der Kriterienvergleich zeigt Muster und verlangt eine eigene Reflexion.
- Die Druckansicht enthält alle Stationen. Die aufklappbaren Quellen und Lehrkraft-Zusätze können vor dem Drucken nach Bedarf geöffnet werden.

## Erwartungshorizont für schriftliche Aufgaben

- **C-12 → C-14:** Z bleibt 6, A steigt von 12 auf 14, Neutronenzahl von 6 auf 8. Entfernen eines Elektrons erzeugt Ladung 1+; das Element bleibt Kohlenstoff.
- **Münzwurfmodell:** Im Mittel bleibt pro Wurf die Hälfte. Jede konkrete Gruppe schwankt; bei größerer Anfangsmenge sind die relativen Schwankungen kleiner.
- **Halbwertszeit:** 800 → 400 → 200 → 100 nach drei Halbwertszeiten; nicht 800 durch 3 teilen.
- **Entdeckung:** Hahn/Straßmann liefern den chemischen Barium-Befund Ende 1938, Meitner/Frisch die physikalische Erklärung 1939. Der Nobelpreis für Hahn allein ist kein vollständiges Verzeichnis der Beiträge.
- **Medizin:** Nutzen einer besseren Diagnose/Behandlung gegen zusätzliche Belastung abwägen. Zum Beispiel nach Untersuchungsziel und möglichen Alternativen fragen; keine pauschale individuelle Empfehlung durch die Lernseite.
- **Energie:** Mindestens zwei unterschiedliche Kriterien mit Belegen abwägen, etwa verlässliche Erzeugung und Treibhausgase gegenüber Unfallrisiken, Kosten und langfristiger Abfallverantwortung. Eine begründete Gewichtung ist wichtiger als ein vorgegebenes Urteil.

## Sicherheit und Didaktik

- Im Labor nur zugelassene, beaufsichtigte Schulquellen und die Vorgaben der Schule beziehungsweise des Strahlenschutzes verwenden.
- Die Website nutzt ausschließlich Simulationen und Alltagsvergleiche. „Durchdringung“ ist nicht gleich „Gefährlichkeit“: Entscheidend sind unter anderem Aktivität, Energie, Aufenthaltsdauer, Abstand und Abschirmung.
- Die Atombombenstation bleibt historisch und konzeptionell. Sie behandelt die unkontrollierte Kettenreaktion, nicht technische Umsetzung.
- Modelle immer als Modelle kennzeichnen: Elektronen sind nicht kleine Kugeln auf starren Kreisbahnen, und ein Reaktorschema ist kein maßstabsgetreuer Bauplan.
- Auch die Schutzwirkungen der Abschirmbilder sind qualitativ. Keine sicheren Materialdicken oder Dosiswerte aus der Zeichnung ableiten. Gamma-Strahlung wird abgeschwächt, nicht vollständig beseitigt.
- Druckwasserreaktor, Moderator und Absorber unterscheiden; nach Ende der Kettenreaktion bleibt Nachzerfallswärme.

## Fachliche Quellen

- [Bildungsplan BW, 3.3.4](https://www.bildungsplaene-bw.de/,Lde/LS/BP2016BW/ALLG/SEK1/PH/IK/10/04): direkt abgerufene G/M/E-Kompetenztabelle, maßgeblich M.
- [Nobel Foundation: Marie Curie](https://www.nobelprize.org/prizes/physics/1903/marie-curie/facts/): direkt abgerufen; Becquerel, Curies und Preise.
- [Nobel Foundation: Otto Hahn](https://www.nobelprize.org/prizes/chemistry/1944/hahn/facts/): direkt abgerufen; Nachweis und Deutung unterscheiden. Die Kurzbiografie fasst den Befund unter 1939 zusammen; im Lernlabor sind der Befund Ende 1938 und die Veröffentlichung 1939 getrennt.
- [BfS: Ionisierende Strahlung](https://www.bfs.de/DE/themen/ion/ion_node.html): vertiefende Leseempfehlung. Der automatisierte Abruf war eingeschränkt (403); nicht als erfolgreich geprüfter Abruf ausgegeben.

Abruf der direkt geprüften Quellen: 19.10.2026.

## Pflege und Prüfung

- [ ] Jede Station per Tastatur und Touch bedienen.
- [ ] Fünf Modellbilder, Teilchenzahlen und ungültige Zahlen prüfen.
- [ ] Abschirmung, Abstand/Zeit, Halbwertszeit und Reaktormodell prüfen.
- [ ] Quizantworten und Rückmeldungen auf fachliche Richtigkeit prüfen.
- [ ] Layout bei 320 px, Tablet und Desktop kontrollieren.
- [ ] `prefers-reduced-motion` und sichtbare Fokusrahmen erhalten.

Automatisch mit Node.js (ohne Paketinstallation):

```sh
node --test labor.test.cjs
```

Die Tests prüfen Modelle und Antwortschlüssel, ersetzen aber keine Erprobung mit Schülerinnen und Schülern. Die Veröffentlichung erfolgt über GitHub Pages aus `main`, Wurzelverzeichnis. HTML, CSS und JavaScript müssen gemeinsam veröffentlicht werden.

### Durchgeführte Prüfung am 19.10.2026

- Alle acht Node-Tests erfolgreich, einschließlich statistischem Halbwertszeit-Test mit 100 000 Anfangskernen.
- Alle 22 Auswahlaufgaben im Browser mit richtigen Antworten und Erklärungen geprüft; der Lerncheck zeigt 22 von 24 vor den beiden Zusatzaufgaben.
- Zusätzlich Magnesium-Einstellung, leere/ungültige Eingaben, Abschirmung, Halbwertszeit-Regler und Zahlenaufgabe, Spaltungsbildfolge, Stabbewegung und Freitext-Selbstvergleich bedient.
- Inhaltslink, Pfeiltasten/Pos1 und Browser-Zurück geprüft; Antworten bleiben bei Stationswechsel erhalten.
- Alle sechs Stationen bei 320, 768 und 1280 Pixeln ohne horizontalen Seitenüberlauf. Kleine Bildschirme bieten für beschriftete Schaubilder eine separat verschiebbare Bildfläche statt unlesbar kleiner Beschriftungen.
- Druckmedienprüfung: alle sechs Stationen sichtbar. Ein Testdruck auf realem Papier sowie ein Unterrichtstest mit einer Lerngruppe stehen noch aus.
