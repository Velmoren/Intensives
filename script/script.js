//обработчик событий отслеж.загрузку контента
document.addEventListener('DOMContentLoaded', function () {
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const closeModal = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const btnBurger = document.querySelector('#burger');
  const prevBtn = document.querySelector('#prev');
  const nextBtn = document.querySelector('#next');
  const sendBtn = document.querySelector('#send');
  const modalDialog = document.querySelector('.modal-dialog');
  const modalTitle = document.querySelector('.modal-title');

  // получение данных из FireBase
  const firebaseConfig = {
    apiKey: "AIzaSyAzFXIq2kiskzXdkDCT9dRAzPsCmEMmiDY",
    authDomain: "testburger-44725.firebaseapp.com",
    databaseURL: "https://testburger-44725.firebaseio.com",
    projectId: "testburger-44725",
    storageBucket: "testburger-44725.appspot.com",
    messagingSenderId: "862367171575",
    appId: "1:862367171575:web:445fe554d44f1077a424f2",
    measurementId: "G-52WF8Q13Z6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //функция, получающая данные с firebase
  const getData = () => {
    formAnswers.textContent = "LOAD"; // можно заменить на спинер
    //получение данных из json

    setTimeout(() => {
      firebase.database().ref().child('questions').once('value')
        .then(snap => playTest(snap.val()));

      //берем информацию из json файла в проекте, если подключен локальный сервер, без баз данных
      /*fetch('./questions.json').then(res => res.json())
      .then(obj => playTest(obj.questions))
      // обработка ошибки, если ответ после запроса не придет
      .catch(err => formAnswers.textContent = 'Ошибка загрузки данных...')*/
    }, 1000)
  }

  //вопросы и ответы без сервера
  /* const questions = [
     {
       question: "Какого цвета бургер?",
       answers: [
           {
               "title": "Стандарт",
               "url": "./image/burger.png"
           },
           {
               "title": "Черный",
               "url": "./image/burgerBlack.png"
           }
       ],
       type: "radio"
   },
   {
       question: "Из какого мяса котлета?",
       answers: [
           {
               "title": "Курица",
               "url": "./image/chickenMeat.png"
           },
           {
               "title": "Говядина",
               "url": "./image/beefMeat.png"
           },
           {
               "title": "Свинина",
               "url": "./image/porkMeat.png"
           }
       ],
       type: "radio"
   },
   {
       question: "Дополнительные ингредиенты?",
       answers: [
           {
               "title": "Помидор",
               "url": "./image/tomato.png"
           },
           {
               "title": "Огурец",
               "url": "./image/cucumber.png"
           },
           {
               "title": "Салат",
               "url": "./image/salad.png"
           },
           {
               "title": "Лук",
               "url": "./image/onion.png"
           }
       ],
       type: "checkbox"
   },
   {
       question: "Добавить соус?",
       answers: [
           {
               "title": "Чесночный",
               "url": "./image/sauce1.png"
           },
           {
               "title": "Томатный",
               "url": "./image/sauce2.png"
           },
           {
               "title": "Горчичный",
               "url": "./image/sauce3.png"
           }
       ],
       type: "radio"
   }
   ]*/

  let clientWidth = document.documentElement.clientWidth;
  let count = -100;

  modalDialog.style.top = count + '%';

  const animateModal = () => {
    modalDialog.style.top = count + '%';
    count += 3;

    if (count < 0) {
      requestAnimationFrame(animateModal)
    } else {
      count = -100;
    }
  }

  //проверяет какой экран открыт, добавляет кнопку бургер
  if (clientWidth < 768) {
    btnBurger.style.display = "flex";
  } else {
    btnBurger.style.display = "none";
  }

  window.addEventListener('resize', function () {
    clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 768) {
      btnBurger.style.display = "flex";
    } else {
      btnBurger.style.display = "none";
    }
  });

  // открытие и закрытие модального окна 
  btnBurger.addEventListener('click', () => {
    btnBurger.classList.add('active');
    // modalBlock.classList.add('d-block'); //bootstrap(display:block)   
    // playTest();
    // getData();
  })

  btnOpenModal.addEventListener('click', () => {
    requestAnimationFrame(animateModal);
    modalBlock.classList.add('d-block'); //bootstrap(display:block)   
    //playTest(); // убрать, когда подключен к серверу
    getData(); // включить, когда подключен сервер
  })

  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
    btnBurger.classList.remove('active');
  })

  document.addEventListener('click', function (evt) {
    if (!evt.target.closest('.modal-dialog') && !evt.target.closest('.btnOpenModal') && !evt.target.closest('.burger')) {
      modalBlock.classList.remove('d-block');
      btnBurger.classList.remove('active');
    }
  })

  //функция начало тестирование
  const playTest = (questions) => { //в скобки вставить questions(массив данных), когда подключим сервер

    //объект для ответов пользователя и массив ответов
    const finalAnswers = [];
    const obj = {};
    // переменная с номером вопроса
    let numberQuestion = 0;

    modalTitle.textContent = 'Ответь на вопрос:';

    //перебирает массив с ответами и запускает их 
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement('div');
        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
        answerItem.innerHTML = `
        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}"> 
        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
          <img class="answerImg" src="${answer.url}" alt="burger">
          <span>${answer.title}</span>
        </label>
        `

        formAnswers.appendChild(answerItem);
      })
    }
    // ренедкрит вопросы и ответы в модальное окно
    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = ``;
      // функционал появления кнопок next / prev
      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);
        nextBtn.classList.remove('d-none');
        prevBtn.classList.remove('d-none');
        sendBtn.classList.add('d-none');
      }

      if (numberQuestion === 0) {
        prevBtn.classList.add('d-none');
      }

      if (numberQuestion === questions.length) {
        questionTitle.textContent = '';
        nextBtn.classList.add('d-none');
        prevBtn.classList.add('d-none');
        sendBtn.classList.remove('d-none');
        //после прохождения опроса появляется инпут для телефона(взял с официального сайта bootstrap) 
        formAnswers.innerHTML = `
        <div class="form-group">
          <label for="numberPhone">Enter your phone number</label>
          <input type="phone" class="form-control" id="numberPhone">
        </div>
        `
        const numberPhone = document.querySelector('#numberPhone');
        numberPhone.addEventListener('input', (evt) => {
          evt.target.value = evt.target.value.replace(/[^0-9+-]/, '');
        })
      }
      if (numberQuestion === questions.length + 1) {
        modalTitle.textContent = '';
        formAnswers.textContent = 'Спасибо за пройденый тест!';
        sendBtn.classList.add('d-none');

        for (let key in obj) {
          let newObj = {};
          newObj[key] = obj[key];
          finalAnswers.push(newObj);
        }

        setTimeout(() => {
          modalBlock.classList.remove('d-block');
        }, 2000);
      }

    }
    //запускем функцию рендеринга
    renderQuestions(numberQuestion);
    // функция генерации ответов пользователя

    const checkAnswer = () => {
      // массив ответов и фильтр выюранннго элемента filter
      const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === "numberPhone");

      //перебираем массив
      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          //{index} добавляем для радио-кнопок, т.к. можно выбрать несколько вариантов
          obj[`${index}_${questions[numberQuestion].question}`] = input.value; //для получения ответа мы добавляем измение в верстке в input, добавляем  value
        }

        if (numberQuestion === questions.length) {
          obj['Номер телефона'] = input.value;
        }
      })
      //создаем массив с ответами пользователя
      //finalAnswers.push(obj);
    }

    // обработчики вопросов
    nextBtn.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    }

    prevBtn.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    }

    sendBtn.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      //отправляет информацию ответов в базу данных firebase
      firebase.database().ref().child('contacts').push(finalAnswers);
      console.log(finalAnswers);
    }
  }
});