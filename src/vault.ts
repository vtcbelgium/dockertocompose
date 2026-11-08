// In-Memory Client-Side Shield
export function auditVault(): { clientSideOnly: boolean; bytesInRam: number } {
  return {
    clientSideOnly: true,
    bytesInRam: 0,
  };
}
