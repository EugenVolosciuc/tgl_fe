<script lang="ts">
	import { Dayjs } from 'dayjs';

	import { DISPLAY_DATE_FORMAT, checkIsWeekend } from '@/utils/date-utils';

	export let date: Dayjs;
	export let isFirstDay: boolean;

	const isWeekend = checkIsWeekend(date);
	const isToday = date.isToday();
</script>

<div
	data-date={date.format(DISPLAY_DATE_FORMAT)}
	class="flex flex-col text-purple-950"
	class:bg-slate-100={isWeekend}>
	<!-- Header -->
	<div class="border-b-[1px] border-b-slate-200 bg-white p-1">
		<p
			class="whitespace-nowrap rounded px-4 py-1 text-sm"
			class:bg-orange-500={isToday}
			class:text-white={isToday}
			class:text-slate-400={isWeekend}>
			{date.format('dd')[0]}
			{date.format('D')}
		</p>
	</div>
	<!-- Timeline -->
	<div
		class="flex-1 border-r-[1px] border-b-slate-200"
		class:border-l-[1px]={isFirstDay}>
	</div>
</div>
