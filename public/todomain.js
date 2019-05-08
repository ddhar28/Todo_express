const taskInp = document.getElementById('taskInp')
const list = document.getElementById('taskList')
const add = document.getElementById('addTask')
const storage = window.localStorage
let tasks = storage.length ? JSON.parse(storage.getItem('task')) : []

function createOption (element, className, txt, func) {
  let btn = document.createElement(element)
  btn.setAttribute('class', className)
  btn.textContent = txt
  btn.addEventListener('click', func)
  return btn
}

function saveTask () {
  storage.setItem('task', JSON.stringify(tasks))
}

function updateTask (id, key, value, del = false) {
  if (!del) {
    let storageTask = tasks.filter(temp => temp.id === id)[0]
    tasks[tasks.indexOf(storageTask)][key] = value
  } else tasks = tasks.filter(temp => temp.id !== id)
  saveTask()
}

const createId = (() => {
  let last = 0
  return () => {
    let id = Date.now()
    if (id <= last) id = ++last
    else last = id
    return id
  }
})()

function addTask (task) {
  if (task !== '') {
    let taskDetails = { 'id': createId() + '', 'title': task, 'class': 'active', 'note': '' }
    tasks.push(taskDetails)
    displayTask(taskDetails)
    saveTask()
  }
}

function displayTask (task) {
  let newTask = document.createElement('li')
  let taskName = document.createElement('input')
  taskName.value = task.title
  taskName.setAttribute('class', 'noEdit')
  taskName.addEventListener('keydown', (e) => {
    taskName.setAttribute('class', 'editMode')
    enter(e, editTask)
  })
  taskName.disabled = true
  newTask.appendChild(taskName)
  newTask.append(createOption('button', 'delete', '\u2718', (e) => {
    updateTask(task.id, '', '', true)
    e.target.parentNode.parentNode.removeChild(e.target.parentNode)
  }))
  newTask.append(createOption('button', 'complete', task.class === 'active' ? '\u2714' : '\u27F3', completeTask))
  let isNote = task.note !== ''
  newTask.append(createOption('button', 'addNote', !isNote ? '\u271A Note' : String.fromCodePoint(128065) + ' Note', editNote))
  if (isNote) {
    let taskNote = document.createElement('textarea')
    taskNote.setAttribute('class', 'noteDone')
    taskNote.value = task.note
    newTask.appendChild(taskNote)
  }
  newTask.append(createOption('button', 'edit', '\u270D', editTask))
  setTimeout(() => (newTask.setAttribute('class', task.class)), 10)
  newTask.setAttribute('id', task.id)
  if (list.children.length < 1) list.appendChild(newTask)
  else list.insertBefore(newTask, list.childNodes[0])
  if (task.class !== 'active') {
    newTask.parentNode.querySelector('.edit').disabled = true
    newTask.parentNode.querySelector('.addNote').disabled = true
  }
  taskInp.value = ''
  taskInp.focus()
}

function completeTask (e) {
  let task = e.target.parentNode
  let isActive = task.getAttribute('class') === 'active'
  let taskClass = isActive ? 'inactive' : 'active'
  setTimeout(() => (task.setAttribute('class', taskClass)), 50)
  task.querySelector('.edit').disabled = isActive
  task.querySelector('.addNote').disabled = isActive
  e.target.textContent = isActive ? '\u27F3' : '\u2714'
  updateTask(task.getAttribute('id'), 'class', taskClass)
  if (isActive) list.insertBefore(task, list.lastChild.nextSibling)
  else list.insertBefore(task, list.firstChild)
  taskInp.focus()
}

function editTask (e) {
  let editBox = e.target.parentNode.firstChild
  let isEdit = editBox.getAttribute('class') === 'editMode'
  editBox.setAttribute('class', isEdit ? 'noEdit' : 'editMode')
  editBox.parentNode.querySelector('.complete').disabled = !isEdit
  editBox.parentNode.querySelector('.delete').disabled = !isEdit
  editBox.parentNode.querySelector('.edit').textContent = isEdit ? '\u270D' : 'Ok'
  editBox.disabled = isEdit
  if (isEdit) taskInp.focus()
  else editBox.focus()
  if (editBox.value === '') editBox.value = 'Untitled'
  updateTask(editBox.parentNode.getAttribute('id'), 'title', editBox.value)
}

function editNote (e) {
  let noNote = e.target.textContent === '\u271A Note'
  let noteBox = noNote ? document.createElement('textarea') : e.target.parentNode.querySelector('textarea')
  if (noNote) noteBox.setAttribute('class', 'noteDone')
  let isEditable = noteBox.getAttribute('class') === 'noteEdit'
  if (!isEditable) e.target.parentNode.appendChild(noteBox)
  if (isEditable) taskInp.focus()
  noteBox.setAttribute('class', isEditable ? 'noteDone' : 'noteEdit')
  noteBox.parentNode.querySelector('.complete').disabled = !isEditable
  noteBox.parentNode.querySelector('.delete').disabled = !isEditable
  e.target.parentNode.style.height = isEditable ? '30px' : '150px'
  updateTask(noteBox.parentNode.getAttribute('id'), 'note', noteBox.value)
  let noVal = noteBox.value.trim() === ''
  if (isEditable && noVal) noteBox.parentNode.removeChild(noteBox)
  e.target.textContent = (isEditable ? (noVal ? '\u271A Note' : String.fromCodePoint(128065) + ' Note') : 'Done')
  noteBox.focus()
}

function enter (e, f, para = e) {
  if (e.code === 'Enter') {
    f(para)
  }
}

taskInp.value = ''
add.addEventListener('click', (e) => {
  addTask(taskInp.value.trim())
})

taskInp.addEventListener('keydown', (e) => {
  enter(e, addTask, taskInp.value.trim())
})

taskInp.focus()
if (storage.length) {
  const data = JSON.parse(storage.getItem('task'))
  let activeTask = []
  data.forEach(item => {
    if (item.class === 'active') activeTask.push(item)
    else displayTask(item)
  })
  activeTask.forEach(item => displayTask(item))
}
