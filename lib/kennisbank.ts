// Kennisbank wet- en regelgeving (briefing §3.4.2, Bijlage A). Dutch law, so
// the topics stay in Dutch. Every topic links to the official source, so the
// hotel can check the latest version of the rules itself.
// Links checked on 30 Oct 2026.

export interface KennisbankTopic {
  topic: string;
  explanation: string;
  source: string;
  url: string;
}

export interface KennisbankCategory {
  key: string;
  icon: string;
  name: string;
  topics: KennisbankTopic[];
}

const OP = "https://ondernemersplein.overheid.nl/wetten-en-regels";
const AP = "https://www.autoriteitpersoonsgegevens.nl/themas";
const BD = "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl";
const NVWA = "https://www.nvwa.nl/onderwerpen/voedselveiligheid";
const RIJK = "https://www.rijksoverheid.nl/themas";
const OMGEVINGSLOKET = "https://omgevingswet.overheid.nl/";

export const KENNISBANK: KennisbankCategory[] = [
  {
    key: "hotel",
    icon: "🏨",
    name: "Hotel & Exploitatie",
    topics: [
      { topic: "Exploitatievergunningen", explanation: "Veel gemeenten vereisen een exploitatievergunning.", source: "Ondernemersplein – Exploitatievergunning horeca", url: `${OP}/exploitatievergunning-horecabedrijf-aanvragen/` },
      { topic: "Hotelclassificatie", explanation: "Hotelsterren is de officiële Nederlandse classificatie.", source: "Hotelsterren", url: "https://www.hotelsterren.nl/" },
      { topic: "Lokale regelgeving", explanation: "Gemeenten stellen eigen regels op; controleer de APV.", source: "Ondernemersplein – APV", url: `${OP}/algemene-plaatselijke-verordening-apv/` },
      { topic: "Bestemmingsplan / Omgevingsplan", explanation: "Bepaalt wat er op een locatie mag gebeuren.", source: "Omgevingsloket", url: OMGEVINGSLOKET },
      { topic: "Openingstijden", explanation: "Specifieke openingstijden voor horeca; de gemeente legt ze vast in de APV.", source: "Ondernemersplein – APV", url: `${OP}/algemene-plaatselijke-verordening-apv/` },
      { topic: "Algemene hotelverplichtingen", explanation: "Gastenregistratie (nachtregister) en meldplicht.", source: "Ondernemersplein – Nachtregister bijhouden", url: `${OP}/nachtregister-bijhouden/` },
      { topic: "Toeristenbelasting", explanation: "Gemeenten heffen toeristenbelasting.", source: "Ondernemersplein – Toeristenbelasting", url: `${OP}/toeristenbelasting-betalen/` },
      { topic: "Rookverbod (handhaving)", explanation: "Binnen roken verboden, ook in rookruimtes. NVWA: 199 boetes bij 543 inspecties (2025).", source: "Ondernemersplein – Rookverbod op de werkplek", url: `${OP}/rookverbod-op-de-werkplek/` },
    ],
  },
  {
    key: "fire",
    icon: "🔥",
    name: "Brandveiligheid & Veiligheid",
    topics: [
      { topic: "Brandveiligheidsvoorschriften", explanation: "Voldoen aan het Besluit bouwwerken leefomgeving (Bbl).", source: "Ondernemersplein – Brandveilig gebruik", url: `${OP}/regels-brandveilig-gebruik-gebouw/` },
      { topic: "Melding brandveilig gebruik", explanation: "Gebruiksmelding uiterlijk 4 weken voor ingebruikname.", source: "Omgevingsloket", url: OMGEVINGSLOKET },
      { topic: "Brandmeldinstallaties", explanation: "Periodieke controle door gecertificeerd bedrijf.", source: "Ondernemersplein – Brandveilig gebruik", url: `${OP}/regels-brandveilig-gebruik-gebouw/` },
      { topic: "Vluchtroutes", explanation: "Vrij en gemarkeerd.", source: "Ondernemersplein – Inrichtingseisen horeca", url: `${OP}/eisen-aan-de-inrichting-van-een-horecabedrijf/` },
      { topic: "Brandblussers", explanation: "Jaarlijkse controle verplicht.", source: "Ondernemersplein – Brandveilig gebruik", url: `${OP}/regels-brandveilig-gebruik-gebouw/` },
      { topic: "Ontruimingsplannen", explanation: "Actueel plan; personeel moet het kennen.", source: "Ondernemersplein – Brandveilig gebruik", url: `${OP}/regels-brandveilig-gebruik-gebouw/` },
      { topic: "BHV", explanation: "Voldoende BHV'ers en geldige certificaten.", source: "Arboportaal – BHV", url: "https://www.arboportaal.nl/onderwerpen/arbozorg/bedrijfshulpverlening" },
      { topic: "Veiligheidscontroles (NEN 3140)", explanation: "Periodieke keuring elektrische installaties.", source: "NEN", url: "https://www.nen.nl/" },
      { topic: "Arbo & veiligheid", explanation: "RI&E en veilige werkomgeving.", source: "Arboportaal – RI&E", url: "https://www.arboportaal.nl/onderwerpen/arbowet--en--regelgeving/risico-inventarisatie---evaluatie" },
    ],
  },
  {
    key: "staff",
    icon: "👥",
    name: "Personeel & Arbeidsrecht",
    topics: [
      { topic: "Arbeidsovereenkomsten", explanation: "Schriftelijke overeenkomst verplicht.", source: "Rijksoverheid – Arbeidsovereenkomst en cao", url: `${RIJK}/werk/arbeidsovereenkomst-en-cao` },
      { topic: "Arbeidstijden", explanation: "Regels voor werk- en rusttijden.", source: "Rijksoverheid – Werktijden", url: `${RIJK}/werk/werktijden` },
      { topic: "Minimumloon", explanation: "Wettelijk minimumloon en jaarlijkse verhogingen.", source: "Rijksoverheid – Minimumloon", url: `${RIJK}/werk/minimumloon` },
      { topic: "Vakantiedagen", explanation: "Minimaal vier keer de wekelijkse arbeidsduur.", source: "Rijksoverheid – Vakantiedagen en vakantiegeld", url: `${RIJK}/werk/vakantiedagen-en-vakantiegeld` },
      { topic: "Ziekte & verzuim", explanation: "Loon doorbetalen en verzuimbegeleiding.", source: "Rijksoverheid – Ziekteverzuim", url: `${RIJK}/werk/ziekteverzuim-van-het-werk` },
      { topic: "Cao Hospitality", explanation: "Cao voor het Hotel-, Restaurant-, Café- en Cateringbedrijf.", source: "Rijksoverheid – Arbeidsovereenkomst en cao", url: `${RIJK}/werk/arbeidsovereenkomst-en-cao` },
      { topic: "Arbo", explanation: "RI&E en plan van aanpak verplicht.", source: "Arboportaal – RI&E", url: "https://www.arboportaal.nl/onderwerpen/arbowet--en--regelgeving/risico-inventarisatie---evaluatie" },
      { topic: "Pensioen", explanation: "Verplicht bij een verplichtgestelde bedrijfstakpensioenregeling.", source: "Rijksoverheid – Pensioen", url: `${RIJK}/werk/pensioen` },
      { topic: "Internationale medewerkers", explanation: "Verblijfs- en werkvergunning controleren.", source: "IND – Werken in Nederland", url: "https://ind.nl/nl/verblijfsvergunningen/werken" },
      { topic: "ZZP-regelgeving", explanation: "Voorkom schijnzelfstandigheid.", source: "Belastingdienst – Schijnzelfstandigheid", url: "https://over-ons.belastingdienst.nl/onderwerpen/schijnzelfstandigheid/" },
    ],
  },
  {
    key: "food",
    icon: "🍽",
    name: "Voedsel & Horeca",
    topics: [
      { topic: "NVWA-registratie", explanation: "Registreren via MijnNVWA bij regelmatige voedselverkoop.", source: "NVWA – Registratie en erkenning", url: `${NVWA}/levensmiddelen-produceren-en-verhandelen/registratie-en-erkenning` },
      { topic: "HACCP", explanation: "Voedselveiligheidsplan of hygiënecode verplicht.", source: "NVWA – HACCP", url: `${NVWA}/haccp` },
      { topic: "Voedselveiligheid", explanation: "Veilig bereiden, bewaren en verhandelen.", source: "Ondernemersplein – Voedselveilig werken", url: `${OP}/voedselveilig-werken/` },
      { topic: "Allergeneninformatie", explanation: "Gasten informeren over allergenen.", source: "NVWA – Allergenen", url: `${NVWA}/allergenen` },
      { topic: "Hygiëne", explanation: "Persoonlijke hygiëne en schoonmaakprotocollen.", source: "NVWA – Voedselveilig werken in de horeca", url: `${NVWA}/voedselveilig-werken-in-horeca-ambacht-en-retail` },
      { topic: "Alcoholwetgeving", explanation: "Leeftijdscontrole en drankvergunning.", source: "Ondernemersplein – Alcohol verkopen", url: `${OP}/alcohol-verkopen/` },
      { topic: "Horecavergunningen", explanation: "Vergunningen per gemeente.", source: "Ondernemersplein – Exploitatievergunning horeca", url: `${OP}/exploitatievergunning-horecabedrijf-aanvragen/` },
      { topic: "Terrasvergunningen", explanation: "Aparte vergunning per gemeente.", source: "Ondernemersplein – Terras, kraam en uitstalling", url: `${OP}/horeca-recreatie-en-catering/terras-kraam-en-uitstalling/` },
      { topic: "Keukenvoorschriften", explanation: "Afzuiging, oppervlakken en opslag.", source: "NVWA – Voedselveilig werken in de horeca", url: `${NVWA}/voedselveilig-werken-in-horeca-ambacht-en-retail` },
    ],
  },
  {
    key: "privacy",
    icon: "🔐",
    name: "Privacy & Data",
    topics: [
      { topic: "AVG / GDPR", explanation: "Algemene Verordening Gegevensbescherming.", source: "AP – Basis AVG", url: `${AP}/basis-avg` },
      { topic: "Cameratoezicht", explanation: "Regels voor camera's onder de AVG.", source: "AP – Cameratoezicht", url: `${AP}/cameratoezicht` },
      { topic: "Gastgegevens", explanation: "Alleen voor een gerechtvaardigd doel.", source: "AP – Grondslagen", url: `${AP}/basis-avg/avg-algemeen/grondslagen-avg-uitgelegd` },
      { topic: "Online boekingen", explanation: "E-commerce-eisen en veilige betalingen.", source: "ACM – Verkoop aan consumenten", url: "https://www.acm.nl/nl/verkoop-aan-consumenten" },
      { topic: "Marketing & cookies", explanation: "Toestemming voor cookies verplicht.", source: "AP – Cookies", url: `${AP}/internet-slimme-apparaten/cookies` },
      { topic: "E-mailmarketing", explanation: "Opt-in vereist.", source: "AP – Digitale direct marketing", url: `${AP}/internet-slimme-apparaten/reclame/digitale-direct-marketing` },
      { topic: "Dataretentie", explanation: "Bewaartermijnen vaststellen en naleven.", source: "AP – Bewaren van persoonsgegevens", url: `${AP}/basis-avg/privacy-en-persoonsgegevens/bewaren-van-persoonsgegevens` },
      { topic: "Cybersecurity", explanation: "Passende technische en organisatorische maatregelen.", source: "AP – Beveiliging", url: `${AP}/beveiliging` },
    ],
  },
  {
    key: "building",
    icon: "🏗",
    name: "Gebouw & Omgeving",
    topics: [
      { topic: "Bouwregelgeving", explanation: "Bouwbesluit / Bbl.", source: "Ondernemersplein – Regels voor bouwen", url: `${OP}/regels-voor-bouwen/` },
      { topic: "Omgevingsvergunning", explanation: "Vergunningcheck via het Omgevingsloket.", source: "Omgevingsloket", url: OMGEVINGSLOKET },
      { topic: "Brandveilig gebruik", explanation: "Vergunning of melding per gemeente.", source: "Ondernemersplein – Brandveilig gebruik", url: `${OP}/regels-brandveilig-gebruik-gebouw/` },
      { topic: "Installaties", explanation: "Periodieke keuringen (elektra, gas, water), onder meer legionellapreventie.", source: "Ondernemersplein – Legionella voorkomen", url: `${OP}/legionella-voorkomen/` },
      { topic: "Energie", explanation: "Energielabel en energieprestatie-eisen.", source: "RVO – Energielabel utiliteitsgebouwen", url: "https://www.rvo.nl/onderwerpen/wetten-en-regels-gebouwen/energielabel-utiliteitsgebouwen" },
      { topic: "Geluid", explanation: "Geluidsnormen voor installaties en activiteiten.", source: "Ondernemersplein – Geluidsvoorschriften", url: `${OP}/geluidsvoorschriften/` },
      { topic: "Toegankelijkheid", explanation: "VN-Verdrag handicap en toegankelijkheidseisen.", source: "Ondernemersplein – Inrichtingseisen horeca", url: `${OP}/eisen-aan-de-inrichting-van-een-horecabedrijf/` },
      { topic: "Milieuregels", explanation: "Afval, emissies, opslag gevaarlijke stoffen.", source: "Ondernemersplein – Milieubelastende activiteit", url: `${OP}/omgevingsvergunning-milieubelastende-activiteit/` },
    ],
  },
  {
    key: "sustainability",
    icon: "♻️",
    name: "Duurzaamheid & Milieu",
    topics: [
      { topic: "Energiebesparing", explanation: "Verplichte maatregelen en monitoring.", source: "RVO – Energiebesparingsplicht", url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht" },
      { topic: "Energie-audit (EED)", explanation: "Verplicht voor grote bedrijven.", source: "RVO – EED-auditplicht", url: "https://www.rvo.nl/onderwerpen/energiebesparingsplicht/eed-auditplicht" },
      { topic: "Afval scheiden (bedrijven)", explanation: "Zo goed mogelijk scheiden; zie de Afvalwijzer.", source: "Rijksoverheid – Afval buitenshuis scheiden", url: `${RIJK}/klimaat-milieu-en-natuur/afval/afval-buitenshuis-scheiden-en-recyclen` },
      { topic: "Wegwerpplastic (horeca)", explanation: "Geen plastic wegwerpbekers ter plaatse; herbruikbaar alternatief bij afhalen.", source: "Ondernemersplein – Wegwerpplastic", url: `${OP}/klanten-moeten-betalen-voor-plastic-bekers-en-bakjes-wegwerpplastic/` },
      { topic: "Recycling", explanation: "Gescheiden inzameling glas, papier, plastic.", source: "Afvalscheidingswijzer", url: "https://www.afvalscheidingswijzer.nl/" },
      { topic: "Watergebruik", explanation: "Zuinig omgaan met water.", source: "RVO – Energie besparen", url: "https://www.rvo.nl/onderwerpen/energie-besparen" },
      { topic: "Milieuregels", explanation: "Emissies, opslag, vervoer gevaarlijke stoffen.", source: "Ondernemersplein – Milieubelastende activiteit", url: `${OP}/omgevingsvergunning-milieubelastende-activiteit/` },
      { topic: "CO₂-rapportage", explanation: "Verplicht voor grotere bedrijven (werkgebonden personenmobiliteit).", source: "RVO – Rapportage WPM", url: "https://www.rvo.nl/onderwerpen/rapportage-wpm" },
      { topic: "CSRD", explanation: "Rapportageverplichting voor grote bedrijven.", source: "RVO – CSRD", url: "https://www.rvo.nl/onderwerpen/csrd" },
    ],
  },
  {
    key: "finance",
    icon: "💳",
    name: "Financieel & Administratief",
    topics: [
      { topic: "Facturatie", explanation: "Wettelijke eisen aan facturen (btw-nummer, KvK).", source: "Belastingdienst – Factuureisen", url: `${BD}/belastingdienst/zakelijk/btw/administratie_bijhouden/facturen_maken/factuureisen/factuureisen` },
      { topic: "Boekhouding", explanation: "Administratieplicht, 7 jaar bewaren.", source: "Belastingdienst – Administratie bijhouden", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/administratie-bijhouden/administratie-bijhouden" },
      { topic: "Belasting", explanation: "Btw, loonheffing, vennootschapsbelasting.", source: "Belastingdienst – Ondernemers", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/ondernemers/ondernemers" },
      { topic: "Toeristenbelasting", explanation: "Innen en afdragen aan gemeente.", source: "Ondernemersplein – Toeristenbelasting", url: `${OP}/toeristenbelasting-betalen/` },
      { topic: "Kassaregels", explanation: "Kassa met keurmerk en juiste administratie.", source: "Belastingdienst – Het kassasysteem in uw bedrijf", url: `${BD}/themaoverstijgend/brochures_en_publicaties/uw_bedrijf_en_het_kassasysteem` },
      { topic: "Betalingen", explanation: "Veilige betaalomgeving en administratie.", source: "ACM – Betaalmogelijkheden en betaalkosten", url: "https://www.acm.nl/nl/concurrentie-en-marktwerking/concurreren-en-samenwerken/concurrentie-het-betalingsverkeer/betaalmogelijkheden-en-betaalkosten-winkels" },
      { topic: "Administratieverplichtingen", explanation: "Minimaal 7 jaar bewaren.", source: "Belastingdienst – Administratie bijhouden", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/administratie-bijhouden/administratie-bijhouden" },
    ],
  },
];
