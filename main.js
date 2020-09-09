// Lybrary variables
let storage = window.localStorage;
let myLibrary = storage.getItem('books') ? JSON.parse(storage.getItem('books')) : [ new Book('A Tale of Two Cities', 'Charles Dickens', '835', false), new Book('The Great Gatsby', 'F. Scott Fitzgerald', '218', true), new Book('The Player Piano', 'Kurt Vonnegut', '296', false)]
const submit = document.getElementById("submit");
const form = document.getElementById('bookForm');
const inputs = Array.from(form.elements);
let message = document.getElementById('verification');
let books = document.getElementsByClassName('card');

// Modal variables
const modal = document.getElementById("bookModal");
const btn = document.getElementById("addBook");
const span = document.getElementsByClassName("close")[0];

function firstRender() {
	JSON.parse(storage.getItem('books')).forEach(item => {
		render(item);
	})
}

function Book(title, author, pages, read) {
  // the constructor...
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

function addBookToLibrary(event) {
  // do stuff here
  let nBook = [];

  inputs.forEach(input => {
  	if (input.name === "read") {
		nBook.push(input.checked);
	}
  	nBook.push(input.value);
  })

  let added = new Book(...nBook)

  myLibrary.push(added);
  render(added);
  updateStorage();
}

function updateIndex() {
	Array.from(books).forEach((book, index) => {
		book.dataset.place = index;
	})
}

function changeStatus(tar, index) {
	if(myLibrary[index].read === true) {
		myLibrary[index].read = false;
		tar.textContent = '✘'
	} else {
		myLibrary[index].read = true;
		tar.textContent = '✔'
	}
	updateStorage();
}

function removeBook(event) {
	event.target.parentElement.remove();
	myLibrary.splice(event.target.parentElement.getAttribute('data-place'), 1);
	updateStorage();
}

function updateStorage() {
	updateIndex();
	storage.setItem('books', JSON.stringify(myLibrary));
}

function resetForm() {
	inputs.forEach(input => {
		if(input.type == 'checkbox') {
			input.checked = false;
		}
		input.value = '';
	})
	message.style.display = 'none';
}

function render(item) {
	let torender = myLibrary[myLibrary.length-1];
	let card = document.createElement('DIV');
	card.dataset.place = myLibrary.length-1;
	card.className = 'card';
	card.innerHTML = `<span class='delete'>&times;</span>
						<h2>${item.title}</h2>
						<p class='author'>${item.author}</p>
						<p>${item.pages} pages</p>
						<p>Read?</p>`;
	if(item.read == true) {
		card.innerHTML += `<span class='check'>&#10004;</span>`;
	} else {
		card.innerHTML += `<span class='check'>&#10008;</span>`;
	}
	document.getElementById('library').appendChild(card);
	updateIndex();
}

// Delete buttons and update status functionality
document.addEventListener('click', function(e) {
	if(e.target && e.target.className == 'delete') {
		removeBook(e);
	} else if(e.target && e.target.className == 'check') {
		changeStatus(e.target, e.target.parentElement.dataset.place)
	}
})

// updateStorage();
firstRender();

// Form submission
submit.addEventListener('click', () => {
	for(let i = 0; i < inputs.length-1; i++) {
		if(inputs[i].value == '') {
			message.style.display = 'block';
			return false;
		}
	}
	addBookToLibrary();
	modal.style.display = 'none'
	resetForm();
})

// Modal functionality
// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  resetForm();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    resetForm();
  }
}