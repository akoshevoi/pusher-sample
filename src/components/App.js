import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Pusher from "pusher-js";
import "./styles.css";

const App = () => {
  const [pusherInstance, setPusherInstance] = useState();
  const [appState, setAppState] = useState({
    text: "",
    username: "",
    chats: [],
    channel: "",
  });

  const handleSelectChannel = ({ target }) => {
    setAppState({ ...appState, channel: target.value });
  };

  const handleTextChange = (event) => {
    if (event.keyCode === 13) {
      const payload = {
        username: appState.username,
        message: appState.text,
        channel: appState.channel,
      };
      axios.post("http://localhost:5000/message", payload);
    } else {
      setAppState({ ...appState, text: event.target.value });
    }
  };

  useEffect(() => {
    const username = window.prompt("Username", "John");
    setAppState({ ...appState, username });

    const pusher = new Pusher("d1b131a24f37362ce861", {
      cluster: "eu",
      authEndpoint: "http://localhost:5000/pusher/auth",
    });

    setPusherInstance(pusher);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!appState.channel) return;

    const channel = pusherInstance.subscribe(appState.channel);

    channel.bind("message", (data) => {
      setAppState((prevState) => ({
        ...prevState,
        chats: [...prevState.chats, { ...data, id: uuidv4() }],
        text: "",
      }));
    });
  }, [appState.channel]); // eslint-disable-line

  return (
    <div>
      <select onChange={handleSelectChannel}>
        <option value="chat-1">Chat 1</option>
        <option value="chat-2">Chat 2</option>
        <option value="chat-3">Chat 3</option>
      </select>
      <input
        onChange={handleTextChange}
        onKeyDown={handleTextChange}
        value={appState.text}
      />
      <div>
        {appState.chats.map(({ id, message, username }) => {
          return (
            <div
              key={id}
              className="message-container"
              style={{
                justifyContent:
                  username === appState.username ? "flex-end" : "flex-start",
              }}
            >
              <div
                className="message"
                style={{
                  background:
                    username === appState.username ? "#84b4ff" : "#ccc",
                }}
              >
                {message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
