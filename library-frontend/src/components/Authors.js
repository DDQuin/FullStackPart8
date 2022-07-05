import { useState, useEffect } from "react";
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries";
import { gql, useMutation } from "@apollo/client";

const Authors = ({ show, authors, setError }) => {
  if (!show) {
    return null;
  }
  const authorsr = [...authors];

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authorsr.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditAuthor setError={setError} />
    </div>
  );
};

const EditAuthor = ({ setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState(0);
  const [editAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      console.log(error);
      setError(error.graphQLErrors[0]);
    },
  });
  const submit = async (event) => {
    event.preventDefault();
    const vars = {
      name: name,
      setBornTo: born,
    };

    editAuthor({ variables: vars });

    setName("");
    setBorn(0);
  };

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      setError("author not found");
    }
  }, [result.data]);

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
