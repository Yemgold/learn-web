






// src/lib/api/index.ts

import "./interceptors";

// Export everything from axios except apiClient.
export {
  axiosInstance,
} from "./axios";

// Export the shared apiClient from client.
export {
  apiClient,
} from "./client";

// Export other client utilities.
export * from "./client";