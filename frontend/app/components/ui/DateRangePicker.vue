<script setup lang="ts">
import { addMonths, format, isBefore, startOfDay, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { HugeiconsIcon } from "@hugeicons/vue";
import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	Calendar03Icon,
} from "@hugeicons/core-free-icons";

type DateRange = { start: Date | null; end: Date | null };

const props = withDefaults(
	defineProps<{
		modelValue: DateRange;
		minDate?: Date;
	}>(),
	{
		minDate: () => startOfDay(new Date()),
	},
);

const emit = defineEmits<{
	"update:modelValue": [value: DateRange];
}>();

const open = ref(false);
const viewMonth = ref(startOfDay(new Date()));
const hoverDay = ref<Date | null>(null);
const rootRef = ref<HTMLElement | null>(null);

const monthsToShow = computed(() => [
	viewMonth.value,
	addMonths(viewMonth.value, 1),
]);

const formattedStart = computed(() =>
	props.modelValue.start ? format(props.modelValue.start, "d MMM", { locale: ru }) : "",
);
const formattedEnd = computed(() =>
	props.modelValue.end ? format(props.modelValue.end, "d MMM", { locale: ru }) : "",
);

const toggle = () => {
	open.value = !open.value;
};

const close = () => {
	open.value = false;
	hoverDay.value = null;
};

const handleDocClick = (event: MouseEvent) => {
	if (!open.value) return;
	if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
		close();
	}
};

const handleEscape = (event: KeyboardEvent) => {
	if (event.key === "Escape" && open.value) close();
};

onMounted(() => {
	document.addEventListener("mousedown", handleDocClick);
	document.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
	document.removeEventListener("mousedown", handleDocClick);
	document.removeEventListener("keydown", handleEscape);
});

const isDisabled = (day: Date) => isBefore(day, props.minDate);

const isInSelectedRange = (day: Date) => {
	const { start, end } = props.modelValue;
	if (!start || !end) return false;
	return !isBefore(day, start) && !isBefore(end, day);
};

const isInPreviewRange = (day: Date) => {
	const { start, end } = props.modelValue;
	if (!start || end || !hoverDay.value) return false;
	const previewStart = isBefore(start, hoverDay.value) ? start : hoverDay.value;
	const previewEnd = isBefore(start, hoverDay.value) ? hoverDay.value : start;
	return !isBefore(day, previewStart) && !isBefore(previewEnd, day);
};

const isStart = (day: Date) =>
	!!props.modelValue.start && isSameDate(day, props.modelValue.start);

const isEnd = (day: Date) =>
	!!props.modelValue.end && isSameDate(day, props.modelValue.end);

const pickDay = (day: Date) => {
	if (isDisabled(day)) return;
	const { start, end } = props.modelValue;

	// no start yet, or both selected → start a new range
	if (!start || (start && end)) {
		emit("update:modelValue", { start: day, end: null });
		return;
	}

	// have start, no end
	if (isBefore(day, start)) {
		emit("update:modelValue", { start: day, end: start });
	} else if (isSameDate(day, start)) {
		emit("update:modelValue", { start: day, end: day });
	} else {
		emit("update:modelValue", { start, end: day });
	}
};

const shiftMonth = (delta: number) => {
	viewMonth.value = delta < 0 ? subMonths(viewMonth.value, 1) : addMonths(viewMonth.value, 1);
};

const clear = () => {
	emit("update:modelValue", { start: null, end: null });
	hoverDay.value = null;
};

const onCellEnter = (day: Date) => {
	hoverDay.value = day;
};

const onCellLeave = () => {
	hoverDay.value = null;
};
</script>

<template>
	<div ref="rootRef" class="picker">
		<button
			type="button"
			class="trigger"
			:class="{ 'is-open': open }"
			:aria-expanded="open"
			@click="toggle"
		>
			<HugeiconsIcon
				:icon="Calendar03Icon"
				:size="18"
				:stroke-width="1.5"
				class="trigger-icon"
			/>
			<div class="cell">
				<span class="cell-label">Заезд</span>
				<span class="cell-value" :class="{ placeholder: !formattedStart }">
					{{ formattedStart || "выберите дату" }}
				</span>
			</div>
			<span class="divider" />
			<div class="cell">
				<span class="cell-label">Выезд</span>
				<span class="cell-value" :class="{ placeholder: !formattedEnd }">
					{{ formattedEnd || "выберите дату" }}
				</span>
			</div>
		</button>

		<Transition name="pop">
			<div v-if="open" class="popover" role="dialog" aria-label="Выбор дат">
				<div class="nav">
					<button
						type="button"
						class="nav-btn"
						aria-label="Предыдущий месяц"
						@click="shiftMonth(-1)"
					>
						<HugeiconsIcon :icon="ArrowLeft01Icon" :size="18" :stroke-width="1.5" />
					</button>
					<button
						type="button"
						class="nav-btn"
						aria-label="Следующий месяц"
						@click="shiftMonth(1)"
					>
						<HugeiconsIcon :icon="ArrowRight01Icon" :size="18" :stroke-width="1.5" />
					</button>
				</div>

				<div class="months">
					<div v-for="month in monthsToShow" :key="month.getTime()" class="month">
						<div class="month-title">
							{{ format(month, "LLLL yyyy", { locale: ru }) }}
						</div>
						<div class="weekdays">
							<span v-for="weekdayLabel in WEEKDAY_LABELS_RU" :key="weekdayLabel">{{ weekdayLabel }}</span>
						</div>
						<div class="grid">
							<template v-for="week in getMonthGrid(month)" :key="week[0]!.date.getTime()">
								<button
									v-for="day in week"
									:key="day.date.getTime()"
									type="button"
									class="day"
									:class="{
										'is-out': !day.inMonth,
										'is-disabled': isDisabled(day.date),
										'is-selected': isInSelectedRange(day.date),
										'is-preview': isInPreviewRange(day.date),
										'is-start': isStart(day.date),
										'is-end': isEnd(day.date),
									}"
									:disabled="isDisabled(day.date)"
									@click="pickDay(day.date)"
									@mouseenter="onCellEnter(day.date)"
									@mouseleave="onCellLeave"
								>
									{{ day.date.getDate() }}
								</button>
							</template>
						</div>
					</div>
				</div>

				<div class="footer">
					<button
						type="button"
						class="link-btn"
						:disabled="!modelValue.start && !modelValue.end"
						@click="clear"
					>
						Сбросить
					</button>
					<button type="button" class="link-btn primary" @click="close">Готово</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style lang="scss" scoped>
.picker {
	position: relative;
	width: 100%;
}

.trigger {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	border: 1px solid $border;
	border-radius: 12px;
	background: $surface;
	transition: border-color 0.15s ease;

	&:hover,
	&.is-open {
		border-color: $text;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.trigger-icon {
	color: $text;
	flex-shrink: 0;
}

.cell {
	display: flex;
	flex-direction: column;
	gap: 2px;
	text-align: left;
	flex: 1;
	min-width: 0;
}

.cell-label {
	@include caption;
	color: $text-muted;
	text-transform: lowercase;
}

.cell-value {
	@include text-2-medium;
	color: $text;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&.placeholder {
		color: $text-subtle;
		font-weight: 400;
	}
}

.divider {
	width: 1px;
	align-self: stretch;
	background: $border;
}

.popover {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	right: 0;
	z-index: 50;
	background: $surface;
	border: 1px solid $border;
	border-radius: 16px;
	padding: 20px;
	@include soft-shadow;
}

.nav {
	display: flex;
	justify-content: space-between;
	margin-bottom: 4px;
}

.nav-btn {
	width: 32px;
	height: 32px;
	border-radius: 50%;
	border: 1px solid transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	color: $text;
	transition: border-color 0.15s ease, background 0.15s ease;

	&:hover {
		border-color: $border;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.months {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;

	@media (max-width: 640px) {
		grid-template-columns: 1fr;
		gap: 16px;
	}
}

.month-title {
	@include text-1-medium;
	text-align: center;
	margin-bottom: 12px;
	text-transform: capitalize;
}

.weekdays {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	@include caption;
	color: $text-muted;
	margin-bottom: 6px;

	span {
		text-align: center;
		text-transform: lowercase;
	}
}

.grid {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	row-gap: 2px;
}

.day {
	aspect-ratio: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	@include text-2;
	color: $text;
	border-radius: 8px;
	border: 1px solid transparent;
	transition: background 0.1s ease, color 0.1s ease, border-color 0.1s ease;

	&.is-out {
		color: $text-subtle;
	}

	&.is-disabled {
		color: $text-subtle;
		cursor: not-allowed;
		text-decoration: line-through;
		text-decoration-color: $text-subtle;
	}

	&:not(.is-disabled):hover {
		border-color: $text;
	}

	&.is-preview {
		background: $range-fill;
	}

	&.is-selected {
		background: $range-fill;
	}

	&.is-start,
	&.is-end {
		background: $text;
		color: $surface;
		border-color: $text;
		font-weight: 600;
	}

	&:focus-visible {
		@include focus-ring;
	}
}

.footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid $border;
}

.link-btn {
	@include text-2-medium;
	color: $text-muted;
	padding: 8px 14px;
	border-radius: 8px;
	transition: color 0.15s ease, background 0.15s ease;

	&:hover:not(:disabled) {
		color: $text;
		background: $bg;
	}

	&:disabled {
		color: $text-subtle;
		cursor: not-allowed;
	}

	&.primary {
		color: $text;
		background: $text;
		color: $surface;

		&:hover {
			background: #000;
		}
	}
}

.pop-enter-active,
.pop-leave-active {
	transition: opacity 0.15s ease, transform 0.15s ease;
	transform-origin: top center;
}
.pop-enter-from,
.pop-leave-to {
	opacity: 0;
	transform: translateY(-4px) scale(0.98);
}
</style>
