const state = {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    categories: JSON.parse(localStorage.getItem('categories')) || ['All', 'Personal', 'Work'],
    currentCategory: localStorage.getItem('currentCategory') || 'All',
    darkMode: localStorage.getItem('darkMode') === 'true'
};

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksContainer = document.getElementById('tasksContainer');
const categoriesTabs = document.getElementById('categoriesTabs');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const darkModeToggle = document.querySelector('.dark-mode-toggle');

const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRight = document.getElementById('scrollRight');
const confirmationModal = document.getElementById('confirmationModal');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const confirmDeleteBtn = document.getElementById('confirmDelete');

let categoryToDelete = null;
