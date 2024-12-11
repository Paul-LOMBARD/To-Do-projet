//Pop-up de création
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('popup-overlay');
    const openPopupButton = document.getElementById('button-create');
    const closePopupIcon = document.getElementById('popup-close');

    // Ouvrir le popup
    openPopupButton.addEventListener('click', () => {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Fermer le popup via l'icône
    closePopupIcon.addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Fermer en cliquant sur l'overlay
    overlay.addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });
});


// Tableaux des tâches
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskInput = document.getElementById('task-description');
const addTaskButton = document.getElementById('button-save');
const taskList = document.getElementById('task-list');

//CREATE (Créer une tâche)
addTaskButton.addEventListener('click', function () {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            id: Date.now(), // Identifiant unique
            text: taskText,
            completed: false
        };
        tasks.unshift(task);
        saveTasks();
        renderTasks();
        taskInput.value = ''; // On vide le champ input
    }

    popup.style.display = 'none';
    overlay.style.display = 'none';
});

// READ (Afficher toutes les tâches)

function renderTasks() {
    taskList.innerHTML = ''; // Очищаем список
    const fragment = document.createDocumentFragment();

    tasks.sort((a, b) => {
        if (a.completed !== b.completed) {
            return +a.completed - +b.completed; 
        }
        if (!a.deadline && !b.deadline) return 0; 
        if (!a.deadline) return 1; 
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    tasks.forEach(task => {
        const taskDiv = document.createElement('li');
        taskDiv.classList.add('task');
        
        if (task.completed) taskDiv.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task-checkbox');
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;

        const taskDeadline = document.createElement('span');
        taskDeadline.classList.add('task-deadline');
        taskDeadline.textContent = `Échéance : ${task.deadline ? formatDate(task.deadline) : 'Aucune deadline'}`;

        const editButton = document.createElement('button');
        editButton.classList.add('button-modif');
        editButton.textContent = 'Modifier';
        editButton.addEventListener('click', () => editTask(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('button-delete');
        deleteButton.innerHTML = '🗑️';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        taskDiv.append(checkbox, taskText, taskDeadline, editButton, deleteButton);
        
        taskDiv.classList.add('task-move');
        taskDiv.addEventListener('animationend', () => taskDiv.classList.remove('task-move'));

        fragment.appendChild(taskDiv);
    });

    taskList.appendChild(fragment);
}

console.log(tasks);



//Pop-up de modification

const editPopup = document.getElementById('edit-popup');
const editOverlay = document.getElementById('edit-popup-overlay');
const editCloseIcon = document.getElementById('edit-popup-close');
const editTaskInput = document.getElementById('edit-popup-task');
const editSaveButton = document.getElementById('edit-popup-save');

let taskBeingEdited = null; // Stocker la tâche actuellement éditée

//Ouvrir le pop-up de modification
function editTask(taskId) {
    taskBeingEdited = tasks.find(task => task.id === taskId); // Trouver la tâche
    editTaskInput.value = taskBeingEdited.text; // Pré-remplir la description
    editPopup.style.display = 'block';
    editOverlay.style.display = 'block';
}
console.log(taskBeingEdited);
//Fermer le pop-up de modification
editCloseIcon.addEventListener('click', () => {
    editPopup.style.display = 'none';
    editOverlay.style.display = 'none';
});

editOverlay.addEventListener('click', () => {
    editPopup.style.display = 'none';
    editOverlay.style.display = 'none';
});

//Sauvegarder la tâche modifiée
editSaveButton.addEventListener('click', () => {
    if (taskBeingEdited) {
        const updatedText = editTaskInput.value.trim();
        if (updatedText) {
            taskBeingEdited.text = updatedText; // Met à jour la description
            saveTasks(); // Sauvegarde dans localStorage
            renderTasks(); // Recharge l'affichage
        }
    }
    editPopup.style.display = 'none';
    editOverlay.style.display = 'none';
});

//Pop up de suppression

const deletePopup = document.getElementById('delete-popup');
const deleteOverlay = document.getElementById('delete-popup-overlay');
const deleteCloseIcon = document.getElementById('delete-popup-close');
const deleteSaveButton = document.getElementById('delete-popup-save');

let taskToDelete = null;

function deleteTask(taskId) {
    taskToDelete = taskId;
    // tasks = tasks.filter(task => task.id !== taskId);
    console.log('Tâche à supprimer:', taskToDelete);
    deletePopup.style.display = 'block';
    deleteOverlay.style.display = 'block';
    // saveTasks();
    // renderTasks();
}
//Fermer le pop-up de suppression

deleteCloseIcon.addEventListener('click', () => {
    deletePopup.style.display = 'none';
    deleteOverlay.style.display = 'none';
});

deleteOverlay.addEventListener('click', () => {
    deletePopup.style.display = 'none';
    deleteOverlay.style.display = 'none';
});

//COnfirmer la suppression de la tâche

deleteSaveButton.addEventListener('click', () => {
    console.log('Confirmer suppression de la tâche:', taskToDelete);
    if (taskToDelete !== null) {
        // Filtrer la tâche à supprimer en fonction de son ID
        tasks = tasks.filter(task => task.id !== taskToDelete);
        // Sauvegarder les tâches dans localStorage
        saveTasks();
        // Re-render les tâches
        renderTasks();
        // Masquer le pop-up de confirmation
        deletePopup.style.display = 'none';
        deleteOverlay.style.display = 'none';
    }
});

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed; 
        
        // Trouver l'element de la tache
        const taskElement = document.querySelector(`.task input[type="checkbox"][onchange="toggleTaskCompletion(${taskId})"]`).closest('.task');
        
        // Ajout de la classe pour l'animation
        if (task.completed) {
            taskElement.classList.add('task-completed-animation', 'completed');
        } else {
            taskElement.classList.remove('completed');
        }

        // Suprimer la classe après l'animation
        setTimeout(() => taskElement.classList.remove('task-completed-animation'), 500); // Temps de l'animation
        
        // Sauvegarder les tâches
        setTimeout(() => {
            saveTasks(); 
            renderTasks(); 
        }, 600); // Le temp de l'animation
    }
}
// Charger les tâches au démarrage
renderTasks()