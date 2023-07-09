document.getElementById('generarTrivia').addEventListener('click', generarTrivia);
document.getElementById('enviarRespuestas').addEventListener('click', enviarRespuestas);
document.getElementById('nuevaTrivia').addEventListener('click',nuevaTrivia );

function generarTrivia() {
  const dificultad = document.getElementById('dificultad').value;
  const tipo = document.getElementById('tipo').value;
  const categoria = document.getElementById('categoria').value;
  
  fetchTrivia(dificultad, tipo, categoria)
    .then(data => {
      mostrarTrivia(data.results);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function fetchTrivia(dificultad, tipo, categoria) {
  const url = `https://opentdb.com/api.php?amount=10&difficulty=${dificultad}&type=${tipo}&category=${categoria}`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.response_code !== 0) {
        throw new Error('No se pudieron obtener las preguntas de trivia.');
      }
      return data;
    });
}

function mostrarTrivia(preguntas) {
  const contenedorTrivia = document.getElementById('trivia');
  const contenedorPreguntas = document.getElementById('preguntas');
  contenedorPreguntas.innerHTML = '';

  preguntas.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
      <p id="pregunta"><strong>${index + 1}. ${question.question}</strong></p>
      ${createAnswersHTML(question.incorrect_answers, question.correct_answer, question.type)}
    `;
    contenedorPreguntas.appendChild(questionElement);
  });

  contenedorTrivia.style.display = 'block';
}

function createAnswersHTML(incorrectAnswers, correctAnswer, tipo) {
  let answersHTML = '';
  const answers = incorrectAnswers.concat(correctAnswer);
  
  if (tipo === 'multiple') {
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
      answersHTML += `
        <label>
          <input type="radio" name="${correctAnswer}" value="${answer}">
          ${answer}
        </label>
        <br>
      `;
    });
  } else if (tipo === 'boolean') {
    answersHTML += `
      <label>
        <input type="radio" name="${correctAnswer}" value="True">
        Verdadero
      </label>
      <br>
      <label>
        <input type="radio" name="${correctAnswer}" value="False">
        Falso
      </label>
      <br>
    `;
  }

  return answersHTML;
}

function enviarRespuestas() {
  const contenedorPreguntas = document.getElementById('preguntas');
  const preguntas = contenedorPreguntas.getElementsByTagName('div');
  let puntaje = 0;
  const respuestasCorrectas = [];

  for (let i = 0; i < preguntas.length; i++) {
    const selecccionarRespuesta = preguntas[i].querySelector('input[type="radio"]:checked');
    if (selecccionarRespuesta && selecccionarRespuesta.value === selecccionarRespuesta.name) {
      puntaje += 100;
      respuestasCorrectas.push(selecccionarRespuesta.name);
    }
  }

  const contenedorTrivia = document.getElementById('trivia');
  const contenedorPuntaje = document.getElementById('puntaje');
  const valorPuntuacion = document.getElementById('valorPuntuacion');
  const contenedorRespuestasCorrectas = document.getElementById('respuestasCorrectas');

  valorPuntuacion.textContent = puntaje;
  contenedorRespuestasCorrectas.innerHTML = respuestasCorrectas.map((answer, index) => `<p><strong>${index + 1}. ${answer}</strong></p>`).join('');
  
  contenedorTrivia.style.display = 'none';
  contenedorPuntaje.style.display = 'block';
}

function nuevaTrivia() {
  const contenedorTrivia = document.getElementById('trivia');
  const contenedorPuntaje = document.getElementById('puntaje');
  contenedorTrivia.style.display = 'none';
  contenedorPuntaje.style.display = 'none';
}
