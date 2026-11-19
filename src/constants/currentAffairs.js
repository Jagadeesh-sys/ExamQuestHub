export const CURRENT_AFFAIR_TOPICS = [
  'National Affairs',
  'International Affairs',
  'Science and Technology',
  'Defence',
  'Economy',
  'Banking',
  'Sports',
  'Awards and Honours',
  'Appointments',
  'Important Days',
  'Environment',
  'Government Schemes',
  'Andhra Pradesh current affairs',
  'Telangana current affairs'
];

const TOPIC_ALIASES = {
  'national news': 'National Affairs',
  'national affairs': 'National Affairs',
  'national': 'National Affairs',
  'international affairs': 'International Affairs',
  'international relations': 'International Affairs',
  'international': 'International Affairs',
  'foreign policy': 'International Affairs',
  'science and technology': 'Science and Technology',
  'science & technology': 'Science and Technology',
  'science': 'Science and Technology',
  'technology': 'Science and Technology',
  'health': 'Science and Technology',
  'biotechnology': 'Science and Technology',
  'defence': 'Defence',
  'defense': 'Defence',
  'economy': 'Economy',
  'agriculture': 'Economy',
  'banking': 'Banking',
  'banking and finance': 'Banking',
  'finance': 'Banking',
  'sports': 'Sports',
  'awards and honours': 'Awards and Honours',
  'awards and honors': 'Awards and Honours',
  'awards': 'Awards and Honours',
  'appointments': 'Appointments',
  'important days': 'Important Days',
  'important events': 'Important Days',
  'environment': 'Environment',
  'renewable energy': 'Environment',
  'biodiversity': 'Environment',
  'disaster management': 'Environment',
  'government schemes': 'Government Schemes',
  'schemes': 'Government Schemes',
  'education': 'Government Schemes',
  'andhra pradesh current affairs': 'Andhra Pradesh current affairs',
  'andhra pradesh': 'Andhra Pradesh current affairs',
  'telangana current affairs': 'Telangana current affairs',
  'telangana': 'Telangana current affairs'
};

export function normalizeTopic(topic) {
  if (!topic) return 'National Affairs';
  const raw = String(topic).trim();
  const key = raw.toLowerCase();
  if (TOPIC_ALIASES[key]) return TOPIC_ALIASES[key];

  // If Admin entered a compound topic like "Environment and Renewable Energy",
  // map the first matching segment to a canonical topic for display defaults.
  const parts = key.split(/\s*(?:,|&|\/|\band\b)\s*/i).filter(Boolean);
  for (const part of parts) {
    if (TOPIC_ALIASES[part]) return TOPIC_ALIASES[part];
  }
  return raw;
}

function extractCanonicalTopics(topic) {
  if (!topic) return ['National Affairs'];
  const raw = String(topic).trim().toLowerCase();
  const matched = new Set();

  if (TOPIC_ALIASES[raw]) {
    matched.add(TOPIC_ALIASES[raw]);
  }

  const parts = raw.split(/\s*(?:,|&|\/|\band\b)\s*/i).filter(Boolean);
  for (const part of parts) {
    if (TOPIC_ALIASES[part]) {
      matched.add(TOPIC_ALIASES[part]);
    } else {
      for (const [alias, canonical] of Object.entries(TOPIC_ALIASES)) {
        if (part.includes(alias) && alias.length >= 5) {
          matched.add(canonical);
        }
      }
    }
  }

  if (matched.size === 0) {
    matched.add(normalizeTopic(topic));
  }
  return Array.from(matched);
}

export function topicMatches(itemTopic, filterTopic) {
  if (!filterTopic || filterTopic === 'All') return true;
  const target = normalizeTopic(filterTopic);
  const candidates = extractCanonicalTopics(itemTopic);
  return candidates.includes(target) || normalizeTopic(itemTopic) === target;
}
