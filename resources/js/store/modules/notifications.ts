import { ActionContext } from 'vuex';
import NotificationContract from '../../Contracts/NotificationContract';
import { v4 as uuidv4 } from 'uuid';
import { NotificationTypeEnum } from '../../Enums/NotificationTypeEnum';

const state = {
	notifications: [] as NotificationContract[],
	isShowNotifications: false as boolean,
};

const getters = {
	notifications: (state: {
		notifications: NotificationContract[];
	}): NotificationContract[] => state.notifications,
	isShowNotifications: (state: { isShowNotifications: boolean }): boolean =>
		state.isShowNotifications,
};

const actions = {
	addNotification(
		{ commit, getters }: ActionContext<any, any>,
		{
			uuid = uuidv4(),
			type,
			title,
			status = null,
			response = null,
			progress = 0,
			is_alert = true,
		}: NotificationContract
	): void {
		const notifications: NotificationContract[] = getters.notifications;
		const notification: NotificationContract = {
			uuid,
			type,
			title,
			status,
			response,
			progress,
			is_alert,
			date: getDate(),
		};

		commit('setNotifications', [...notifications, notification]);
	},
	addSendingNotification(
		{ dispatch }: ActionContext<any, any>,
		payload: Omit<NotificationContract, 'type'>
	): void {
		dispatch('addNotification', {
			...payload,
			type: NotificationTypeEnum.SENDING,
		});
	},
	addDisplayingNotification1(
		{ dispatch }: ActionContext<any, any>,
		payload: Omit<NotificationContract, 'type'>
	): void {
		dispatch('addNotification', {
			...payload,
			type: NotificationTypeEnum.DISPLAYING,
		});
		dispatch('markNotificationAsDeleted', payload.uuid);
	},
	addDisplayingNotification2(
		{ dispatch }: ActionContext<any, any>,
		payload: Omit<NotificationContract, 'type'>
	): void {
		const new_uuid: string = `${payload.uuid}_delete_${uuidv4()}`;
		dispatch('addNotification', {
			...payload,
			payload: new_uuid,
			type: NotificationTypeEnum.DISPLAYING,
		});
	},
	changeNotification(
		{ commit, getters, dispatch }: ActionContext<any, any>,
		{
			uuid,
			status,
			response,
			progress,
			is_finished = false,
		}: {
			uuid: string;
			status: boolean | null;
			response: string | null;
			progress: number;
			is_finished: boolean;
		}
	): void {
		updateNotification(commit, getters.notifications, uuid, {
			uuid,
			status,
			response,
			progress,
		});

		if (is_finished) {
			dispatch('markNotificationAsDeleted', uuid);
		}
	},
	markNotificationAsDeleted(
		{ commit, getters }: ActionContext<any, any>,
		uuid: string
	): void {
		const new_uuid: string = `${uuid}_delete_${uuidv4()}`;

		updateNotification(commit, getters.notifications, uuid, { uuid: new_uuid });
	},
	changeNotificationProgress(
		{ commit, getters }: ActionContext<any, any>,
		{
			uuid,
			progress,
		}: {
			uuid: string;
			progress: number;
		}
	): void {
		updateNotification(commit, getters.notifications, uuid, { uuid, progress });
	},
	changeShowNotifications(
		{ commit, getters }: ActionContext<any, any>,
		status: boolean | null = null
	): void {
		const newStatus = status !== null ? status : !getters.isShowNotifications;
		commit('setIsShowNotifications', newStatus);
	},
	deleteNotificationAlert(
		{ commit, getters }: ActionContext<any, any>,
		uuid: string
	): void {
		const notifications: NotificationContract[] = getters.notifications;
		const notificationIndex: number = getNotificationIndexByUUID(
			notifications,
			uuid
		);
		const isNotification: boolean = notificationIndex !== -1;
		if (isNotification) {
			updateNotifications(commit, notifications, notificationIndex, {
				is_alert: false,
			});
		}
	},
};

const mutations = {
	setNotifications(
		state: { notifications: NotificationContract[] },
		notifications: NotificationContract[]
	): void {
		state.notifications = notifications;
	},
	setIsShowNotifications(
		state: { isShowNotifications: boolean },
		isShowNotifications: boolean
	): void {
		state.isShowNotifications = isShowNotifications;
	},
};

function getDate(): string {
	const date: Date = new Date();

	const year: number = date.getFullYear();
	const month: number = date.getMonth();
	const day: number = date.getDay();
	const hours: number = date.getHours();
	const minutes: number = date.getMinutes();
	const seconds: number = date.getSeconds();

	return `${day < 10 ? String(0) + String(day) : day}-${
		month < 10 ? String(0) + String(month) : month
	}-${year}г ${hours < 10 ? String(0) + String(hours) : hours}:${
		minutes < 10 ? String(0) + String(minutes) : minutes
	}:${seconds < 10 ? String(0) + String(seconds) : seconds}`;
}

function updateNotification(
	commit: Function,
	notifications: NotificationContract[],
	uuid: string,
	updatedData: Partial<NotificationContract>
): void {
	const notificationIndex: number = getNotificationIndexByUUID(
		notifications,
		uuid
	);
	const isNotification: boolean = notificationIndex !== -1;
	if (isNotification) {
		updateNotifications(commit, notifications, notificationIndex, updatedData);
	}
}

function updateNotifications(
	commit: Function,
	notifications: NotificationContract[],
	index: number,
	updatedData: Partial<NotificationContract>
): void {
	const updatedNotifications = getNewUpdatedNotifications(
		notifications,
		index,
		updatedData
	);

	commit('setNotifications', updatedNotifications);
}

function getNewUpdatedNotifications(
	notifications: NotificationContract[],
	index: number,
	updatedData: Partial<NotificationContract>
): NotificationContract[] {
	const updatedNotification: NotificationContract = {
		...notifications[index],
		...updatedData,
	};
	const updatedNotifications: NotificationContract[] = [
		...notifications.slice(0, index),
		updatedNotification,
		...notifications.slice(index + 1),
	];

	return updatedNotifications;
}

function getNotificationIndexByUUID(
	notifications: NotificationContract[],
	uuid: string
): number {
	return notifications.findIndex(
		(notification: NotificationContract): boolean => notification.uuid === uuid
	);
}

export default {
	state,
	getters,
	actions,
	mutations,
};
