import { useState } from "react";
import { ALL_AUTHORS, BOOKS_GENRE, CREATE_BOOK } from "../queries";
import { ALL_BOOKS } from "../queries";
import { gql, useMutation } from "@apollo/client";

const NewBook = ({ show, setError }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
      { query: BOOKS_GENRE },
    ],

    update: (cache, response) => {
      cache.updateQuery({ query: BOOKS_GENRE }, ({ allBooks }) => {
        console.log(response, allBooks);

        return {
          allBooks: allBooks.concat(response.data.addBook),
        };
      });
    },

    onError: (error) => {
      setError(error.graphQLErrors[0]);
    },
  });

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const vars = {
      title: title,
      published: Number(published),
      author: author,
      genres: genres,
    };

    createBook({ variables: vars });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
