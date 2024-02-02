import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

export const checkDateRangesOverlap = (
	start1: Dayjs,
	end1: Dayjs,
	start2: Dayjs,
	end2: Dayjs
) => start1.isSameOrBefore(end2) && end1.isSameOrAfter(start2);
