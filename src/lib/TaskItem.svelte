<script lang="ts">
	import { getColorBasedOnColorId } from '@/utils/color';
	import type { Task } from '@/types';
	import { getPositionAndSizeOfTask } from '@/utils/positioning';

	export let task: Task;

	const paddingValue = 4;
	const bgColor = getColorBasedOnColorId(task.color);

	let isDragged = false;

	const handleDragStart = (
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) => {
		// Do I want to save the dragged task in event.dataTransfer or the store?
		// I suppose that saving it to dataTransfer is more performant, but it's just a thought.
		isDragged = true;
		event.dataTransfer?.setData('text/plain', JSON.stringify(task));
	};

	const { left, width, top, height } = getPositionAndSizeOfTask(task);

	const handleDrag = (
		event: DragEvent & {
			currentTarget: EventTarget & HTMLDivElement;
		}
	) => {
		console.log('drag event over task item', event);
		const draggedItem = (
			event.target as HTMLDivElement
		).getBoundingClientRect();
		const elements = document.querySelectorAll(`[data-date]`);

		elements.forEach(function (dataDateElement) {
			const dataDateRect = dataDateElement.getBoundingClientRect();

			// Check for overlap based on the upper-left corner coordinates
			// const specialThing = event.x - draggedItem.left; // this is close, but it selects an element too far away, something's amiss
			if (
				draggedItem.left < dataDateRect.right &&
				draggedItem.left > dataDateRect.left
			) {
				const dateValue = dataDateElement.getAttribute('data-date');
				// console.log('Overlap with data-date:', dataDateElement);
			}

			// // Instead of this, use the mouse X position - the draggedItem's initial left position (?)
			// const specialThing = event.x - draggedItem.left;
			// if (
			// 	specialThing < dataDateRect.right &&
			// 	specialThing > dataDateRect.left
			// ) {
			// 	const dateValue = dataDateElement.getAttribute('data-date');
			// 	console.log('Overlap with data-date:', dateValue);
			// }
		});
	};
	// Try to use isElementBetweenXCoordinates, but I might need to change it
</script>

<!-- Step 2: Add the tasks to the calendar -->
<!-- First horizontally (using the data-date attribute), then vertically (using the weight of a task?) -->
<div
	data-taskId={task.id}
	style="background-color:{bgColor}; height: {height -
		paddingValue * 2}px; left: {left + paddingValue}px; width: {width -
		paddingValue * 2}px; top: {top + paddingValue}px;"
	class="absolute z-10 rounded"
	role="cell"
	tabindex="0"
	draggable="true"
	on:dragstart={handleDragStart}
	on:dragend={() => (isDragged = false)}
	on:drag={handleDrag}>
	<div class=" px-[6px] py-[3px]">
		<p class="text-sm text-white">{task.name}</p>
	</div>
</div>
