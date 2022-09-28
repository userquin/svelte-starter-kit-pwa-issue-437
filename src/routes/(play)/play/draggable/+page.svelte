<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import type { DragOptions } from '@neodrag/svelte';

	let options: DragOptions = {
		axis: 'y',
		bounds: 'parent'
	};

	let axis;
</script>

<div use:draggable="{{ axis: 'x', grid: [10, 10] }}">Drag Me X</div>

<div use:draggable="{{ axis: 'y', bounds: 'parent' }}">Drag Me Y</div>

<div>
	Axis:
	<label>
		<input type="radio" bind:group="{axis}" value="both" />
		Both
	</label>
	<label>
		<input type="radio" bind:group="{axis}" value="x" />
		x
	</label>
	<label>
		<input type="radio" bind:group="{axis}" value="y" />
		y
	</label>
	<label>
		<input type="radio" bind:group="{axis}" value="none" />
		none
	</label>
</div>

<!-- Dynamically change axis -->
<div use:draggable="{{ axis }}">Drag Me the way you like</div>
