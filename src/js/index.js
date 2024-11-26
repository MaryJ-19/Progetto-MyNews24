import "../../styles/scss/style.scss";
import axios from "axios";
import get from "lodash/get";

let currentIndex = 0;
let batchSize = 10;
let allData = [];

function getNews() {
  axios
    .get(process.env.HN_NEW_STORIES_API)
    .then((response) => {
      allData = response.data;
      let storyId = allData.slice(currentIndex, batchSize);
      currentIndex += batchSize;
      getNewsData(storyId);
    })
    .catch((error) => {
      console.error("Errore:", error.message);
    });
}
getNews();

function getNewsData(storyId) {
  const requests = storyId.map((id) => 
    axios.get(`${process.env.HN_STORY_ITEM_API}/${id}.json`)
  );

  Promise.all(requests)
    .then((storyData) => {
      storyData.forEach((response) => {
        let story = response.data;
        let storyTitle = get(story, "title", "Titolo non disponibile");;
        let storyUrl = get(story, "url", "#");
        let storyAuthor = get(story, "by", "Anonimo");
        let storyTimestamp = get(story, "time", 0);
        let storyDate = new Date(storyTimestamp * 1000);

        createCard(storyTitle, storyUrl, storyDate, storyAuthor);
      });
    })
    .catch((error) => {
      console.error('Errore nel caricare le storie:', error);
    });
}
 
function createCard(storyTitle, storyUrl, storyDate, storyAuthor) {
  let card = document.createElement("div");
  card.className = "card col-12 col-lg-5 mb-3 px-0";

  let cardImg = document.createElement("img")
  cardImg.className = "card-img-top my-2"
  cardImg.setAttribute("src", `${process.env.PICSUM_IMG_API}=${Math.floor(Math.random() * 20) + 1}"`)

  let cardBody = document.createElement("div");
  cardBody.className = "card-body";

  let cardAuthor = document.createElement("div");
  cardAuthor.className = "card-author text-uppercase";
  cardAuthor.textContent = storyAuthor;

  let cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.textContent = storyTitle;

  let cardDate = document.createElement("p");
  cardDate.className = "card-date";
  cardDate.textContent =
    storyDate.getDate() +
    "/" +
    (storyDate.getMonth() + 1) +
    "/" +
    storyDate.getFullYear() +
    " - " +
    storyDate.getHours() +
    ":" +
    storyDate.getMinutes() +
    ":" +
    storyDate.getSeconds();

  let cardLink = document.createElement("a");
  cardLink.className = "btn btn-primary";
  cardLink.setAttribute("href", storyUrl);
  cardLink.setAttribute("target", "_blank");
  cardLink.textContent = "Vai al sito";

  cardBody.appendChild(cardImg);
  cardBody.appendChild(cardAuthor);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardDate);
  cardBody.appendChild(cardLink);

  card.appendChild(cardBody);
  document.querySelector(".cards-wrapper").appendChild(card);
}

let loadMore = document.querySelector(".load-more");
loadMore.addEventListener("click", getMoreNews);

function getMoreNews() {
  if (currentIndex < allData.length) {
    let storyId = allData.slice(currentIndex, currentIndex + batchSize);
    currentIndex += batchSize; 
    getNewsData(storyId);
  } else {
    console.log("Non ci sono più notizie da caricare");
  }
}