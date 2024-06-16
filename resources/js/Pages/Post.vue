<template>
	<Head title="Привет"></Head>
	<div
		class="absolute right-5 top-5 cursor-pointer sidebar-header__notifications-button"
		@click="$store.dispatch('changeShowNotifications')"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-10 h-10 fill-white"
			viewBox="0 0 512 512"
		>
			<!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
			<path
				d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
			/>
		</svg>
	</div>
	<Notifications></Notifications>
	<div class="w-full max-w-sm mx-auto my-6">
		<form @submit.prevent="sendPost" class="w-full max-w-sm mx-12">
			<DragAndDrop v-model="images" :isReadOnly="isReadOnly"></DragAndDrop>
			<div class="w-full mb-3">
				<div class="w-full">
					<label for="title" class="block text-red-500 font-bold mb-1 pr-4">
						Title
					</label>
				</div>
				<div class="w-full">
					<input
						type="text"
						id="title"
						v-model="title"
						:readonly="isReadOnly"
						class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
						placeholder="Название..."
						required
					/>
				</div>
			</div>
			<div class="w-full mb-3">
				<div class="w-full">
					<label for="content" class="block text-gray-500 font-bold mb-1 pr-4">
						Content
					</label>
				</div>
				<textarea
					id="content"
					v-model="content"
					:readonly="isReadOnly"
					rows="8"
					class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
					placeholder="Дополнительные данные..."
					required
				></textarea>
			</div>
			<div
				v-if="isSending"
				class="w-full flex items-center justify-center mb-6 h-4 bg-gray-400 relative"
			>
				<div
					class="bg-blue-700 h-full absolute left-0 transition duration-150 ease-out"
					:style="{
						width: progress + '%',
					}"
				></div>
				<div class="text-center relative text-white">{{ progress }}%</div>
			</div>
			<div class="w-full mb-3">
				<button
					:disabled="isSendingImages || isReadOnly"
					type="submit"
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
				>
					Отправить
				</button>
			</div>
		</form>
	</div>
	<div class="w-full max-w-sm mx-auto my-6">
		<div
			class="mt-6 mb-2 border-y border-amber-100 text-start"
			v-for="(image, index) in images"
		>
			<div class="py-1 border-y border-neutral-600 text-center">
				{{ index + 1 }}
			</div>
			<div class="mb-1 text-red-600">
				id:
				<span
					:class="{
						'text-yellow-800': !image.id,
					}"
				>
					{{ image.id ?? 'null' }}
				</span>
			</div>
			<div class="mb-1">
				src:
				<span
					:class="{
						'text-yellow-800': !image.src,
					}"
				>
					{{ image.src ?? 'null' }}
				</span>
			</div>
			<div class="mb-1">
				file:
				<span
					:class="{
						'text-yellow-800': !image.file,
					}"
				>
					{{ image.file ?? 'null' }}
				</span>
			</div>
			<div class="mb-1">
				isSending:
				<span
					:class="{
						'text-yellow-800': !image.isSending,
					}"
				>
					{{ image.isSending ?? 'null' }}
				</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Head } from '@inertiajs/vue3';
	import axios from 'axios';
	import DragAndDrop from './../Components/DragAndDrop.vue';
	import AppLayout from '@/Layouts/AppLayout.vue';
	import Notifications from '@/Components/Notifications/Notifications.vue';

	interface ImageContract {
		id: number | null;
		src: string | null;
		file: File | null;
	}

	export default {
		name: 'Post',
		layout: AppLayout,
		data() {
			return {
				title: '',
				content: '',
				images: [] as ImageContract[],

				isSending: false,
				progress: 0,
				isReadOnly: false,
			};
		},
		created() {
			for (let index = 0; index < 5; index++) {
				let { id, src } = {
					id: null,
					src: null,
				};
				this.images.push({
					id: id,
					src: src,
					file: null,
				});
			}
		},
		methods: {
			async sendPost(): Promise<void> {
				this.$store.dispatch('addSendingNotification', {
					uuid: `post`,
					title: `Создание нового поста: ${this.title.trim()}`,
				});
				try {
					this.isReadOnly = true;
					this.isSending = true;

					const config = {
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								(progressEvent.loaded / progressEvent.total) * 100
							);
							this.progress = progress
							this.$store.dispatch('changeNotificationProgress', {
								uuid: `post`,
								progress: progress,
							});
						},
					};

					const formData = {};

					formData['title'] = this.title.trim();
					formData['content'] = this.content.trim();

					const images = this.images
						.filter((image) => image.id)
						.map((image) => image.id);

					formData['images'] = images;

					const response = await axios.post(
						route('api.post.store'),
						formData,
						config
					);

					if (response.data?.post) {
						this.$store.dispatch('changeNotification', {
							uuid: `post`,
							progress: 100,
							status: true,
							response: `Поост созданно по id: ${response.data.post.id}`,
							is_finished: true,
						});
					} else {
						this.$store.dispatch('changeNotification', {
							uuid: `post`,
							progress: 100,
							status: false,
							response: 'Непредвиденная ошибка!',
							is_finished: true,
						});
					}
				} catch (error) {
					const errorMessage =
						error.response?.data?.error || 'Непредвиденная ошибка';

					this.$store.dispatch('changeNotification', {
						uuid: `post`,
						progress: 100,
						status: false,
						response: errorMessage,
						is_finished: true,
					});
				} finally {
					setTimeout(() => {
						this.isReadOnly = false;
						this.isSending = false;
						this.progress = 0;
					}, 600);
				}
			},
		},
		computed: {
			isSendingImages() {
				return this.images.some((image) => image.isSending === true);
			},
			notifications() {
				return this.$store.getters.notifications;
			},
		},
		components: {
			Notifications,
			DragAndDrop,
			Head,
		},
	};
</script>

<style scoped></style>
