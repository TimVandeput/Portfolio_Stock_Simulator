import { HttpClient } from "@/lib/api/http";

export interface CreateMysteryPageDTO {
  title: string;
}

export interface MysteryPageDTO {
  title: string;
  content: string;
}

const client = new HttpClient();

export async function createMysteryPage(
  userId: number,
  dto: CreateMysteryPageDTO
): Promise<MysteryPageDTO> {
  return client.post<MysteryPageDTO>(`/api/users/${userId}/mystery-page`, dto);
}

export async function getMysteryPage(userId: number): Promise<MysteryPageDTO> {
  return client.get<MysteryPageDTO>(`/api/users/${userId}/mystery-page`);
}
