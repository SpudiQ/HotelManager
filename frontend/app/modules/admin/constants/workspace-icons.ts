import {
	Folder01Icon,
	Home01Icon,
	Building01Icon,
	Hotel01Icon,
	City01Icon,
	Globe02Icon,
	Briefcase01Icon,
	FavouriteIcon,
	Tag01Icon,
	Bookmark01Icon,
} from "@hugeicons/core-free-icons";
import type { WorkspaceIcon } from "~/modules/admin/types/workspace";

type IconComponent = typeof Folder01Icon;

export const WORKSPACE_ICONS: Record<WorkspaceIcon, IconComponent> = {
	folder01: Folder01Icon,
	home01: Home01Icon,
	building01: Building01Icon,
	hotel01: Hotel01Icon,
	city01: City01Icon,
	globe02: Globe02Icon,
	briefcase01: Briefcase01Icon,
	favourite: FavouriteIcon,
	tag01: Tag01Icon,
	bookmark01: Bookmark01Icon,
};

export const WORKSPACE_ICON_OPTIONS: { value: WorkspaceIcon; icon: IconComponent; label: string }[] = [
	{ value: "folder01", icon: Folder01Icon, label: "Папка" },
	{ value: "home01", icon: Home01Icon, label: "Дом" },
	{ value: "building01", icon: Building01Icon, label: "Здание" },
	{ value: "hotel01", icon: Hotel01Icon, label: "Отель" },
	{ value: "city01", icon: City01Icon, label: "Город" },
	{ value: "globe02", icon: Globe02Icon, label: "Глобус" },
	{ value: "briefcase01", icon: Briefcase01Icon, label: "Портфель" },
	{ value: "favourite", icon: FavouriteIcon, label: "Избранное" },
	{ value: "tag01", icon: Tag01Icon, label: "Тег" },
	{ value: "bookmark01", icon: Bookmark01Icon, label: "Закладка" },
];

export const getWorkspaceIcon = (key?: WorkspaceIcon | null): IconComponent =>
	(key && WORKSPACE_ICONS[key]) || Folder01Icon;
