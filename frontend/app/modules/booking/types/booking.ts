export type DateRange = {
	start: Date | null;
	end: Date | null;
};

export type GuestCounts = {
	adults: number;
	children: number;
	pets: number;
};

export type BookingForm = {
	range: DateRange;
	counts: GuestCounts;
};
