import { errorMessage, createNotification, client } from "./api";

export async function startSnipping(apiKey, secretKey) {
  try {
    await client.post("bots/startSnipping", {
      apiKey: apiKey,
      secretKey: secretKey,
    });
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function stopSnipping() {
  try {
    await client.post("bots/stopSnipping");
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function getSnippingStatus() {
  try {
    let res = await client.get("bots/getSnippingStatus");
    let status = res.data.data[0];
    return status;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function loadBalance(apiKey, secretKey) {
  try {
    let res = await client.post("bots/getBalance", {
      apiKey: apiKey,
      secretKey: secretKey,
    });
    let balance = res.data.data;
    return balance;
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function buyCoin(mode, coin, apiKey, secretKey) {
  try {
    let res = await client.post("bots/buyCoin", {
      coin: coin,
      mode: mode,
      apiKey: apiKey,
      secretKey: secretKey
    });
    let message = res.data.message;
    createNotification("success", message);
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}

export async function sellCoin(mode, coin, apiKey, secretKey) {
  try {
    let res = await client.post("bots/sellCoin", {
      coin: coin,
      mode: mode,
      apiKey: apiKey,
      secretKey: secretKey
    });
    let message = res.data.message;
    createNotification("success", message);
  } catch (err) {
    createNotification("error", errorMessage(err));
  }
}
