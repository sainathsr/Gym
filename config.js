/**
 * Gym Tracker Configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Deploy the Cloudflare Worker (see backend/cloudflare-worker.js)
 * 2. Replace SYNC_API_URL with your worker URL
 * 3. Your User ID will be generated automatically on first use
 */

const CONFIG = {
    // ===========================================
    // REPLACE THIS WITH YOUR CLOUDFLARE WORKER URL
    // ===========================================
    // Example: 'https://gym-sync.yourname.workers.dev'
    // Leave empty to disable cloud sync
    SYNC_API_URL: '',

    // Auto-sync interval in minutes (0 to disable)
    AUTO_SYNC_INTERVAL: 15,

    // Local storage keys
    STORAGE_KEYS: {
        USER_ID: 'gym-tracker-user-id',
        LAST_SYNC: 'gym-tracker-last-sync',
        SYNC_ENABLED: 'gym-tracker-sync-enabled'
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
