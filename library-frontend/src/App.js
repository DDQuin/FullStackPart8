import { useState } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
import Recommendations from "./components/Recommendation";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const resultAuthor = useQuery(ALL_AUTHORS);
  const resultBook = useQuery(ALL_BOOKS);
  const [errorMessage, setErrorMessage] = useState(null);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  if (!resultAuthor.data || !resultBook.data) {
    return <div></div>;
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && (
          <>
            <button onClick={() => setPage("add")}>add book</button>{" "}
            <button onClick={() => setPage("recommend")}>recommend</button>{" "}
            <button onClick={logout}>logout</button>
          </>
        )}
      </div>

      <Authors
        show={page === "authors"}
        authors={resultAuthor.data.allAuthors}
        setError={notify}
      />

      <Books
        show={page === "books"}
        books={resultBook.data.allBooks}
        setError={notify}
      />

      <NewBook show={page === "add"} setError={notify} />
      <LoginForm
        show={page === "login"}
        setError={notify}
        setToken={setToken}
      />
      <Recommendations
        show={page === "recommend"}
        books={resultBook.data.allBooks}
      />
    </div>
  );
};

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export default App;
