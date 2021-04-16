import books from './books.js';
import {nanoid} from 'nanoid';
import {responseError, responseFail, responseSuccess} from './handlerResponse.js';

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

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

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  const nameLower = name ? name.toLowerCase() : undefined;

  const hasName = books.filter((book) => book.name.toLowerCase().includes(nameLower));
  const isRead = books.filter((book) => book.reading == reading);
  const isFinish = books.filter((book) => book.finished == finished);
  console.log(hasName);

  const getData = (data) => ({
    books: data.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),
  });

  if (name) {
    const data = getData(hasName);
    return responseSuccess(h, 200, undefined, data);
  }

  if (reading) {
    const data = getData(isRead);
    return responseSuccess(h, 200, undefined, data);
  }

  if (finished) {
    const data = getData(isFinish);
    return responseSuccess(h, 200, undefined, data);
  }

  const data = getData(books);
  return responseSuccess(h, 200, undefined, data);
};

const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const findBook = books.find((book) => book.id === bookId);
  if (findBook) {
    return responseSuccess(h, 200, undefined, {book: findBook});
  }

  return responseFail(h, 404, 'Buku tidak ditemukan');
};

const editBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const found = books.findIndex((book) => book.id === bookId);
  if (found !== -1) {
    if (!name) {
      return responseFail(h, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
    }

    if (readPage > pageCount) {
      return responseFail(h, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    }

    books[found] = {
      ...books[found],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return responseSuccess(h, 200, 'Buku berhasil diperbarui', undefined);
  }

  return responseFail(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const found = books.findIndex((book) => book.id === bookId);
  if (found !== -1) {
    books.splice(found);

    return responseSuccess(h, 200, 'Buku berhasil dihapus');
  }

  return responseFail(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');
};

export {
  addBookHandler, getAllBooksHandler, getBookByIdHandler
  , editBookByIdHandler, deleteBookByIdHandler,
};
