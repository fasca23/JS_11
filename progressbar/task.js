const progress = document.getElementById('progress');
const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
    // Отменяем стандартное действие
    event.preventDefault();
    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://students.netoservices.ru/nestjs-backend/upload');
    xhr.upload.onprogress = (event) => {
        // console.log(`Отправлено ${event.loaded} из ${event.total} байт`)
        // console.log(event.loaded/event.total)
        progress.value = event.loaded/event.total;
    }
    xhr.send(formData);
});