import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./Display.css";
import { MDBDataTable } from "mdbreact";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import CONFIG from "./constant/config";
import {
  startSnipping,
  stopSnipping,
  getSnippingStatus,
  listSnipping,
  loadBalance,
  buyCoin,
  sellCoin
} from "./api";

const Snipping = () => {
  const client = new W3CWebSocket("ws://localhost:8080/connect");

  var transactionItems = [];

  const [isRunning, setIsRunning] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [balance, setBalance] = useState("");
  const [transactions, setTransactions] = useState([]);

  var rows = transactions.map((item) => {
    item.title = (
      <div>
        <a href={item.url} target="_blank">
          {item.title}
        </a>
      </div>
    );
    item.action = (
      <div className="btnGroup">
        <Button variant={"success"} className="buyBtn" onClick={() => buyCoin(1, item.coin, apiKey, secretKey)}>
          {" "}
          10%
        </Button>
        <Button variant={"success"} className="buyBtn" onClick={() => buyCoin(2, item.coin, apiKey, secretKey)}>
          {" "}
          25%{" "}
        </Button>
        <Button variant={"success"} className="buyBtn" onClick={() => buyCoin(3, item.coin, apiKey, secretKey)}>
          50%{" "}
        </Button>
        <Button variant={"success"} className="buyBtn" onClick={() => buyCoin(4, item.coin, apiKey, secretKey)}>
          100%{" "}
        </Button>
        <br />
        <Button
          variant={"danger"}
          className="sellBtn"
          id="button-addon2"
          onClick={() => sellCoin(1, item.coin, apiKey, secretKey)}
        >
          {" "}
          10%
        </Button>
        <Button
          variant={"danger"}
          className="sellBtn"
          id="button-addon2"
          onClick={() => sellCoin(2, item.coin, apiKey, secretKey)}
        >
          {" "}
          25%{" "}
        </Button>
        <Button
          variant={"danger"}
          className="sellBtn"
          id="button-addon2"
          onClick={() => sellCoin(3, item.coin, apiKey, secretKey)}
        >
          50%{" "}
        </Button>
        <Button
          variant={"danger"}
          className="sellBtn"
          id="button-addon2"
          onClick={() => sellCoin(4, item.coin, apiKey, secretKey)}
        >
          100%{" "}
        </Button>
      </div>
    );

    return item;
  });

  const data = {
    columns: [
      {
        label: "Time",
        field: "timestamp",
      },
      {
        label: "Title",
        field: "title",
      },

      {
        label: "Coin",
        field: "coin",
      },
      {
        label: "Action",
        field: "action",
      },
    ],
    rows: rows,
  };

  const buy = () => {
    console.log("buy");
  };

  const sell = () => {
    console.log("sell");
  };

  const start = () => {
    if (apiKey == "" || secretKey == "") {
      alert("please input all information to start the snipping !");
    } else {
      setIsRunning(true);
      startSnipping(apiKey, secretKey);
    }
  };

  const stop = () => {
    setIsRunning(false);
    stopSnipping();
  };

  const loadSetting = (status) => {
    setApiKey(status.api);
    setSecretKey(status.secret);
    loadBalanceInformation(status.api, status.secret)
  };

  const setStatus = async () => {
    var curStatus = await getSnippingStatus();
    loadSetting(curStatus);
    if (curStatus.status === "1") setIsRunning(true);
    else setIsRunning(false);
  };

  const listTransactions = async () => {
    console.log("listTransactions");
    transactionItems = await listSnipping();
    const filteredData = transactionItems
      .sort((a, b) => b.id - a.id) // sort by timestamp in descending order
    setTransactions(filteredData);
    console.log(transactions);
  };

  const loadBalanceInformation = async (api, secret) => {
    const balance = await loadBalance(api, secret);
    setBalance("$" + balance)
  }

  useEffect(() => {
    setStatus();
    listTransactions();
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      if (message.data.includes("snipping")) listTransactions();
      if (message.data.includes("setting")) {
        setStatus();
        listTransactions();
      }
    };
  }, []);

  return (
    <div>
      <div className="form-group">
        <label htmlFor="balance">Balance: </label>
        <input
          disabled
          type="text"
          id="balance"
          className="balance-input"
          value={balance}
        />
        <label htmlFor="pwd">API Key: </label>
        <input
          type="password"
          id="apiKey"
          className="short-input"
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
          }}
        />
        <label htmlFor="pwd">Secret Key: </label>
        <input
          type="password"
          id="secretKey"
          className="short-input"
          value={secretKey}
          onChange={(e) => {
            setSecretKey(e.target.value);
          }}
        />
        <Button
          variant={isRunning ? "danger" : "primary"}
          className="startBtn"
          id="button-addon2"
          onClick={isRunning ? () => stop() : () => start()}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </Button>
      </div>

      <MDBDataTable hover data={data} />
    </div>
  );
};

export default Snipping;
