/**
 * Task Tracker - Main Application Logic
 */

const STORAGE_KEY = 'taskManagerTasks';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

function addTask(e) {
  e && e.preventDefault();
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) return;
  tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  input.value = '';
  render();
}

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (t) {
    t.completed = !t.completed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function startEdit(id) {
  const item = document.querySelector('[data-id="' + id + '"]');
  const t = tasks.find(x => x.id === id);
  if (!item || !t) return;
  item.classList.add('editing');
  const inp = document.createElement('input');
  inp.className = 'task-edit-input';
  inp.value = t.text;
  inp.onblur = function() {
    const v = inp.value.trim();
    if (v) t.text = v;
    item.classList.remove('editing');
    inp.remove();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    render();
  };
  inp.onkeydown = function(e) {
    if (e.key === 'Enter') inp.blur();
    if (e.key === 'Escape') {
      item.classList.remove('editing');
      inp.remove();
      render();
    }
  };
  item.querySelector('.task-text').before(inp);
  inp.focus();
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function render() {
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('task-count');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.completed ? ' completed' : '');
    li.dataset.id = t.id;
    li.innerHTML = '<label class="task-checkbox-wrapper"><input type="checkbox" class="task-checkbox" ' + (t.completed ? 'checked' : '') + '><span class="task-checkbox-custom"></span></label><span class="task-text">' + escapeHtml(t.text) + '</span><div class="task-actions"><button type="button" class="task-btn edit-btn">✎</button><button type="button" class="task-btn delete-btn">Delete</button></div>';
    li.querySelector('.task-checkbox').onchange = () => toggleComplete(t.id);
    li.querySelector('.edit-btn').onclick = () => startEdit(t.id);
    li.querySelector('.delete-btn').onclick = () => deleteTask(t.id);
    list.appendChild(li);
  });
  empty.classList.toggle('visible', tasks.length === 0);
  const done = tasks.filter(x => x.completed).length;
  count.textContent = tasks.length + ' task' + (tasks.length !== 1 ? 's' : '') + ' | ' + done + ' completed';
}

document.getElementById('task-form').onsubmit = addTask;
document.getElementById('add-btn').onclick = addTask;
render();
