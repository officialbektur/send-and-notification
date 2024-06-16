import { NotificationTypeEnum } from '@/Enums/NotificationTypeEnum';

export default interface NotificationContract {
	uuid?: string;
	type?: NotificationTypeEnum;
	title: string;
	status?: boolean | null;
	response: string | null;
	progress?: number;
	is_alert: boolean;
	date: string;
}
