export default {
	data() {
		return {};
	},
	computed: {
		isSending(): boolean {
			return this.notification.status === null;
		},

		isTypeSending(): boolean {
			return this.notification.type === 'sending';
		},

		isTypeDisplaying(): boolean {
			return this.notification.type === 'displaying';
		},

		isError(): boolean {
			return this.notification.status === false;
		},

		progress(): string {
			return `${this.notification.progress}%`;
		},

		notificationResponseProgress(): string {
			return this.isSending ? this.progress : this.isError ? 'Error' : 'Ok';
		},

		notificationResponseTitle(): string {
			return this.isSending ? 'Статус' : 'Ответ';
		},
	},
};
