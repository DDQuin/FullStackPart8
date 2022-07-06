import { useState } from "react";
import { BOOKS_GENRE, ALL_AUTHORS, ALL_BOOKS } from "../queries";
import { useQuery } from "@apollo/client";

const Books = (props) => {
  const [genreSelected, setGenre] = useState("");
  const { loading, error, data } = useQuery(BOOKS_GENRE, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    variables: { genre: genreSelected },
    onError: (error) => {
      props.setError(error.graphQLErrors[0]);
    },
  });

  if (!props.show) {
    return null;
  }

  let books = [...props.books];
  if (genreSelected !== "" && !loading) {
    books = data.allBooks;
  }
  return (
    <div>
      <h2>books</h2>
      {genreSelected && <span>in genre {genreSelected}</span>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenre("refactoring")}> refactoring</button>
      <button onClick={() => setGenre("agile")}> agile</button>
      <button onClick={() => setGenre("patterns")}> patterns</button>
      <button onClick={() => setGenre("design")}> design</button>
      <button onClick={() => setGenre("crime")}> crime</button>
      <button onClick={() => setGenre("classic")}> classic</button>
      <button onClick={() => setGenre("")}> all genres</button>
    </div>
  );
};

export default Books;
