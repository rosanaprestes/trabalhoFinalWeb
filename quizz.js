const url = "https://opentdb.com/api.php"
const list_categories = "https://opentdb.com/api_category.php"

let answers_array = []

let category_selected = ''
let answer_selected = ''
let difficulty_selected = ''
let correct_answ = ''
let view_category = ''

const elements = {
    title: document.querySelector('.title'),
    functions:{
        embaralha: function(array) {
            var escolha = array.length, a, i;
            while (escolha) {
              i = Math.floor(Math.random() * escolha--);
              a = array[escolha];
              array[escolha] = array[i];
              array[i] = a;
            }
            return array;
        },
        novaPergunta: function () {
            difficulty_selected = document.querySelector('.diff input[name="diffRadio"]:checked')
            category_selected = document.querySelector('.categ > select')
            axios.get(`${url}?amount=1&category=${category_selected.value}&difficulty=${difficulty_selected.value}&type=multiple`)
            .then((response) => {
                correct_answ = response.data.results[0].correct_answer
                elements.buttons.diff.classList.add('d-none')
                elements.buttons.diff.classList.remove('d-flex')
                elements.game.classList.remove('d-none')
                elements.game.classList.add('d-flex')
                elements.game_category.innerHTML = `${response.data.results[0].category}`
                view_category = response.data.results[0].category
                let question = response.data.results[0].question
                elements.game_question.innerHTML = `${question}`
                answers_array = [
                    response.data.results[0].incorrect_answers[0],
                    response.data.results[0].incorrect_answers[1],
                    response.data.results[0].incorrect_answers[2],
                    response.data.results[0].correct_answer,
                ]
                let suffled_array = elements.functions.embaralha(answers_array)
                elements.quiz_answer_1.innerHTML = `${suffled_array[0]}`
                elements.quiz_answer_2.innerHTML = `${suffled_array[1]}`
                elements.quiz_answer_3.innerHTML = `${suffled_array[2]}`
                elements.quiz_answer_4.innerHTML = `${suffled_array[3]}`
            })
            .catch((error) => {
                console.log(error)
            })
        },
        final: function () {
            elements.final_area.final_view.classList.remove('d-none')
            elements.final_area.final_view.classList.add('d-flex')
            if(lost_game == 1) {
                elements.final_area.final_message_user_score.innerHTML = `Pontos: ${score}`
                elements.final_area.final_message_user_category.innerHTML = `Dificuldade: ${difficulty_selected.value}`
                elements.final_area.final_message_user_difficulty.innerHTML = `Categoria: ${view_category}`
            }
        },
        saida: function () {
            document.location.reload()
            elements.buttons.diff.classList.add('d-none')
            elements.buttons.diff.classList.remove('d-flex')
            elements.title.classList.remove('d-none')
            elements.title.classList.add('d-flex')

        }
    },
    buttons: {
        playButton: document.querySelector('.play'),
        diff: document.querySelector('.difficulty'),
        saida: document.querySelector('.saida'),
        startButton: document.querySelector('.start'),
        btn_confirm_answer: document.querySelector('.btn-confirm-answer'),
        btn_back: document.querySelector('.btn-back'),
    },
    difficulty: document.querySelector('.diff-radios > input'),
    category: document.querySelector('.lista'),
    game: document.querySelector('.game'),
    game_category: document.querySelector('.game-category'),
    game_question: document.querySelector('.game-question'),
    quiz_answers: document.querySelector('.quiz-answers'),
    quiz_answer_1: document.querySelector('.quiz-answer-1'),
    quiz_answer_2: document.querySelector('.quiz-answer-2'),
    quiz_answer_3: document.querySelector('.quiz-answer-3'),
    quiz_answer_4: document.querySelector('.quiz-answer-4'),
    scoreboard_area: {
        score_area: document.querySelector('.var-score-area'),
        chances_area: document.querySelector('.var-chances-area'),
    },
    final_area: {
        final_view: document.querySelector('.final-game-message'),
        final_message_body: document.querySelector('.final-message-body'),
        final_message_user_sb: document.querySelector('.final-message-user-sb'),
        final_message_user_score: document.querySelector('.total-score'),
        final_message_user_category: document.querySelector('.selected-category'),
        final_message_user_difficulty: document.querySelector('.selected-difficulty'),
        final_message_button: document.querySelector('.final-message-button button')
    },
}

let score = 0
let incorrect = 0
let chances = 3
let lost_game = 0

elements.buttons.btn_back.addEventListener("click", () => {
    lost_game = 1
    elements.game.classList.remove('d-flex')
    elements.game.classList.add('d-none')
    elements.functions.final()
})

elements.final_area.final_message_button.addEventListener("click", () => {
    elements.final_area.final_view.classList.remove('d-flex')
    elements.final_area.final_view.classList.add('d-none')
    elements.functions.saida()
})

elements.buttons.playButton.addEventListener("click", () => {
    elements.title.classList.add('d-none')
    elements.title.classList.remove('d-flex')
    elements.buttons.diff.classList.remove('d-none')
    elements.buttons.diff.classList.add('d-flex')

})

axios.get(`${list_categories}`)
.then((response) => {   
    for(let i = 0; i < response.data.trivia_categories.length; i++) {
        elements.category.innerHTML += `<option value="${response.data.trivia_categories[i].id}"
         class="item d-flex m-auto align-items-center justify-content-center fw-bold">${response.data.trivia_categories[i].name}</option>`
    }
})
.catch((error) => {
    console.log(error)
})

elements.buttons.startButton.addEventListener("click", () => {
    elements.functions.novaPergunta()
})

elements.buttons.btn_confirm_answer.addEventListener("click", () => {
    if(chances <= 0) {
        lost_game = 1
        elements.game.classList.remove('d-flex')
        elements.game.classList.add('d-none')
        elements.functions.final()
    } else {
        answer_selected = document.querySelector('.quiz-answers input[name="ansRadio"]:checked').parentElement.children[1]
        if (answer_selected.textContent == correct_answ && difficulty_selected.value == 'easy') {
            score += 5
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce acertou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
          
        } else if(answer_selected.textContent == correct_answ && difficulty_selected.value == 'medium') {
            score += 8
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce acertou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
        } else if(answer_selected.textContent == correct_answ && difficulty_selected.value == 'hard') {
            score += 10
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce acertou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
        } else if(answer_selected.textContent != correct_answ && difficulty_selected.value == 'easy') {  
            score -= 5
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce errou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
            chances -= 1
        } else if(answer_selected.textContent != correct_answ && difficulty_selected.value == 'medium') {
            score -= 8
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce errou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
           chances -= 1 
        } else if(answer_selected.textContent != correct_answ && difficulty_selected.value == 'hard') {
            score -= 10
            elements.scoreboard_area.score_area.innerHTML = `${score}`
            alert("voce errou!!!. Seu score é:" + score  + " Suas chances são:" + chances)
            chances -= 1
        }
        elements.functions.novaPergunta()
    }
})

