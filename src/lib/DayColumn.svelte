<script lang="ts">
	import { Dayjs } from 'dayjs';

	import { DISPLAY_DATE_FORMAT, checkIsWeekend } from '@/utils/date-utils';

	export let date: Dayjs;
	export let isFirstDay: boolean;

	const isWeekend = checkIsWeekend(date);
</script>

<div
	data-date={date.format(DISPLAY_DATE_FORMAT)}
	class="inline-block w-16 shrink-0 grow-0 border-r-[1px] border-b-slate-200 text-purple-950"
	class:bg-slate-100={isWeekend}
	class:border-l-[1px]={isFirstDay} />
