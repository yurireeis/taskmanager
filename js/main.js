// set your api key on environment
const apiKey = process.env.API_KEY;
const apiUrl = "https://api.mlab.com/api/1";
const taskUrl = `${apiUrl}/databases/taskmanager/collections/tasks`;
const categoryUrl = `${apiUrl}/databases/taskmanager/collections/categories`;
const taskCollectionUrl = `${apiUrl}/databases/taskmanager/collections/tasks?apiKey=${apiKey}`;
const categoriesCollectionUrl = `${apiUrl}/databases/taskmanager/collections/categories?apiKey=${apiKey}`;

$(document).ready(() => {
  getTasks();
  getCategories();
  getCategoriesOptions();

  // creating events
  $('#add_task').on('submit', addTask);
  $('#edit_task').on('submit', editTask);
  $('body').on('click', '.btn-edit-task', setTask);
  $('body').on('click', '.btn-delete-task', deleteTask);
  $('#add_category').on('submit', addCategory);
  $('#edit_category').on('submit', editCategory);
  $('body').on('click', '.btn-edit-category', setCategory);
  $('body').on('click', '.btn-delete-category', deleteCategory);
});

function addTask (event) {
  let taskName = $('#task_name').val();
  let category = $('#category').val();
  let dueDate = $('#due_date').val();
  let isUrgent = $('#is_urgent').val();

  $.ajax({
    url: taskCollectionUrl,
    data: JSON.stringify({
      task_name: taskName,
      category: category,
      due_date: dueDate,
      is_urgent: isUrgent
    }),
    type: "POST",
    contentType: "application/json",
    success: data => {
      window.location.href = 'categories.html';
    },
    error: (xhr, status, err) => {
      console.log(err);
    }
  });

  // prevent default behaviour of submit click action
  event.preventDefault();
}

function addCategory (event) {
  let categoryName = $('#category_name').val();

  $.ajax({
    url: categoriesCollectionUrl,
    data: JSON.stringify({
      category_name: categoryName,
    }),
    type: "POST",
    contentType: "application/json",
    success: data => {
      window.location.href = 'index.html';
    },
    error: (xhr, status, err) => {
      console.log(err);
    }
  });

  // prevent default behaviour of submit click action
  event.preventDefault();
}

function editTask (event) {
  let id = sessionStorage.getItem('current_id');
  let taskName = $('#task_name').val();
  let category = $('#category').val();
  let dueDate = $('#due_date').val();
  let isUrgent = $('#is_urgent').val();

  $.ajax({
    url: `${taskUrl}/${id}/?apiKey=${apiKey}`,
    data: JSON.stringify({
      task_name: taskName,
      category: category,
      due_date: dueDate,
      is_urgent: isUrgent
    }),
    type: "PUT",
    contentType: "application/json",
    success: data => {
      window.location.href = 'index.html';
    },
    error: (xhr, status, err) => {
      console.log(err);
    }
  });

  // prevent default behaviour of submit click action
  event.preventDefault();
}

function editCategory (event) {
  let id = sessionStorage.getItem('current_category');
  let categoryName = $('#category_name').val();

  $.ajax({
    url: `${categoryUrl}/${id}/?apiKey=${apiKey}`,
    data: JSON.stringify({
      category_name: categoryName,
    }),
    type: "PUT",
    contentType: "application/json",
    success: data => {
      window.location.href = 'categories.html';
    },
    error: (xhr, status, err) => {
      console.log(err);
    }
  });

  // prevent default behaviour of submit click action
  event.preventDefault();
}

function setTask (event) {
  // get the data attribute by data parameter
  let taskId = $(this).data('task-id');
  sessionStorage.setItem('current_id', taskId);
  window.location.href = 'edittask.html';
  return false;
}

function setCategory (event) {
  // get the data attribute by data parameter
  let taskId = $(this).data('category-id');
  sessionStorage.setItem('current_category', taskId);
  window.location.href = 'editcategory.html';
  return false;
}

function deleteTask () {
  let id = $(this).data('task-id');

  $.ajax({
    url: `${taskUrl}/${id}/?apiKey=${apiKey}`,
    type: 'DELETE',
    async: true,
    contentType: 'application/json',
    success: function (data) {
      window.location.href = 'index.html';
    },
    error: function (xhr, status, err) {
      console.log(err);
    }
  });
}

function deleteCategory () {
  let id = $(this).data('category-id');

  $.ajax({
    url: `${categoryUrl}/${id}/?apiKey=${apiKey}`,
    type: 'DELETE',
    async: true,
    contentType: 'application/json',
    success: function (data) {
      window.location.href = 'categories.html';
    },
    error: function (xhr, status, err) {
      console.log(err);
    }
  });
}

function getTasks () {
  $.get(taskCollectionUrl, data => {
    let output = '<ul class="list-group">';

    $.each(data, (key, task) => {
      let dueDate = task && task.due_date;
      let taskName = task && task.task_name;
      let taskId = task && task._id && task._id.$oid;

      output += `<li class="list-group-item">
        <div class="pull-left">${task.task_name}
          <span class="due_on"> [Due on ${dueDate}]</span>`;

      if ($.parseJSON(task.is_urgent)) {
        output += '<span class="label label-danger"> Urgent</span>';
      }

      output += `</div><div class="pull-right">
        <a class="btn btn-primary btn-edit-task" data-task-name="${taskName}" data-task-id="${taskId}">Edit</a>
        <a class="btn btn-danger btn-delete-task" data-task-id="${taskId}">Delete</a>
        </div></li>`;
    });

    output += '</ul>';

    $('#tasks').html(output);
  });
}

function getTask (id) {
  $.get(`${taskUrl}/${id}/?apiKey=${apiKey}`, function (task) {
    $('#task_name').val(task.task_name);
    $('#category').val(task.category);
    $('#due_date').val(task.due_date);
    $('#is_urgent').val(task.is_urgent);
  });
}

function getCategory (category) {
  $.get(`${categoryUrl}/${id}/?apiKey=${apiKey}`, function (category) {
    $('#category_name').val(category.category_name);
  });
}

function getCategoriesOptions () {
  let output = '';

  $.get(categoriesCollectionUrl, data => {
    $.each(data, (key, category) => {
      let categoryName = category && category.category_name;
      output += `<option value="${categoryName}">${categoryName}</option>`;
    });

    $('#category').append(output);
  });
}

function getCategories () {
  $.get(categoriesCollectionUrl, data => {
    let output = '<ul class="list-group">';

    $.each(data, (key, category) => {
      let categoryName = category && category.category_name;
      let categoryId = category && category._id && category._id.$oid;

      output += `<li class="list-group-item">${categoryName}
        <div class="pull-right">
          <a class="btn btn-primary
            btn-edit-category"
            data-category-name="${categoryName}"
            data-category-id="${categoryId}">
            Edit
          </a>
          <a class="btn btn-danger btn-delete-category"
            data-category-id="${categoryId}">
            Delete
          </a>
        </div>
      </li>`;
    });

    output += '</ul>';

    $('#categories').append(output);
  });
}
