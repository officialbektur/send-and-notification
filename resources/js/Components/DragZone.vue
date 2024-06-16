<template>
	<div
		class="drag-zone"
		:class="{
			'_drag-and-drop': isDragging,
			_error: !isDropZoneEmpty,
		}"
	>
		<div
			ref="content"
			class="drag-zone__content"
			:class="{
				_active: isOverContent,
			}"
		>
			<div class="drag-zone__icon">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
					<path
						d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
					/>
				</svg>
			</div>
			<div class="drag-zone__title">
				{{ dropZoneStatus }}
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'HtmlDragZone',
		props: {
			isDragZone: {
				type: Boolean,
				default: true,
			},
			isDropZoneEmpty: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				isDragging: false,
				isOverContent: false,
			};
		},
		emits: ['onDropFiles'],
		mounted() {
			document.documentElement.addEventListener(
				'dragenter',
				this.handleDragEnter
			);
			document.documentElement.addEventListener(
				'dragleave',
				this.handleDragLeave
			);
			document.documentElement.addEventListener(
				'dragover',
				this.handleDragOver
			);
			document.documentElement.addEventListener('drop', this.handleDrop);
		},
		beforeDestroy() {
			document.documentElement.removeEventListener(
				'dragenter',
				this.handleDragEnter
			);
			document.documentElement.removeEventListener(
				'dragleave',
				this.handleDragLeave
			);
			document.documentElement.removeEventListener(
				'dragover',
				this.handleDragOver
			);
			document.documentElement.removeEventListener('drop', this.handleDrop);
		},
		methods: {
			handleDragOver(event) {
				event.preventDefault();
				if (this.isDragZone) {
					this.isDragging = true;
				}
			},
			handleDragEnter(event) {
				event.preventDefault();
				if (this.isDragZone) {
					if (event.target === this.$refs.content) {
						this.isOverContent = true;
					} else {
						this.isOverContent = false;
					}
				}
			},
			handleDragLeave(event) {
				event.preventDefault();
			},
			handleDrop(event) {
				event.preventDefault();
				if (this.isDragZone) {
					this.isDragging = false;
					if (
						this.isDropZoneEmpty &&
						event.target === this.$refs.content &&
						event.dataTransfer.files.length
					) {
						this.$emit('onDropFiles', event.dataTransfer.files);
					}
				}
			},
		},
		computed: {
			dropZoneStatus() {
				return this.isDropZoneEmpty
					? 'Перетащите изображение сюда'
					: 'Нету слободного места!';
			},
		},
	};
</script>

<style scoped></style>
