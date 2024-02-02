<script lang="ts">
	import { getColorBasedOnColorId } from '@/utils/color';
	import type { Task } from '@/types';
	import { getPositionAndSizeOfTask } from '@/utils/positioning';

	export let task: Task;
	const paddingValue = 4;

	const bgColor = getColorBasedOnColorId(task.color);

	const { left, width, top, height } = getPositionAndSizeOfTask(task);
</script>

<!-- Step 2: Add the tasks to the calendar -->
<!-- First horizontally (using the data-date attribute), then vertically (using the weight of a task?) -->
<div
	data-taskId={task.id}
	style="background-color:{bgColor}; height: {height -
		paddingValue * 2}px; left: {left + paddingValue}px; width: {width -
		paddingValue * 2}px; top: {top + paddingValue}px;"
	class="absolute rounded">
	<div class=" px-[6px] py-[3px]">
		<p class="text-sm text-white">{task.name}</p>
	</div>
</div>
