import type { PropertyContacts } from "~/modules/admin/types/property";

export const stripTelegramPrefix = (value: string): string => {
	let v = value.trim();
	v = v.replace(/^https?:\/\/(t|telegram)\.me\//i, "");
	v = v.replace(/^tg:\/\/resolve\?domain=/i, "");
	v = v.replace(/^@+/, "");
	return v;
};

export interface ContactsInput {
	email?: string;
	phone?: string;
	telegram?: string;
	whatsapp?: string;
}

export const buildContacts = (input: ContactsInput): PropertyContacts | null => {
	const out: PropertyContacts = {};
	const email = input.email?.trim() ?? "";
	const phone = input.phone?.trim() ?? "";
	const telegram = stripTelegramPrefix(input.telegram ?? "");
	const whatsapp = input.whatsapp?.trim() ?? "";
	if (email) out.email = email;
	if (phone) out.phone = phone;
	if (telegram) out.telegram = `@${telegram}`;
	if (whatsapp) out.whatsapp = whatsapp;
	return Object.keys(out).length ? out : null;
};
