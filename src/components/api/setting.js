import { API_URL, client } from "./api";

export async function resetSnippingAPI() {
    try {
     await client.post(`${API_URL}/setting/resetSnipping`);
    } catch (err) {
      console.log(err);
    }
}

export async function initSnippingAPI() {
  try {
     await client.post(`${API_URL}/setting/initSnipping`);
  } catch (err) {
    console.log(err);
  }
}

export async function resetAllAPI() {
  try {
    await client.post(`${API_URL}/setting/resetAll`);;
  } catch (err) {
    console.log(err);
  }
}



