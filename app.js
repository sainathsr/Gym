// Gym Tracker App
(function() {
    'use strict';

    // State
    let currentDay = 'upper';
    let workoutProgress = loadProgress();

    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const workoutPages = document.querySelectorAll('.workout-page');
    const header = document.querySelector('.header');
    const dayTitle = document.querySelector('.day-title');
    const daySubtitle = document.querySelector('.day-subtitle');
    const progressRing = document.querySelector('.progress-ring');
    const progressText = document.querySelector('.progress-text');
    const resetBtn = document.getElementById('reset-day');
    const modal = document.getElementById('workout-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSave = document.getElementById('modal-save');

    let currentExercise = null;

    // Initialize
    function init() {
        renderAllDays();
        setupEventListeners();
        switchDay('upper');
    }

    // Render all workout days
    function renderAllDays() {
        Object.keys(workoutData).forEach(day => {
            const page = document.getElementById(`${day}-page`);
            page.innerHTML = renderDay(day);
        });
    }

    // Render a single day's workouts
    function renderDay(day) {
        const data = workoutData[day];
        let html = '';

        data.sections.forEach(section => {
            html += `<div class="section-header">${section.name}</div>`;
            section.exercises.forEach(exercise => {
                html += renderExerciseCard(exercise, day);
            });
        });

        return html;
    }

    // Render an exercise card
    function renderExerciseCard(exercise, day) {
        const progress = getExerciseProgress(day, exercise.id);
        const isCompleted = progress && progress.completed;
        const cardClass = `workout-card ${exercise.type === 'cardio' ? 'cardio' : ''} ${isCompleted ? 'completed' : ''}`;

        let completedInfo = '';
        if (isCompleted) {
            const sets = progress.sets || [];
            const repUnit = exercise.repUnit || 'reps';
            completedInfo = `
                <div class="completed-info">
                    <div class="completed-sets">
                        ${sets.map((reps, i) => `<span class="completed-set">Set ${i + 1}: <span>${reps} ${repUnit}</span></span>`).join('')}
                    </div>
                    ${progress.comment ? `<div class="completed-comment">"${progress.comment}"</div>` : ''}
                </div>
            `;
        }

        const muscles = exercise.muscles.slice(0, 2).map(m => `<span class="tag">${m}</span>`).join('');
        const equipmentTag = exercise.equipment ? `<span class="tag equipment">${exercise.equipment.brand}</span>` : '';

        return `
            <div class="${cardClass}" data-exercise-id="${exercise.id}" data-day="${day}">
                <div class="card-main">
                    <div class="card-illustration">
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
                    ${isCompleted ? `
                        <button class="btn btn-undo" data-action="undo">↩ Undo</button>
                        <button class="btn btn-details" data-action="details">View Details</button>
                    ` : `
                        <button class="btn btn-quick" data-action="quick">✓ Quick Done</button>
                        <button class="btn btn-details" data-action="details">+ Details</button>
                    `}
                </div>
            </div>
        `;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Tab navigation
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const day = btn.dataset.day;
                switchDay(day);
            });
        });

        // Workout card actions (delegation)
        document.querySelectorAll('.workout-page').forEach(page => {
            page.addEventListener('click', handleCardAction);
        });

        // Modal events
        modalClose.addEventListener('click', closeModal);
        modalCancel.addEventListener('click', closeModal);
        modalSave.addEventListener('click', saveAndComplete);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Reset button
        resetBtn.addEventListener('click', resetCurrentDay);
    }

    // Handle card button clicks
    function handleCardAction(e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const card = btn.closest('.workout-card');
        const exerciseId = card.dataset.exerciseId;
        const day = card.dataset.day;
        const action = btn.dataset.action;

        const exercise = findExercise(day, exerciseId);
        if (!exercise) return;

        switch (action) {
            case 'quick':
                quickComplete(day, exercise);
                break;
            case 'details':
                openModal(day, exercise);
                break;
            case 'undo':
                undoComplete(day, exerciseId);
                break;
        }
    }

    // Quick complete an exercise
    function quickComplete(day, exercise) {
        const defaultSets = [];
        for (let i = 0; i < exercise.defaultSets; i++) {
            defaultSets.push(exercise.defaultReps);
        }

        setExerciseProgress(day, exercise.id, {
            completed: true,
            sets: defaultSets,
            comment: '',
            completedAt: new Date().toISOString()
        });

        refreshDay(day);
        updateProgress();

        // Haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    // Undo completion
    function undoComplete(day, exerciseId) {
        deleteExerciseProgress(day, exerciseId);
        refreshDay(day);
        updateProgress();
    }

    // Open modal for detailed entry
    function openModal(day, exercise) {
        currentExercise = { day, exercise };
        const progress = getExerciseProgress(day, exercise.id);

        // Update modal content
        document.querySelector('.modal-title').textContent = exercise.name;
        document.querySelector('.modal-illustration').innerHTML = svgIcons[exercise.icon] || '';
        document.querySelector('.modal-description').textContent = exercise.description;

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

        // Set inputs
        const repsInputs = document.querySelectorAll('.reps-input');
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
        const commentInput = document.querySelector('.comment-input');
        commentInput.value = progress?.comment || '';

        // Update save button text
        modalSave.textContent = progress?.completed ? 'Update' : 'Save & Complete';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentExercise = null;
    }

    // Save and complete from modal
    function saveAndComplete() {
        if (!currentExercise) return;

        const { day, exercise } = currentExercise;
        const repsInputs = document.querySelectorAll('.reps-input');
        const commentInput = document.querySelector('.comment-input');

        const sets = Array.from(repsInputs).map(input => parseInt(input.value) || 0);
        const comment = commentInput.value.trim();

        setExerciseProgress(day, exercise.id, {
            completed: true,
            sets,
            comment,
            completedAt: new Date().toISOString()
        });

        closeModal();
        refreshDay(day);
        updateProgress();

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }
    }

    // Switch day
    function switchDay(day) {
        currentDay = day;

        // Update tabs
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.day === day);
        });

        // Update pages
        workoutPages.forEach(page => {
            page.classList.toggle('active', page.id === `${day}-page`);
        });

        // Update header
        const data = workoutData[day];
        dayTitle.textContent = data.title;
        daySubtitle.textContent = data.subtitle;

        updateProgress();
    }

    // Refresh a day's rendering
    function refreshDay(day) {
        const page = document.getElementById(`${day}-page`);
        page.innerHTML = renderDay(day);
    }

    // Update progress display
    function updateProgress() {
        const data = workoutData[currentDay];
        let total = 0;
        let completed = 0;

        data.sections.forEach(section => {
            section.exercises.forEach(exercise => {
                total++;
                const progress = getExerciseProgress(currentDay, exercise.id);
                if (progress && progress.completed) {
                    completed++;
                }
            });
        });

        progressText.textContent = `${completed}/${total}`;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        progressRing.style.setProperty('--progress', `${percentage}%`);
    }

    // Reset current day's progress
    function resetCurrentDay() {
        if (!confirm(`Reset all progress for ${workoutData[currentDay].title}?`)) {
            return;
        }

        const data = workoutData[currentDay];
        data.sections.forEach(section => {
            section.exercises.forEach(exercise => {
                deleteExerciseProgress(currentDay, exercise.id);
            });
        });

        refreshDay(currentDay);
        updateProgress();
    }

    // Find exercise by day and id
    function findExercise(day, exerciseId) {
        const data = workoutData[day];
        for (const section of data.sections) {
            for (const exercise of section.exercises) {
                if (exercise.id === exerciseId) {
                    return exercise;
                }
            }
        }
        return null;
    }

    // Local Storage functions
    function getStorageKey() {
        const today = new Date().toISOString().split('T')[0];
        return `gym-progress-${today}`;
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem(getStorageKey());
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(workoutProgress));
        } catch (e) {
            console.warn('Could not save progress:', e);
        }
    }

    function getExerciseProgress(day, exerciseId) {
        if (!workoutProgress[day]) return null;
        return workoutProgress[day][exerciseId] || null;
    }

    function setExerciseProgress(day, exerciseId, data) {
        if (!workoutProgress[day]) {
            workoutProgress[day] = {};
        }
        workoutProgress[day][exerciseId] = data;
        saveProgress();
    }

    function deleteExerciseProgress(day, exerciseId) {
        if (workoutProgress[day]) {
            delete workoutProgress[day][exerciseId];
            saveProgress();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
