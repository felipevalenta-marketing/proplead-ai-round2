(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.PropLead = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const SUPPORTED_CHANNELS = ['web_form', 'email', 'whatsapp', 'property_portal', 'social', 'manual'];
  const SCORE_WEIGHTS = {
    budget_eur: 20,
    locations: 20,
    property_type: 15,
    min_bedrooms: 15,
    timeline_months: 15,
    purpose: 10,
    financing_status: 5
  };

  const LANGUAGE_TERMS = {
    es: ['hola', 'busco', 'quiero', 'necesito', 'presupuesto', 'habitaciones', 'dormitorios', 'mudarnos', 'vivienda', 'hipoteca', 'comprar', 'inversion', 'licencia turistica'],
    de: ['hallo', 'ich', 'wir', 'suche', 'suchen', 'wohnung', 'haus', 'budget', 'schlafzimmer', 'kaufen', 'finanzierung', 'immobilie', 'preis', 'ferienvermietung', 'meerblick'],
    en: ['hello', 'looking', 'need', 'budget', 'bedroom', 'buy', 'purchase', 'mortgage', 'property', 'apartment', 'villa', 'relocating', 'sea view']
  };

  const LOCATION_RULES = [
    { canonical: 'Palma', aliases: ['palma', 'palma old town', 'old town palma', 'casco antiguo de palma', 'casco antiguo', 'palma altstadt', 'palmas altstadt', 'santa catalina', 'santa catalina palma'] },
    { canonical: "Cala d'Or", aliases: ["cala d'or", 'cala dor', 'cala d or'] },
    { canonical: 'Sóller', aliases: ['port de soller', 'port de sóller', 'soller', 'sóller'] },
    { canonical: 'Artà', aliases: ['arta', 'artà'] },
    { canonical: 'Sant Llorenç des Cardassar', aliases: ['sant llorenc des cardassar', 'sant llorenç des cardassar'] },
    { canonical: 'Inca', aliases: ['inca'] },
    { canonical: 'Mallorca', aliases: ['mallorca'] }
  ];

  const FEATURE_RULES = [
    { canonical: 'pool', aliases: ['pool', 'piscina'] },
    { canonical: 'parking', aliases: ['parking', 'aparcamiento', 'stellplatz'] },
    { canonical: 'sea view', aliases: ['sea view', 'sea front', 'seafront', 'frontline', 'beachfront', 'frente al mar', 'meerblick', 'on the beach', 'directly on the sea', 'direkt am meer', 'primera linea'] },
    { canonical: 'tourist licence', aliases: ['tourist licence', 'tourist license', 'tourist rental licence', 'tourist rental license', 'licencia turistica', 'licencia turística', 'ferienvermietung'] },
    { canonical: 'renovation', aliases: ['renovation', 'renovate', 'renovating', 'reformar', 'reforma', 'reform', 'renovierungsbeduerftig', 'renovierungsbedürftig', 'for reform', 'to renovate'] }
  ];

  const NUMBER_WORDS = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    once: 11,
    twelve: 12,
    ein: 1,
    eins: 1,
    eine: 1,
    zwei: 2,
    drei: 3,
    vier: 4,
    fuenf: 5,
    funf: 5,
    sechs: 6,
    sieben: 7,
    acht: 8,
    neun: 9,
    zehn: 10,
    uno: 1,
    una: 1,
    dos: 2,
    tres: 3,
    cuatro: 4,
    cinco: 5,
    seis: 6,
    siete: 7,
    ocho: 8,
    nueve: 9,
    diez: 10
  };

  function stripDiacritics(value) {
    return String(value || '').normalize('NFD').replace(/\p{M}/gu, '');
  }

  function normaliseText(value) {
    return String(value || '')
      .replace(/[’´`]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normaliseForMatching(value) {
    return stripDiacritics(normaliseText(value))
      .toLowerCase()
      .replace(/[’'`´]/g, ' ')
      .replace(/[^a-z0-9]+/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenisedMatch(haystack, phrase) {
    const hay = ` ${normaliseForMatching(haystack)} `;
    const needle = ` ${normaliseForMatching(phrase)} `;
    return hay.includes(needle);
  }

  function normaliseInput(input) {
    const sourceChannel = SUPPORTED_CHANNELS.includes(input.source_channel) ? input.source_channel : 'manual';
    const message = normaliseText(input.original_text || input.message);
    if (!message) throw new Error('A lead message is required.');
    return {
      lead_id: input.lead_id || `lead-${Date.now()}`,
      source_channel: sourceChannel,
      source_message_id: input.source_message_id || null,
      received_at: input.received_at || new Date().toISOString(),
      consent_status: input.consent_status || 'synthetic_demo',
      source_metadata: input.source_metadata || {},
      original_text: message
    };
  }

  function detectLanguage(text) {
    const lower = normaliseForMatching(text);
    const scores = {};
    for (const [language, terms] of Object.entries(LANGUAGE_TERMS)) {
      scores[language] = terms.reduce((total, term) => total + (lower.includes(normaliseForMatching(term)) ? 1 : 0), 0);
    }
    const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const language = ranking[0][1] === 0 ? 'en' : ranking[0][0];
    const activeLanguages = ranking.filter(([, score]) => score >= 2).map(([key]) => key);
    return { language, scores, mixed: activeLanguages.length > 1 };
  }

  function parseBudgetValue(rawNumber, rawUnit) {
    let cleaned = String(rawNumber || '').replace(/\s/g, '');
    const unit = normaliseForMatching(rawUnit).replace(/\s/g, '');
    const millions = ['m', 'million', 'millionen', 'millions', 'millon', 'millones'];
    const thousands = ['k', 'mil'];

    if (millions.includes(unit)) {
      return Math.round(Number(cleaned.replace(',', '.')) * 1000000);
    }
    if (thousands.includes(unit)) {
      return Math.round(Number(cleaned.replace(',', '.')) * 1000);
    }
    if (/^\d{1,3}([.,]\d{3})+$/.test(cleaned)) {
      return Math.round(Number(cleaned.replace(/[.,]/g, '')));
    }
    cleaned = cleaned.replace(',', '.');
    const value = Number(cleaned);
    return Number.isFinite(value) && value >= 100000 ? Math.round(value) : null;
  }

  function extractBudgets(text) {
    const source = stripDiacritics(normaliseText(text)).toLowerCase();
    const values = [];
    const patterns = [
      /(?:\u20ac|eur|euro|euros)\s*([0-9][0-9.,]*)\s*(k|mil|m|million(?:es)?|millones?|millon)?\b/gi,
      /\b([0-9][0-9.,]*)\s*(k|mil|m|million(?:en|es)?|millones?|millon)\b/gi,
      /\b(?:budget|presupuesto)\b[^0-9]{0,20}([0-9][0-9.,]*)\s*(k|mil|m|million(?:es)?|millones?|millon)?\b/gi,
      /\b([0-9][0-9.,]*)\s*(?:\u20ac|eur|euro|euros)\b/gi,
      /(?:\u20ac|eur|euro|euros)\s*([0-9][0-9.,]*)\b/gi
    ];
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        const value = parseBudgetValue(match[1], match[2]);
        if (value && !values.includes(value)) values.push(value);
      }
    }
    return values;
  }

  function findLocationMatches(text) {
    const lower = normaliseForMatching(text);
    const haystack = ` ${lower} `;
    const found = [];
    for (const item of LOCATION_RULES) {
      let best = null;
      for (const alias of item.aliases) {
        const aliasMatch = ` ${normaliseForMatching(alias)} `;
        const index = haystack.indexOf(aliasMatch);
        if (index >= 0) {
          const candidate = { canonical: item.canonical, alias, index, score: aliasMatch.length };
          if (!best || candidate.index < best.index || (candidate.index === best.index && candidate.score > best.score)) {
            best = candidate;
          }
        }
      }
      if (best) found.push(best);
    }
    found.sort((a, b) => a.index - b.index || b.score - a.score);
    const canonical = [];
    const evidence = [];
    for (const item of found) {
      if (!canonical.includes(item.canonical)) canonical.push(item.canonical);
      if (!evidence.includes(item.alias)) evidence.push(item.alias);
    }
    const filtered = canonical.some(location => location !== 'Mallorca') ? canonical.filter(location => location !== 'Mallorca') : canonical;
    return { locations: filtered, evidence };
  }

  function extractLocations(text) {
    return findLocationMatches(text);
  }

  function extractPropertyType(text, locations) {
    const lower = normaliseForMatching(text);
    const typesFound = [];
        const specificRules = [
      ['apartment', ['apartment', 'flat', 'apartamento', 'piso', 'wohnung']],
      ['townhouse', ['townhouse', 'casa de pueblo', 'village house', 'reihenhaus', 'stadthaus']],
      ['finca', ['finca', 'country house', 'landhaus', 'casa de campo']],
      ['villa', ['villa', 'detached villa']]
    ];

    for (const [value, aliases] of specificRules) {
      if (aliases.some(alias => tokenisedMatch(lower, alias))) typesFound.push(value);
    }

    const genericHousePresent = /\b(house|haus)\b|\bcasa\b(?!\s+de\s+(?:pueblo|campo))/i.test(lower);
    if (typesFound.length === 0 && genericHousePresent) {
      if (locations && locations.some(location => location === 'Sant Llorenç des Cardassar' || location === 'Inca')) typesFound.push('townhouse');
      else typesFound.push('house');
    } else if (typesFound.length > 0 && genericHousePresent) {
      typesFound.push('house');
    }

    const unique = [...new Set(typesFound)];
    return { value: unique.length === 1 ? unique[0] : null, ambiguous: unique.length > 1 };
  }

  function buildNumberWordPattern() {
    return Object.keys(NUMBER_WORDS)
      .sort((a, b) => b.length - a.length)
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
  }

  function extractBedrooms(text) {
    const lower = normaliseForMatching(text);
    const roomWords = '(?:bed(?:room)?s?|beds?|rooms?|habitaciones?|dormitorios?|schlafzimmern?|schlafzimmer|zimmern?)';
    const numberWords = buildNumberWordPattern();
    const rangePattern = new RegExp(`\\b(?:\\d+|${numberWords})\\s*(?:-|to|or|oder|o)\\s*(?:\\d+|${numberWords})\\s*${roomWords}\\b`, 'i');
    if (rangePattern.test(lower)) {
      return { value: null, ambiguous: true };
    }
    const digitMatch = lower.match(new RegExp(`\\b(\\d+)\\s*${roomWords}\\b`, 'i'));
    if (digitMatch) return { value: Number(digitMatch[1]), ambiguous: false };
    const words = Object.entries(NUMBER_WORDS).sort((a, b) => b[0].length - a[0].length);
    for (const [word, value] of words) {
      const pattern = new RegExp(`\\b${word}\\b(?:\\s*-?\\s*|\\s+)${roomWords}\\b`, 'i');
      if (pattern.test(lower)) return { value, ambiguous: false };
    }
    return { value: null, ambiguous: false };
  }

  function extractTimeline(text) {
    const lower = normaliseForMatching(text);
    if (/next three months|within (?:the )?next three months|3 months|tres meses|drei monaten/i.test(lower)) return 3;
    if (/within six months|6 months|seis meses|sechs monaten/i.test(lower)) return 6;
    return null;
  }

  function extractPurpose(text) {
    const lower = normaliseForMatching(text);
    if (/invest|invert|inversi|anlageobjekt|rendite|alquilar.*ingresos/i.test(lower)) return 'investment';
    if (/relocat|mudarnos|umzieh/i.test(lower)) return 'relocation';
    return null;
  }

  function extractFinancing(text) {
    const lower = normaliseForMatching(text);
    if (/finanzierung noch unklar|financing.*unclear|financiaci[oó]n.*(sin|no|duda|aclar)/i.test(lower)) return 'unknown';
    if (/mortgage|hipoteca|finanzier/i.test(lower)) return 'mortgage';
    if (/cash buyer|al contado|barzahler/i.test(lower)) return 'cash';
    return null;
  }

  function canonicaliseFeature(feature) {
    const lower = normaliseForMatching(feature);
    for (const rule of FEATURE_RULES) {
      if (rule.aliases.some(alias => tokenisedMatch(lower, alias))) return rule.canonical;
    }
    return null;
  }

  function extractMustHaves(text) {
    const lower = normaliseForMatching(text);
    const features = [];
    for (const rule of FEATURE_RULES) {
      if (rule.aliases.some(alias => tokenisedMatch(lower, alias))) features.push(rule.canonical);
    }
    return [...new Set(features)];
  }

  function canonicaliseCatalogueFeatures(features) {
    return [...new Set((features || []).map(canonicaliseFeature).filter(Boolean))];
  }

  function policyFlags(text) {
    const lower = normaliseForMatching(text);
    const flags = [];
    if (/guarantee.*mortgage|asegurar.*hipoteca|garant.*finanz/i.test(lower)) flags.push('mortgage_advice');
    if (/avoid.*tax|sin declarar|steuer.*vermeid/i.test(lower)) flags.push('tax_or_legal_advice');
    if (/negotiate|negoci|herunterhandeln|contrato|contract.*review|vertrag.*pruf/i.test(lower)) flags.push('negotiation_or_contract');
    return flags;
  }

  function calculateScore(lead) {
    let score = 0;
    const breakdown = {};
    for (const [field, weight] of Object.entries(SCORE_WEIGHTS)) {
      const value = lead[field];
      const present = Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== '';
      breakdown[field] = present ? weight : 0;
      if (present) score += weight;
    }
    return { score, breakdown };
  }

  function priorityFor(score, riskFlags, confidence) {
    if (riskFlags.length || confidence === 'low') return 'review';
    if (score >= 80) return 'hot';
    if (score >= 55) return 'warm';
    return 'cold';
  }

  function isSpecificLocation(locations) {
    return locations.some(location => location !== 'Mallorca');
  }

  function qualify(lead) {
    const missing = [];
    if (!lead.budget_eur) missing.push('budget_eur');
    if (!isSpecificLocation(lead.locations)) missing.push('specific_location');
    if (!lead.property_type && !lead.min_bedrooms) missing.push('property_type_or_bedrooms');
    const blockingAmbiguity = lead.risk_flags.some(flag => ['conflicting_budget', 'ambiguous_property_type', 'ambiguous_bedrooms'].includes(flag));
    return {
      missing_fields: missing,
      qualification_status: missing.length || blockingAmbiguity ? 'needs_information' : 'matching_ready'
    };
  }

  function mapPropertyType(requested, actual) {
    if (!requested) return true;
    if (requested === actual) return true;
    return requested === 'house' && ['townhouse', 'villa'].includes(actual);
  }

  function daysBetween(dateA, dateB) {
    return Math.floor(Math.abs(new Date(dateA) - new Date(dateB)) / 86400000);
  }

  function explicitAreaEvidence(lead, property) {
    const propertyTitle = normaliseForMatching(property.title || '');
    return lead.location_evidence.some(evidence => {
      const normalisedEvidence = normaliseForMatching(evidence);
      if (!normalisedEvidence || normalisedEvidence === normaliseForMatching(property.location)) return false;
      return propertyTitle.includes(normalisedEvidence);
    });
  }

  function buildMatchReason(lead, property, propertyFeatures, referenceDate) {
    const reasons = [];
    if (lead.location_evidence.length) {
      const specificEvidence = lead.location_evidence.find(evidence => normaliseForMatching(evidence) !== normaliseForMatching(property.location));
      if (specificEvidence && normaliseForMatching(property.title || '').includes(normaliseForMatching(specificEvidence))) {
        reasons.push(`area: ${specificEvidence}`);
      }
    }
    reasons.push(`location: ${property.location}`);
    reasons.push(`type: ${property.type}`);
    reasons.push(`bedrooms: ${property.bedrooms}`);
    if (lead.min_bedrooms) reasons.push(`meets requested minimum bedrooms (${lead.min_bedrooms})`);
    if (lead.budget_eur) reasons.push(`within budget (${property.price_eur} <= ${lead.budget_eur})`);
    if (lead.must_have_features.length) {
      const matchedFeatures = lead.must_have_features.filter(feature => propertyFeatures.includes(feature));
      if (matchedFeatures.length) reasons.push(`features: ${matchedFeatures.join(', ')}`);
    }
    reasons.push(`availability verified ${property.last_verified_at}`);
    if (referenceDate) reasons.push(`reference date ${referenceDate}`);
    return reasons;
  }

  function scoreMatch(lead, property, propertyFeatures, referenceDate, freshnessDays) {
    const requestedFeatures = lead.must_have_features || [];
    const matchedFeatures = requestedFeatures.filter(feature => propertyFeatures.includes(feature));
    const specificAreaBonus = explicitAreaEvidence(lead, property) ? 4 : 0;
    const exactLocationBonus = lead.locations.includes(property.location) ? 4 : 0;
    const typeBonus = lead.property_type === property.type ? 4 : lead.property_type === 'house' && ['townhouse', 'villa'].includes(property.type) ? 2 : 0;
    const bedroomBonus = lead.min_bedrooms ? Math.max(0, 4 - Math.abs(property.bedrooms - lead.min_bedrooms)) : 0;
    const featureBonus = matchedFeatures.length * 5;
    const priceBonus = lead.budget_eur ? Math.max(0, Math.floor((lead.budget_eur - property.price_eur) / 100000)) : 0;
    const freshnessBonus = Math.max(0, freshnessDays - daysBetween(property.last_verified_at, referenceDate));
    return specificAreaBonus + exactLocationBonus + typeBonus + bedroomBonus + featureBonus + priceBonus + freshnessBonus;
  }

  function matchProperties(lead, catalogue, options) {
    if (lead.qualification_status !== 'matching_ready') return [];
    const referenceDate = options.reference_date || new Date().toISOString().slice(0, 10);
    const freshnessDays = options.availability_freshness_days || 30;
    const requestedFeatures = lead.must_have_features || [];

    return catalogue
      .map(property => ({ ...property, _canonical_features: canonicaliseCatalogueFeatures(property.key_features) }))
      .filter(property => property.status === 'available')
      .filter(property => property.last_verified_at && daysBetween(property.last_verified_at, referenceDate) <= freshnessDays)
      .filter(property => property.price_eur <= lead.budget_eur)
      .filter(property => lead.locations.includes(property.location))
      .filter(property => mapPropertyType(lead.property_type, property.type))
      .filter(property => !lead.min_bedrooms || property.bedrooms >= lead.min_bedrooms)
      .filter(property => requestedFeatures.every(feature => property._canonical_features.includes(feature)))
      .map(property => {
        const matchScore = scoreMatch(lead, property, property._canonical_features, referenceDate, freshnessDays);
        return {
          ...property,
          match_score: matchScore,
          match_reason: buildMatchReason(lead, property, property._canonical_features, referenceDate)
        };
      })
      .sort((a, b) => b.match_score - a.match_score || a.price_eur - b.price_eur || a.id.localeCompare(b.id))
      .slice(0, 3)
      .map(({ _canonical_features, ...property }) => property);
  }

  const LABELS = {
    en: { budget_eur: 'your maximum budget', specific_location: 'your preferred area', property_type_or_bedrooms: 'the property type or minimum number of bedrooms' },
    es: { budget_eur: 'su presupuesto maximo', specific_location: 'la zona especifica que prefiere', property_type_or_bedrooms: 'el tipo de propiedad o el numero minimo de dormitorios' },
    de: { budget_eur: 'Ihr maximales Budget', specific_location: 'Ihre bevorzugte genaue Lage', property_type_or_bedrooms: 'den Immobilientyp oder die Mindestanzahl der Schlafzimmer' }
  };

  function joinNatural(items, language) {
    if (items.length <= 1) return items[0] || '';
    const conjunction = language === 'es' ? ' y ' : language === 'de' ? ' und ' : ' and ';
    return `${items.slice(0, -1).join(', ')}${conjunction}${items[items.length - 1]}`;
  }

  function draftReply(lead) {
    const lang = lead.language;
    if (lead.qualification_status === 'needs_information') {
      const items = lead.missing_fields.map(field => LABELS[lang][field]);
      if (lang === 'es') return `Gracias por su consulta. Para poder encontrar opciones adecuadas, podria confirmarnos ${joinNatural(items, lang)}? Revisaremos su respuesta antes de recomendar cualquier propiedad.`;
      if (lang === 'de') return `Vielen Dank fur Ihre Anfrage. Damit wir passende Optionen finden konnen, konnten Sie bitte ${joinNatural(items, lang)} bestatigen? Wir prufen Ihre Antwort, bevor wir eine Immobilie empfehlen.`;
      return `Thank you for your enquiry. To help us find suitable options, could you please confirm ${joinNatural(items, lang)}? We will review your answer before recommending any property.`;
    }
    if (lead.matches.length) {
      if (lang === 'es') return `Gracias por su consulta. Hemos identificado ${lead.matches.length} opcion${lead.matches.length > 1 ? 'es' : ''} que coincide${lead.matches.length > 1 ? 'n' : ''} con los requisitos indicados. Un agente comprobara la disponibilidad y revisara los detalles antes de responderle.`;
      if (lang === 'de') return `Vielen Dank fur Ihre Anfrage. Wir haben ${lead.matches.length} mogliche Option${lead.matches.length > 1 ? 'en' : ''} gefunden, die Ihren Angaben entspricht. Ein Makler pruft die Verfugbarkeit und alle Details, bevor wir Ihnen antworten.`;
      return `Thank you for your enquiry. We identified ${lead.matches.length} possible option${lead.matches.length > 1 ? 's' : ''} matching your stated requirements. An agent will confirm availability and review the details before replying.`;
    }
    if (lang === 'es') return 'Gracias por su consulta. No hemos encontrado una coincidencia fiable en el catalogo actual. Un agente revisara su solicitud antes de responderle.';
    if (lang === 'de') return 'Vielen Dank fur Ihre Anfrage. Im aktuellen Katalog wurde keine verlassliche Ubereinstimmung gefunden. Ein Makler pruft Ihre Anfrage, bevor wir Ihnen antworten.';
    return 'Thank you for your enquiry. We could not find a reliable match in the current catalogue. An agent will review your request before replying.';
  }

  function extractLead(normalised) {
    const text = normalised.original_text;
    const languageResult = detectLanguage(text);
    const budgets = extractBudgets(text);
    const locationResult = extractLocations(text);
    const propertyType = extractPropertyType(text, locationResult.locations);
    const bedrooms = extractBedrooms(text);
    const riskFlags = policyFlags(text);
    if (budgets.length > 1) riskFlags.push('conflicting_budget');
    if (propertyType.ambiguous) riskFlags.push('ambiguous_property_type');
    if (bedrooms.ambiguous) riskFlags.push('ambiguous_bedrooms');
    if (languageResult.mixed) riskFlags.push('mixed_language');
    if (locationResult.locations.length > 1) riskFlags.push('multiple_locations');
    if (/\b(maybe|perhaps|possibly|vielleicht|quizas|quizás|tal vez)\b/i.test(normaliseForMatching(text))) riskFlags.push('uncertain_requirements');
    const confidence = riskFlags.some(flag => flag.startsWith('ambiguous') || flag === 'conflicting_budget') ? 'low' : languageResult.mixed ? 'medium' : 'high';
    const lead = {
      ...normalised,
      language: languageResult.language,
      budget_eur: budgets.length === 1 ? budgets[0] : null,
      locations: locationResult.locations,
      location_evidence: locationResult.evidence,
      property_type: propertyType.value,
      min_bedrooms: bedrooms.value,
      timeline_months: extractTimeline(text),
      purpose: extractPurpose(text),
      financing_status: extractFinancing(text),
      must_have_features: extractMustHaves(text),
      risk_flags: [...new Set(riskFlags)],
      confidence,
      evidence: { original_text: text }
    };
    const scoreResult = calculateScore(lead);
    const qualification = qualify(lead);
    return {
      ...lead,
      ...scoreResult,
      ...qualification,
      priority: priorityFor(scoreResult.score, lead.risk_flags, confidence)
    };
  }

  function processLead(input, catalogue, options = {}) {
    const extracted = extractLead(normaliseInput(input));
    const matches = matchProperties(extracted, catalogue, options);
    const zeroMatch = extracted.qualification_status === 'matching_ready' && matches.length === 0;
    const riskFlags = zeroMatch ? [...extracted.risk_flags, 'zero_match'] : extracted.risk_flags;
    const result = {
      ...extracted,
      risk_flags: [...new Set(riskFlags)],
      priority: priorityFor(extracted.score, riskFlags, extracted.confidence),
      matches,
      must_escalate: riskFlags.length > 0 || extracted.qualification_status === 'needs_information',
      human_review_required: true,
      status: extracted.qualification_status === 'needs_information' ? 'needs_information' : 'awaiting_agent_approval'
    };
    result.draft_reply = draftReply(result);
    return result;
  }

  return {
    SUPPORTED_CHANNELS,
    SCORE_WEIGHTS,
    normaliseInput,
    detectLanguage,
    extractLead,
    calculateScore,
    matchProperties,
    draftReply,
    processLead
  };
});
