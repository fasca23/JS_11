let xhr = new XMLHttpRequest();
let items = document.getElementById('items');
let loader = document.getElementById('loader');
let arr = [];
let fromLocalStorage = localStorage.getItem('preloader');
const url = 'https://students.netoservices.ru/nestjs-backend/slow-get-courses'
// console.log(localStorage)

// Если локальное хранилище не пустое работаем вначале с ним
if (fromLocalStorage !== null) {
    let answer = JSON.parse(fromLocalStorage);
    // Отправляем на страницу
    renderAnswer(answer);
    // Забираем запрос
    xhr.open('GET', url);
    xhr.send();
    // console.log(xhr);
    // Если все отработало нормально - отправляем на страницу и записываем в хранилище
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            // console.log(xhr.responseText);
            answer = JSON.parse(xhr.responseText);
            // Отправляем на страницу
            renderAnswer(answer);
            // Записываем новое значение в хранилище
            localStorage.setItem('preloader', xhr.responseText);
        }    
    });
// Если хранилище пустое - сразу запрос и потом на страницу
} else {
    xhr.open('GET', url);
    xhr.send();
    
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            let answer = JSON.parse(xhr.responseText);
            
            renderAnswer(answer);
            localStorage.setItem('preloader', xhr.responseText);
        }    
    });
}

function renderAnswer(answer) {
    // console.log(answer)
    for (let valute in answer.response.Valute) {
        // Пушим в пустой arr
        arr.push(answer.response.Valute[valute]);
    }
        // С помощью map для каждого елемента (валюты) готовим html
    let render = arr.map(el => `
        <div class="item">
            <div class="item__code">
                ${el.CharCode} (${el.Name}) - 
            </div>
            <div class="item__value">
                ${el.Value}
            </div>
            <div class="item__currency">
                руб.
            </div>
        </div>
    `);
    // Для блока items добавляем новый html
    items.innerHTML = render.join('');
    // Чистим arr
    arr = [];
    // Удаляем активную анимацию загрузки
    loader.classList.remove('loader_active');
}