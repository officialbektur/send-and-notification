<template>
	<li
		class="notification__list notification-list"
		:class="{
			_error: isError,
			_sending: isSending,
		}"
	>
		<div class="notification-list__title">
			{{ notification.title }}
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
	};
</script>
