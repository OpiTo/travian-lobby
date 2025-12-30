import { useNavigateWithParams } from './useNavigateWithParams';
import { useI18n } from '../localization/i18n';
import * as Lobby from '../services/lobby';
import { parseUUID } from '../utils/uuid';

/**
 * Null UUID constant (O in original)
 */
const NULL_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * Play flow hook (F function in original)
 * Handles the flow of joining/playing a gameworld after login
 */
export const usePlayFlow = () => {
  const { locale } = useI18n();
  const navigate = useNavigateWithParams();

  return async (searchParams?: URLSearchParams) => {
    const server = searchParams?.get('server') || undefined;
    const adCode = searchParams?.get('ad') || undefined;
    const ucCode = searchParams?.get('uc') || undefined;

    let targetUUID: string | null = null;
    let registrationKey: string | undefined;

    // Parse uc code to get gameworld UUID
    if (ucCode) {
      const parsed = parseUUID(ucCode, 'GAME');
      if (parsed) {
        targetUUID = parsed;
        registrationKey = ucCode;
      }
    }

    // Use server param if no uc code
    if (!targetUUID && server) {
      targetUUID = server;
    }

    let redirectUrl = window.Config?.lobby?.host || '/';

    if (targetUUID) {
      // Build redirect URL with params
      redirectUrl = new URL(
        `/account/join?${searchParams?.toString()}`,
        window.Config?.lobby?.host || window.location.origin
      ).toString();

      // Get gameworlds metadata and find the target
      const metadata = await Lobby.getMetadata() as unknown as Array<{
        uuid?: string;
        url?: string;
        registrationKeyRequired?: boolean;
        flags?: { registrationKeyRequired?: boolean };
      }>;
      const gameworld = metadata.find((gw) => gw.uuid === targetUUID);

      if (gameworld && gameworld.uuid) {
        try {
          // Check if user has an avatar on this gameworld
          const query = `{avatars(wuid: "${gameworld.uuid}", context: {type: StartPlaying}){uuid name}}`;
          const result = await Lobby.graphql<{ avatars: Array<{ uuid: string; name: string }> }>(query);
          const avatar = result.avatars?.[0];

          // If has registration key and avatar, show refer a friend forwarding
          if (registrationKey && avatar) {
            navigate('#referAFriendForwarding');
            return;
          }

          // If has avatar, play it
          if (avatar) {
            const playResult = await Lobby.playAvatar(avatar.uuid);
            redirectUrl = new URL(playResult.redirectTo, gameworld.url).toString();
          }

          // If no avatar and registration key required, redirect to join page
          if (avatar === undefined && (gameworld.registrationKeyRequired || gameworld.flags?.registrationKeyRequired)) {
            redirectUrl = new URL(
              `/account/join?${searchParams?.toString()}`,
              window.Config?.lobby?.host || window.location.origin
            ).toString();
          }

          // If no avatar, register one
          if (avatar === undefined) {
            const registerResult = await Lobby.registerAvatar(
              gameworld.uuid,
              adCode,
              registrationKey
            );
            redirectUrl = new URL(registerResult.redirectTo, gameworld.url).toString();
          }
        } catch {
          // Ignore errors and use default redirect
        }
      }
    }

    // If only ad code, redirect to join with null UUID
    if (!targetUUID && adCode) {
      redirectUrl = new URL(
        `/account/join?server=${NULL_UUID}&ad=${adCode}`,
        window.Config?.lobby?.host || window.location.origin
      ).toString();
    }

    window.location.href = redirectUrl;
  };
};

export default usePlayFlow;
