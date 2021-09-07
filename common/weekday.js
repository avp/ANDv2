let weekdays = {
 // 'en': 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  'en': 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
}

export function getWeekdayName(language, number) {
  return weekdays[language][number];  
}