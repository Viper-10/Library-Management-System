const BOOKS_PER_PAGE = 10;
let books = [];
let filteredBooks = [];
let currentPage = 0;
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");

(async function runOnlyOnce() {
  addEventListeners();
  await loadAllBooksFromServer();
  addBooksToTable();
})();

const getBookMarkup = (book) =>
  `<tr>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.subject}</td>
        <td>${book["published-date"]}</td>
    </tr>
`;

const updateTableFooter = () => {
  // TODO:
  //     const pageSpan = document.querySelector(".page-number");
  //     pageSpan.textContent = `${currPage + 1}/${lastPage + 1}`;
  //   })();

  if (currentPage === 0) {
    prevButton.disabled = true;
  } else if (currentPage >= Math.ceil(filteredBooks.length / BOOKS_PER_PAGE)) {
    nextButton.disabled = true;
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
  }
};

function addBooksToTable() {
  const totalBooks = filteredBooks.length;
  const tbodyDiv = document.querySelector("tbody");
  let output = "";
  for (
    let i = 0;
    i < BOOKS_PER_PAGE && currentPage * BOOKS_PER_PAGE + i < totalBooks;
    ++i
  ) {
    const book = books[currentPage * BOOKS_PER_PAGE + i];

    output += getBookMarkup(book);
  }

  tbodyDiv.innerHTML = output;

  updateTableFooter();
}

async function loadAllBooksFromServer() {
  // imitating accessing data from backend server by storing it in json file.
  // We provide the output in pages. However we load data only once from the server to keep it simple

  const response = await fetch("./books.json");
  books = await response.json();
  filteredBooks = [...books];
}

function addEventListeners() {
  prevButton.addEventListener("click", () => {
    currentPage -= 1;
    addBooksToTable();
  });

  nextButton.addEventListener("click", () => {
    currentPage += 1;
    addBooksToTable();
  });
}
