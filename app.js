const BOOKS_PER_PAGE = 10;
let books = [];
let filteredBooks = [];
let currentPage = 0;
const prevButton = document.querySelector(".prev-button");
const radioChoices = document.getElementsByName("attribute");
const nextButton = document.querySelector(".next-button");
const searchInput = document.querySelector(".search-query-input");
const resultNumber = document.querySelector(".result-number");

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
    const book = filteredBooks[currentPage * BOOKS_PER_PAGE + i];

    output += getBookMarkup(book);
  }

  tbodyDiv.innerHTML = output;
  resultNumber.textContent = filteredBooks.length;

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

  searchInput.addEventListener("input", onSearchQuery);
}

function sortByTitle(asc) {
  function compare(a, b) {
    if (a.title < b.title === asc) {
      return -1;
    }
    if (a.title > b.title === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}
function sortByAuthor(asc) {
  function compare(a, b) {
    if (a.author < b.author === asc) {
      return -1;
    }
    if (a.author > b.author === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}
function sortBySubject(asc) {
  function compare(a, b) {
    if (a.subject < b.subject === asc) {
      return -1;
    }
    if (a.subject > b.subject === asc) {
      return 1;
    }
    return 0;
  }

  filteredBooks.sort(compare);
  addBooksToTable();
}

function onSearchQuery(e) {
  let atleastOneChecked = false;
  let attributeSelected = "";

  for (i = 0; i < radioChoices.length; i++) {
    if (radioChoices[i].checked) {
      atleastOneChecked = true;

      if (i == 0) {
        attributeSelected = "title";
      } else if (i == 1) attributeSelected = "author";
      else attributeSelected = "subject";

      break;
    }
  }

  if (atleastOneChecked === false) {
    alert(
      "You have to select appropriate radio button to search by that attribute"
    );
    return;
  }

  const query = e.target.value;

  filteredBooks = filteredBooks.filter((book) =>
    book[attributeSelected].toLowerCase().includes(query.toLowerCase())
  );

  if (query === "") {
    filteredBooks = [...books];
  }

  addBooksToTable();
}
