import {
	addDays,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	isAfter,
	isBefore,
	isSameDay,
	startOfMonth,
	startOfWeek,
} from "date-fns";

export type CalendarDay = {
	date: Date;
	inMonth: boolean;
};

const WEEK_STARTS_ON = 1 as const;

export function getMonthGrid(month: Date): CalendarDay[][] {
	const monthStart = startOfMonth(month);
	const monthEnd = endOfMonth(month);
	const gridStart = startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON });
	const gridEnd = endOfWeek(addDays(monthEnd, 0), { weekStartsOn: WEEK_STARTS_ON });

	const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
	const total = days.length < 42 ? 42 : days.length;
	const filled =
		days.length < total
			? eachDayOfInterval({ start: gridStart, end: addDays(gridStart, total - 1) })
			: days;

	const weeks: CalendarDay[][] = [];
	for (let i = 0; i < filled.length; i += 7) {
		weeks.push(
			filled.slice(i, i + 7).map((date) => ({
				date,
				inMonth: date.getMonth() === month.getMonth(),
			})),
		);
	}
	return weeks;
}

export function isInRange(
	day: Date,
	range: { start: Date | null; end: Date | null },
): boolean {
	if (!range.start || !range.end) return false;
	return !isBefore(day, range.start) && !isAfter(day, range.end);
}

export function isRangeBoundary(
	day: Date,
	range: { start: Date | null; end: Date | null },
): "start" | "end" | null {
	if (range.start && isSameDay(day, range.start)) return "start";
	if (range.end && isSameDay(day, range.end)) return "end";
	return null;
}

export function isSameDate(a: Date | null, b: Date | null): boolean {
	if (!a || !b) return false;
	return isSameDay(a, b);
}

export const WEEKDAY_LABELS_RU = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
