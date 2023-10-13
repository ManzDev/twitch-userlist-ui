const API_URL = "http://localhost:9999/api/datausers/";

export const getDataUsers = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  const usernames = Object.keys(data);

  return usernames.map(username => ({
    ...data[username],
    username,
    isLive: data[username].events?.at(-1)?.type !== "part",
    messages: data[username].messages ?? 0
  }))
    .sort((a, b) => b.messages - a.messages);
};
