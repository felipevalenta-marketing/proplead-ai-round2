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
    es: ['hola', 'busco', 'quiero', 'necesito', 'presupuesto', 'habitaciones', 'dormitorios', 'mudarnos', 'vivienda', 'hipoteca', 'comprar', 'inversión', 'licencia turística'],
    de: ['hallo', 'ich', 'wir', 'suche', 'suchen', 'wohnung', 'haus', 'budget', 'schlafzimmer', 'kaufen', 'finanzierung', 'immobilie', 'preis'],
    en: ['hello', 'looking', 'need', 'budget', 'bedroom', 'buy', 'purchase', 'mortgage', 'property', 'apartment', 'villa', 'relocating']
  };

  const LOCATION_ALIASES = [
    { canonical: 'Sant Llorenç des Cardassar', aliases: ['sant llorenç des cardassar', 'sant llorenc des cardassar'] },
    { canonical: "Cala d'Or", aliases: ["cala d'or", 'cala dor'] },
    { canonical: 'Sóller', aliases: ['port de sóller', 'port de soller', 'sóller', 'soller'] },
    { canonical: 'Palma', aliases: ['palma'] },
    { canonical: 'Artà', aliases: ['artà', 'arta'] },
    { canonical: 'Inca', aliases: ['inca'] },
    { canonical: 'Mallorca', aliases: ['mallorca'] }
  ];

  const NUMBER_WORDS = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    ein: 1, eine: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, funf: 5,
    uno: 1, una: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5
  };

  function normaliseText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
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
    const lower = text.toLowerCase();
    const scores = {};
    for (const [language, terms] of Object.entries(LANGUAGE_TERMS)) {
      scores[language] = terms.reduce((total, term) => total + (lower.includes(term) ? 1 : 0), 0);
    }
    const ranking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const language = ranking[0][1] === 0 ? 'en' : ranking[0][0];
    const activeLanguages = ranking.filter(([, score]) => score >= 2).map(([key]) => key);
    return { language, scores, mixed: activeLanguages.length > 1 };
  }

  function parseMoneyToken(token, suffix) {
    let cleaned = token.replace(/\s/g, '');
    const unit = (suffix || '').toLowerCase();
    if (unit === 'm' || unit === 'million' || unit === 'millón' || unit === 'millon') {
      return Math.round(Number(cleaned.replace(',', '.')) * 1000000);
    }
    if (unit === 'k') return Math.round(Number(cleaned.replace(',', '.')) * 1000);
    if (/^\d{1,3}([.,]\d{3})+$/.test(cleaned)) cleaned = cleaned.replace(/[.,]/g, '');
    else cleaned = cleaned.replace(',', '.');
    const value = Number(cleaned);
    return Number.isFinite(value) && value >= 100000 ? Math.round(value) : null;
  }

  function extractBudgets(text) {
    const values = [];
    const patterns = [
      /€\s*([0-9]+(?:[.,][0-9]+)*)\s*(million|millón|millon|m|k)?/gi,
      /([0-9]+(?:[.,][0-9]+)*)\s*(million|millón|millon|m|k)?\s*(?:euros?|€)/gi,
      /(?:budget|presupuesto)\b[^0-9]{0,24}([0-9]+(?:[.,][0-9]+)*)\s*(million|millón|millon|m|k)\b/gi
    ];
    for (const pattern of patterns) {
      for (const match of text.matchAll(pattern)) {
        const value = parseMoneyToken(match[1], match[2]);
        if (value && !values.includes(value)) values.push(value);
      }
    }
    return values;
  }

  function extractLocations(text) {
    const lower = text.toLowerCase();
    const found = [];
    for (const item of LOCATION_ALIASES) {
      let earliest = -1;
      for (const alias of item.aliases) {
        const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const match = new RegExp(`(^|[^\\p{L}])${escaped}(?=$|[^\\p{L}])`, 'iu').exec(lower);
        if (match) {
          const index = match.index + match[1].length;
          if (earliest === -1 || index < earliest) earliest = index;
        }
      }
      if (earliest >= 0) found.push({canonical:item.canonical,index:earliest});
    }
    const ordered = found.sort((a,b)=>a.index-b.index).map(item=>item.canonical);
    return ordered.filter(value => value !== 'Mallorca' || !ordered.some(other => other !== 'Mallorca'));
  }

  function extractPropertyType(text, locations) {
    const lower = text.toLowerCase();
    const typesFound = [];
    if (/\b(apartment|flat|apartamento|piso|wohnung)\b/i.test(lower)) typesFound.push('apartment');
    if (/\b(villa)\b/i.test(lower)) typesFound.push('villa');
    if (/\b(finca|country house|landhaus)\b/i.test(lower)) typesFound.push('finca');
    if (/townhouse|casa de pueblo/i.test(lower)) typesFound.push('townhouse');
    if (/casa para reformar/i.test(lower)) typesFound.push('townhouse');
    if (/\b(house|haus|casa)\b/i.test(lower) && !typesFound.includes('townhouse')) {
      if (locations.includes('Sant Llorenç des Cardassar')) typesFound.push('townhouse');
      else typesFound.push('house');
    }
    const unique = [...new Set(typesFound)];
    return { value: unique.length === 1 ? unique[0] : null, ambiguous: unique.length > 1 };
  }

  function extractBedrooms(text) {
    const lower = text.toLowerCase();
    if (/\b\d+\s*(?:oder|or|o)\s*\d+\s*(?:zimmer|bedrooms?|habitaciones?|dormitorios?)/i.test(lower)) {
      return { value: null, ambiguous: true };
    }
    const digit = lower.match(/\b(\d+)\s*(?:[- ]?bedrooms?|habitaciones?|dormitorios?|schlafzimmer)/i);
    if (digit) return { value: Number(digit[1]), ambiguous: false };
    for (const [word, value] of Object.entries(NUMBER_WORDS)) {
      const pattern = new RegExp(`\\b${word}\\b(?=.{0,12}(?:bedrooms?|habitaciones?|dormitorios?|schlafzimmer))`, 'i');
      if (pattern.test(lower)) return { value, ambiguous: false };
    }
    return { value: null, ambiguous: false };
  }

  function extractTimeline(text) {
    const lower = text.toLowerCase();
    if (/next three months|within (?:the )?next three months|3 months|tres meses|drei monaten/i.test(lower)) return 3;
    if (/within six months|6 months|seis meses|sechs monaten/i.test(lower)) return 6;
    return null;
  }

  function extractPurpose(text) {
    const lower = text.toLowerCase();
    if (/invest|invert|inversi|anlageobjekt|rendite|alquilar.*ingresos/i.test(lower)) return 'investment';
    if (/relocat|mudarnos|umzieh/i.test(lower)) return 'relocation';
    return null;
  }

  function extractFinancing(text) {
    const lower = text.toLowerCase();
    if (/finanzierung noch unklar|financing.*unclear|financiaci[oó]n.*(sin|no|duda|aclar)/i.test(lower)) return 'unknown';
    if (/mortgage|hipoteca|finanzier/i.test(lower)) return 'mortgage';
    if (/cash buyer|al contado|barzahler/i.test(lower)) return 'cash';
    return null;
  }

  function extractMustHaves(text) {
    const lower = text.toLowerCase();
    const features = [
      ['pool', /\b(pool|piscina)\b/i],
      ['parking', /\b(parking|aparcamiento|stellplatz)\b/i],
      ['sea view', /sea view|frente al mar|meerblick|on the beach/i],
      ['tourist licence', /tourist (?:rental )?licen[cs]e|licencia tur[ií]stica|ferienvermietung/i],
      ['renovation', /renovat|reformar|renovierungsbedürftig/i]
    ];
    return features.filter(([, pattern]) => pattern.test(lower)).map(([name]) => name);
  }

  function policyFlags(text) {
    const lower = text.toLowerCase();
    const flags = [];
    if (/guarantee.*mortgage|asegurar.*hipoteca|garant.*finanz/i.test(lower)) flags.push('mortgage_advice');
    if (/avoid.*tax|sin declarar|steuer.*vermeid/i.test(lower)) flags.push('tax_or_legal_advice');
    if (/negotiate|negoci|herunterhandeln|contrato|contract.*review|vertrag.*prüfen/i.test(lower)) flags.push('negotiation_or_contract');
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

  function matchProperties(lead, catalogue, options) {
    if (lead.qualification_status !== 'matching_ready') return [];
    const referenceDate = options.reference_date || new Date().toISOString().slice(0, 10);
    const freshnessDays = options.availability_freshness_days || 30;
    return catalogue
      .filter(property => property.status === 'available')
      .filter(property => property.last_verified_at && daysBetween(property.last_verified_at, referenceDate) <= freshnessDays)
      .filter(property => property.price_eur <= lead.budget_eur)
      .filter(property => lead.locations.includes(property.location))
      .filter(property => mapPropertyType(lead.property_type, property.type))
      .filter(property => !lead.min_bedrooms || property.bedrooms >= lead.min_bedrooms)
      .filter(property => !lead.must_have_features.includes('tourist licence') || property.key_features.includes('tourist licence'))
      .map(property => ({
        ...property,
        match_reason: [
          property.location,
          property.type,
          `${property.bedrooms} bedrooms`,
          'within budget',
          `availability verified ${property.last_verified_at}`
        ]
      }))
      .slice(0, 3);
  }

  const LABELS = {
    en: { budget_eur: 'your maximum budget', specific_location: 'your preferred area', property_type_or_bedrooms: 'the property type or minimum number of bedrooms' },
    es: { budget_eur: 'su presupuesto máximo', specific_location: 'la zona específica que prefiere', property_type_or_bedrooms: 'el tipo de propiedad o el número mínimo de dormitorios' },
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
      if (lang === 'es') return `Gracias por su consulta. Para poder encontrar opciones adecuadas, ¿podría confirmarnos ${joinNatural(items, lang)}? Revisaremos su respuesta antes de recomendar cualquier propiedad.`;
      if (lang === 'de') return `Vielen Dank für Ihre Anfrage. Damit wir passende Optionen finden können, könnten Sie bitte ${joinNatural(items, lang)} bestätigen? Wir prüfen Ihre Antwort, bevor wir eine Immobilie empfehlen.`;
      return `Thank you for your enquiry. To help us find suitable options, could you please confirm ${joinNatural(items, lang)}? We will review your answer before recommending any property.`;
    }
    if (lead.matches.length) {
      if (lang === 'es') return `Gracias por su consulta. Hemos identificado ${lead.matches.length} opción${lead.matches.length > 1 ? 'es' : ''} que coincide${lead.matches.length > 1 ? 'n' : ''} con los requisitos indicados. Un agente comprobará la disponibilidad y revisará los detalles antes de responderle.`;
      if (lang === 'de') return `Vielen Dank für Ihre Anfrage. Wir haben ${lead.matches.length} mögliche Option${lead.matches.length > 1 ? 'en' : ''} gefunden, die Ihren Angaben entspricht. Ein Makler prüft die Verfügbarkeit und alle Details, bevor wir Ihnen antworten.`;
      return `Thank you for your enquiry. We identified ${lead.matches.length} possible option${lead.matches.length > 1 ? 's' : ''} matching your stated requirements. An agent will confirm availability and review the details before replying.`;
    }
    if (lang === 'es') return 'Gracias por su consulta. No hemos encontrado una coincidencia fiable en el catálogo actual. Un agente revisará su solicitud antes de responderle.';
    if (lang === 'de') return 'Vielen Dank für Ihre Anfrage. Im aktuellen Katalog wurde keine verlässliche Übereinstimmung gefunden. Ein Makler prüft Ihre Anfrage, bevor wir Ihnen antworten.';
    return 'Thank you for your enquiry. We could not find a reliable match in the current catalogue. An agent will review your request before replying.';
  }

  function extractLead(normalised) {
    const text = normalised.original_text;
    const languageResult = detectLanguage(text);
    const budgets = extractBudgets(text);
    const locations = extractLocations(text);
    const propertyType = extractPropertyType(text, locations);
    const bedrooms = extractBedrooms(text);
    const riskFlags = policyFlags(text);
    if (budgets.length > 1) riskFlags.push('conflicting_budget');
    if (propertyType.ambiguous) riskFlags.push('ambiguous_property_type');
    if (bedrooms.ambiguous) riskFlags.push('ambiguous_bedrooms');
    if (languageResult.mixed) riskFlags.push('mixed_language');
    if (locations.length > 1) riskFlags.push('multiple_locations');
    if (/\b(maybe|perhaps|possibly|vielleicht|quiz[aá]s|tal vez)\b/i.test(text)) riskFlags.push('uncertain_requirements');
    const confidence = riskFlags.some(flag => flag.startsWith('ambiguous') || flag === 'conflicting_budget') ? 'low' : languageResult.mixed ? 'medium' : 'high';
    const lead = {
      ...normalised,
      language: languageResult.language,
      budget_eur: budgets.length === 1 ? budgets[0] : null,
      locations,
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
