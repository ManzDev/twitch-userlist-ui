import styles from "./UserList.css?inline";
import { getDataUsers } from "@/modules/getDataUsers.js";
import { debounce } from "@/modules/debounce.js";
import SyncIcon from "@/assets/icons/sync.svg?raw";
import "./UserInfo.js";

const INTERVAL_SYNC = 2 * 60_000;

class UserList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return styles;
  }

  query(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  async connectedCallback() {
    await this.render();
    await this.syncData();
    this.renderUsers(this.users);
    this.updateCounters();

    // Listeners
    this.query("input.filter").addEventListener("input", debounce(() => this.filter(), 400));
    this.query("button.sync").addEventListener("click", () => this.syncData());

    // Timers
    setInterval(() => this.syncData(), INTERVAL_SYNC);
  }

  async syncData() {
    const syncButton = this.query("button.sync");
    syncButton.setAttribute("disabled", "");
    this.users = await getDataUsers();
    this.renderUsers(this.users);
    this.filter();
    syncButton.removeAttribute("disabled");
  }

  filter() {
    const input = this.query("input.filter");
    const filteredUsers = this.users.filter(user => user.username.includes(input.value));
    const allSources = this.shadowRoot.querySelectorAll(".userlist user-info");
    allSources.forEach(row => row.setAttribute("hidden", ""));
    filteredUsers.forEach(user => user.source.removeAttribute("hidden"));
  }

  getUsers(users) {
    const elements = users.map(userInfo => {
      const html = document.createElement("user-info");

      const data = {
        name: userInfo.name ?? "",
        username: userInfo.username,
        messages: userInfo.messages,
        isBot: userInfo.isBot,
        isFriendlyBot: userInfo.isFriendlyBot,
        monthsSub: userInfo.monthsSub ?? "",
        picture: userInfo.picture ?? "",
        isLive: userInfo.isLive
      };

      html.setData(data);
      userInfo.source = html;
      return html;
    });
    return elements;
  }

  emptyUserList() {
    const users = this.shadowRoot.querySelectorAll(".userlist user-info");
    users.forEach(userInfo => userInfo.remove());
  }

  renderUsers(users) {
    this.activeUsers = users.filter(user => user.isLive).length;
    this.emptyUserList();
    this.query(".userlist").append(...this.getUsers(users));
  }

  updateCounters() {
    this.query(".total-users.badge").textContent = this.users.length;
    this.query(".active-users.badge").textContent = this.activeUsers;
  }

  async render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${UserList.styles}</style>
    <div class="container">
      <header>
        <h1>Viewers de Manz.dev <button class="sync">${SyncIcon}</button></h1>
        <div class="bar">
          <h2>Usuarios del chat <span class="total-users badge"></span></h2>
          <h2>Usuarios activos <span class="active-users badge"></span></h2>

          <search>
            <input class="filter" type="text" placeholder="Escribe el username...">
          </search>
        </div>
      </header>

      <div class="userlist">
      </div>

    </div>`;
  }
}

customElements.define("user-list", UserList);
