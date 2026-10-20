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
| (5) Nutzen und Risiken der Anwendungen von Strahlung und Kernspaltung beschreiben und bewerten | Stationen 3/6/7/8: Medizin, Stromerzeugung und schriftliche Kriterienabwägung |
| (6) Gesundheitsgefahren und Schutzmaßnahmen einschließlich Abschirmung und Endlagerung beschreiben | Stationen 3/6: Schutzregeln, Aufnahmeweg, Abfälle und langfristiger Einschluss |

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
| 4 | Kernspaltung | Konkrete Uran-Spaltung, A/Z-Bilanz, exponentielle Generationen; Zerfallsreihe als Vertiefung |
| 5 | Kraftwerk und Verantwortung | Energieumwandlung, Kreisläufe, Nachzerfallswärme, Abfälle, Kernwaffen nur konzeptionell |
| 6 und ggf. weitere Zeit | Geschichte und Sichern | Quellenvergleich, Lernzettel, Test und individuelle Nacharbeit |

Für eine 90-minütige Wiederholung nur ausgewählte Experimente und Aufgaben einsetzen. Das vollständige Labor ist kein realistisch in 90 Minuten zu erarbeitender Neukurs.

## Bedienung und Rückmeldungen

- Inhaltslinks und Reiter öffnen dieselben neun Stationen; Direktlinks reichen von `#station1` bis `#station9`. Browser-Zurück sowie Pfeiltasten und Pos1/Ende in der Reiterleiste werden unterstützt. **Intentional geänderte Nummerierung:** Die frühere Geschichte aus Station 6 liegt jetzt in Station 8; Station 6 ist Kernenergie.
- Die fünf historischen Bilder wechseln passend zum Modell. Das Bohr-Beispiel zeigt Na-23 mit drei besetzten Schalen. Der Baumeister zählt jedes Proton, Neutron und Elektron und ordnet Elektronen im vereinfachten Schalenbild an: 2/8/8/2 für bis zu 20 Elektronen. Dies ist keine allgemeine Kapazitätsformel und keine Existenzprüfung für frei gewählte Kerne/Ionen. Schalen sind Energieniveaus, keine realen Kreisbahnen.
- Bei ungültigen Teilchenzahlen erscheint eine Meldung statt einer stillen Korrektur. Positive Ladungen werden vollständig angezeigt, etwa `20+`.
- Abschirmung baut Schichten auf: Papier bleibt erhalten, wenn Aluminium und später Blei hinzukommen. Beschriftung, Färbung und Breite unterscheiden die Materialien. Weniger weiterlaufende Gamma-Beispielspuren zeigen qualitative Abschwächung, keine quantitative Absorptionsquote.
- Das Zerfallsmodell simuliert für jeden noch vorhandenen Kern pro Sekunde eine Überlebensentscheidung mit Wahrscheinlichkeit `(1/2)^(1/T)`, T in Sekunden. **1 Messschritt = 1 s**; der Regler wählt einen erfundenen Modellstoff mit T zwischen 2 und 8 s. Bereits zerfallene Kerne bleiben entfernt. Start: exakt 200 Kerne.
- Der Zeitpunkt-Regler liest dieselbe Zufallsreihe ab, ohne sie neu zu ziehen. Diagramm, Zeitmarke, Punktbild und Tabelle zeigen denselben Zählwert. Hilfslinien markieren T und 2T; Erwartungswert und Zufallsverlauf sind getrennt.
- Der Abstandsvergleich nutzt 100 frei gewählte Modelltreffer bei 1 m und 1 min. Bei 2 m/1 min: 25, bei 2 m/2 min: 50. Gleiche Detektorfläche und idealisierte Punktquelle sind Voraussetzung; keine realen Dosen oder sicheren Zeiten.
- Die U-235-Spaltung zeigt nach Aufnahme eines Neutrons U-236* und einen möglichen Kanal Ba-141/Kr-92/3 n. Protonen und Neutronen sind als vereinfachte Zählbilder dargestellt; die A-/Z-Bilanzen werden geprüft. Sieben anklickbare Bildschritte führen über die β⁻-Zerfallsreihen (Ba-141 18,27 min → La-141 3,92 h → Ce-141 32,5 d → Pr-141 stabil; Kr-92 1,84 s → Rb-92 4,49 s → Sr-92 2,66 h → Y-92 3,54 h → Zr-92 stabil) bis zu stabilen Endkernen. Hinweis: Das gilt nur für diesen Spaltkanal; andere Spaltprodukte wie Cs-137 (≈ 30 a) bleiben lange radioaktiv.
- Der Kettenbaum zeigt 1 → 3 → 9 → 27 Spaltungen (N(g) = 3^g, ideal) und im Vergleich den Kraftwerksfall mit Faktor 1.
- Station 7 zeigt Atombombe (Kanonen-/Implosionsprinzip) und zweistufige Wasserstoffbombe als Prinzipbilder in vier Schritten, ausdrücklich ohne Maße, Mengen oder Bauanleitung.
- Station 8 ergänzt Tschernobyl (26.04.1986) und Fukushima (11.03.2011), jeweils INES 7, mit Vergleichstabelle.
- Generationen heißen **g**, das Teilchensymbol **n** bedeutet Neutron. Wachstumsfall: Faktor 2, N(g) = 8 · 2^g. Alle drei Diagrammfälle haben dieselbe Skala. Bei Faktor 0,5 sind Bruchteile statistische Mittelwerte, nicht halbe reale Spaltungen.
- Die natürliche U-238-Reihe endet im Hauptpfad bei stabilem Pb-206 (8 α, 6 β⁻). Sie ist keine Spaltungskettenreaktion. Die aufklappbare Tabelle zeigt den Hauptpfad einschließlich Pa-234m, ohne seltene Nebenäste und begleitende Gammaübergänge.
- Der Stabregler verändert die eingezeichnete Einfahrtiefe, nicht eine erfundene Prozentleistung. Sicherheit oder konkrete Kraftwerksleistung lassen sich aus der Stellung allein nicht ableiten.
- 45 Auswahlaufgaben, eine Zahlenaufgabe und die Magnesium-Einstellung zählen zu den 47 Lernchecks. Eine geänderte Antwort muss erneut geprüft werden. Das Anzeigen der Magnesium-Musterlösung gibt allein keinen Punkt.
- Fortschritt, Antworten und Freitext existieren nur bis zum Neuladen. Es gibt keine personenbezogene Auswertung oder Übertragung.
- Freitext wird **nicht automatisch inhaltlich bewertet**. Der Kriterienvergleich zeigt Muster und verlangt eine eigene Reflexion.
- Der Abschlusstest hat 18 offene Grundaufgaben und einen freiwilligen Zusatz zu Fusion. Richtzeit 45–60 Minuten; Antworten werden nicht automatisch benotet. Die Lösungskriterien verweisen auf passende Stationen zur Nacharbeit.
- Station 9 druckt Lernzettel, Test ohne Lösungen und Lösungen gezielt getrennt. Eigene Texte werden im Testdruck übernommen, ansonsten bleibt Schreibraum. Nach dem Druckdialog wird der spezielle Druckmodus zurückgesetzt, auch nach Abbrechen. Der allgemeine Labordruck zeigt alle Stationen, aber keinen Lösungsanhang.

## Erwartungshorizont für schriftliche Aufgaben

- **C-12 → C-14:** Z bleibt 6, A steigt von 12 auf 14, Neutronenzahl von 6 auf 8. Entfernen eines Elektrons erzeugt Ladung 1+; das Element bleibt Kohlenstoff.
- **Münzwurfmodell:** Im Mittel bleibt pro Wurf die Hälfte. Jede konkrete Gruppe schwankt; bei größerer Anfangsmenge sind die relativen Schwankungen kleiner.
- **Halbwertszeit:** 800 → 400 → 200 → 100 nach drei Halbwertszeiten; nicht 800 durch 3 teilen.
- **Spaltung:** 235 + 1 = 141 + 92 + 3 = 236; 92 = 56 + 36. U-235 ist bereits radioaktiv; * kennzeichnet die Anregung des Zwischenkerns.
- **Zerfallsreihe:** (238 − 206)/4 = 8 α. Danach Z = 92 − 16 = 76; bis Z = 82 fehlen 6 β⁻. Nicht als einzige Spaltung oder einheitlichen Zeitablauf erklären.
- **Exponentiell:** 8, 16, 32, 64, 128, 256; gleicher Multiplikationsfaktor statt konstantem additivem Zuwachs. Nicht jede Kettenreaktion wächst exponentiell.
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
- [LEIFIphysik: Kernspaltung](https://www.leifiphysik.de/kern-teilchenphysik/kernspaltung-und-kernfusion/grundwissen/kernspaltung): Beispiel schwerer Kerne und Energie aus stärker gebundenen Spaltprodukten.
- [Uran-Radium-Reihe](https://de.wikipedia.org/wiki/Uran-Radium-Reihe): Nuklidtabelle für U-238 bis Pb-206, Pa-234m und Nebenäste.
- [BfS: Unfall in Fukushima](https://www.bfs.de/DE/themen/ion/notfallschutz/notfall/fukushima/unfall.html): Datum, Erdbeben 9,0, Tsunami, Ausfall der Kühlung, Evakuierung, INES 7.
- [Nuklearkatastrophe von Tschernobyl](https://de.wikipedia.org/wiki/Nuklearkatastrophe_von_Tschernobyl): Datum, Block 4, RBMK, Test, Explosion, Graphitbrand, Sperrzone.
- [IAEA LiveChart of Nuclides](https://www-nds.iaea.org/relnsd/vcharthtml/VChartHTML.html): Halbwertszeiten der Ba-141- und Kr-92-Folgekerne.
- [Elektronenkonfiguration](https://www.chemie.de/lexikon/Elektronenkonfiguration.html): Schalen und Reihenfolge der besetzten Unterschalen. Daraus folgt bei den ersten 20 neutralen Atomen die schulische Besetzung 2/8/8/2.

Die ergänzten Quellen wurden direkt abgerufen; alle Schaubilder bleiben eigene, didaktisch reduzierte Zeichnungen. Fremde Bilddateien werden nicht übernommen.

Abruf der direkt geprüften Quellen: 19.10.2026 und 20.10.2026.

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

### Automatisierte Modellprüfung

Die 17 Node-Tests prüfen unter anderem Schalenbesetzung und tatsächliche Elektronen pro Schale, kumulative Abschirmschichten und verbleibende Gamma-Spuren, Massenzahlen/Ladungen und gezählte Kernteilchen des Spaltungskanals, jeden Schritt der 14-stufigen Uran-Radium-Reihe, exponentielle Verdopplung, die Spaltprodukt-Zerfallsreihen (A konstant, Z + 1, stabile Endkerne), den Kettenbaum 3^g, die Bombenschemata sowie alle 45 Antwortschlüssel. Hinzu kommen statistische Halbwertszeit-Prüfungen mit 100 000 Anfangskernen.

Bei Änderungen außerdem im Browser Zeitregler ohne neue Zufallsreihe, alle neun Stationen, Tastaturnavigation, Mobilansicht und die drei getrennten Druckausgaben prüfen. Ein Testdruck auf realem Papier und eine Erprobung mit einer echten Lerngruppe stehen weiterhin aus.

Prüfstand vom 20.10.2026: 17 Node-Tests bestanden; alle Prinzipbilder (Kettenbaum, Kanonen-/Implosionsprinzip, Wasserstoffbombe) als eigenständige SVG gerendert und visuell geprüft; U-235-Stepper im Browser bis Bildschritt 7 geprüft; das schwarze Dreieck an den Halbwertszeit-Linien (fehlendes fill) behoben.

Prüfstand der Überarbeitung vom 19.10.2026: 13 Node-Tests bestanden; alle 36 Auswahlaufgaben im Browser mit fachlichen Rückmeldungen geprüft. Das Zeitpunkt-Ablesen lässt die vollständige Zufallstabelle unverändert; Tabelle und Kernpunkte stimmen überein. Die getrennten Druckmodi zeigen jeweils nur Lernzettel, Test oder Lösungen und übernehmen eigene Testantworten. Alle neun Stationen wurden bei 320/768/1280 Pixeln ohne Seitenüberlauf geprüft. Ein PDF-Export über das integrierte Browser-Testprotokoll ist nicht verfügbar; die Druck-Medienregeln wurden im Browser geprüft, keine physische Papierausgabe behauptet.
