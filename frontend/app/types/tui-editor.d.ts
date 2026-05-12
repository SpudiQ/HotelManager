declare module "@toast-ui/editor" {
	interface EditorOptions {
		el: HTMLElement;
		height?: string;
		initialValue?: string;
		initialEditType?: "markdown" | "wysiwyg";
		previewStyle?: "tab" | "vertical";
		placeholder?: string;
		usageStatistics?: boolean;
		hideModeSwitch?: boolean;
		[key: string]: unknown;
	}

	export default class Editor {
		constructor(options: EditorOptions);
		on(event: string, handler: (...args: unknown[]) => void): void;
		off(event: string): void;
		getMarkdown(): string;
		setMarkdown(markdown: string, cursorToEnd?: boolean): void;
		destroy(): void;
	}
}

declare module "@toast-ui/editor/dist/toastui-editor.css";
