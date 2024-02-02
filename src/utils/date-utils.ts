import dayjs, { Dayjs } from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

export const DISPLAY_DATE_FORMAT = 'YYYY-MM-DD';

export const getDaysBetween = (start: Dayjs, end: Dayjs) => {
	const range = [];
	let current = start;
	while (!current.isAfter(end)) {
		range.push(current);
		current = current.add(1, 'days');
	}
	return range;
};

export const checkIsWeekend = (date: Dayjs) => {
	const dayOfTheWeek = dayjs(date).day();
	return dayOfTheWeek === 0 || dayOfTheWeek === 6;
};
