export type FormActionVariant = "primary" | "ghost" | "danger";

export interface FormAction {
	key: string;
	label: string;
	variant?: FormActionVariant;
	type?: "button" | "submit";
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
}
