// Re-export API utilities
export * from './api';

// Re-export high-level auth service (preferred for components)
export * from './auth';

// Re-export Identity service with namespace to avoid conflicts
export * as Identity from './identity';

// Re-export Lobby service with namespace to avoid conflicts
export * as Lobby from './lobby';
