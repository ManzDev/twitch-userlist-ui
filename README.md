# UserList UI

Interfaz de usuario para ver los usuarios que se han pasado por el chat de Twitch.

![UserList UI](userlist-ui.png)

## Endpoints

Ten en cuenta que los endpoints de backend no están incluidos en este repo.

- `/api/datausers/` Devuelve un JSON con información del stream. Usado en `modules/getDataUsers.js`.

```js
{
  "manzdev": {
    /* userinfo */
  },
  "username2": {
    /* userinfo */
  },
  /* ... */
}
```

- `/api/userinfo/:username` Devuelve la información del usuario. Usado en `modules/getUserInfo.js`.

```js
{
  "events": [
    { "type": "join", "time": "2023-10-12T17:25:14.867Z" },   // Entrada al chat
    { "type": "part", "time": "2023-10-12T18:13:48.247Z" },   // Salida del chat
    // ...
  ],
  "isBot": false
  "isFriendlyBot": false,
  "monthsSub": 10,
  "messages": 200,
  "name": "ManzDev",
  "picture": "https://static-cdn.jtvnw.net/jtv_user_pictures/86bd7a3b-b42f-4463-a428-e3f8d0614208-profile_image-70x70.png",
}
```

- `/api/badge/:months` Redirige a la URL de la imagen del badge de suscriptor de twitch en el número de `months` indicado.

## Components

- `UserList.js` El componente que contiene la información de la lista de usuarios
- `UserInfo.js` El componente de cada uno de los items de la lista de usuarios
