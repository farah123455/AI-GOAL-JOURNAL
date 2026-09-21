/**
 * ============================================================================
 * DEVELOPMENT / LOCAL PREVIEW ONLY — DO NOT SHIP
 * ============================================================================
 * Temporary frontend bypass so protected pages can be opened and tested in a
 * local dev server without a configured Firebase login.
 *
 * Enable:  VITE_DEV_PREVIEW=true  in the frontend .env, then restart Vite.
 * Disable: set to false (or delete the line) — real Firebase auth resumes.
 *
 * Safety: this flag is ALSO gated on `import.meta.env.DEV`, so production
 * builds (`npm run build`) can NEVER ship with the bypass active, even if the
 * env var is accidentally left in .env.
 *
 * Remove this file (and the two small gated checks in AuthContext.jsx /
 * ProtectedRoute.jsx) once Firebase auth is properly configured.
 */
export const isDevPreview =
  import.meta.env.DEV === true &&
  (import.meta.env.VITE_DEV_PREVIEW || '').toString().trim().toLowerCase() === 'true';

/** Minimal mock user for preview pages that read the auth context. */
export const devPreviewUser = {
  uid: 'dev-preview-user',
  email: 'dev-preview@localhost',
  displayName: 'Dev Preview',
  // Must match the backend's accepted mock dev token (backend/app/core/auth.py
  // accepts tokens starting with "mock-"). See services/api.js getAuthHeaders.
  getIdToken: async () => 'mock-dev-token-123',
};
