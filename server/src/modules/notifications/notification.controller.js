import Notification from '../../db/models/Notification.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError, httpStatus } from '../../utils/apiError.js';

export const createNotification = asyncHandler(async (req, res) => {
  const { receiverId, title, message, type, data } = req.body;
  if (!receiverId || !title || !message) throw new ApiError(httpStatus.BAD_REQUEST, 'receiverId, title, and message are required');
  const notification = await Notification.create({ senderId: req.user.id || req.user._id, receiverId, title, message, type, data });
  res.status(201).json({ status: 'success', data: notification });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const { page = 1, limit = 50 } = req.query;
  const notifications = await Notification.find({ receiverId: userId })
    .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
  const unreadCount = await Notification.countDocuments({ receiverId: userId, isRead: false });
  res.json({ status: 'success', data: notifications, unreadCount, count: notifications.length });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const count = await Notification.countDocuments({ receiverId: userId, isRead: false });
  res.json({ status: 'success', data: { unreadCount: count } });
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  res.json({ status: 'success', data: notification });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, receiverId: userId },
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  res.json({ status: 'success', data: notification });
});

export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  await Notification.updateMany({ receiverId: userId, isRead: false }, { isRead: true });
  res.json({ status: 'success', message: 'All notifications marked as read' });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, receiverId: userId });
  if (!notification) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  res.json({ status: 'success', message: 'Notification deleted' });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  await Notification.deleteMany({ receiverId: userId });
  res.json({ status: 'success', message: 'All notifications deleted' });
});
