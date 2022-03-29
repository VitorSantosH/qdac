import { isThisWeek, formatDistanceToNowStrict, format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const formatOptions = {
  locale: ptBR,
};

/**
 * If the parameter date is during this week it going to return the distance between now and the date
 * (e.g. 3 minutos, 1 hora, 2 dias).
 * If not it just going to return that date formated (e.g. 07/11/2021).
 *
 *
 * @param date    - Date that should be format it.
 */
const formatDateToString = (date: Date): string => {
  date = new Date(date);

  let finalDate: string;

  if (isThisWeek(date)) {
    finalDate = formatDistanceToNow(date);
  } else {
    finalDate = formatDate(date);
  }

  return finalDate;
};

const formatDistanceToNow = (date: Date): string => {
  date = new Date(date);

  return formatDistanceToNowStrict(date, formatOptions);
};

const formatDate = (date: Date): string => {
  date = new Date(date);

  const formatString = "dd'/'MM'/'yyyy";

  return format(date, formatString, formatOptions);
};

const getDayCountSinceDate = (dateStr: string): number => {
  const date = new Date(dateStr);

  return differenceInDays(new Date(), date);
};

export { formatDateToString, formatDistanceToNow, formatDate, getDayCountSinceDate };
