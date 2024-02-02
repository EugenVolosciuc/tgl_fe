<script lang="ts">
	import { getColorBasedOnColorId } from '@/utils/color';
	import type { Task } from '@/types';
	import { getPositionAndSizeOfTask } from '@/utils/positioning';

	export let task: Task;

	const bgColor = getColorBasedOnColorId(task.color);

	const { left, width, top, height } = getPositionAndSizeOfTask(task);
</script>

<!-- Step 2: Add the tasks to the calendar -->
<!-- First horizontally (using the data-date attribute), then vertically (using the weight of a task?) -->
<div
	style="background-color:{bgColor}; height: {height}px; left: {left}px; width: {width}px; top: {top}px; height: {height}px;"
	class="absolute rounded px-[6px] py-[3px]">
	<p class="text-white">{task.name}</p>
</div>
