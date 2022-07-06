import { useQuery } from "@apollo/client";

import { USER } from "../queries";

const Recommendations = (props) => {
  const result = useQuery(USER);
  if (!props.show || !result.data.me) {
    return null;
  }

  const favGenre = result.data.me.favouriteGenre;

  let books = [...props.books];
  books = books.filter((b) => b.genres.includes(favGenre));
  return (
    <div>
      <h2>recommendations</h2>
      books in your favourite genre {favGenre}
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
    </div>
  );
};

export default Recommendations;
