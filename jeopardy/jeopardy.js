// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let data = [];
let board = [];
const HEIGHT = 5;
const WIDTH = 6;
const htmlBoard = document.querySelector('#board');

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    // randomly choose 6 ids and return as an Array
    let id = [];
    const res = await axios.get('http://jservice.io/api/categories?count=100');
    let nums = res.data.length;
    for (let i = 0; i < WIDTH; i++) {
        let randomIdx = Math.floor(Math.random(0, 1) * nums);
        if (!id.includes(res.data[randomIdx].id)) {
            id.push(res.data[randomIdx].id);
        }
    }
    return id;
}


async function getData(catId) {
    const res = await axios.get(`http://jservice.io/api/category?id=${catId}`);
    console.log(res);
    let title = res.data.title;

    let obj = {}
    let clues = []
    for (let j = 0; j < HEIGHT; j++) {
        clues.push(
            {
                question: res.data.clues[j].question,
                answer: res.data.clues[j].answer,
                show: null
            })
    }
    obj = {
        title: title,
        clues: clues
    }
    data.push(obj);

    console.log(data);
    return data;

}


/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    console.log("evt.target.getAttribute('show')=" + evt.target.getAttribute('show') == null);
    if ( evt.target.getAttribute('show') == "null") {
        let idxCat = parseInt(evt.target.getAttribute('clues'));
        let idxClues = parseInt(evt.target.parentElement.getAttribute('catNum'));
        evt.target.innerText = data[idxCat - 1].clues[idxClues - 1].question;
        evt.target.setAttribute('show', "question");
    }else if (evt.target.getAttribute('show')=== "question") {
        let idxCat = parseInt(evt.target.getAttribute('clues'));
        let idxClues = parseInt(evt.target.parentElement.getAttribute('catNum'));
        evt.target.innerText = data[idxCat - 1].clues[idxClues - 1].answer;
        evt.target.setAttribute('show', "answer");
    }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

// function showLoadingView() {

// }

// /** Remove the loading spinner and update the button used to fetch data. */

// function hideLoadingView() {

// }

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    data = [];
    let ids = await getCategoryIds();
    for (let i = 0; i < WIDTH; i++) {
        await getData(ids[i]);
    }
    console.log("setupAndStart" + data);

}

function makeBoard(height, width) {
    for (let i = 0; i < height; i++) {
        // board.push(new Array(width));
        board.push(Array.from({ length: width }));
    }
    console.log(board);
}


async function makeHtmlBoard() {
    let num = 0;
    let trTop = document.createElement('tr');
    trTop.setAttribute('id', top);
    for (let i = 0; i < data.length; i++) {
        let tdTop = document.createElement('td');
        tdTop.innerText = data[i].title;
        trTop.append(tdTop);
        htmlBoard.append(trTop);
    }
    for (let i = 0; i < HEIGHT; i++) {
        num++
        let dataNum = 0;
        let tr = document.createElement('tr');
        tr.setAttribute('catNum', num);
        htmlBoard.append(tr);
        for (let i = 0; i < WIDTH; i++) {
            dataNum++
            let td = document.createElement('td');
            td.classList = "click";
            td.setAttribute('clues', dataNum);
            td.setAttribute('show', null);
            td.innerText = "?";
            tr.append(td);
        }
    }
    // console.log(htmlBoard);
}


/** On click of start / restart button, set up game. */

// TODO
$('#restart').on('click', async function () {
    await setupAndStart();
    $('#board').empty();
    makeBoard(HEIGHT, WIDTH);
    makeHtmlBoard();
})


const selectCell = document.querySelectorAll('.click');

$('#board').on('click', async function (e) {
    handleClick(e);
    console.log(e.target);
})
/** On page load, add event handler for clicking clues */

// TODO

async function start() {
    await setupAndStart();
    $('#board').empty();
    makeBoard(HEIGHT, WIDTH);
    makeHtmlBoard();
}

start(); 
