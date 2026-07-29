import { IUser } from './user.model';

export interface INotification {
  _id: string;
  senderId?: string | IUser;
  receiverId: string | IUser;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}
