# Apple Health Sync Backend

This is a Cloudflare Worker that receives workout data from Apple Health and makes it available to the Gym Tracker web app.

## Setup Instructions

### Step 1: Create a Cloudflare Account

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up for a free account (if you don't have one)

### Step 2: Deploy the Worker

1. In the Cloudflare dashboard, go to **Workers & Pages**
2. Click **Create Application** → **Create Worker**
3. Give it a name (e.g., `gym-sync`)
4. Click **Deploy**
5. Click **Edit code**
6. Replace all the code with the contents of `cloudflare-worker.js`
7. Click **Save and Deploy**

### Step 3: Create KV Storage

1. Go to **Workers & Pages** → **KV**
2. Click **Create namespace**
3. Name it `GYM_DATA`
4. Go back to your Worker → **Settings** → **Variables**
5. Scroll to **KV Namespace Bindings**
6. Click **Add binding**:
   - Variable name: `GYM_DATA`
   - KV namespace: Select the `GYM_DATA` namespace you created
7. Click **Save**

### Step 4: Get Your Worker URL

Your worker URL will be something like:
```
https://gym-sync.YOUR_SUBDOMAIN.workers.dev
```

Copy this URL.

### Step 5: Configure the Web App

1. Open `config.js` in the Gym Tracker app
2. Set your worker URL:
```javascript
SYNC_API_URL: 'https://gym-sync.YOUR_SUBDOMAIN.workers.dev',
```

### Step 6: Set Up Health Auto Export (iPhone App)

1. Install **Health Auto Export** from the [App Store](https://apps.apple.com/us/app/health-auto-export-json-csv/id1115567069) ($2.99 or subscription)

2. Open the app and go to **Automations**

3. Create a new automation:
   - **Trigger**: After workout ends (or daily at a specific time)
   - **Action**: REST API Export

4. Configure the REST API:
   - **URL**: Your worker URL + `/webhook`
     (e.g., `https://gym-sync.yourname.workers.dev/webhook`)
   - **Method**: POST
   - **Headers**: Add a header:
     - Key: `X-User-ID`
     - Value: Your Sync ID (shown in the app's Settings → Apple Health Sync)

5. Select data to export:
   - Enable **Workouts**
   - Optionally enable other metrics you want to track

6. Save and enable the automation

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook` | POST | Receive workout data from Health Auto Export |
| `/workouts` | GET | Get all synced workouts for a user |
| `/workouts` | DELETE | Clear all workouts for a user |
| `/register` | POST | Generate a new user ID |
| `/status` | GET | Get sync status for a user |
| `/health` | GET | Health check endpoint |

### Authentication

All endpoints (except `/register` and `/health`) require the `X-User-ID` header.

## Data Format

The webhook accepts workout data in the Health Auto Export format:

```json
{
  "data": {
    "workouts": [
      {
        "name": "Traditional Strength Training",
        "start": "2024-12-30T10:00:00Z",
        "end": "2024-12-30T11:00:00Z",
        "duration": 3600,
        "activeEnergy": 250
      }
    ]
  }
}
```

## Workout Type Mapping

Apple Health workout types are automatically mapped to the app's categories:

| Apple Health Type | App Category |
|-------------------|--------------|
| Traditional Strength Training | strength (auto-detected) |
| Functional Strength Training | strength |
| Elliptical, Cycling, Running | cardio |
| Core Training | core |
| Yoga, Pilates, Flexibility | core |

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests/day
- 10ms CPU time per request
- 1GB KV storage

This is more than enough for personal use.

## Troubleshooting

### Workouts not syncing?

1. Check that your User ID matches in both the app and Health Auto Export
2. Verify the webhook URL is correct (ends with `/webhook`)
3. Check the Health Auto Export app logs for errors
4. Test the endpoint manually:
   ```bash
   curl -X POST https://your-worker.workers.dev/webhook \
     -H "Content-Type: application/json" \
     -H "X-User-ID: YOUR_SYNC_ID" \
     -d '{"data":{"workouts":[{"name":"Test","start":"2024-01-01T10:00:00Z"}]}}'
   ```

### CORS errors?

The worker includes CORS headers for all origins. If you're still seeing errors, check your browser console for the specific error message.

## Alternative: iOS Shortcuts (Free)

If you don't want to pay for Health Auto Export, you can create an iOS Shortcut:

1. Create a new Shortcut
2. Add action: "Find Health Samples" → Workouts
3. Add action: "Get Contents of URL"
   - URL: Your webhook URL
   - Method: POST
   - Headers: X-User-ID: YOUR_SYNC_ID
   - Request Body: JSON with the workout data
4. Run manually or set up an automation

This requires more manual setup but works without any paid apps.
