import { useState } from "react";

const Books = (props) => {
  const [genreSelected, setGenre] = useState("");
  if (!props.show) {
    return null;
  }

  let books = [...props.books];
  if (genreSelected !== "") {
    books = books.filter((b) => b.genres.includes(genreSelected));
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
