/**
 * Gym Tracker - Apple Health Sync Backend
 * Deploy this as a Cloudflare Worker
 *
 * Setup Instructions:
 * 1. Go to dash.cloudflare.com
 * 2. Workers & Pages > Create Application > Create Worker
 * 3. Paste this code and deploy
 * 4. Go to Settings > Variables > KV Namespace Bindings
 * 5. Create a KV namespace called "GYM_DATA" and bind it
 * 6. Copy your worker URL (e.g., gym-sync.yourname.workers.dev)
 */

// CORS headers for web app access
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-ID, X-API-Key',
    'Access-Control-Max-Age': '86400',
};

// Main request handler
export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            // Route handling
            if (path === '/webhook' && request.method === 'POST') {
                return await handleWebhook(request, env);
            }

            if (path === '/workouts' && request.method === 'GET') {
                return await getWorkouts(request, env);
            }

            if (path === '/workouts' && request.method === 'DELETE') {
                return await clearWorkouts(request, env);
            }

            if (path === '/register' && request.method === 'POST') {
                return await registerUser(request, env);
            }

            if (path === '/status' && request.method === 'GET') {
                return await getStatus(request, env);
            }

            if (path === '/health') {
                return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
            }

            return jsonResponse({ error: 'Not found' }, 404);
        } catch (error) {
            console.error('Error:', error);
            return jsonResponse({ error: 'Internal server error' }, 500);
        }
    }
};

/**
 * Handle webhook from Health Auto Export app or iOS Shortcuts
 * Expected payload format from Health Auto Export:
 * {
 *   "data": {
 *     "workouts": [
 *       {
 *         "name": "Traditional Strength Training",
 *         "start": "2024-12-30T10:00:00Z",
 *         "end": "2024-12-30T11:00:00Z",
 *         "duration": 3600,
 *         "activeEnergy": 250,
 *         "totalEnergy": 300
 *       }
 *     ]
 *   }
 * }
 */
async function handleWebhook(request, env) {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
        return jsonResponse({ error: 'Missing X-User-ID header' }, 400);
    }

    let payload;
    try {
        payload = await request.json();
    } catch (e) {
        return jsonResponse({ error: 'Invalid JSON payload' }, 400);
    }

    // Extract workouts from various payload formats
    let workouts = [];

    // Health Auto Export format
    if (payload.data?.workouts) {
        workouts = payload.data.workouts;
    }
    // Direct array format
    else if (Array.isArray(payload.workouts)) {
        workouts = payload.workouts;
    }
    // Single workout
    else if (payload.name && payload.start) {
        workouts = [payload];
    }
    // iOS Shortcuts format (may vary)
    else if (Array.isArray(payload)) {
        workouts = payload;
    }

    if (workouts.length === 0) {
        return jsonResponse({ error: 'No workouts found in payload' }, 400);
    }

    // Get existing workouts
    const existingData = await env.GYM_DATA.get(`workouts:${userId}`, 'json') || { workouts: [] };

    // Process and normalize incoming workouts
    const processedWorkouts = workouts.map(w => normalizeWorkout(w));

    // Merge with existing (avoid duplicates based on start time)
    const existingStarts = new Set(existingData.workouts.map(w => w.start));
    const newWorkouts = processedWorkouts.filter(w => !existingStarts.has(w.start));

    existingData.workouts = [...existingData.workouts, ...newWorkouts];
    existingData.lastSync = new Date().toISOString();

    // Store updated data
    await env.GYM_DATA.put(`workouts:${userId}`, JSON.stringify(existingData));

    return jsonResponse({
        success: true,
        added: newWorkouts.length,
        total: existingData.workouts.length
    });
}

/**
 * Normalize workout data from different sources
 */
function normalizeWorkout(workout) {
    // Map Apple Health workout types to our categories
    const workoutTypeMap = {
        // Upper body
        'Traditional Strength Training': 'strength',
        'Functional Strength Training': 'strength',
        'Upper Body': 'upper',

        // Lower body
        'Lower Body': 'lower',

        // Core
        'Core Training': 'core',
        'Flexibility': 'core',
        'Yoga': 'core',
        'Pilates': 'core',

        // Cardio (warmup/cooldown)
        'Elliptical': 'cardio',
        'Cycling': 'cardio',
        'Indoor Cycling': 'cardio',
        'Walking': 'cardio',
        'Running': 'cardio',
        'Treadmill': 'cardio',
        'Indoor Walk': 'cardio',
        'Indoor Run': 'cardio',
        'Stair Stepper': 'cardio',
    };

    const type = workoutTypeMap[workout.name] ||
                 workoutTypeMap[workout.type] ||
                 'strength';

    return {
        id: workout.id || `apple-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: workout.name || workout.type || 'Workout',
        type: type,
        start: workout.start || workout.startDate || new Date().toISOString(),
        end: workout.end || workout.endDate,
        duration: workout.duration || workout.durationSeconds || 0,
        activeEnergy: workout.activeEnergy || workout.activeEnergyBurned || 0,
        totalEnergy: workout.totalEnergy || workout.totalEnergyBurned || 0,
        source: 'apple_health',
        metadata: {
            originalType: workout.name || workout.type,
            heartRateAvg: workout.heartRateAvg,
            heartRateMax: workout.heartRateMax,
        }
    };
}

/**
 * Get workouts for a user
 */
async function getWorkouts(request, env) {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
        return jsonResponse({ error: 'Missing X-User-ID header' }, 400);
    }

    const url = new URL(request.url);
    const since = url.searchParams.get('since'); // ISO date string
    const limit = parseInt(url.searchParams.get('limit') || '100');

    const data = await env.GYM_DATA.get(`workouts:${userId}`, 'json') || { workouts: [] };

    let workouts = data.workouts;

    // Filter by date if specified
    if (since) {
        const sinceDate = new Date(since);
        workouts = workouts.filter(w => new Date(w.start) >= sinceDate);
    }

    // Sort by date descending and limit
    workouts = workouts
        .sort((a, b) => new Date(b.start) - new Date(a.start))
        .slice(0, limit);

    return jsonResponse({
        workouts,
        lastSync: data.lastSync,
        total: data.workouts.length
    });
}

/**
 * Clear all workouts for a user
 */
async function clearWorkouts(request, env) {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
        return jsonResponse({ error: 'Missing X-User-ID header' }, 400);
    }

    await env.GYM_DATA.delete(`workouts:${userId}`);

    return jsonResponse({ success: true, message: 'All workouts cleared' });
}

/**
 * Register a new user and get a unique ID
 */
async function registerUser(request, env) {
    const userId = generateUserId();

    // Initialize user data
    await env.GYM_DATA.put(`workouts:${userId}`, JSON.stringify({
        workouts: [],
        createdAt: new Date().toISOString()
    }));

    return jsonResponse({
        userId,
        message: 'User registered successfully',
        webhookUrl: `${new URL(request.url).origin}/webhook`
    });
}

/**
 * Get sync status for a user
 */
async function getStatus(request, env) {
    const userId = request.headers.get('X-User-ID');

    if (!userId) {
        return jsonResponse({ error: 'Missing X-User-ID header' }, 400);
    }

    const data = await env.GYM_DATA.get(`workouts:${userId}`, 'json');

    if (!data) {
        return jsonResponse({
            registered: false,
            message: 'User not found'
        });
    }

    return jsonResponse({
        registered: true,
        lastSync: data.lastSync,
        workoutCount: data.workouts?.length || 0,
        createdAt: data.createdAt
    });
}

/**
 * Generate a unique user ID
 */
function generateUserId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

/**
 * JSON response helper
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
        }
    });
}
