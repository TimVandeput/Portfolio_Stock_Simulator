import { HttpClient, ApiError } from "@/lib/api/http";
import type { Page } from "@/types/pagination";
import type {
  SymbolDTO,
  ImportSummaryDTO,
  ImportStatusDTO,
  Universe,
} from "@/types/symbol";

const client = new HttpClient();

function qs(
  params: Record<string, string | number | boolean | undefined>
): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.length > 0) u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}

export async function getImportStatus(): Promise<ImportStatusDTO> {
  return client.get<ImportStatusDTO>(`/api/symbols/import/status`);
}

export async function importSymbols(
  universe: Universe = "NDX"
): Promise<ImportSummaryDTO> {
  try {
    return await client.post<ImportSummaryDTO>(
      `/api/symbols/import${qs({ universe })}`
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

export async function listSymbols(params?: {
  q?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}): Promise<Page<SymbolDTO>> {
  const query = qs({
    q: params?.q,
    enabled: params?.enabled,
    page: params?.page ?? 0,
    size: params?.size ?? 25,
  });
  return client.get<Page<SymbolDTO>>(`/api/symbols${query}`);
}

export async function setSymbolEnabled(
  id: number,
  enabled: boolean
): Promise<SymbolDTO> {
  try {
    return await client.put<SymbolDTO>(`/api/symbols/${id}/enabled`, {
      enabled,
    });
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
