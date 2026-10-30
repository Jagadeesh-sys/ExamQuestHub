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
  'international affairs': 'International Affairs',
  'science and technology': 'Science and Technology',
  'science & technology': 'Science and Technology',
  'defence': 'Defence',
  'defense': 'Defence',
  'economy': 'Economy',
  'banking': 'Banking',
  'sports': 'Sports',
  'awards and honours': 'Awards and Honours',
  'awards and honors': 'Awards and Honours',
  'appointments': 'Appointments',
  'important days': 'Important Days',
  'environment': 'Environment',
  'government schemes': 'Government Schemes',
  'andhra pradesh current affairs': 'Andhra Pradesh current affairs',
  'telangana current affairs': 'Telangana current affairs'
};

export function normalizeTopic(topic) {
  if (!topic) return 'National Affairs';
  const key = String(topic).trim().toLowerCase();
  return TOPIC_ALIASES[key] || topic;
}

export function topicMatches(itemTopic, filterTopic) {
  if (!filterTopic || filterTopic === 'All') return true;
  return normalizeTopic(itemTopic) === normalizeTopic(filterTopic);
}
