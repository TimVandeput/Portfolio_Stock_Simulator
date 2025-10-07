export interface NotificationResponse {
  id: number;
  senderName?: string;
  receiverUserId: number;
  subject: string;
  body: string;
  preview: string;
  createdAt: string;
  read: boolean;
}

export interface SendNotificationRequest {
  senderUserId: number | null;
  subject: string;
  body: string;
}

export interface SendRoleNotificationRequest {
  senderUserId: number | null;
  role: string;
  subject: string;
  body: string;
}
