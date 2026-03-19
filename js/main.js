// Do your work here...
const BOOKSHELF_STORAGE_KEY = 'BOOKSHELF';
const bookshelf = [];
const RENDER_EVENT = 'RENDER_EVENT';
const RENDER_FINDINGS_EVENT = 'RENDER_FINDINGS_EVENT';

function generateID() {
    return Number(new Date);
}

function isStorageExist() {
    return (typeof Storage !== 'undefined');
}

function createBookObject(id, title, author, year, isComplete) {
    return {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
    };
}

function saveData() {
    if (isStorageExist()) {
        const bookshelfParsed = JSON.stringify(bookshelf);
        localStorage.setItem(BOOKSHELF_STORAGE_KEY, bookshelfParsed);        
    }    
}

function addBook() {
    const bookID = generateID();
    const bookTitle = document.getElementById('bookFormTitle').value.trim();
    const bookAuthor = document.getElementById('bookFormAuthor').value.trim();
    const bookYear = Number(document.getElementById('bookFormYear').value);
    const bookIsComplete = document.getElementById('bookFormIsComplete').checked;

    const bookObject = createBookObject(bookID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    bookshelf.push(bookObject);
    
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
    return bookshelf.findIndex((book) => book.id === bookId);
}

function deleteBook(bookId) {
    const targetBookIndex = findBookIndex(bookId);
    
    if (targetBookIndex === -1) {
        return;
    }

    bookshelf.splice(targetBookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function doneReadBook(bookObject) {
    if (bookObject === null) {
        return;
    }

    bookObject.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoneReadBook(bookObject) {
    if (bookObject === null) {
        return;
    }

    bookObject.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    return bookshelf.find((book) => book.id === bookId);
}

function editBook(bookId) {
    const bookObject = findBook(bookId);
    const editTitle = document.getElementById('editBookFormTitle');
    const editAuthor = document.getElementById('editBookFormAuthor');
    const editYear = document.getElementById('editBookFormYear');

    bookObject.title = editTitle.value.trim();
    bookObject.author = editAuthor.value.trim();
    bookObject.year = Number(editYear.value);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeDialog(bookObject) {
    const editID = document.getElementById('editBookFormID');
    editID.value = bookObject.id;

    const editTitle = document.getElementById('editBookFormTitle');
    editTitle.value = bookObject.title;

    const editAuthor = document.getElementById('editBookFormAuthor');
    editAuthor.value = bookObject.author;

    const editYear = document.getElementById('editBookFormYear');
    editYear.value = bookObject.year;
}

function makeBookElement(bookObject) {
    const container = document.createElement('div');
    container.setAttribute('data-bookid', bookObject.id);
    container.setAttribute('data-testid', 'bookItem');
    
    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.innerText = bookObject.title;
    container.append(bookTitle);

    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.innerText = bookObject.author;
    container.append(bookAuthor);

    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.innerText = bookObject.year;
    container.append(bookYear);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');
    
    const doneButton = document.createElement('button');
    doneButton.classList.add('done-button');
    doneButton.setAttribute('data-testid', 'bookItemIsCompleteButton');

    if (bookObject.isComplete) {
        doneButton.innerText = 'Belum selesai dibaca';
        doneButton.addEventListener('click', () => {
            undoneReadBook(bookObject)
        });
    } else {
        doneButton.innerText = 'Selesai dibaca';
        doneButton.addEventListener('click', () => {
            doneReadBook(bookObject);
        });
    }

    buttonsContainer.append(doneButton);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', () => {
        deleteBook(bookObject.id);
    });
    buttonsContainer.append(deleteButton);

    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit buku';
    editButton.dataset.bookId = bookObject.id;
    editButton.addEventListener('click', () => {
        const editDialog = document.getElementById('editBookDialog');;
        editDialog.dataset.bookId = editButton.dataset.bookId;
        makeDialog(bookObject);
        editDialog.showModal();
    });
    buttonsContainer.append(editButton);

    container.append(buttonsContainer);
    return container;
}

function manageEmptyList(incompleteBookList, completeBookList) {
    const emptyIncompleteBookList = document.getElementById('incompleteBookListNone');
    const emptyCompleteBookList = document.getElementById('completeBookListNone');
    if (incompleteBookList.innerHTML === '') {
        emptyIncompleteBookList.style.display = 'flex';
    } else {
        emptyIncompleteBookList.style.display = 'none';
    }
    
    if (completeBookList.innerHTML === '') {
        emptyCompleteBookList.style.display = 'flex';
    } else {
        emptyCompleteBookList.style.display = 'none';
    }
}

function manageEmptySearch(incompleteBookList, completeBookList) {
    const incompleteBookSection = document.getElementById('incompleteBookSection');
    const completeBookSection = document.getElementById('completeBookSection');
    if (incompleteBookList.innerHTML === '') {
        incompleteBookSection.style.display = 'none';
    } else {
        incompleteBookSection.style.display = 'flex';
    }
    
    if (completeBookList.innerHTML === '') {
        completeBookSection.style.display = 'none';
    } else {
        completeBookSection.style.display = 'flex';
    }

    const cantFindBookSection = document.getElementById('cantFindBookSection');
    if (incompleteBookList.innerHTML === '' && completeBookList.innerHTML === '') {
        cantFindBookSection.style.display = 'flex';
    } else {
        cantFindBookSection.style.display = 'none';
    }
}   

function renderBookItems(bookList, manageEmptyFunction) {    
    const incompleteBookList = document.getElementById('incompleteBookList');
    incompleteBookList.innerHTML = '';

    const completeBookList = document.getElementById('completeBookList');
    completeBookList.innerHTML = '';

    for (const book of bookList) {
        const bookElement = makeBookElement(book);
        if (book.isComplete) {
            if (completeBookList.innerHTML !== '') {
                const hr = document.createElement('hr');
                completeBookList.append(hr);
            }
            completeBookList.append(bookElement);
        } else {
            if (incompleteBookList.innerHTML != '') {
                const hr = document.createElement('hr');
                incompleteBookList.append(hr);
            }
            incompleteBookList.append(bookElement);
        }
    }

    manageEmptyFunction(incompleteBookList, completeBookList);
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKSHELF_STORAGE_KEY)
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            bookshelf.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBookList(bookName) {
    return bookshelf.filter((book) => book.title.toLowerCase().includes(bookName.toLowerCase()));
}

function searchBook() {
    const searchBookTitle = document.getElementById('searchBookTitle').value;
    if (searchBookTitle.length !== 0) {
        const bookFindingsList = searchBookList(searchBookTitle); 
        document.dispatchEvent(new CustomEvent(RENDER_FINDINGS_EVENT, { detail: bookFindingsList }));
    } else {
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function resetSearch() {   
    document.dispatchEvent(new Event(RENDER_EVENT));
    
    const incompleteBookSection = document.getElementById('incompleteBookSection');
    const completeBookSection = document.getElementById('completeBookSection');

    incompleteBookSection.style.display = 'flex';
    completeBookSection.style.display = 'flex';

    const cantFindBookSection = document.getElementById('cantFindBookSection');
    cantFindBookSection.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener(RENDER_EVENT, () => {
        renderBookItems(bookshelf, manageEmptyList);
    });

    document.addEventListener(RENDER_FINDINGS_EVENT, (event) => {
        renderBookItems(event.detail, manageEmptySearch);
    });
    
    if (isStorageExist) {
        loadDataFromStorage();
    }

    const addForm = document.getElementById('bookForm');
    addForm.addEventListener('submit', () => {
        addBook(); 
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        searchBook();   
    });

    const searchInput = document.getElementById('searchBookTitle');
    searchInput.addEventListener('input', (event) => {
        if (event.target.value.length === 0) {
            resetSearch();
        }
    });

    const editDialog = document.getElementById('editBookDialog');
    
    const editForm = document.getElementById('editBookForm');
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const bookId = Number(editDialog.dataset.bookId)
        editBook(bookId);   
        editDialog.close();
    });
    
    const cancelEditButton = document.getElementById('cancelEditBook');
    cancelEditButton.addEventListener('click', () => {
        editDialog.close();
    });
});