<template>
	<div
		class="form__images images w-96 flex flex-wrap gap-2"
		:class="{
			_sending: isReadOnly,
			'_has-file': isSelectedFile,
		}"
	>
		<div
			v-for="(imageItem, index) in imageItems"
			:key="index"
			@drop.prevent="handleDrop($event, index)"
			@dragover.prevent
			@dragenter.prevent="handleDragEnter($event, index)"
			@dragleave.prevent="handleDragLeave($event, index)"
			@dragend.prevent="handleDragEnd"
			@click="moveImageToAddress($event, imageItem)"
			class="images__block images-block"
			:class="{
				_hovered: dragCounter[index],
				_dropped: droppedIndex === index,
				_current: currentItemTouch === index,
			}"
		>
			<div
				@dragstart="handleDragStart($event, imageItem)"
				:draggable="!isSendingImages"
				class="images-block__content"
				:class="{
					_active: imageItem.src,
					_sending: imageItem.isSending,
				}"
			>
				<input
					:readonly="imageItem.isReadOnly"
					:disabled="imageItem.isReadOnly"
					accept=".jpg, .png, .jpeg"
					type="file"
					name="images[]"
					@change="handleFileChange($event, index)"
					multiple
					:ref="`input_${index}`"
					class="images-block__input"
				/>
				<div class="images-block__preview">
					<img
						v-if="imageItem.src"
						:src="imageItem.src"
						:alt="imageItem.src"
						class="images-block__img"
					/>
				</div>
				<button
					:disabled="imageItem.isReadOnly"
					type="button"
					class="images-block__close"
					@click.prevent="resetImage(index)"
				>
					<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99h144v-144C192 62.32 206.33 48 224 48s32 14.32 32 32.01v144h144c17.7-.01 32 14.29 32 31.99z"
						/>
					</svg>
				</button>
				<div
					class="images-block__placeholder images-block-placeholder"
					:class="{
						_done: imageItem.isSending || imageItem.src,
					}"
				>
					<div class="images-block-placeholder__icon">
						<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								d="M30 6l3.66 4H40c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V14c0-2.2 1.8-4 4-4h6.34L18 6h12zm-6 13.6a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zM24 36c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"
							/>
						</svg>
					</div>
					<div class="images-block-placeholder__title">
						Добавьте фото
					</div>
				</div>
				<div
					class="images-block__loading images-block-loading"
					:class="{
						_active: imageItem.isSending,
						_error:
							imageItem.isSending &&
							imageItem.isSendingStatus !== null &&
							!imageItem.isSendingStatus,
					}"
				>
					<div class="images-block-loading__content">
						<button
							v-if="
								imageItem.isSending &&
									(imageItem.isSendingStatus === null ||
										imageItem.isSendingStatus === false)
							"
							type="button"
							class="images-block-loading__icon"
							@click.prevent="
								cancelImageSending(index, imageItem.isSendingStatus === false)
							"
						>
							<svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99h144v-144C192 62.32 206.33 48 224 48s32 14.32 32 32.01v144h144c17.7-.01 32 14.29 32 31.99z"
								/>
							</svg>
						</button>
						<div class="images-block-loading__status">
							{{ imageItem.status }}
						</div>
					</div>
					<div
						class="images-block-loading__progress"
						:style="{
							height: imageItem.progress + '%',
						}"
					></div>
				</div>
				<div v-if="isSelectedFile" class="images-block__moves">
					<button
						v-if="index !== 0 && !currentItem"
						:disabled="isReadOnly || isSendingImages"
						type="button"
						class="images-block__banner images-block__banner-button images-block__move images-block__move-current"
						@click="startMoveImage(imageItem)"
					>
						Переместить
					</button>
					<button
						v-if="currentItem && currentItem.index !== imageItem.index"
						:disabled="isReadOnly || isSendingImages"
						type="button"
						class="images-block__banner images-block__banner-button images-block__move images-block__move-target"
					>
						Сюда
					</button>
				</div>
			</div>
			<div
				v-if="index === 0"
				class="images-block__banner images-block__banner-button images-block__title"
				:class="{
					_done: currentItem,
				}"
			>
				Главная
			</div>
		</div>
	</div>
	<DragZone
		@onDropFiles="onDropFiles"
		:isDragZone="isDragZone"
		:isDropZoneEmpty="isDropZoneEmpty"
	></DragZone>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';
	import axios from 'axios';
	import DragZone from '@/Components/DragZone.vue';
	import { mapActions } from 'vuex';

	interface ImageContract {
		index: number;
		status: string | null;
		isSending: boolean;
		isSendingStatus: boolean | null;
		isReadOnly: boolean;
		progress: number;
		src: string | null;
		file: File | null;
	}

	export default defineComponent({
		name: 'DragAndDrop',
		components: { DragZone },
		props: {
			modelValue: {
				type: Array,
				required: true,
			},
			isReadOnly: {
				type: Boolean,
				required: true,
			},
		},
		data() {
			return {
				imageItems: [] as ImageContract[],
				dragCounter: [] as number[],
				currentItem: null as ImageContract | null,
				droppedIndex: null as number | null,
				currentItemTouch: null as number | null,
				preventWatchUpdate: false,
				isDragZone: true,
			};
		},
		methods: {
			...mapActions([
				'addSendingNotification',
				'changeNotificationProgress',
				'changeNotification',
				'addDisplayingNotification1'
			]),
			onDropFiles(data: FileList) {
				if (data && data.length) {
					const filesLength = Math.min(data.length, this.imageItems.length);
					const files = Array.from(data).slice(0, filesLength);
					for (let i = 0; i < files.length; i++) {
						this.handleFileInput(files[i], 0);
					}
				}
			},
			handleFileChange(event, index: number) {
				const selectedFiles = event.target.files;

				this.resetMove();
				this.resetDrop(index);

				if (selectedFiles && selectedFiles.length > 0) {
					const selectedFilesLength = Math.min(
						selectedFiles.length,
						this.imageItems.length
					);
					const files = Array.from(selectedFiles).slice(0, selectedFilesLength);
					if (files.length > 1) {
						this.handleMultipleFiles(files, index);
					} else {
						this.uploadFile(files[0], index);
					}
				} else {
					this.removeImage(index);
				}
			},
			handleMultipleFiles(files: FileList, index: number) {
				this.removeImage(index);
				for (let i = 0; i < files.length; i++) {
					this.handleFileInput(files[i], index);
				}
			},
			handleFileInput(file: File, index: number) {
				const images = Array.prototype.concat(
					this.imageItems.slice(index),
					this.imageItems.slice(0, index)
				);

				const imageItem = images.find((res) => {
					const isIDNull = !res.hasOwnProperty('id') || res.id === null;
					const isFileNull = !res.hasOwnProperty('file') || res.file === null;
					return isIDNull && isFileNull;
				});
				if (imageItem) {
					return this.uploadFile(file, imageItem.index);
				}
			},
			uploadFile(file: File, index: number) {
				if (this.validateFile(file, index)) {
					const input = this.$refs[`input_${index}`][0];

					const newFile =
						new ClipboardEvent('').clipboardData || new DataTransfer();

					newFile.items.add(file);

					input.files = newFile.files;
					this.imageItems[index].id = null;
					this.imageItems[index].file = newFile.files;
					this.sendImage(index);
					this.addSendingNotification({
						uuid: `images_${index}`,
						title: `Создание новой картинки: ${file.name}, тип: ${
							file.type
						}, размер: ${this.getSizeImage(file.size)}`,
					});
				}
			},
			createCancelToken(index: number) {
				this.imageItems[index].cancelToken = axios.CancelToken.source();
			},
			async sendImage(index: number) {
				this.createCancelToken(index);
				const cancelToken = this.imageItems[index].cancelToken.token;
				try {
					this.imageItems[index].status = 'Загрузка...';
					this.imageItems[index].progress = 0;
					this.imageItems[index].isReadOnly = true;
					this.imageItems[index].isSending = true;

					const formData = new FormData();
					const config = {
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								(progressEvent.loaded / progressEvent.total) * 100
							);
							this.imageItems[index].progress = progress;
							this.imageItems[index].status = progress + '%';
							this.changeNotificationProgress({
								uuid: `images_${index}`,
								progress: progress,
							});
						},
						cancelToken: cancelToken,
					};

					formData.append('image', this.imageItems[index].file[0]);

					const response = await axios.postForm(
						route('api.image.store'),
						formData,
						config
					);
					if (response.data?.image) {
						this.imageItems[index].progress = 100;
						this.imageItems[index].isReadOnly = false;
						this.imageItems[index].isSendingStatus = true;
						this.imageItems[index].status = 'Добавлено!';

						this.imageItems[index].id = response.data.image.id;
						this.imageItems[index].src = response.data.image.url;

						this.changeNotification({
							uuid: `images_${index}`,
							progress: 100,
							status: true,
							response: `Картинка созданно по id: ${response.data.image.id}`,
							is_finished: true,
						});

						setTimeout(() => {
							this.imageItems[index].isSendingStatus = null;
							this.imageItems[index].progress = 0;
							this.imageItems[index].isSending = false;
						}, 600);
					} else {
						this.imageItems[index].progress = 100;
						this.imageItems[index].isReadOnly = false;
						this.imageItems[index].isSendingStatus = false;
						this.imageItems[index].status = 'Непредвиденная ошибка!';

						this.changeNotification({
							uuid: `images_${index}`,
							progress: 100,
							status: false,
							response: 'Непредвиденная ошибка!',
							is_finished: true,
						});
					}
				} catch (error) {
					this.imageItems[index].progress = 100;
					this.imageItems[index].isReadOnly = false;
					this.imageItems[index].isSendingStatus = false;
					if (!axios.isCancel(error)) {
						const errorMessage =
							error.response?.data?.message || 'Непредвиденная ошибка!';
						this.imageItems[index].status = errorMessage;

						this.changeNotification({
							uuid: `images_${index}`,
							progress: 100,
							status: false,
							response: errorMessage,
							is_finished: true,
						});
					}
				}
			},
			cancelImageSending(index: number, is_sending_failed = true) {
				if (this.imageItems[index].cancelToken) {
					this.imageItems[index].cancelToken.cancel('Отменено вами');
					this.imageItems[index].isSendingStatus = false;
					this.imageItems[index].status = 'Отменено вами!';
				}

				setTimeout(() => {
					this.imageItems[index].isReadOnly = false;
					this.imageItems[index].isSendingStatus = null;
					this.imageItems[index].progress = 0;
					this.imageItems[index].isSending = false;
					this.imageItems[index].status = 'Загрузка...';
					this.removeImage(index);
					this.resetMove();
				}, 600);

				if (!is_sending_failed) {
					this.changeNotification({
						uuid: `images_${index}`,
						progress: 100,
						status: false,
						response: 'Отменено вами!',
						is_finished: true,
					});
				}
			},
			validateFile(file: File, index: number, maxSizeMB = 5): boolean {
				const isAllowedTypes = ['image/jpeg', 'image/png', 'image/jpg'].some(
					(type) => type === file.type
				);
				if (!isAllowedTypes) {
					this.addDisplayingNotification1({
						uuid: `images_error_${index}`,
						title: 'Ошибка в валидаций',
						status: false,
						response: 'Разрешены только изображения форматов: jpg, jpeg и png!',
					});
					this.removeImage(index);
					return false;
				}

				const isTooLarge = file.size > maxSizeMB * 1024 * 1024;
				if (isTooLarge) {
					this.addDisplayingNotification1({
						uuid: `images_error_${index}`,
						title: 'Ошибка в валидаций',
						status: false,
						response: `Файл должен быть не более ${maxSizeMB} МБ, а ваш файл составляет: ${this.getSizeImage(
							file.size
						)}`,
					});
					this.removeImage(index);
					return false;
				}
				return true;
			},
			removeImage(index: number) {
				this.imageItems[index].id = null;
				this.imageItems[index].src = null;
				this.imageItems[index].file = null;
				this.$refs[`input_${index}`][0].value = null;
			},
			getSizeImage(
				size: number,
				factionDigits = 2 as number,
				name = 'МБ' as string
			): string {
				const getSize = this.getSize(size);
				const getSizeMB = getSize.toFixed(2);
				return `${getSizeMB} ${name}`;
			},
			getSize(size: number): number {
				return (size / 1024 / 1024) as number;
			},
			resetImage(index: number) {
				this.removeImage(index);
				this.resetMove();
			},

			handleDragStart(e: DragEvent, imageItem: ImageContract) {
				this.isDragZone = false;
				if (!this.isSendingImages) {
					e.dataTransfer.effectAllowed = 'move';
					this.currentItem = imageItem;
					this.droppedIndex = imageItem.index;
				}
			},
			handleDragEnter(e: DragEvent, index: number) {
				if (!this.dragCounter[index]) {
					this.dragCounter[index] = 0;
				}
				this.dragCounter[index]++;
			},
			handleDragLeave(e: DragEvent, categoryId: number) {
				if (this.dragCounter[categoryId]) {
					this.dragCounter[categoryId]--;
				}
			},
			handleDrop(e: DragEvent, index: number) {
				if (this.currentItem) {
					this.moveImage(this.imageItems[index], this.currentItem);
				}
				this.resetDrop(index);
			},
			resetDrop(index: number) {
				this.dragCounter[index] = 0;
				this.currentItem = null;
				this.droppedIndex = null;
				this.resetMove();
			},
			handleDragEnd() {
				this.droppedIndex = null;
				this.isDragZone = true;
			},
			moveImage(targetItem: ImageContract, currentItem: ImageContract) {
				this.moveImageContract(targetItem, currentItem);
				this.updateInputs(currentItem.index, targetItem.index);
			},
			moveImageContract(targetItem: ImageContract, currentItem: ImageContract) {
				[targetItem.index, currentItem.index] = [
					currentItem.index,
					targetItem.index,
				];
				[
					this.imageItems[targetItem.index],
					this.imageItems[currentItem.index],
				] = [
					this.imageItems[currentItem.index],
					this.imageItems[targetItem.index],
				];
			},
			startMoveImage(targetItem: ImageContract) {
				this.currentItem = targetItem;
				this.currentItemTouch = targetItem.index;
			},
			moveImageToAddress(event, currentItem: ImageContract) {
				if (this.currentItem && this.currentItem.index !== currentItem.index) {
					event.preventDefault();
					this.moveImage(this.currentItem, currentItem);
					this.resetMove();
				}
			},
			resetMove() {
				this.currentItem = null;
				this.currentItemTouch = null;
			},
			updateInputs(currentIndex: number, targetIndex: number) {
				const currentInput = this.$refs[`input_${currentIndex}`][0];
				const targetInput = this.$refs[`input_${targetIndex}`][0];

				const currentFiles = currentInput.files;
				const targetFiles = targetInput.files;

				currentInput.files = targetFiles;
				targetInput.files = currentFiles;
			},
		},
		computed: {
			isSelectedFile() {
				return this.imageItems.some((res) => res.src !== null);
			},
			isDropZoneEmpty() {
				return this.imageItems.some((res) => res.src === null);
			},
			isSendingImages() {
				return this.imageItems.some((image) => image.isSending === true);
			},
		},
		watch: {
			modelValue: {
				handler(newVal) {
					if (this.preventWatchUpdate) {
						this.preventWatchUpdate = false;
						return;
					}

					this.imageItems = newVal.map((image, index) => {
						return {
							...image,
							index: index,
							status: 'Загрузка...',
							isSending: false,
							isSendingStatus: null,
							isReadOnly: false,
							progress: 0,
						};
					});
				},
				deep: true,
				immediate: true,
			},
			imageItems: {
				handler(newVal) {
					this.preventWatchUpdate = true;
					this.$emit('update:modelValue', newVal);
				},
				deep: true,
			},
		},
	});
</script>
