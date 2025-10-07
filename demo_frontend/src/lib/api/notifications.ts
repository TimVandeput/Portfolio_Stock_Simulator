import { HttpClient, ApiError } from "@/lib/api/http";
import type {
  NotificationResponse,
  SendNotificationRequest,
  SendRoleNotificationRequest,
} from "@/types/notification";

const client = new HttpClient();

export async function sendNotificationToUser(
  receiverUserId: number,
  request: SendNotificationRequest
): Promise<NotificationResponse> {
  try {
    return await client.post<NotificationResponse>(
      `/api/notifications/user/${receiverUserId}`,
      request
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

export async function sendNotificationToRole(
  request: SendRoleNotificationRequest
): Promise<NotificationResponse[]> {
  try {
    return await client.post<NotificationResponse[]>(
      `/api/notifications/role`,
      request
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

export async function sendNotificationToAll(
  request: SendNotificationRequest
): Promise<NotificationResponse[]> {
  try {
    return await client.post<NotificationResponse[]>(
      `/api/notifications/all`,
      request
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

export async function getUserNotifications(
  userId: number
): Promise<NotificationResponse[]> {
  try {
    return await client.get<NotificationResponse[]>(
      `/api/notifications/user/${userId}`
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  try {
    return await client.post<void>(`/api/notifications/${notificationId}/read`);
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}
