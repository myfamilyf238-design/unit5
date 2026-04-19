
let books = [];
// TOGGLE FORM
const addBooksection = document.querySelector('.add-book-section');
const toggleFormBtn = document.getElementById('toggle-form'); 

toggleFormBtn.addEventListener('click', () => {
  if (addBooksection.style.display === 'none') {
    addBooksection.style.display = 'block';
    toggleFormBtn.textContent = 'Hide Form';
  } else {
    addBooksection.style.display = 'none';
    toggleFormBtn.textContent = 'Add New Book';
  }
});
// SHOW FILE SIZE FOR E-BOOK
const typeSelect = document.getElementById('type');
const ebookDetails = document.getElementById('ebook-details');

typeSelect.addEventListener('change', () => {
  if (typeSelect.value === 'ebook') { 
    ebookDetails.style.display = 'block';
  } else {
    ebookDetails.style.display = 'none';
  }
});
// BOOK CLASS
class Book {
  constructor(title, author) {
    this.id = Date.now();
    this.title = title;
    this.author = author;
    this.type = 'physical';
    this.available = true;
    this.borrower = null;
  }

  borrow(borrowerName) {
    this.borrower = borrowerName;
    this.available = false;
  }

  markReturn() {
    this.borrower = null;
    this.available = true;
  }

  getHTML() {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    bookCard.setAttribute('data-id', this.id);

    const titleEl = document.createElement('h3');
    titleEl.classList.add('book-title');
    titleEl.textContent = this.title;
    bookCard.appendChild(titleEl);

    const authorEl = document.createElement('div');
    authorEl.classList.add('book-meta');
    authorEl.textContent = `Author: ${this.author}`;
    bookCard.appendChild(authorEl);

    const statusEl = document.createElement('div');
    statusEl.classList.add('book-meta');
    statusEl.textContent = this.available ? 'Status: Available' : `Status: Borrowed by ${this.borrower}`;
    bookCard.appendChild(statusEl);

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('book-actions');

    if (this.available) {
      const borrowBtn = document.createElement('button');
      borrowBtn.classList.add('btn', 'btn-borrow');
      borrowBtn.textContent = 'Borrow';
      actionsEl.appendChild(borrowBtn);
    } else {
      const returnBtn = document.createElement('button');
      returnBtn.classList.add('btn', 'btn-return');
      returnBtn.textContent = 'Return';
      actionsEl.appendChild(returnBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-remove');
    removeBtn.textContent = 'Remove';
    actionsEl.appendChild(removeBtn);

    bookCard.appendChild(actionsEl);
    return bookCard;
  }
}
// EBOOK CLASS
class Ebook extends Book {
  constructor(title, author, fileSize) {
    super(title, author);
    this.type = 'ebook';
    this.fileSize = fileSize;
  }

  borrow(borrowerName) {
    this.borrower = borrowerName;
  }

  markReturn() {
    this.borrower = null;
  }

  getHTML() {
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card', 'ebook');
    bookCard.setAttribute('data-id', this.id);

    const titleEl = document.createElement('h3');
    titleEl.classList.add('book-title');
    titleEl.textContent = this.title;
    bookCard.appendChild(titleEl);

    const authorEl = document.createElement('div');
    authorEl.classList.add('book-meta');
    authorEl.textContent = `Author: ${this.author}`;
    bookCard.appendChild(authorEl);

    const fileSizeEl = document.createElement('div');
    fileSizeEl.classList.add('book-meta');
    fileSizeEl.textContent = `File Size: ${this.fileSize} MB`;
    bookCard.appendChild(fileSizeEl);

    const statusEl = document.createElement('div');
    statusEl.classList.add('book-meta');
    statusEl.textContent = this.borrower ? `Downloaded by ${this.borrower}` : 'Status: Available';
    bookCard.appendChild(statusEl);

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('book-actions');

    if (!this.borrower) {
      const downloadBtn = document.createElement('button');
      downloadBtn.classList.add('btn', 'btn-borrow');
      downloadBtn.textContent = 'Download';
      actionsEl.appendChild(downloadBtn);
    } else {
      const returnBtn = document.createElement('button');
      returnBtn.classList.add('btn', 'btn-return');
      returnBtn.textContent = 'Return';
      actionsEl.appendChild(returnBtn);
    }

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('btn', 'btn-remove');
    removeBtn.textContent = 'Remove';
    actionsEl.appendChild(removeBtn);

    bookCard.appendChild(actionsEl);
    return bookCard;
  }
}

// DISPLAY BOOKS
const bookList = document.getElementById('book-list'); 

function displayBooks() {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.innerHTML = '<p>No Books Found</p>';
    return;
  }

  books.forEach(book => {
    const bookCard = book.getHTML();
    bookList.appendChild(bookCard);
  });

  attachEventListeners();
}

function attachEventListeners() {
  document.querySelectorAll('.btn-borrow').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookId = Number(e.target.closest('.book-card').dataset.id);
      const bookBorrower = prompt('Enter your name:');
      if (bookBorrower) {
        borrowBooks(bookId, bookBorrower);
      }
    });
  });

  document.querySelectorAll('.btn-return').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookId = Number(e.target.closest('.book-card').dataset.id);
      returnBooks(bookId);
    });
  });

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const confirmed = confirm('Are you sure you want to remove this book?');
      if (confirmed) {
        const bookId = Number(e.target.closest('.book-card').dataset.id);
        removeBooks(bookId);
      }
    });
  });
}
// BORROW FUNCTION
function borrowBooks(bookId, bookBorrower) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.borrow(bookBorrower);
    displayBooks();
    saveBooks();
  }
}
// RETURN FUNCTION
function returnBooks(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.markReturn();
    displayBooks();
    saveBooks();
  }
}
// REMOVE FUNCTION
function removeBooks(bookId) {
  books = books.filter(b => b.id!== bookId);
  displayBooks();
  saveBooks();
}
// SAVE TO LOCALSTORAGE
function saveBooks() {
  localStorage.setItem('booksArray', JSON.stringify(books));
}
// LOAD FROM LOCALSTORAGE
function loadBooks() {
  const storedBooks = localStorage.getItem('booksArray');
  if (storedBooks!== null) {
    const bookObjects = JSON.parse(storedBooks);
    
    books = bookObjects.map(obj => {
      let bookInstance;
      if (obj.type === 'ebook') {
        bookInstance = new Ebook(obj.title, obj.author, obj.fileSize);
      } else {
        bookInstance = new Book(obj.title, obj.author);
      }
      bookInstance.id = obj.id;
      bookInstance.available = obj.available;
      bookInstance.borrower = obj.borrower;
      return bookInstance;
    });
  }
}
//  FORM SUBMIT
const bookForm = document.getElementById('book-form');

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const type = document.getElementById('type').value;

  if (!title ||!author) return;

  let newBook;
  
  if (type === 'ebook') { 
    const fileSize = document.getElementById('file-size').value;
    newBook = new Ebook(title, author, fileSize);
  } else {
    newBook = new Book(title, author);
  }

  console.log(newBook);
  books.push(newBook);
  displayBooks();
  saveBooks();
  bookForm.reset();
  ebookDetails.style.display = 'none';
});
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  displayBooks();
});