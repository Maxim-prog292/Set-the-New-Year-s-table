// const mainHeader = document.querySelector(".mainHeader");
// const dishes = document.querySelectorAll(".dish");
// const tablecloths = document.querySelectorAll(".tablecloth");
// const table = document.getElementById("table");
// const reload = document.querySelector(".reload");
// let placedDishes = 0;

// reload.addEventListener("click", () => {
//   location.reload();
// });

// // Добавляем события для всех блюд
// dishes.forEach((dish) => {
//   dish.addEventListener("dragstart", dragStart);
// });

// // Добавляем события для всех скатертей
// tablecloths.forEach((tablecloth) => {
//   tablecloth.addEventListener("dragstart", dragStartTablecloth);
// });

// table.addEventListener("dragover", dragOver);
// table.addEventListener("drop", drop);

// function dragStart(event) {
//   if (event.target.dataset.placed === "true") {
//     event.preventDefault();
//     return;
//   }
//   event.dataTransfer.setData("type", "dish");
//   event.dataTransfer.setData("text/plain", event.target.src);
//   event.dataTransfer.setData("id", event.target.alt);
// }

// function dragStartTablecloth(event) {
//   const tableclothSrc = event.target.src;
//   event.dataTransfer.setData("type", "tablecloth");
//   event.dataTransfer.setData("src", tableclothSrc);
// }

// function dragOver(event) {
//   event.preventDefault();
// }

// function drop(event) {
//   event.preventDefault();

//   const type = event.dataTransfer.getData("type");

//   if (type === "dish") {
//     const dishSrc = event.dataTransfer.getData("text/plain");
//     const dishId = event.dataTransfer.getData("id");

//     const existingDish = Array.from(table.children).find(
//       (child) => child.alt === dishId
//     );

//     if (existingDish) {
//       return;
//     }

//     const dishElement = document.createElement("img");
//     dishElement.src = dishSrc;
//     dishElement.classList.add("dish");
//     dishElement.style.position = "absolute";
//     dishElement.style.left = event.offsetX - 40 + "px";
//     dishElement.style.top = event.offsetY - 40 + "px";
//     dishElement.alt = dishId;

//     table.appendChild(dishElement);

//     const originalDish = Array.from(dishes).find((d) => d.alt === dishId);
//     if (originalDish) {
//       originalDish.dataset.placed = "true";
//       originalDish.style.opacity = "0.5";
//       originalDish.draggable = false;
//     }

//     placedDishes++;
//     checkWin();
//   } else if (type === "tablecloth") {
//     const tableclothSrc = event.dataTransfer.getData("src");
//     table.style.backgroundImage = `url(${tableclothSrc})`;
//     table.style.backgroundSize = "cover";
//   }
// }

// function checkWin() {
//   if (placedDishes === dishes.length) {
//     setTimeout(
//       () =>
//         (mainHeader.textContent =
//           "Поздравляем! Вы накрыли новогодний стол! 🎉"),
//       100
//     );
//   }
// }

const mainHeader = document.querySelector(".mainHeader");
const dishes = document.querySelectorAll(".dish");
const tablecloths = document.querySelectorAll(".tablecloth");
const table = document.getElementById("table");
const reload = document.querySelector(".reload");
const toggle_game_tree = document.querySelector(".toggle_game_tree");

let placedDishes = 0;

// Функция для управления прелоадером
function hidePreloader() {
  // Получаем элементы прелоадера и основного контента
  const preloader = document.querySelector(".preloader_wrap");
  const content = document.getElementById("content");

  // Убираем прелоадер с экрана
  preloader.style.opacity = "0"; // Плавное исчезновение
  preloader.style.transition = "opacity 0.5s";

  // Ждем завершения анимации и скрываем элемент полностью
  setTimeout(() => {
    preloader.style.display = "none";
    content.style.display = "block"; // Показываем основной контент
  }, 500); // Время должно совпадать с transition
}

// Ждем полной загрузки страницы (включая все ресурсы)
window.onload = hidePreloader;

mainHeader.style.width = "1700px";
mainHeader.style.left = 1920 / 2 - 1700 / 2 + "px";

window.addEventListener("mousewheel", function (e) {
  if (e.ctrlKey) {
    e.preventDefault();
    return false;
  }
});
document.addEventListener(
  "touchstart",
  (e) => {
    // Если используется более одного пальца
    if (e.touches.length > 1) {
      e.preventDefault(); // Отключаем действие по умолчанию
    }
  },
  { passive: false }
); // { passive: false } важно для предотвращения поведения по умолчанию
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) {
      e.preventDefault(); // Отключаем зумирование двумя пальцами
    }
  },
  { passive: false }
); // { passive: false } важно для отмены действия по умолчанию

reload.addEventListener("click", () => {
  location.reload();
});

// Добавляем события для всех блюд
dishes.forEach((dish) => {
  dish.addEventListener("dragstart", dragStart);
  dish.addEventListener("touchstart", touchStart);
  dish.addEventListener("touchmove", touchMove);
  dish.addEventListener("touchend", touchEnd);
});

// Добавляем события для всех скатертей
tablecloths.forEach((tablecloth) => {
  tablecloth.addEventListener("dragstart", dragStartTablecloth);
  tablecloth.addEventListener("click", () => {
    applyTablecloth(tablecloth.src);
  });
});

table.addEventListener("dragover", dragOver);
table.addEventListener("drop", drop);

// Координаты для touch-событий
let touchDishElement = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

function dragStart(event) {
  if (event.target.dataset.placed === "true") {
    event.preventDefault();
    return;
  }
  event.dataTransfer.setData("type", "dish");
  event.dataTransfer.setData("text/plain", event.target.src);
  event.dataTransfer.setData("id", event.target.alt);
}

function dragStartTablecloth(event) {
  const tableclothSrc = event.target.src;
  event.dataTransfer.setData("type", "tablecloth");
  event.dataTransfer.setData("src", tableclothSrc);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();

  const type = event.dataTransfer.getData("type");

  if (type === "dish") {
    const dishSrc = event.dataTransfer.getData("text/plain");
    const dishId = event.dataTransfer.getData("id");

    const existingDish = Array.from(table.children).find(
      (child) => child.alt === dishId
    );

    if (existingDish) {
      return;
    }

    const dishElement = document.createElement("img");
    dishElement.src = dishSrc;
    dishElement.classList.add("dish");
    dishElement.style.position = "absolute";
    dishElement.style.left = event.offsetX - 40 + "px";
    dishElement.style.top = event.offsetY - 40 + "px";
    dishElement.alt = dishId;

    table.appendChild(dishElement);

    const originalDish = Array.from(dishes).find((d) => d.alt === dishId);
    if (originalDish) {
      originalDish.dataset.placed = "true";
      originalDish.style.opacity = "0.5";
      originalDish.draggable = false;
    }

    placedDishes++;
    checkWin();
  } else if (type === "tablecloth") {
    const tableclothSrc = event.dataTransfer.getData("src");
    applyTablecloth(tableclothSrc);
  }
}

function applyTablecloth(src) {
  table.style.backgroundImage = `url(${src})`;
  table.style.backgroundSize = "cover";
}

// Touch-события для перетаскивания блюд
function touchStart(event) {
  const touch = event.touches[0];
  const target = event.target;

  if (target.dataset.placed === "true") return;

  touchDishElement = target.cloneNode(true); // Клонируем элемент блюда
  touchDishElement.style.position = "absolute";
  touchDishElement.style.pointerEvents = "none";
  touchDishElement.style.zIndex = "1000";

  document.body.appendChild(touchDishElement);

  touchOffsetX = touch.clientX - target.getBoundingClientRect().left;
  touchOffsetY = touch.clientY - target.getBoundingClientRect().top;

  moveAt(touch.clientX, touch.clientY);
}

function touchMove(event) {
  if (!touchDishElement) return;

  const touch = event.touches[0];
  moveAt(touch.clientX, touch.clientY);

  function moveAt(clientX, clientY) {
    touchDishElement.style.left = clientX - touchOffsetX + "px";
    touchDishElement.style.top = clientY - touchOffsetY + "px";
  }
}

function touchEnd(event) {
  if (!touchDishElement) return;
  const dropTarget = document.elementFromPoint(
    event.changedTouches[0].clientX,
    event.changedTouches[0].clientY
  );

  if (dropTarget && dropTarget.id === "table") {
    const rect = dropTarget.getBoundingClientRect();
    const x = event.changedTouches[0].clientX - rect.left;
    const y = event.changedTouches[0].clientY - rect.top;

    const dishId = touchDishElement.alt;

    const existingDish = Array.from(table.children).find(
      (child) => child.alt === dishId
    );

    if (!existingDish) {
      const dishElement = document.createElement("img");
      dishElement.src = touchDishElement.src;
      dishElement.classList.add("dish");
      dishElement.style.position = "absolute";
      dishElement.style.left = x - 40 + "px";
      dishElement.style.top = y - 40 + "px";
      dishElement.alt = dishId;

      table.appendChild(dishElement);

      const originalDish = Array.from(dishes).find((d) => d.alt === dishId);
      if (originalDish) {
        originalDish.dataset.placed = "true";
        originalDish.style.opacity = "0.5";
        originalDish.draggable = false;
      }

      placedDishes++;
      checkWin();
    }
  }

  // Удаляем временный элемент
  document.body.removeChild(touchDishElement);
  touchDishElement = null;
}

function checkWin() {
  if (placedDishes === dishes.length) {
    setTimeout(
      () =>
        (mainHeader.textContent = "Поздравляем! Вы накрыли новогодний стол!"),
      100
    );
  }
}
