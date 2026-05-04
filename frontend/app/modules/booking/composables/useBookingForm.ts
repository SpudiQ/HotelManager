import type { BookingForm } from "../types/booking";

export const useBookingForm = () => {
	const form = reactive<BookingForm>({
		range: { start: null, end: null },
		counts: { adults: 2, children: 0, pets: 0 },
	});

	const isValid = computed(
		() => !!form.range.start && !!form.range.end && form.counts.adults >= 1,
	);

	const reset = () => {
		form.range = { start: null, end: null };
		form.counts = { adults: 2, children: 0, pets: 0 };
	};

	return { form, isValid, reset };
};
