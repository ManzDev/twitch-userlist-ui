const API_URL = "http://localhost:9999/api/userinfo/";

export const getUserInfo = async (username) => {
  const response = await fetch(API_URL + username);
  const data = await response.json();
  return data;
};
