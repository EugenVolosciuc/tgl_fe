<script lang="ts">
	import { Dayjs } from 'dayjs';

	import { checkIsWeekend } from '@/utils/date-utils';

	export let date: Dayjs;

	const isWeekend = checkIsWeekend(date);
	const isToday = date.isToday();
</script>

<div
	class="inline-block w-16 shrink-0 grow-0 border-b-[1px] border-b-slate-200 bg-white p-1">
	<p
		class="whitespace-nowrap rounded px-4 py-1 text-sm"
		class:bg-orange-500={isToday}
		class:text-white={isToday}
		class:text-slate-400={isWeekend}>
		{date.format('dd')[0]}
		{date.format('D')}
	</p>
</div>
