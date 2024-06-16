<template>
	<li
		class="notification__list notification-list"
		:class="{
			_done: is_show,
			_error: isError,
		}"
	>
		<div class="notification-list__header">
			<div class="notification-list__title">
				{{ notification.title }}
			</div>
			<button
				type="button"
				@click.prevent="closeNotificationAlert"
				class="notification-list__close notification-list-close a-hover-bgc"
			>
				<span class="notification-list-close__icon">
					<svg viewBox="0 0 320 322" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M310.6 55.6C323.1 43.1 323.1 22.8 310.6 10.3C298.1 -2.20001 277.8 -2.20001 265.3 10.3L160 115.7L54.6 10.4C42.1 -2.10001 21.8 -2.10001 9.30005 10.4C-3.19995 22.9 -3.19995 43.2 9.30005 55.7L114.7 161L9.40005 266.4C-3.09995 278.9 -3.09995 299.2 9.40005 311.7C21.9 324.2 42.2001 324.2 54.7001 311.7L160 206.3L265.4 311.6C277.9 324.1 298.2 324.1 310.7 311.6C323.2 299.1 323.2 278.8 310.7 266.3L205.3 161L310.6 55.6Z"
						/>
					</svg>
				</span>
			</button>
		</div>
		<div class="notification-list__content">
			<div
				v-if="isTypeSending"
				class="notification-list__loading notification-list-loading"
			>
				<div
					class="notification-list-loading__indicator notification-list-loading-indicator"
				>
					<span
						class="notification-list-loading-indicator__progress"
						:style="{
							width: progress,
						}"
					></span>
				</div>
				<div class="notification-list-loading__progress">
					{{ notificationResponseProgress }}
				</div>
			</div>
			<div class="notification-list__response notification-list-response _full">
				<span class="notification-list-response__title"
					>{{ notificationResponseTitle }}:
				</span>
				<span
					v-if="!isSending || isTypeDisplaying"
					class="notification-list-response__result"
				>
					{{ notification.response }}
				</span>
				<span v-else class="notification-list-response__loading"></span>
			</div>
			<div class="notification-list__date">
				{{ notification.date }}
			</div>
		</div>
	</li>
</template>

<script lang="ts">
	import NotificationContract from '@/Contracts/NotificationContract';
	import NotificationMixin from '@/Mixins/NotificationMixin';

	export default {
		name: 'Notification',
		props: {
			notification: {
				type: Object as NotificationContract,
				required: true,
			},
		},
		mixins: [NotificationMixin],
		data() {
			return {
				is_show: false,
			};
		},
		mounted() {
			this.startNotificationAlert();
		},
		methods: {
			closeNotificationAlert() {
				this.is_show = true;
				setTimeout(() => {
					this.$store.dispatch(
						'deleteNotificationAlert',
						this.notification.uuid
					);
				}, 300);
			},
			startNotificationAlert() {
				setTimeout(() => {
					this.closeNotificationAlert();
				}, 2000);
			},
		},
	};
</script>
<style scoped lang="scss"></style>
