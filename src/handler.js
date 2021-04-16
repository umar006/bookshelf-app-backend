import books from './books.js';
import {nanoid} from 'nanoid';
import {responseError, responseFail, responseSuccess} from './handlerResponse.js';

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher
    , pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name && (readPage <= pageCount)) {
    books.push(newBook);

    return responseSuccess(h, 201, 'Buku berhasil ditambahkan', {bookId: id});
  }

  if (!name) {
    return responseFail(h, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
  }

  if (readPage > pageCount) {
    return responseFail(h, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
  }

  return responseError(h, 500, 'Buku gagal ditambahkan');
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books: books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  },
});

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const findBook = books.filter((book) => book.id === bookId)[0];
  console.log(findBook);
  if (findBook) {
    return responseSuccess(h, 200, undefined, {book: findBook});
  }

  return responseFail(h, 404, 'Buku tidak ditemukan');
};

export {addBookHandler, getAllBooksHandler, getBookByIdHandler};
