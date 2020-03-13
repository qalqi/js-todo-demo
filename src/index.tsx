// https://levelup.gitconnected.com/react-hooks-mobx-todolist-c138eb4f3d04
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./serviceWorker";
import { StoreProvider } from "./Helpers/StoreProvider";
import { TodoList } from "./Stores/TodoList";
import "semantic-ui-css/semantic.min.css";
import API from "@textile/textile";
import uuid from "uuid";
import queryString from "query-string";

registerServiceWorker();

let deviceId = '5GEm36BDFXkKNx9LbW9eX6zAFuwUVJbb9P5UnXaFg2XaoQ7i'
const parsed = queryString.parse(window.location.search);
if (!parsed.user) {
  const query = { user: deviceId };
  window.location.search = queryString.stringify(query);
} else {
    deviceId = parsed.user.toString();
}

new API({
  // Hard-coded for demo purposes
  token: "38fc999c-d621-4411-8263-49752bb6f340",
  deviceId
})
  .start()
  .then(api => {
    const todoList = new TodoList([], api.threadsConfig);

    //@ts-ignore - for debugging
    window.todoList = todoList;

    ReactDOM.render(
      <StoreProvider value={todoList}>
        <App />
      </StoreProvider>,
      document.getElementById("root")
    );
  });
