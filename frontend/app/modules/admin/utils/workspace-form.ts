import type {
	UpdateWorkspaceDto,
	Workspace,
	WorkspaceIcon,
	WorkspaceSettings,
} from "~/modules/admin/types/workspace";

export interface FormState {
	name: string;
	slug: string;
	icon: WorkspaceIcon;
}

export const emptyForm = (): FormState => ({
	name: "",
	slug: "",
	icon: "folder01",
});

export const buildForm = (w: Workspace): FormState => ({
	name: w.name,
	slug: w.slug,
	icon: w.settings?.icon ?? "folder01",
});

export const buildPayload = (
	f: FormState,
	base?: WorkspaceSettings | null,
): Required<Pick<UpdateWorkspaceDto, "name" | "slug" | "settings">> => ({
	name: f.name.trim(),
	slug: f.slug.trim(),
	settings: { ...(base ?? {}), icon: f.icon },
});
