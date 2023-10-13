import styles from "./UserInfo.css?inline";
import MessageIcon from "@/assets/icons/message.svg?raw";
import BotIcon from "@/assets/icons/bot.svg?raw";
import FriendlyBotIcon from "@/assets/icons/friendly-bot.svg?raw";
import DEFAULT_AVATAR from "@/assets/icons/default-avatar.svg?inline";
import { getUserInfo } from "@/modules/getUserInfo.js";

const API_BADGE_URL = "http://localhost:9999/api/badge/";

class UserInfo extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get styles() {
    return styles;
  }

  setData({ username, name, picture, messages, isBot, isFriendlyBot, monthsSub, events }) {
    this.username = username;
    this.name = name || "Loading...";
    this.picture = picture || DEFAULT_AVATAR;
    this.messages = messages ?? 0;
    this.isBot = isBot ?? false;
    this.isFriendlyBot = isFriendlyBot ?? false;
    this.monthsSub = monthsSub ?? 0;
    this.isLive = events?.at(-1)?.type !== "part" ?? false;
  }

  async manualUpdateData() {
    const data = await getUserInfo(this.username);
    this.setData({ ...data, username: this.username });
    this.renderData();
    this.removeAttribute("loading");
  }

  handleUnknownUser() {
    this.setAttribute("loading", "");
    const handleIntersection = ([{ isIntersecting }], observer) => {
      isIntersecting && this.manualUpdateData();
    };
    const options = { root: this.parentElement, rootMargin: "0px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(this);
  }

  connectedCallback() {
    !this.picture && this.handleUnknownUser();
    this.render();
    const img = this.shadowRoot.querySelector(".picture");
    img.addEventListener("error", () => (img.src = DEFAULT_AVATAR));
    this.renderData();
  }

  renderData() {
    this.setText(".name", this.name);
    this.setText(".username", `@${this.username}`);
    this.setImage(".picture", this.picture, this.username);
    this.setHTML(".info .badge.icon", this.renderBadge());
    this.setHTML(".info .bot", this.getBotType());
    this.setHTML(".info .message.icon", `${MessageIcon}<span>${this.messages}</span>`);
  }

  getBotType() {
    if (this.isBot) {
      return BotIcon;
    } else if (this.isFriendlyBot) {
      return FriendlyBotIcon;
    } else {
      return "";
    }
  }

  renderBadge() {
    if (this.monthsSub > 0) {
      return /* html */`<img src="${API_BADGE_URL + this.monthsSub}" alt="Badge" title="${this.monthsSub} mes(es)">`;
    }
    return "";
  }

  setText(selector, value) {
    this.shadowRoot.querySelector(selector).textContent = value;
  }

  setHTML(selector, value) {
    const element = this.shadowRoot.querySelector(selector);
    element.innerHTML = ""; // * TO DO: Revisar HTML y eliminar (sin leaks de memoria)
    element.insertAdjacentHTML("beforeend", value);
  }

  addHTML(selector, value) {
    this.shadowRoot.querySelector(selector).insertAdjacentHTML("beforeend", value);
  }

  setImage(selector, source, text) {
    const image = this.shadowRoot.querySelector(selector);
    image.setAttribute("src", source);
    image.setAttribute("alt", text);
  }

  render() {
    this.shadowRoot.innerHTML = /* html */`
    <style>${UserInfo.styles}</style>
    <div class="container">
      <div class="avatar">
        <img class="picture">
        <div class="dot live"></div>
      </div>
      <div class="name-container">
        <div class="name"></div>
        <div class="username"></div>
      </div>
      <div class="info">
        <div class="bot icon"></div>
        <div class="badge icon"></div>
        <div class="message icon"></div>
      </div>
    </div>`;
  }
}

customElements.define("user-info", UserInfo);
