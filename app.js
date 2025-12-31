// Gym Tracker App
(function() {
    'use strict';

    // State
    let currentView = 'today';
    let selectedDate = new Date();
    let currentMonth = new Date();
    let selectedWorkoutType = null;

    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    const todayView = document.getElementById('today-view');
    const calendarView = document.getElementById('calendar-view');
    const workoutContent = document.getElementById('workout-content');
    const typeButtons = document.querySelectorAll('.type-btn');
    const progressRing = document.querySelector('.progress-ring');
    const progressText = document.querySelector('.progress-text');
    const currentDateEl = document.querySelector('.current-date');
    const fullDateEl = document.querySelector('.full-date');
    const resetBtn = document.getElementById('reset-day');

    // Calendar elements
    const monthTitle = document.querySelector('.month-title');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarDays = document.getElementById('calendar-days');
    const daySummary = document.getElementById('day-summary');

    // Modal elements
    const editModal = document.getElementById('edit-modal');
    const infoModal = document.getElementById('info-modal');

    let currentExercise = null;

    // Initialize
    function init() {
        updateDateDisplay();
        loadSelectedWorkoutType();
        setupEventListeners();
        renderCalendar();
        updateTypeButtonStates();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Bottom navigation
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => switchView(btn.dataset.view));
        });

        // Workout type selection
        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => selectWorkoutType(btn.dataset.type));
        });

        // Workout content actions (delegation)
        workoutContent.addEventListener('click', handleWorkoutAction);

        // Reset button
        resetBtn.addEventListener('click', resetCurrentDay);

        // Calendar navigation
        prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
        nextMonthBtn.addEventListener('click', () => navigateMonth(1));
        calendarDays.addEventListener('click', handleCalendarDayClick);

        // Edit Modal
        editModal.querySelector('.modal-close').addEventListener('click', closeEditModal);
        document.getElementById('modal-cancel').addEventListener('click', closeEditModal);
        document.getElementById('modal-save').addEventListener('click', saveExercise);
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) closeEditModal();
        });

        // Info Modal
        infoModal.querySelectorAll('.info-close, .info-close-btn').forEach(el => {
            el.addEventListener('click', closeInfoModal);
        });
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfoModal();
        });
    }

    // Switch view (today/calendar)
    function switchView(view) {
        currentView = view;
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        views.forEach(v => {
            v.classList.toggle('active', v.id === `${view}-view`);
        });

        if (view === 'calendar') {
            renderCalendar();
        }
    }

    // Update date display
    function updateDateDisplay() {
        const today = new Date();
        const isToday = isSameDay(selectedDate, today);

        currentDateEl.textContent = isToday ? 'Today' : formatDate(selectedDate, 'short');
        fullDateEl.textContent = formatDate(selectedDate, 'long');
    }

    // Format date
    function formatDate(date, format) {
        const options = format === 'long'
            ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
            : { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // Check if same day
    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    // Get date key for storage
    function getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    // Load selected workout type from storage
    function loadSelectedWorkoutType() {
        const dateKey = getDateKey(selectedDate);
        const dayData = getDayData(dateKey);

        if (dayData && dayData.workoutType) {
            selectedWorkoutType = dayData.workoutType;
            renderWorkouts();
        }

        updateTypeButtonStates();
    }

    // Update type button states
    function updateTypeButtonStates() {
        const dateKey = getDateKey(selectedDate);
        const dayData = getDayData(dateKey);

        typeButtons.forEach(btn => {
            const type = btn.dataset.type;
            const isSelected = type === selectedWorkoutType;
            const hasWorkout = dayData && dayData.workoutType === type && dayData.exercises && Object.keys(dayData.exercises).length > 0;

            btn.classList.toggle('active', isSelected);
            btn.classList.toggle('has-workout', hasWorkout && !isSelected);
        });
    }

    // Select workout type
    function selectWorkoutType(type) {
        selectedWorkoutType = type;

        // Save selection
        const dateKey = getDateKey(selectedDate);
        let dayData = getDayData(dateKey) || {};
        dayData.workoutType = type;
        saveDayData(dateKey, dayData);

        updateTypeButtonStates();
        renderWorkouts();
    }

    // Render workouts for selected type
    function renderWorkouts() {
        if (!selectedWorkoutType) {
            workoutContent.innerHTML = '';
            updateProgress();
            return;
        }

        const data = workoutData[selectedWorkoutType];
        const dateKey = getDateKey(selectedDate);
        let html = '';

        data.sections.forEach(section => {
            html += `<div class="section-header">${section.name}</div>`;
            section.exercises.forEach(exercise => {
                html += renderExerciseCard(exercise, dateKey);
            });
        });

        workoutContent.innerHTML = html;
        updateProgress();
    }

    // Render exercise card with updated CTAs
    function renderExerciseCard(exercise, dateKey) {
        const progress = getExerciseProgress(dateKey, exercise.id);
        const isCompleted = progress && progress.completed;
        const cardClass = `workout-card ${exercise.type === 'cardio' ? 'cardio' : ''} ${isCompleted ? 'completed' : ''}`;

        // Only show completed info if custom values were entered
        let completedInfo = '';
        if (isCompleted) {
            const hasCustomData = progress.comment ||
                (progress.sets && !arraysEqual(progress.sets, getDefaultSets(exercise)));

            if (hasCustomData) {
                const sets = progress.sets || [];
                const repUnit = exercise.repUnit || 'reps';
                const defaultSets = getDefaultSets(exercise);
                const setsChanged = !arraysEqual(sets, defaultSets);

                completedInfo = `
                    <div class="completed-info">
                        ${setsChanged ? `
                            <div class="completed-sets">
                                ${sets.map((reps, i) => `<span class="completed-set">Set ${i + 1}: <span>${reps} ${repUnit}</span></span>`).join('')}
                            </div>
                        ` : ''}
                        ${progress.comment ? `<div class="completed-comment">"${progress.comment}"</div>` : ''}
                    </div>
                `;
            }
        }

        const muscles = exercise.muscles.slice(0, 2).map(m => `<span class="tag">${m}</span>`).join('');
        const equipmentTag = exercise.equipment ? `<span class="tag equipment">${exercise.equipment.brand}</span>` : '';

        // Updated CTAs
        let actionsHtml;
        if (isCompleted) {
            actionsHtml = `
                <button class="btn btn-undo" data-action="undo">↩ Undo</button>
                <button class="btn btn-edit" data-action="edit">Edit</button>
            `;
        } else {
            actionsHtml = `
                <button class="btn btn-done" data-action="done">✓ Done</button>
            `;
        }

        return `
            <div class="${cardClass}" data-exercise-id="${exercise.id}" data-date="${dateKey}">
                <div class="card-main">
                    <div class="card-illustration" data-action="info">
                        ${svgIcons[exercise.icon] || ''}
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${exercise.name}</h3>
                        <p class="card-subtitle">${exercise.subtitle}</p>
                        <div class="card-tags">
                            ${muscles}
                            ${equipmentTag}
                        </div>
                    </div>
                </div>
                ${completedInfo}
                <div class="card-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }

    // Get default sets for exercise
    function getDefaultSets(exercise) {
        const sets = [];
        for (let i = 0; i < exercise.defaultSets; i++) {
            sets.push(exercise.defaultReps);
        }
        return sets;
    }

    // Compare arrays
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    // Handle workout card actions
    function handleWorkoutAction(e) {
        const actionEl = e.target.closest('[data-action]');
        if (!actionEl) return;

        const card = actionEl.closest('.workout-card');
        if (!card) return;

        const exerciseId = card.dataset.exerciseId;
        const dateKey = card.dataset.date;
        const action = actionEl.dataset.action;

        const exercise = findExercise(exerciseId);
        if (!exercise) return;

        switch (action) {
            case 'done':
                markDone(dateKey, exercise);
                break;
            case 'edit':
                openEditModal(dateKey, exercise);
                break;
            case 'undo':
                undoExercise(dateKey, exerciseId);
                break;
            case 'info':
                openInfoModal(exercise);
                break;
        }
    }

    // Mark exercise as done with defaults
    function markDone(dateKey, exercise) {
        const defaultSets = getDefaultSets(exercise);

        setExerciseProgress(dateKey, exercise.id, {
            completed: true,
            sets: defaultSets,
            comment: '',
            completedAt: new Date().toISOString()
        });

        renderWorkouts();

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Undo exercise
    function undoExercise(dateKey, exerciseId) {
        deleteExerciseProgress(dateKey, exerciseId);
        renderWorkouts();
    }

    // Open edit modal
    function openEditModal(dateKey, exercise) {
        currentExercise = { dateKey, exercise };
        const progress = getExerciseProgress(dateKey, exercise.id);

        // Update modal content
        document.querySelector('#edit-modal .modal-title').textContent = 'Edit Exercise';
        document.querySelector('.modal-exercise-name').textContent = exercise.name;
        document.querySelector('.modal-exercise-desc').textContent = exercise.subtitle;
        document.querySelector('.modal-exercise-info .modal-illustration').innerHTML = svgIcons[exercise.icon] || '';

        // Set inputs
        const repsInputs = editModal.querySelectorAll('.reps-input');
        const repUnit = exercise.repUnit || 'reps';
        repsInputs.forEach((input, i) => {
            input.placeholder = repUnit.charAt(0).toUpperCase() + repUnit.slice(1);
            if (progress && progress.sets && progress.sets[i] !== undefined) {
                input.value = progress.sets[i];
            } else {
                input.value = exercise.defaultReps;
            }
        });

        // Comment
        const commentInput = editModal.querySelector('.comment-input');
        commentInput.value = progress?.comment || '';

        editModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close edit modal
    function closeEditModal() {
        editModal.classList.remove('active');
        document.body.style.overflow = '';
        currentExercise = null;
    }

    // Save exercise from modal
    function saveExercise() {
        if (!currentExercise) return;

        const { dateKey, exercise } = currentExercise;
        const repsInputs = editModal.querySelectorAll('.reps-input');
        const commentInput = editModal.querySelector('.comment-input');

        const sets = Array.from(repsInputs).map(input => parseInt(input.value) || 0);
        const comment = commentInput.value.trim();

        setExerciseProgress(dateKey, exercise.id, {
            completed: true,
            sets,
            comment,
            completedAt: new Date().toISOString()
        });

        closeEditModal();
        renderWorkouts();

        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    // Open info modal
    function openInfoModal(exercise) {
        document.querySelector('#info-modal .modal-title').textContent = exercise.name;

        // Video
        const videoContainer = document.getElementById('video-container');
        const videoSourceName = document.getElementById('video-source-name');
        if (exercise.videoId) {
            videoContainer.innerHTML = `<iframe
                src="https://www.youtube.com/embed/${exercise.videoId}?rel=0&modestbranding=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>`;
            videoSourceName.textContent = exercise.videoSource || 'YouTube';
            videoContainer.parentElement.style.display = 'block';
        } else {
            videoContainer.innerHTML = '';
            videoContainer.parentElement.style.display = 'none';
        }

        // Steps
        const stepsList = document.getElementById('steps-list');
        if (exercise.steps && exercise.steps.length > 0) {
            stepsList.innerHTML = exercise.steps.map(step => `<li>${step}</li>`).join('');
            stepsList.parentElement.style.display = 'block';
        } else {
            stepsList.innerHTML = '';
            stepsList.parentElement.style.display = 'none';
        }

        // Muscles
        const muscleTags = document.querySelector('.muscle-tags');
        muscleTags.innerHTML = exercise.muscles.map(m => `<span class="muscle-tag">${m}</span>`).join('');

        // Equipment
        const equipmentSection = document.querySelector('.equipment-section');
        if (exercise.equipment) {
            equipmentSection.classList.add('visible');
            document.querySelector('.equipment-name').textContent = exercise.equipment.name;
            document.querySelector('.equipment-brand').textContent = exercise.equipment.brand;
            document.querySelector('.equipment-desc').textContent = exercise.equipment.description;
        } else {
            equipmentSection.classList.remove('visible');
        }

        infoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close info modal
    function closeInfoModal() {
        infoModal.classList.remove('active');
        document.body.style.overflow = '';
        // Stop video playback when closing modal
        const videoContainer = document.getElementById('video-container');
        if (videoContainer) {
            videoContainer.innerHTML = '';
        }
    }

    // Update progress display
    function updateProgress() {
        if (!selectedWorkoutType) {
            progressText.textContent = '0/0';
            progressRing.style.setProperty('--progress', '0%');
            return;
        }

        const data = workoutData[selectedWorkoutType];
        const dateKey = getDateKey(selectedDate);
        let total = 0;
        let completed = 0;

        data.sections.forEach(section => {
            section.exercises.forEach(exercise => {
                total++;
                const progress = getExerciseProgress(dateKey, exercise.id);
                if (progress && progress.completed) {
                    completed++;
                }
            });
        });

        progressText.textContent = `${completed}/${total}`;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        progressRing.style.setProperty('--progress', `${percentage}%`);
    }

    // Reset current day
    function resetCurrentDay() {
        if (!selectedWorkoutType) return;

        const typeName = workoutData[selectedWorkoutType].title;
        if (!confirm(`Reset all progress for ${typeName}?`)) {
            return;
        }

        const dateKey = getDateKey(selectedDate);
        const dayData = getDayData(dateKey);

        if (dayData) {
            dayData.exercises = {};
            saveDayData(dateKey, dayData);
        }

        renderWorkouts();
    }

    // Find exercise by id
    function findExercise(exerciseId) {
        if (!selectedWorkoutType) return null;

        const data = workoutData[selectedWorkoutType];
        for (const section of data.sections) {
            for (const exercise of section.exercises) {
                if (exercise.id === exerciseId) {
                    return exercise;
                }
            }
        }
        return null;
    }

    // Calendar functions
    function renderCalendar() {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        monthTitle.textContent = currentMonth.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        let html = '';

        // Empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = getDateKey(date);
            const dayData = getDayData(dateKey);
            const isToday = isSameDay(date, today);
            const hasWorkout = dayData && dayData.workoutType && dayData.exercises &&
                             Object.values(dayData.exercises).some(e => e.completed);

            let classes = 'calendar-day';
            if (isToday) classes += ' today';
            if (hasWorkout) classes += ' has-workout';

            let indicators = '';
            if (dayData && dayData.workoutType) {
                indicators = `<div class="day-indicator"><span class="day-dot ${dayData.workoutType}"></span></div>`;
            }

            html += `
                <div class="${classes}" data-date="${dateKey}">
                    <span class="day-number">${day}</span>
                    ${indicators}
                </div>
            `;
        }

        calendarDays.innerHTML = html;
    }

    function navigateMonth(delta) {
        currentMonth.setMonth(currentMonth.getMonth() + delta);
        renderCalendar();
    }

    function handleCalendarDayClick(e) {
        const dayEl = e.target.closest('.calendar-day');
        if (!dayEl || dayEl.classList.contains('empty')) return;

        const dateKey = dayEl.dataset.date;
        showDaySummary(dateKey);

        // Update selected state
        calendarDays.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        dayEl.classList.add('selected');
    }

    function showDaySummary(dateKey) {
        const dayData = getDayData(dateKey);
        const date = new Date(dateKey + 'T00:00:00');

        if (!dayData || !dayData.workoutType) {
            daySummary.innerHTML = `
                <p class="summary-date">${formatDate(date, 'long')}</p>
                <p class="summary-no-workout">No workout recorded</p>
            `;
            return;
        }

        const workoutInfo = workoutData[dayData.workoutType];
        const exercises = dayData.exercises || {};
        const completedCount = Object.values(exercises).filter(e => e.completed).length;
        const totalCount = workoutInfo.sections.reduce((acc, s) => acc + s.exercises.length, 0);

        const icons = { upper: '💪', lower: '🦵', core: '🎯' };

        daySummary.innerHTML = `
            <p class="summary-date">${formatDate(date, 'long')}</p>
            <div class="summary-workout">
                <span class="summary-icon">${icons[dayData.workoutType]}</span>
                <div class="summary-details">
                    <p class="summary-type">${workoutInfo.title}</p>
                    <p class="summary-stats">${completedCount}/${totalCount} exercises completed</p>
                </div>
            </div>
        `;
    }

    // Storage functions
    function getAllData() {
        try {
            const saved = localStorage.getItem('gym-tracker-data');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    function saveAllData(data) {
        try {
            localStorage.setItem('gym-tracker-data', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save data:', e);
        }
    }

    function getDayData(dateKey) {
        const allData = getAllData();
        return allData[dateKey] || null;
    }

    function saveDayData(dateKey, dayData) {
        const allData = getAllData();
        allData[dateKey] = dayData;
        saveAllData(allData);
    }

    function getExerciseProgress(dateKey, exerciseId) {
        const dayData = getDayData(dateKey);
        if (!dayData || !dayData.exercises) return null;
        return dayData.exercises[exerciseId] || null;
    }

    function setExerciseProgress(dateKey, exerciseId, data) {
        let dayData = getDayData(dateKey) || { workoutType: selectedWorkoutType, exercises: {} };
        if (!dayData.exercises) dayData.exercises = {};
        dayData.exercises[exerciseId] = data;
        saveDayData(dateKey, dayData);
    }

    function deleteExerciseProgress(dateKey, exerciseId) {
        const dayData = getDayData(dateKey);
        if (dayData && dayData.exercises) {
            delete dayData.exercises[exerciseId];
            saveDayData(dateKey, dayData);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
