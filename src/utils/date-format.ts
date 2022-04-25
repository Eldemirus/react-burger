import moment from "moment";

export function dateFormat(dateStr: string) {
  const date = moment(dateStr);
  const today = moment().startOf('day')
  const yesterday = moment().add(-1, 'day').startOf('day')

  let a;
  if (date > today) {
    a = 'сегодня';
  } else if (date > yesterday) {
    a = 'вчера';
  } else {
    const days = (1 + today.diff(date, "days"));
    a = pluralize(days, ['день', 'дня', 'дней']) + ' назад';
  }

  const tz = date.utcOffset() / 60;
  const strtz = tz > 0 ? '+'+tz : tz;


  return `${a} ${date.format('HH:mm')} i-GMT${strtz}`;
}

function pluralize(count: number, words: Array<string>) {
  var cases = [2, 0, 1, 1, 1, 2];
  return count + ' ' + words[ (count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)] ];
}