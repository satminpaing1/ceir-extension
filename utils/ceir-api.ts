import type { AltchaSolution } from './altcha';
import type { ImeiCheckResponse } from './types';
import { FetchError } from './altcha';
import { pageFetch } from './page-fetch';

/**
 * Encode an AltchaSolution as a Base64 string for the query parameter.
 */
export function encodeAltchaSolution(solution: AltchaSolution): string {
  return btoa(JSON.stringify(solution));
}

/**
 * Call the CEIR IMEI Verify API.
 *
 * @param imeis  Array of IMEI strings to check.
 * @param solution  The solved Altcha payload.
 * @returns Parsed API response containing the check results.
 * @throws {FetchError} with `status` set to the HTTP code on non-OK responses.
 */
export async function verifyImeis(
  imeis: string[],
  solution: AltchaSolution,
): Promise<ImeiCheckResponse> {
  const altchaParam = encodeAltchaSolution(solution);

  const response = await pageFetch(
    `https://ceir.gov.mm/openapi/API/IMEI/Verify?altcha=${altchaParam}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      referrer: 'https://ceir.gov.mm/check-status',
      credentials: 'include',
      body: JSON.stringify(imeis),
    },
  );

  if (!response.ok) {
    throw new FetchError(
      response.status,
      `IMEI verify failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<ImeiCheckResponse>;
}

// Device Info ကို API ကနေ လှမ်းယူမည့် Function
export async function fetchDeviceInfo(imei: string, solution: any) {
  // Altcha payload ကို ယူရန်
  const altchaPayload = solution?.payload ? solution.payload : solution;
  
  // Network tab က မြင်ရတဲ့အတိုင်း GET request ခေါ်ရန်
  const url = `https://ceir.gov.mm/openapi/API/Device/personal-device-info?altcha=${encodeURIComponent(altchaPayload)}&imei=${imei}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch device info');
  }

  return await response.json();
}
