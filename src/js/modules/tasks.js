/**
 * Task Manager Module - Enhanced with Date Grouping
 */

const Tasks = {
    tasks: [],
    listElement: null,
    filterElement: null,
    modal: null,
    form: null,

    /**
     * Initialize tasks module
     */
    init() {
        this.listElement = $('#tasksList');
        this.filterElement = $('#taskFilter');
        this.modal = $('#taskModal');
        this.form = $('#taskForm');

        this.loadTasks();
        this.render();
        this.bindEvents();
    },

    /**
     * Load tasks from storage
     */
    loadTasks() {
        this.tasks = Storage.load(CONFIG.STORAGE_KEYS.TASKS, []);
    },

    /**
     * Save tasks to storage
     */
    saveTasks() {
        Storage.save(CONFIG.STORAGE_KEYS.TASKS, this.tasks);
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Add button
        const addBtn = $('#addTaskBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal());
        }

        // Filter
        if (this.filterElement) {
            this.filterElement.addEventListener('change', () => this.render());
        }

        // Modal close
        const closeBtn = $('#closeTaskModal');
        const cancelBtn = $('#cancelTask');
        const overlay = this.modal?.querySelector('.modal-overlay');

        [closeBtn, cancelBtn, overlay].forEach(el => {
            if (el) el.addEventListener('click', () => this.closeModal());
        });

        // Form submit
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Show tasks button
        const showTasksBtn = $('#showTasksBtn');
        if (showTasksBtn) {
            showTasksBtn.addEventListener('click', () => {
                this.listElement?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    },

    /**
     * Group tasks by date
     */
    groupTasksByDate(tasks) {
        const groups = {};
        const today = Helpers.getToday();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // Special groups
        groups['overdue'] = { label: 'Întârziate', icon: '⚠️', tasks: [], class: 'overdue' };
        groups['today'] = { label: 'Astăzi', icon: '📌', tasks: [], class: 'today' };
        groups['tomorrow'] = { label: 'Mâine', icon: '📅', tasks: [], class: '' };
        groups['upcoming'] = { label: 'Viitoare', icon: '🗓️', tasks: [], class: '' };
        groups['no-date'] = { label: 'Fără dată', icon: '📋', tasks: [], class: '' };
        groups['completed'] = { label: 'Finalizate', icon: '✅', tasks: [], class: '' };

        tasks.forEach(task => {
            if (task.completed) {
                groups['completed'].tasks.push(task);
            } else if (!task.deadline) {
                groups['no-date'].tasks.push(task);
            } else if (task.deadline < today) {
                groups['overdue'].tasks.push(task);
            } else if (task.deadline === today) {
                groups['today'].tasks.push(task);
            } else if (task.deadline === tomorrowStr) {
                groups['tomorrow'].tasks.push(task);
            } else {
                groups['upcoming'].tasks.push(task);
            }
        });

        // Sort tasks within groups by priority
        Object.values(groups).forEach(group => {
            group.tasks.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return a.priority === 'high' ? -1 : 1;
                }
                if (a.deadline && b.deadline) {
                    return new Date(a.deadline) - new Date(b.deadline);
                }
                return 0;
            });
        });

        return groups;
    },

    /**
     * Render tasks list with date grouping
     */
    render() {
        if (!this.listElement) return;

        const filter = this.filterElement?.value || 'all';

        let filteredTasks = this.tasks;

        if (filter !== 'all') {
            filteredTasks = this.tasks.filter(t => t.priority === filter);
        }

        // Render summary bar
        this.renderSummary();

        if (filteredTasks.length === 0) {
            this.listElement.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✅</div>
                    <p class="empty-state-text">Nicio sarcină. Adăugați prima!</p>
                </div>
            `;
            return;
        }

        // Group tasks by date
        const groups = this.groupTasksByDate(filteredTasks);

        // Render groups
        let html = '';

        const groupOrder = ['overdue', 'today', 'tomorrow', 'upcoming', 'no-date', 'completed'];

        groupOrder.forEach(groupKey => {
            const group = groups[groupKey];
            if (group.tasks.length === 0) return;

            html += `
                <div class="task-date-group">
                    <div class="task-date-header ${group.class}">
                        <span class="date-icon">${group.icon}</span>
                        <span class="date-label">${group.label}</span>
                        <span class="date-count">${group.tasks.length} ${this.getTaskWord(group.tasks.length)}</span>
                    </div>
                    <div class="task-group-items">
                        ${group.tasks.map(task => this.renderTaskItem(task)).join('')}
                    </div>
                </div>
            `;
        });

        this.listElement.innerHTML = html;

        // Bind action events
        this.bindTaskActions();
    },

    /**
     * Render single task item
     */
    renderTaskItem(task) {
        const isOverdue = !task.completed && Helpers.isOverdue(task.deadline);

        return `
            <div class="task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" 
                 data-id="${task.id}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     data-action="toggle" data-id="${task.id}"></div>
                <div class="task-content">
                    <div class="task-title">${Helpers.escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${Helpers.escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        ${task.deadline ? `
                            <span class="task-deadline ${isOverdue ? 'overdue' : ''}">
                                📅 ${Helpers.formatDate(task.deadline, 'short')}
                            </span>
                        ` : ''}
                        <span class="priority-badge ${task.priority}">
                            ${task.priority === 'high' ? '🔴 Important' : '🟢 Normal'}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="habit-action-btn" data-action="edit" data-id="${task.id}" title="Редактировать">✏️</button>
                    <button class="habit-action-btn delete" data-action="delete" data-id="${task.id}" title="Удалить">🗑️</button>
                </div>
            </div>
        `;
    },

    /**
     * Bind task action events
     */
    bindTaskActions() {
        this.listElement.querySelectorAll('[data-action]').forEach(el => {
            el.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                const id = e.currentTarget.dataset.id;

                switch (action) {
                    case 'toggle':
                        this.toggleTask(id);
                        break;
                    case 'edit':
                        this.editTask(id);
                        break;
                    case 'delete':
                        this.deleteTask(id);
                        break;
                }
            });
        });
    },

    /**
     * Render summary bar
     */
    renderSummary() {
        const stats = this.getStats();
        const summaryContainer = document.querySelector('.tasks-summary');

        // Create summary if doesn't exist
        if (!summaryContainer) {
            const summary = document.createElement('div');
            summary.className = 'tasks-summary';
            summary.innerHTML = `
                <div class="tasks-summary-item pending">
                    <span>⏳</span>
                    <span class="count" id="tasksPending">${stats.pending}</span>
                    <span>în așteptare</span>
                </div>
                <div class="tasks-summary-item completed">
                    <span>✅</span>
                    <span class="count" id="tasksCompleted">${stats.completed}</span>
                    <span>finalizate</span>
                </div>
                <div class="tasks-summary-item overdue">
                    <span>⚠️</span>
                    <span class="count" id="tasksOverdue">${stats.overdue}</span>
                    <span>întârziate</span>
                </div>
            `;
            this.listElement?.parentElement?.insertBefore(summary, this.listElement);
        } else {
            // Update existing
            const pending = summaryContainer.querySelector('#tasksPending');
            const completed = summaryContainer.querySelector('#tasksCompleted');
            const overdue = summaryContainer.querySelector('#tasksOverdue');

            if (pending) pending.textContent = stats.pending;
            if (completed) completed.textContent = stats.completed;
            if (overdue) overdue.textContent = stats.overdue;
        }
    },

    /**
     * Get correct Russian word for tasks
     */
    getTaskWord(n) {
        if (n === 1) return 'sarcină';
        return 'sarcini';
    },

    /**
     * Toggle task completion
     */
    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;

        this.saveTasks();
        this.render();

        // Show feedback
        if (task.completed) {
            Helpers.showToast('Sarcină finalizată! 🎉', 'success');
        }

        if (window.Charts) {
            Charts.updateAll();
        }
    },

    /**
     * Open modal for adding/editing
     */
    openModal(task = null) {
        if (!this.modal) return;

        const title = $('#taskModalTitle');
        const idInput = $('#taskId');
        const titleInput = $('#taskTitle');
        const descInput = $('#taskDescription');
        const priorityInput = $('#taskPriority');
        const deadlineInput = $('#taskDeadline');

        if (task) {
            title.textContent = 'Editează sarcina';
            idInput.value = task.id;
            titleInput.value = task.title;
            descInput.value = task.description || '';
            priorityInput.value = task.priority;
            deadlineInput.value = task.deadline || '';
        } else {
            title.textContent = 'Sarcină nouă';
            this.form.reset();
            idInput.value = '';
            // Set default deadline to today
            deadlineInput.value = Helpers.getToday();
        }

        this.modal.classList.add('active');
        titleInput.focus();
    },

    /**
     * Close modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    },

    /**
     * Handle form submit
     */
    handleSubmit(e) {
        e.preventDefault();

        const id = $('#taskId').value;
        const title = $('#taskTitle').value.trim();
        const description = $('#taskDescription').value.trim();
        const priority = $('#taskPriority').value;
        const deadline = $('#taskDeadline').value;

        if (!title) {
            Helpers.showToast('Introduceți numele sarcinii', 'error');
            return;
        }

        if (id) {
            // Edit existing
            const task = this.tasks.find(t => t.id === id);
            if (task) {
                task.title = title;
                task.description = description;
                task.priority = priority;
                task.deadline = deadline || null;
            }
            Helpers.showToast('Sarcină actualizată', 'success');
        } else {
            // Add new
            this.tasks.push({
                id: Helpers.generateId(),
                title,
                description,
                priority,
                deadline: deadline || null,
                completed: false,
                completedAt: null,
                createdAt: new Date().toISOString()
            });
            Helpers.showToast('Sarcină adăugată', 'success');
        }

        this.saveTasks();
        this.closeModal();
        this.render();

        if (window.Charts) {
            Charts.updateAll();
        }
    },

    /**
     * Edit task
     */
    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            this.openModal(task);
        }
    },

    /**
     * Delete task
     */
    deleteTask(id) {
        if (confirm('Ștergeți această sarcină?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
            Helpers.showToast('Sarcină ștearsă', 'success');

            if (window.Charts) {
                Charts.updateAll();
            }
        }
    },

    /**
     * Clear completed tasks
     */
    clearCompleted() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            Helpers.showToast('Nicio sarcină finalizată', 'warning');
            return;
        }

        if (confirm(`Ștergeți ${completedCount} sarcini finalizate?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.render();
            Helpers.showToast('Sarcini finalizate șterse', 'success');
        }
    },

    /**
     * Get tasks statistics
     */
    getStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const highPriority = this.tasks.filter(t => !t.completed && t.priority === 'high').length;
        const overdue = this.tasks.filter(t => !t.completed && Helpers.isOverdue(t.deadline)).length;

        return { total, completed, pending, highPriority, overdue };
    },

    /**
     * Get tasks for AI analysis
     */
    getTasksForAI() {
        return this.tasks.map(t => ({
            title: t.title,
            priority: t.priority,
            deadline: t.deadline,
            completed: t.completed,
            overdue: !t.completed && Helpers.isOverdue(t.deadline)
        }));
    }
};

// Make globally available
window.Tasks = Tasks;
