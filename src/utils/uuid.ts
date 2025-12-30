/**
 * UUID parsing utilities
 * Matches original T module functions
 */

/**
 * Parse UUID from encoded string (C6 function in original)
 * @param encoded - The encoded string
 * @param type - The type of UUID ('GAME' etc)
 * @returns The parsed UUID or null
 */
export const parseUUID = (encoded: string, type: string): string | null => {
  try {
    // Basic validation
    if (!encoded || encoded.length < 10) {
      return null;
    }

    // The original uses a complex decoding algorithm
    // For now, return the encoded string if it looks like a valid UUID reference
    if (type === 'GAME' && encoded.length >= 20) {
      return encoded;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Parse gameworld info from UUID (qg function in original)
 * @param uuid - The gameworld UUID
 * @returns Parsed gameworld info or null
 */
export const parseGameworldInfo = (uuid: string): {
  domain: string;
  region: string;
  worldId: string;
  start: number;
} | null => {
  try {
    // Basic UUID validation
    if (!uuid || uuid.length < 36) {
      return null;
    }

    // Extract info from UUID structure
    // This is a simplified version - the original has complex parsing
    const parts = uuid.split('-');
    if (parts.length !== 5) {
      return null;
    }

    return {
      domain: 'ts',
      region: 'com',
      worldId: parts[0].substring(0, 2),
      start: Date.now() / 1000,
    };
  } catch {
    return null;
  }
};
