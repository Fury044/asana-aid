const LOCAL_API = "http://localhost:5000/api/v1";
const PROD_API = "https://asana-aid-production.up.railway.app/api/v1";

// Hardcoded to PROD to ensure Railway cloud persistence
let activeBase = PROD_API;

/**
 * Intelligent fetch wrapper that falls back to the Railway cloud server
 * if the local server is turned off or unreachable.
 */
export const apiFetch = async (endpoint: string, options?: RequestInit) => {
    try {
        const response = await fetch(`${activeBase}${endpoint}`, options);
        return response;
    } catch (error) {
        // If the fetch fails completely (e.g., local server is off - ECONNREFUSED/Failed to fetch)
        if (activeBase === LOCAL_API) {
            console.warn("Local API unreachable. Switching completely to Railway Production API...");
            activeBase = PROD_API; // Automatically redirect all future requests to cloud
            return await fetch(`${activeBase}${endpoint}`, options); // Retry the current request on cloud
        }
        throw error; // If Railway fails, let the component handle it
    }
};

export const getApiBaseUrl = () => activeBase;
