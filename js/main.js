// Сохраняем API (базу данных) в переменную API
const API = "http://localhost:8000/books"; // для того чтоб обращатся к ней и работать.

// Сохраняем элементы из html в переменные
let inpName = document.getElementById("inpName");
let inpAuthor = document.getElementById("inpAuthor");
let inpImage = document.getElementById("inpImage");
// let inpPrice = document.getElementById("inpPrice");
let btnAdd = document.getElementById("btnAdd");
let sectionBooks = document.getElementById("sectionBooks");
let btnOpenForm = document.getElementById("flush-collapseOne");
let searchValue = ""; // переменная для нашего поиска
let currentPage = 1; // переменная для пагинации, текущая страница
let countPage = 1; // кол-во всех страниц

// Навешиваем событие на кнопку Добавить
btnAdd.addEventListener("click", () => {
  if (
    // проверка на заполненность полей
    !inpName.value.trim() ||
    !inpAuthor.value.trim() ||
    !inpImage.value.trim()
  ) {
    alert("Заполните поле!");
    return;
  }
  console.log("sss");
  let newBook = {
    // создаём новый объект, куда добавляем значения наших инпутов
    bookName: inpName.value,
    bookAuthor: inpAuthor.value,
    bookImage: inpImage.value,
    // bookPrice: inpPrice.value,
  };
  createBooks(newBook); // вызываем фунцию для добавления новой книги в базу данных и передаём в качестве аргумента объект, созданный выше
  readBooks(); // вызываем функцию для отображения данных
});

// ! ================= CREATE =====================
// Функция для добавления новых книг в базу данных (db.json)
function createBooks(book) {
  fetch(API, {
    // отправляем запрос с помощью метода POST, для отправки данных
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(book),
  }).then(() => readBooks());
  // Совершаем очистку инпутов
  inpName.value = "";
  inpImage.value = "";
  inpAuthor.value = "";
  // inpPrice.value = "";
  // Меняем класс с помощью toggle у аккордиона, для того чтобы закрывался аккордион при клике на кнопку добавить
  btnOpenForm.classList.toggle("show");
}

// !=============== READ ====================
// Создаём функцию для отображения
function readBooks(s) {
  // отправляем запрос в db.json с настройками поиска и пагинации. Знак q - нужен для того, чтобы найти элемент во всей базе данных. Знак & - ставится если добавляем новые настройки к предыдущим. _page - для того, чтобы открыть конкретную страницу. _limit - для отображения нескольких элементов на сайте
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=15`) // получение данных из db.json
    .then((res) => res.json())
    .then((data) => {
      sectionBooks.innerHTML = ""; // очищаем тег section, чтобы не было дубликатов
      data.forEach((item) => {
        // console.log(item.id);
        // перебираем наш полученный массив с объектами
        // добавляем в наш тег section вёрстку карточек с данными из массива, при каждом цикле
        sectionBooks.innerHTML += `
        <div class="card mt-3" style="width: 20rem;">
        <img src="${item.bookImage}" class="card-img-top" style="height:280px" alt="${item.bookName}">
         <div class="card-body">
        <h5 class="card-title">${item.bookName}</h5>
        <p class="card-text">${item.bookAuthor}</p>
        <p><i class="bi bi-heart"></i>
        <button class="btn btn-outline-danger btnDelete" id="${item.id}">
        Удалить пост
        </button>
        <button class="btn btn-outline-warning btnEdit" id="${item.id}" data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Редактировать пост
        </button>
        </div>
        </div>
        `;
      });
      sumPage();
    });
}

readBooks(); // один раз вызываем функцию отображения данных для того, чтобы при первом посещении сайта данные отобразились

// ! ============= DELETE =============
// Событие на кнопку удалить
document.addEventListener("click", (event) => {
  // с помощью объекта event ищем класс нашего элемента
  let del_class = [...event.target.classList]; // Сохраняем массив с классами в переменную, используя spread оператор
  if (del_class.includes("btnDelete")) {
    // проверяем, есть ли в нашем поиске класс btnDelete
    let del_id = event.target.id; // сохраняем в переменную id нашего элемента по которому кликнули
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readBooks()); // для того, чтобы вызов функции отображения данных, подождал пока запрос DELETE выполнился, а затем сработал
  }
});

// ! =============== EDIT ==============
// Сохраняем в переменные названия инпутов и кнопки
let editInpName = document.getElementById("editInpName");
let editInpAuthor = document.getElementById("editInpAuthor");
let editInpImage = document.getElementById("editInpImage");
// let editInpPrice = document.getElementById("editInpPrice");
let editBtnSave = document.getElementById("editBtnSave");

document.addEventListener("click", (event) => {
  let editArr = [...event.target.classList];
  if (editArr.includes("btnEdit")) {
    let id = event.target.id;
    fetch(`${API}/${id}`) // с помощью запроса GET, обращаемся к конкретному объекту
      .then((res) => res.json())
      .then((data) => {
        // сохраняем в инпуты модального окна, данные из DB json
        editInpName.value = data.bookName;
        editInpAuthor.value = data.bookAuthor;
        editInpImage.value = data.bookImage;
        // editInpPrice.value = data.bookPrice;
        //добавляем при помощи метода setAttribute id в нашу кнопку сохранить
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

// Событие на кнопку сохранить
editBtnSave.addEventListener("click", () => {
  //Создаем объект с измененными данными, в далнейшем для отпраки в db.json
  let editedBook = {
    bookName: editInpName.value,
    bookAuthor: editInpAuthor.value,
    bookImage: editInpImage.value,
    // bookPrice: editInpPrice.value,
  };
  editBook(editedBook, editBtnSave.id);
  // вызов функции для отправки измененных данных в db.json, в качестве аргумента передаем : вышесозданный объект и значение аттрибута id из кнопки сохранить
});

// функция для отправки измененных данных в db.json

function editBook(objEditBook, id) {
  // в параметры принимаем : измененный объект и id по которому будем обращатся

  fetch(`${API}/${id}`, {
    method: "PATCH", // используем метод PATCH, для запроса на изменение данных в db.json
    headers: {
      "Content-Type": "application/json ; charset=utf-8",
    },
    body: JSON.stringify(objEditBook),
  }).then(() => readBooks()); // вызов функции для отображения данных сразу же после нажатия на кнопку сохранить
}

//!=====================================================SEARCH==================================
//Сохраняем в переменную инпут поиска из index.html

let inpSearch = document.getElementById("inpSearch");
//Навешиваем событие на инпут
inpSearch.addEventListener("input", () => {
  searchValue = event.target.value;
  // Сохраняем в переменную значение импута
  readBooks(); // вызываем фукнцюю для отображения данных сразу
});

// ! ================ PAGINATION ==================
// сохраняем в переменные кнопки назад и вперед из index.html для пагинации
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

// событие на кнопку пред
prevBtn.addEventListener("click", () => {
  if (currentPage <= 1) return; // проверка на то, чтобы текущая страница не уменьшалась 1
  currentPage = currentPage - 1; // уменьешение текущей страницы на одну, если условие не сработает
  readBooks(); // вызов функции для отображения данных, после нажатия кнопки пред
});

// событие на кнопку след
nextBtn.addEventListener("click", () => {
  if (currentPage >= countPage) return; // проверка на то, чтобы текущая страница не увеличилась количества всех страниц(countPage)
  currentPage = currentPage + 1; // увелечение текущей страницы на одну, если условие не сработает
  readBooks(); // вызов функции для отображения данных, при нажатии кнопки след
});

// функция для нахождения количества страниц
function sumPage() {
  fetch(API) // запрос в db.json, для того чтобы получить весь массив с книгами
    .then((res) => res.json()) // переформатируем в обычный формат js
    .then((data) => {
      // сохраняем в переменную количесвто всех страниц, с помощью свойства length узнаём длину массива, затем делим на лимит(сколько карточек хотим отобразить на одной странице) и обворачиваем в метод Math.ceil(), для того чтобы округлить резульат
      countPage = Math.ceil(data.length / 6);
    });
}
// console.log(editBtnSave.id);
editBook(editedBook, editBtnSave.id);
function editBook(objEditBook, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(objEditBook),
  }).then(() => readBooks());
  console.log(ddd)
}
