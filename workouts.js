// SVG Illustrations for exercises
const svgIcons = {
    // Cardio icons
    cardio: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="12" fill="#e94560"/>
        <path d="M50 45 L50 65 M35 55 L65 55 M50 65 L35 85 M50 65 L65 85" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M25 70 Q50 50 75 70" stroke="#00d26a" stroke-width="3" stroke-dasharray="5,5"/>
    </svg>`,

    treadmill: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="55" width="70" height="25" rx="5" fill="#0f3460"/>
        <rect x="20" y="60" width="55" height="15" rx="3" fill="#1a1a2e"/>
        <circle cx="25" cy="75" r="6" fill="#e94560"/>
        <circle cx="75" cy="75" r="6" fill="#e94560"/>
        <path d="M70 55 L75 25 L80 25" stroke="#0f3460" stroke-width="4" stroke-linecap="round"/>
        <circle cx="45" cy="30" r="8" fill="#e94560"/>
        <path d="M45 40 L45 50 M35 45 L45 50 L55 45" stroke="#e94560" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

    // Upper body exercises
    chestPress: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="45" width="80" height="8" rx="2" fill="#0f3460"/>
        <rect x="5" y="40" width="12" height="18" rx="2" fill="#e94560"/>
        <rect x="83" y="40" width="12" height="18" rx="2" fill="#e94560"/>
        <circle cx="50" cy="35" r="10" fill="#e94560"/>
        <ellipse cx="50" cy="55" rx="15" ry="12" fill="#e94560" opacity="0.8"/>
        <path d="M25 49 L35 49 M65 49 L75 49" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </svg>`,

    chestFlys: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="10" fill="#e94560"/>
        <ellipse cx="50" cy="55" rx="15" ry="12" fill="#e94560" opacity="0.8"/>
        <path d="M20 40 Q35 55 50 50" stroke="#0f3460" stroke-width="6" stroke-linecap="round"/>
        <path d="M80 40 Q65 55 50 50" stroke="#0f3460" stroke-width="6" stroke-linecap="round"/>
        <circle cx="18" cy="38" r="6" fill="#e94560"/>
        <circle cx="82" cy="38" r="6" fill="#e94560"/>
        <path d="M35 55 L40 70 M65 55 L60 70" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    shoulderPress: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="30" r="12" fill="#e94560"/>
        <rect x="42" y="42" width="16" height="25" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M30 50 L30 25 L25 25 M70 50 L70 25 L75 25" stroke="#0f3460" stroke-width="6" stroke-linecap="round"/>
        <rect x="20" y="20" width="12" height="8" rx="2" fill="#e94560"/>
        <rect x="68" y="20" width="12" height="8" rx="2" fill="#e94560"/>
        <path d="M42 67 L38 85 M58 67 L62 85" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    latPulldown: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="45" y="5" width="10" height="20" rx="2" fill="#0f3460"/>
        <rect x="20" y="20" width="60" height="6" rx="2" fill="#0f3460"/>
        <path d="M25 26 L35 50 M75 26 L65 50" stroke="#0f3460" stroke-width="4"/>
        <circle cx="50" cy="45" r="10" fill="#e94560"/>
        <path d="M35 50 L35 55 L50 55 L65 55 L65 50" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <rect x="42" y="55" width="16" height="20" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M42 75 L38 90 M58 75 L62 90" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    rowing: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="60" width="80" height="10" rx="3" fill="#0f3460"/>
        <rect x="40" y="55" width="20" height="8" rx="2" fill="#0f3460"/>
        <circle cx="55" cy="40" r="10" fill="#e94560"/>
        <path d="M55 50 L55 58 M45 75 L55 58 L65 75" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M55 55 L30 50 L20 55" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <rect x="12" y="50" width="15" height="6" rx="2" fill="#e94560"/>
    </svg>`,

    hammerCurl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="25" r="12" fill="#e94560"/>
        <rect x="42" y="37" width="16" height="28" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M38 45 L38 65 L35 75" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M62 45 L62 55 L65 45" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <rect x="60" y="32" width="8" height="18" rx="2" fill="#0f3460"/>
        <rect x="32" y="70" width="8" height="15" rx="2" fill="#0f3460"/>
        <path d="M42 65 L40 85 M58 65 L60 85" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    overheadExtension: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="12" fill="#e94560"/>
        <rect x="42" y="47" width="16" height="25" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M40 50 L45 25 L50 15 L55 25 L60 50" stroke="#e94560" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="42" y="8" width="16" height="12" rx="3" fill="#0f3460"/>
        <path d="M42 72 L38 90 M58 72 L62 90" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
    </svg>`,

    // Lower body exercises
    squat: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="12" fill="#e94560"/>
        <rect x="42" y="32" width="16" height="20" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M42 52 L30 70 L30 85" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M58 52 L70 70 L70 85" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M35 45 L35 35 M65 45 L65 35" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="30" cy="88" rx="8" ry="4" fill="#e94560"/>
        <ellipse cx="70" cy="88" rx="8" ry="4" fill="#e94560"/>
    </svg>`,

    legPress: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="25" width="30" height="50" rx="5" fill="#0f3460"/>
        <rect x="50" y="45" width="40" height="20" rx="3" fill="#0f3460" transform="rotate(-30 50 45)"/>
        <circle cx="35" cy="40" r="8" fill="#e94560"/>
        <path d="M35 48 L35 55 L55 70" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M55 70 L75 60" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <rect x="70" y="50" width="20" height="25" rx="3" fill="#e94560" opacity="0.5"/>
    </svg>`,

    legExtension: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="25" height="40" rx="5" fill="#0f3460"/>
        <circle cx="35" cy="40" r="8" fill="#e94560"/>
        <path d="M35 48 L35 60" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M35 60 L35 70 L70 55" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <rect x="65" y="48" width="15" height="10" rx="3" fill="#e94560"/>
        <path d="M20 70 L45 70 L45 85 L20 85" stroke="#0f3460" stroke-width="4" fill="#0f3460"/>
    </svg>`,

    legCurl: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="35" width="60" height="15" rx="4" fill="#0f3460"/>
        <circle cx="30" cy="32" r="8" fill="#e94560"/>
        <ellipse cx="45" cy="42" rx="12" ry="6" fill="#e94560" opacity="0.8"/>
        <path d="M55 42 L75 42 L80 60" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <rect x="75" y="55" width="10" height="15" rx="3" fill="#e94560"/>
        <path d="M15 50 L15 70 L30 70" stroke="#0f3460" stroke-width="4"/>
    </svg>`,

    abductor: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="40" height="25" rx="5" fill="#0f3460"/>
        <circle cx="50" cy="35" r="8" fill="#e94560"/>
        <path d="M50 43 L50 55" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M45 55 L20 75" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M55 55 L80 75" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <rect x="10" y="70" width="15" height="12" rx="3" fill="#0f3460"/>
        <rect x="75" y="70" width="15" height="12" rx="3" fill="#0f3460"/>
        <path d="M25 75 L35 55 M75 75 L65 55" stroke="#0f3460" stroke-width="3" stroke-dasharray="4,4"/>
    </svg>`,

    calfRaise: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="10" fill="#e94560"/>
        <rect x="43" y="30" width="14" height="25" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M43 55 L43 75 L40 85" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M57 55 L57 75 L60 85" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="40" cy="88" rx="10" ry="5" fill="#e94560"/>
        <ellipse cx="60" cy="88" rx="10" ry="5" fill="#e94560"/>
        <path d="M35 88 L35 80 M65 88 L65 80" stroke="#00d26a" stroke-width="2" stroke-dasharray="3,3"/>
        <rect x="25" y="90" width="50" height="6" rx="2" fill="#0f3460"/>
    </svg>`,

    // Core exercises
    birdDog: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="45" r="8" fill="#e94560"/>
        <ellipse cx="50" cy="52" rx="25" ry="10" fill="#e94560" opacity="0.8"/>
        <path d="M30 55 L30 75" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M70 55 L70 75" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M25 45 L10 35" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M75 50 L95 40" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <circle cx="8" cy="33" r="4" fill="#e94560"/>
        <circle cx="97" cy="38" r="4" fill="#e94560"/>
    </svg>`,

    catCamel: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="40" r="8" fill="#e94560"/>
        <path d="M28 42 Q50 25 80 45" stroke="#e94560" stroke-width="8" stroke-linecap="round"/>
        <path d="M25 50 L25 70 M35 50 L35 70 M70 50 L70 70 M80 50 L80 70" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M50 35 L50 25" stroke="#00d26a" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="45" y="20" fill="#00d26a" font-size="10">▲</text>
    </svg>`,

    buttKick: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="20" r="10" fill="#e94560"/>
        <rect x="43" y="30" width="14" height="22" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M43 52 L40 75 L38 90" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M57 52 L60 65 L55 50" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <circle cx="55" cy="48" r="5" fill="#e94560"/>
        <path d="M40 35 L30 30 M60 35 L70 30" stroke="#e94560" stroke-width="4" stroke-linecap="round"/>
        <path d="M60 55 Q70 45 65 50" stroke="#00d26a" stroke-width="2" stroke-dasharray="3,3"/>
    </svg>`,

    jumpingJack: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="18" r="10" fill="#e94560"/>
        <rect x="43" y="28" width="14" height="25" rx="4" fill="#e94560" opacity="0.8"/>
        <path d="M43 35 L20 20" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M57 35 L80 20" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M43 53 L25 85" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M57 53 L75 85" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <circle cx="18" cy="18" r="4" fill="#e94560"/>
        <circle cx="82" cy="18" r="4" fill="#e94560"/>
        <ellipse cx="25" cy="88" rx="6" ry="3" fill="#e94560"/>
        <ellipse cx="75" cy="88" rx="6" ry="3" fill="#e94560"/>
    </svg>`,

    sideBend: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="55" cy="20" r="10" fill="#e94560"/>
        <path d="M55 30 Q70 50 55 70" stroke="#e94560" stroke-width="12" stroke-linecap="round" opacity="0.8"/>
        <path d="M48 35 L30 30" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M62 40 L75 55" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <rect x="70" y="50" width="8" height="18" rx="2" fill="#0f3460"/>
        <path d="M50 70 L45 90 M60 70 L65 90" stroke="#e94560" stroke-width="5" stroke-linecap="round"/>
        <path d="M55 45 L75 45" stroke="#00d26a" stroke-width="2" stroke-dasharray="3,3"/>
    </svg>`,

    gluteBridge: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="70" width="80" height="8" rx="2" fill="#0f3460"/>
        <circle cx="20" cy="50" r="8" fill="#e94560"/>
        <path d="M28 52 Q50 30 75 55" stroke="#e94560" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
        <path d="M75 55 L85 70" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <path d="M60 45 L55 70" stroke="#e94560" stroke-width="6" stroke-linecap="round"/>
        <circle cx="85" cy="72" r="4" fill="#e94560"/>
        <circle cx="55" cy="72" r="4" fill="#e94560"/>
        <path d="M45 38 L45 25" stroke="#00d26a" stroke-width="2" stroke-dasharray="3,3"/>
        <text x="40" y="22" fill="#00d26a" font-size="10">▲</text>
    </svg>`
};

// Workout Data
const workoutData = {
    upper: {
        title: "Upper Body Day",
        subtitle: "3 Sets × 10-15 Reps",
        sections: [
            {
                name: "Warm-up",
                exercises: [
                    {
                        id: "cardio-warmup",
                        name: "Cardio Warm-up",
                        subtitle: "15 minutes on EPX/Elliptical",
                        type: "cardio",
                        defaultSets: 1,
                        defaultReps: 15,
                        repUnit: "min",
                        icon: "cardio",
                        muscles: ["Heart", "Full Body"],
                        description: "Start with 15 minutes of moderate-intensity cardio on the elliptical (EPX) machine. Keep your heart rate at 60-70% of max. This warms up your muscles, increases blood flow, and prepares your body for the strength workout ahead.",
                        equipment: {
                            name: "Elliptical Cross Trainer",
                            brand: "Matrix Fitness",
                            description: "Low-impact cardio machine that mimics running motion without stressing joints. Features adjustable resistance and incline for varied intensity."
                        }
                    }
                ]
            },
            {
                name: "Upper Body Circuit",
                exercises: [
                    {
                        id: "chest-press",
                        name: "Machine Chest Press",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "chestPress",
                        muscles: ["Chest", "Triceps", "Front Deltoids"],
                        description: "Sit with back flat against pad, feet on floor. Grip handles at chest level. Push handles forward until arms are extended (don't lock elbows). Slowly return to start position with control. Keep core engaged throughout.",
                        equipment: {
                            name: "Chest Press Machine",
                            brand: "Matrix Fitness",
                            description: "Converging press pattern mimics natural pushing motion. Adjustable seat height and starting position. Independent arm movement available."
                        }
                    },
                    {
                        id: "chest-flys",
                        name: "Machine Chest Flys",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "chestFlys",
                        muscles: ["Chest", "Front Deltoids"],
                        description: "Sit with back against pad, arms extended on handles at chest height. Bring handles together in front of chest in a hugging motion. Keep slight bend in elbows throughout. Squeeze chest at the center, then slowly return with control.",
                        equipment: {
                            name: "Pec Fly Machine",
                            brand: "Matrix Fitness",
                            description: "Isolates chest muscles with guided arc motion. Adjustable range of motion and starting position. Provides consistent resistance throughout movement."
                        }
                    },
                    {
                        id: "shoulder-press",
                        name: "Machine Shoulder Press",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "shoulderPress",
                        muscles: ["Shoulders", "Triceps", "Upper Chest"],
                        description: "Sit with back firmly against pad. Grip handles at shoulder level. Press handles upward until arms are extended overhead. Lower with control back to shoulder level. Don't arch your back - keep core tight.",
                        equipment: {
                            name: "Shoulder Press Machine",
                            brand: "Matrix Fitness",
                            description: "Ergonomic design supports natural shoulder movement pattern. Converging press path reduces joint stress. Multiple grip positions available."
                        }
                    },
                    {
                        id: "lat-pulldown",
                        name: "Machine Lat Pulldown",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "latPulldown",
                        muscles: ["Lats", "Biceps", "Rear Deltoids", "Rhomboids"],
                        description: "Sit with thighs secured under pads. Grip the bar wider than shoulder-width with palms forward. Pull bar down to upper chest, squeezing shoulder blades together. Slowly return to start with arms fully extended. Don't swing or use momentum.",
                        equipment: {
                            name: "Lat Pulldown Machine",
                            brand: "Matrix Fitness",
                            description: "Cable-based machine for vertical pulling movements. Adjustable thigh pad prevents body lifting. Smooth pulley system for consistent resistance."
                        }
                    },
                    {
                        id: "rowing",
                        name: "Machine Rowing",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "rowing",
                        muscles: ["Middle Back", "Lats", "Biceps", "Rear Deltoids"],
                        description: "Sit with chest against pad, feet flat. Grip handles with arms extended. Pull handles toward your torso, squeezing shoulder blades together at the end. Keep elbows close to body. Return with control to full arm extension.",
                        equipment: {
                            name: "Seated Row Machine",
                            brand: "Matrix Fitness",
                            description: "Chest support reduces lower back strain. Independent handles allow unilateral training. Multiple grip options for varied muscle emphasis."
                        }
                    },
                    {
                        id: "hammer-curl",
                        name: "Dumbbell Hammer Curl",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "hammerCurl",
                        muscles: ["Biceps", "Brachialis", "Forearms"],
                        description: "Stand with dumbbells at sides, palms facing your body (neutral grip). Keeping upper arms stationary, curl weights toward shoulders. Squeeze biceps at top, then lower with control. Don't swing - keep movement strict.",
                        equipment: {
                            name: "Dumbbells",
                            brand: "Matrix Fitness",
                            description: "Rubber hex dumbbells prevent rolling and floor damage. Ergonomic handles with knurled grip. Available in various weight increments."
                        }
                    },
                    {
                        id: "overhead-extension",
                        name: "D/B Overhead Extension",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "overheadExtension",
                        muscles: ["Triceps"],
                        description: "Hold one dumbbell with both hands overhead, arms extended. Lower the weight behind your head by bending elbows. Keep upper arms stationary and close to ears. Extend arms back up, squeezing triceps at top. Control the movement throughout.",
                        equipment: {
                            name: "Dumbbell",
                            brand: "Matrix Fitness",
                            description: "Single dumbbell held with both hands. Choose a weight that allows full range of motion with control."
                        }
                    }
                ]
            },
            {
                name: "Cool-down",
                exercises: [
                    {
                        id: "cardio-cooldown",
                        name: "Cool-down Cardio",
                        subtitle: "5 minutes Treadmill/Cycling",
                        type: "cardio",
                        defaultSets: 1,
                        defaultReps: 5,
                        repUnit: "min",
                        icon: "treadmill",
                        muscles: ["Heart", "Legs"],
                        description: "Finish with 5 minutes of light cardio on treadmill or stationary bike. Keep intensity low (50-60% max heart rate). This helps your heart rate gradually return to normal and aids in recovery by promoting blood flow to muscles.",
                        equipment: {
                            name: "Treadmill / Stationary Bike",
                            brand: "Matrix Fitness",
                            description: "Choose either treadmill at slow walking pace or stationary bike with light resistance for active recovery."
                        }
                    }
                ]
            }
        ]
    },
    lower: {
        title: "Lower Body Day",
        subtitle: "3 Sets × 10-15 Reps",
        sections: [
            {
                name: "Lower Body Circuit",
                exercises: [
                    {
                        id: "squat-hold",
                        name: "Squat Hold",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "squat",
                        muscles: ["Quadriceps", "Glutes", "Hamstrings", "Core"],
                        description: "Stand with feet shoulder-width apart. Lower into squat position (thighs parallel to floor) and hold. Keep chest up, knees tracking over toes. Hold for 2-3 seconds at bottom, then stand back up. Keep weight in your heels.",
                        equipment: null
                    },
                    {
                        id: "leg-press",
                        name: "Machine Leg Press",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "legPress",
                        muscles: ["Quadriceps", "Glutes", "Hamstrings"],
                        description: "Sit in machine with back flat against pad. Place feet shoulder-width on platform. Lower the weight by bending knees toward chest (90-degree angle). Push through heels to extend legs. Don't lock knees at top. Keep lower back pressed into pad.",
                        equipment: {
                            name: "Leg Press Machine",
                            brand: "Matrix Fitness",
                            description: "45-degree angled sled design reduces spinal compression. Large foot platform allows varied foot positions for different muscle emphasis. Smooth linear bearings for consistent movement."
                        }
                    },
                    {
                        id: "leg-extension",
                        name: "Machine Leg Extension",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "legExtension",
                        muscles: ["Quadriceps"],
                        description: "Sit with back against pad, ankles behind lower roller pad. Grip side handles. Extend legs until straight, squeezing quads at top. Lower with control - don't let weight drop. Keep movement smooth and controlled throughout.",
                        equipment: {
                            name: "Leg Extension Machine",
                            brand: "Matrix Fitness",
                            description: "Isolates quadriceps with adjustable back pad and ankle roller. Cam-based resistance provides consistent tension through range of motion."
                        }
                    },
                    {
                        id: "leg-curl",
                        name: "Machine Leg Curl",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "legCurl",
                        muscles: ["Hamstrings", "Calves"],
                        description: "Lie face down on machine, ankles under roller pad. Grip handles for stability. Curl heels toward glutes, squeezing hamstrings at top. Lower with control to starting position. Don't lift hips off the pad during movement.",
                        equipment: {
                            name: "Lying Leg Curl Machine",
                            brand: "Matrix Fitness",
                            description: "Prone position isolates hamstrings effectively. Angled bench reduces hip flexor involvement. Adjustable ankle pad accommodates different leg lengths."
                        }
                    },
                    {
                        id: "abductor",
                        name: "Machine Abductor",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "abductor",
                        muscles: ["Outer Thighs", "Hip Abductors", "Glutes"],
                        description: "Sit with back against pad, legs inside padded levers. Push legs outward against resistance, spreading knees apart. Squeeze outer thighs and glutes at the widest point. Return with control to starting position.",
                        equipment: {
                            name: "Hip Abductor Machine",
                            brand: "Matrix Fitness",
                            description: "Targets outer thigh and hip muscles. Adjustable range of motion and starting position. Comfortable thigh pads for extended sets."
                        }
                    },
                    {
                        id: "calf-raise",
                        name: "Standing Calf Raise",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 15,
                        icon: "calfRaise",
                        muscles: ["Calves", "Soleus"],
                        description: "Stand on calf raise machine with shoulders under pads. Position balls of feet on platform, heels hanging off. Rise up onto toes as high as possible, squeezing calves at top. Lower heels below platform level for full stretch. Keep knees slightly bent.",
                        equipment: {
                            name: "Standing Calf Raise Machine",
                            brand: "Matrix Fitness",
                            description: "Shoulder pads distribute weight evenly. Non-slip foot platform with edge for heel drop. Allows full range of motion for maximum calf development."
                        }
                    }
                ]
            }
        ]
    },
    core: {
        title: "Core & Functional Day",
        subtitle: "3 Sets × 10-15 Reps",
        sections: [
            {
                name: "Core & Functional Circuit",
                exercises: [
                    {
                        id: "bird-dog",
                        name: "Bird Dog",
                        subtitle: "3 sets × 10-15 reps each side",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "birdDog",
                        muscles: ["Core", "Lower Back", "Glutes", "Shoulders"],
                        description: "Start on hands and knees (tabletop position). Simultaneously extend right arm forward and left leg back. Keep hips level and core tight. Hold for 2 seconds, then return to start. Alternate sides. Move slowly and controlled.",
                        equipment: null
                    },
                    {
                        id: "cat-camel",
                        name: "Cat & Camel",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "catCamel",
                        muscles: ["Spine", "Core", "Back"],
                        description: "Start on hands and knees. For Cat: round your back toward ceiling, tucking chin to chest. For Camel: arch back, lifting head and tailbone toward ceiling. Flow between positions smoothly. This mobilizes the spine and relieves tension.",
                        equipment: null
                    },
                    {
                        id: "butt-kick",
                        name: "Butt Kicks",
                        subtitle: "3 sets × 10-15 reps each leg",
                        defaultSets: 3,
                        defaultReps: 15,
                        icon: "buttKick",
                        muscles: ["Hamstrings", "Quadriceps", "Calves", "Heart"],
                        description: "Stand tall with feet hip-width apart. Jog in place, kicking heels up toward glutes with each step. Keep core engaged and arms pumping naturally. Land softly on balls of feet. Maintain quick, light movements.",
                        equipment: null
                    },
                    {
                        id: "jumping-jack",
                        name: "Jumping Jacks",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 15,
                        icon: "jumpingJack",
                        muscles: ["Full Body", "Heart", "Shoulders", "Legs"],
                        description: "Start standing with arms at sides. Jump feet out wide while raising arms overhead. Jump feet back together while lowering arms. Keep core engaged and land softly. Maintain a steady rhythm throughout the set.",
                        equipment: null
                    },
                    {
                        id: "side-bend",
                        name: "Dumbbell Side Bend",
                        subtitle: "3 sets × 10-15 reps each side",
                        defaultSets: 3,
                        defaultReps: 12,
                        icon: "sideBend",
                        muscles: ["Obliques", "Core"],
                        description: "Stand holding dumbbell in one hand at your side. Keep opposite hand behind head. Slowly bend sideways toward the weighted side. Use obliques to pull back to upright position. Complete all reps on one side before switching.",
                        equipment: {
                            name: "Dumbbell",
                            brand: "Matrix Fitness",
                            description: "Light to moderate weight dumbbell. Focus on controlled movement rather than heavy weight for this exercise."
                        }
                    },
                    {
                        id: "glute-bridge",
                        name: "Glute Bridge",
                        subtitle: "3 sets × 10-15 reps",
                        defaultSets: 3,
                        defaultReps: 15,
                        icon: "gluteBridge",
                        muscles: ["Glutes", "Hamstrings", "Core", "Lower Back"],
                        description: "Lie on back with knees bent, feet flat on floor hip-width apart. Push through heels to lift hips toward ceiling. Squeeze glutes at top, creating straight line from knees to shoulders. Lower with control. Don't overarch your back.",
                        equipment: null
                    }
                ]
            }
        ]
    }
};

// Export for use in app.js
window.workoutData = workoutData;
window.svgIcons = svgIcons;
