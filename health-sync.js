/**
 * Health Sync Service
 * Handles syncing workout data from Apple Health via the backend
 */

const HealthSync = (function() {
    'use strict';

    // State
    let userId = null;
    let isEnabled = false;
    let lastSync = null;
    let syncInterval = null;

    /**
     * Initialize the sync service
     */
    function init() {
        userId = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID);
        isEnabled = localStorage.getItem(CONFIG.STORAGE_KEYS.SYNC_ENABLED) === 'true';
        lastSync = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_SYNC);

        // Start auto-sync if enabled
        if (isEnabled && CONFIG.SYNC_API_URL && CONFIG.AUTO_SYNC_INTERVAL > 0) {
            startAutoSync();
        }
    }

    /**
     * Check if sync is configured
     */
    function isConfigured() {
        return Boolean(CONFIG.SYNC_API_URL);
    }

    /**
     * Generate a new user ID from the backend
     */
    async function register() {
        if (!CONFIG.SYNC_API_URL) {
            throw new Error('Sync API URL not configured');
        }

        const response = await fetch(`${CONFIG.SYNC_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Failed to register');
        }

        const data = await response.json();
        userId = data.userId;
        localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, userId);

        return data;
    }

    /**
     * Get or create user ID
     */
    async function getUserId() {
        if (userId) return userId;

        // Generate locally if no backend
        if (!CONFIG.SYNC_API_URL) {
            userId = generateLocalId();
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, userId);
            return userId;
        }

        const result = await register();
        return result.userId;
    }

    /**
     * Generate a local user ID
     */
    function generateLocalId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let id = '';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    /**
     * Enable sync
     */
    async function enable() {
        if (!userId) {
            await getUserId();
        }
        isEnabled = true;
        localStorage.setItem(CONFIG.STORAGE_KEYS.SYNC_ENABLED, 'true');

        if (CONFIG.AUTO_SYNC_INTERVAL > 0) {
            startAutoSync();
        }

        // Do initial sync
        await syncFromCloud();
    }

    /**
     * Disable sync
     */
    function disable() {
        isEnabled = false;
        localStorage.setItem(CONFIG.STORAGE_KEYS.SYNC_ENABLED, 'false');
        stopAutoSync();
    }

    /**
     * Start auto-sync interval
     */
    function startAutoSync() {
        stopAutoSync();
        syncInterval = setInterval(() => {
            syncFromCloud().catch(console.error);
        }, CONFIG.AUTO_SYNC_INTERVAL * 60 * 1000);
    }

    /**
     * Stop auto-sync
     */
    function stopAutoSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }

    /**
     * Fetch workouts from cloud and merge with local data
     */
    async function syncFromCloud() {
        if (!CONFIG.SYNC_API_URL || !userId) {
            return { synced: 0 };
        }

        const response = await fetch(`${CONFIG.SYNC_API_URL}/workouts`, {
            headers: { 'X-User-ID': userId }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch workouts');
        }

        const data = await response.json();
        const imported = importWorkouts(data.workouts);

        lastSync = new Date().toISOString();
        localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_SYNC, lastSync);

        return {
            synced: imported,
            total: data.total,
            lastSync: data.lastSync
        };
    }

    /**
     * Import Apple Health workouts into local storage
     */
    function importWorkouts(healthWorkouts) {
        if (!healthWorkouts || healthWorkouts.length === 0) {
            return 0;
        }

        let imported = 0;

        healthWorkouts.forEach(workout => {
            const dateKey = workout.start.split('T')[0];
            const workoutType = mapWorkoutType(workout);

            if (!workoutType) return;

            // Get existing day data
            let dayData = getDayData(dateKey) || { exercises: {} };

            // If no workout type set for this day, set it based on the synced workout
            if (!dayData.workoutType) {
                dayData.workoutType = workoutType;
                dayData.syncedFrom = 'apple_health';
                dayData.syncedAt = new Date().toISOString();
                imported++;
            }

            // Mark cardio exercises as done if it was a cardio workout
            if (workout.type === 'cardio') {
                markCardioExercises(dayData, workout);
            }

            saveDayData(dateKey, dayData);
        });

        return imported;
    }

    /**
     * Map Apple Health workout type to our workout categories
     */
    function mapWorkoutType(workout) {
        const name = (workout.name || workout.originalType || '').toLowerCase();

        // Check for explicit upper/lower/core mentions
        if (name.includes('upper')) return 'upper';
        if (name.includes('lower') || name.includes('leg')) return 'lower';
        if (name.includes('core') || name.includes('ab')) return 'core';

        // Map based on workout type
        const typeMap = {
            'strength': inferStrengthType(workout),
            'cardio': null, // Cardio alone doesn't set workout type
            'upper': 'upper',
            'lower': 'lower',
            'core': 'core'
        };

        return typeMap[workout.type];
    }

    /**
     * Infer strength workout type from duration and metadata
     */
    function inferStrengthType(workout) {
        // If we have metadata about muscle groups, use that
        if (workout.metadata?.muscleGroups) {
            const groups = workout.metadata.muscleGroups.toLowerCase();
            if (groups.includes('chest') || groups.includes('back') || groups.includes('shoulder')) {
                return 'upper';
            }
            if (groups.includes('leg') || groups.includes('glute') || groups.includes('quad')) {
                return 'lower';
            }
            if (groups.includes('core') || groups.includes('ab')) {
                return 'core';
            }
        }

        // Default to cycling through workout types based on day of week
        // This is a fallback - ideally the user sets the type manually
        return null;
    }

    /**
     * Mark cardio exercises as completed
     */
    function markCardioExercises(dayData, workout) {
        if (!dayData.workoutType || !window.workoutData) return;

        const workoutInfo = window.workoutData[dayData.workoutType];
        if (!workoutInfo) return;

        // Find cardio exercises and mark them
        workoutInfo.sections.forEach(section => {
            section.exercises.forEach(exercise => {
                if (exercise.type === 'cardio' && !dayData.exercises[exercise.id]) {
                    const duration = Math.round((workout.duration || 0) / 60);
                    dayData.exercises[exercise.id] = {
                        completed: true,
                        sets: [duration || exercise.defaultReps],
                        comment: `Synced from Apple Health`,
                        completedAt: workout.start,
                        source: 'apple_health'
                    };
                }
            });
        });
    }

    /**
     * Get day data from storage
     */
    function getDayData(dateKey) {
        try {
            const allData = JSON.parse(localStorage.getItem('gym-tracker-data') || '{}');
            return allData[dateKey] || null;
        } catch {
            return null;
        }
    }

    /**
     * Save day data to storage
     */
    function saveDayData(dateKey, dayData) {
        try {
            const allData = JSON.parse(localStorage.getItem('gym-tracker-data') || '{}');
            allData[dateKey] = dayData;
            localStorage.setItem('gym-tracker-data', JSON.stringify(allData));
        } catch (e) {
            console.error('Failed to save day data:', e);
        }
    }

    /**
     * Get sync status
     */
    async function getStatus() {
        if (!CONFIG.SYNC_API_URL || !userId) {
            return {
                configured: Boolean(CONFIG.SYNC_API_URL),
                enabled: isEnabled,
                userId: userId,
                lastSync: lastSync
            };
        }

        try {
            const response = await fetch(`${CONFIG.SYNC_API_URL}/status`, {
                headers: { 'X-User-ID': userId }
            });

            if (!response.ok) {
                throw new Error('Failed to get status');
            }

            const data = await response.json();
            return {
                configured: true,
                enabled: isEnabled,
                userId: userId,
                lastSync: lastSync,
                cloudLastSync: data.lastSync,
                workoutCount: data.workoutCount
            };
        } catch (error) {
            return {
                configured: true,
                enabled: isEnabled,
                userId: userId,
                lastSync: lastSync,
                error: error.message
            };
        }
    }

    /**
     * Clear all synced data
     */
    async function clearSyncedData() {
        if (CONFIG.SYNC_API_URL && userId) {
            await fetch(`${CONFIG.SYNC_API_URL}/workouts`, {
                method: 'DELETE',
                headers: { 'X-User-ID': userId }
            });
        }
    }

    /**
     * Import from manual Apple Health export (XML)
     */
    async function importFromXML(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const content = e.target.result;
                    let workouts = [];

                    // Check if it's a ZIP file (Apple Health export is a ZIP)
                    if (file.name.endsWith('.zip')) {
                        // We can't unzip in browser easily without a library
                        // For now, ask user to extract and upload the XML
                        reject(new Error('Please extract the ZIP file and upload export.xml'));
                        return;
                    }

                    // Parse XML
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(content, 'text/xml');

                    // Find workout records
                    const workoutRecords = xmlDoc.querySelectorAll('Workout');

                    workoutRecords.forEach(record => {
                        const type = record.getAttribute('workoutActivityType') || '';
                        const start = record.getAttribute('startDate');
                        const end = record.getAttribute('endDate');
                        const duration = parseFloat(record.getAttribute('duration') || '0');

                        // Map Apple's workout activity types
                        let name = type.replace('HKWorkoutActivityType', '');
                        // Convert CamelCase to spaces
                        name = name.replace(/([A-Z])/g, ' $1').trim();

                        workouts.push({
                            name: name,
                            start: start,
                            end: end,
                            duration: duration,
                            source: 'apple_health_export'
                        });
                    });

                    const imported = importWorkouts(workouts.map(w => ({
                        ...w,
                        type: mapAppleWorkoutType(w.name)
                    })));

                    resolve({ imported, total: workouts.length });
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));

            if (file.name.endsWith('.xml')) {
                reader.readAsText(file);
            } else if (file.name.endsWith('.zip')) {
                reader.readAsArrayBuffer(file);
            } else {
                reject(new Error('Please upload an XML or ZIP file'));
            }
        });
    }

    /**
     * Map Apple's HKWorkoutActivityType to our types
     */
    function mapAppleWorkoutType(activityType) {
        const typeMap = {
            'Traditional Strength Training': 'strength',
            'Functional Strength Training': 'strength',
            'Elliptical': 'cardio',
            'Cycling': 'cardio',
            'Indoor Cycling': 'cardio',
            'Walking': 'cardio',
            'Running': 'cardio',
            'Flexibility': 'core',
            'Yoga': 'core',
            'Pilates': 'core',
            'Core Training': 'core'
        };

        return typeMap[activityType] || 'strength';
    }

    /**
     * Get webhook URL for Health Auto Export app
     */
    function getWebhookUrl() {
        if (!CONFIG.SYNC_API_URL) return null;
        return `${CONFIG.SYNC_API_URL}/webhook`;
    }

    /**
     * Get webhook headers for Health Auto Export app
     */
    function getWebhookHeaders() {
        return {
            'Content-Type': 'application/json',
            'X-User-ID': userId || ''
        };
    }

    // Public API
    return {
        init,
        isConfigured,
        getUserId,
        enable,
        disable,
        syncFromCloud,
        getStatus,
        clearSyncedData,
        importFromXML,
        getWebhookUrl,
        getWebhookHeaders,
        get isEnabled() { return isEnabled; },
        get userId() { return userId; },
        get lastSync() { return lastSync; }
    };
})();

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HealthSync.init());
} else {
    HealthSync.init();
}

// Export
window.HealthSync = HealthSync;
