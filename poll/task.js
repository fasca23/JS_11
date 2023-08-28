const url = "https://students.netoservices.ru/nestjs-backend/poll";
const title = document.querySelector(".poll__title");
const answers = document.querySelector(".poll__answers");

let xhr = sendRequest();
xhr.open("GET", url);
xhr.send();

// При успешном ответе сервера получаем данные
xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {

        // console.log(xhr.response)

        let resp = xhr.response;
        let val = resp.data;

        // console.log(val)

        let id = resp.id;

        // console.log(id)

        // Список вопросов сохраняем
        let arrAnswers = val.answers;
        // console.log(arrAnswers)

        // Название сразу вписываем в страницу
        title.textContent = val.title

        arrAnswers.forEach(el => {
            // Создаем кнопку
            const button = document.createElement("button")
            // Добавляем в нее класс
            button.classList.add("poll__answer")
            // Добавляем в нее вопрос из списка
            button.textContent = el
            // Добавляем на страницу
            answers.append(button)

        });

        // Собираем со страницы ответы
        const answer = document.querySelectorAll(".poll__answer"),
        xhrPOST = sendRequest()
        xhrPOST.open('POST', url);
        xhrPOST.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        // Проверяем в цикле ответы с учетом номеров ответов
        answer.forEach((el, index) => {
            // Подписываемся на нажатие на каждый элемент
            el.addEventListener("click", () => {
                // Если нажатие произошло - отправляем запрос на сервер с данным id вопроса и index ответа
                xhrPOST.send(`vote=${id}&answer=${index}`);
                alert('«Ваш голос засчитан!»')
                // Удаляем все вопросы со страницы при отправке
                answers.remove()
            })
        })
        
        xhrPOST.onreadystatechange = () => {
            if (xhrPOST.readyState == 4 && xhrPOST.status == 201) {
                console.log(xhrPOST)
                let response = xhrPOST.response,
                    statistic = response.stat;
                // console.log(statistic)

                // Считаем общее количество голосов
                const sumvotes = statistic.reduce(
                    (sum, answerstat) => {
                      return sum + answerstat.votes
                    },0
                  )
                // console.log(sumvotes)

                // Для каждого количества голосов берем процент от общего количества голосов
                statistic.forEach(el => {
                    const p = document.createElement("p")
                    p.textContent = `${el["answer"]}: ${Math.round((el["votes"] / sumvotes)*100)}%`
                    title.append(p)
                });
            }
        }
    }
}

function sendRequest() {
    let request = new XMLHttpRequest();
    request.responseType = 'json';
    return request
}