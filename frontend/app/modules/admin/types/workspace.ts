export type WorkspaceIcon =
	| "folder01"
	| "home01"
	| "building01"
	| "hotel01"
	| "city01"
	| "globe02"
	| "briefcase01"
	| "favourite"
	| "tag01"
	| "bookmark01";

export interface WorkspaceSettings {
	icon?: WorkspaceIcon;
	[key: string]: unknown;
}

export interface Workspace {
	id: string;
	name: string;
	slug: string;
	settings?: WorkspaceSettings | null;
	propertyCount: number;
}

export interface CreateWorkspaceDto {
	name: string;
	slug: string;
	settings?: WorkspaceSettings | null;
}

export type UpdateWorkspaceDto = Partial<CreateWorkspaceDto>;
