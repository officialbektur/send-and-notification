<template>
	<div v-if="isNotificationAlert" ref="content" class="notification__alert notification-alert">
		<ul class="notification__lists">
			<notification
				v-for="(notification, index) in notifications"
				:notification="notification"
				:key="notification.uuid"
			></notification>
		</ul>
	</div>
</template>

<script lang="ts">
	import Notification from './includes/Notification/Notification.vue';
	import NotificationContract from '@/Contracts/NotificationContract';

	export default {
		name: 'Alert',
		methods: {
			scrollToBottom() {
				try {
					const content = this.$refs.content as HTMLElement;
					if (content) {
						content.scroll({
							top: content.querySelector('.notification__lists').scrollHeight,
							behavior: 'smooth',
						});
					}
				} catch (error) {
				}
			},
		},
		computed: {
			notifications(): NotificationContract[] {
				return this.$store.getters.notifications.filter(
					(notification) => notification.is_alert
				) as NotificationContract[];
			},
			isNotificationAlert(): boolean {
				return (this.notifications?.length > 0) as boolean;
			},
		},
		watch: {
			notifications(status) {
				this.scrollToBottom()
			}
		},
		components: {
			Notification,
		},
	};
</script>
