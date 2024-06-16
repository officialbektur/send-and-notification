<template>
	<div
		class="notification"
		:class="{
			_show: isShowNotifications,
		}"
	>
		<div class="notification__header">
			<div class="notification__title">
				Уведомление: {{ notifications?.length }} шт
			</div>
			<button
				type="button"
				@click.prevent="$store.dispatch('changeShowNotifications', false)"
				class="notification__close notification-close a-hover-bgc"
			>
				<span class="notification-close__icon">
					<svg viewBox="0 0 320 322" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M310.6 55.6C323.1 43.1 323.1 22.8 310.6 10.3C298.1 -2.20001 277.8 -2.20001 265.3 10.3L160 115.7L54.6 10.4C42.1 -2.10001 21.8 -2.10001 9.30005 10.4C-3.19995 22.9 -3.19995 43.2 9.30005 55.7L114.7 161L9.40005 266.4C-3.09995 278.9 -3.09995 299.2 9.40005 311.7C21.9 324.2 42.2001 324.2 54.7001 311.7L160 206.3L265.4 311.6C277.9 324.1 298.2 324.1 310.7 311.6C323.2 299.1 323.2 278.8 310.7 266.3L205.3 161L310.6 55.6Z"
						/>
					</svg>
				</span>
			</button>
		</div>
		<div ref="content" class="notification__content">
			<ul class="notification__lists">
				<notification
					v-if="notifications && notifications.length > 0"
					v-for="notification in notifications"
					:notification="notification"
					:key="notification.uuid"
				/>
				<div v-else class="text-center text-blue-600 font-bold">
					Уведомление пусто!
				</div>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
	import Notification from './includes/Notification/Notification.vue';
	import { mapActions, mapGetters } from 'vuex';

	export default {
		name: 'Notifications',
		data() {
			return {
				clickListenerAdded: false as boolean,
			};
		},

		updated() {
			if (!this.clickListenerAdded) {
				this.addClickListener();
				this.clickListenerAdded = true;
			}
		},

		beforeDestroy() {
			this.removeClickListener();
		},

		methods: {
			...mapActions(['changeShowNotifications']),
			scrollToBottom() {
				try {
					const content = this.$refs.content as HTMLElement;
					if (content) {
						content.scroll({
							top: content.scrollHeight,
							behavior: 'smooth',
						});
					}
				} catch (error) {}
			},
			addClickListener(): void {
				document.documentElement.addEventListener(
					'click',
					this.handleWindowClick
				);
			},

			removeClickListener(): void {
				document.documentElement.removeEventListener(
					'click',
					this.handleWindowClick
				);
			},

			handleWindowClick(e: Event): void {
				const el = e.target as HTMLElement | null;
				if (!el) return;

				const isTargetNotifications = el.closest('.notification');
				const isTargetSidebarHeaderNotificationsButton = el.closest(
					'.sidebar-header__notifications-button'
				);

				const shouldCloseNotifications =
					this.isShowNotifications &&
					!isTargetNotifications &&
					!isTargetSidebarHeaderNotificationsButton;

				if (shouldCloseNotifications) {
					this.changeShowNotifications(false);
				}
			},
		},
		computed: {
			...mapGetters(['notifications', 'isShowNotifications']),
		},
		watch: {
			isShowNotifications(status) {
				if (status) {
					this.scrollToBottom();
				}
			},
		},
		components: {
			Notification,
		},
	};
</script>
