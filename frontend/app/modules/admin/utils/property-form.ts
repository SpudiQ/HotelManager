import type {
	Property,
	PropertyType,
	UpdatePropertyDto,
} from "~/modules/admin/types/property";
import { PROPERTY_TYPE_LABELS } from "~/modules/admin/constants/property-labels";
import { buildContacts, stripTelegramPrefix } from "~/utils/contacts";

export interface FormState {
	name: string;
	slug: string;
	type: PropertyType;
	address: string;
	description: string;
	isActive: boolean;
	email: string;
	phone: string;
	telegram: string;
	whatsapp: string;
}

export const TYPE_OPTIONS = (
	[
		"hotel",
		"resort",
		"hostel",
		"glamping",
		"apartment",
		"guesthouse",
	] as PropertyType[]
).map((value) => ({ value, label: PROPERTY_TYPE_LABELS[value] }));

export const emptyForm = (): FormState => ({
	name: "",
	slug: "",
	type: "hotel",
	address: "",
	description: "",
	isActive: true,
	email: "",
	phone: "",
	telegram: "",
	whatsapp: "",
});

export const buildForm = (p: Property): FormState => ({
	name: p.name,
	slug: p.slug,
	type: p.type,
	address: p.address ?? "",
	description: p.description ?? "",
	isActive: p.isActive,
	email: p.contacts?.email ?? "",
	phone: p.contacts?.phone ?? "",
	telegram: p.contacts?.telegram ? stripTelegramPrefix(p.contacts.telegram) : "",
	whatsapp: p.contacts?.whatsapp ?? "",
});

export const buildPayload = (f: FormState): Required<Pick<UpdatePropertyDto,
	"name" | "slug" | "type" | "address" | "description" | "contacts" | "isActive"
>> => ({
	name: f.name.trim(),
	slug: f.slug.trim(),
	type: f.type,
	address: f.address.trim() === "" ? null : f.address.trim(),
	description: f.description.trim() === "" ? null : f.description,
	contacts: buildContacts({
		email: f.email,
		phone: f.phone,
		telegram: f.telegram,
		whatsapp: f.whatsapp,
	}),
	isActive: f.isActive,
});
