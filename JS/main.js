/**
 * Project Configuration
 */
const CONFIG = {
  WEATHER: {
    API_KEY: "7d77b96c972b4d119a3151101212704",
    BASE_URL: "https://api.weatherapi.com/v1/forecast.json",
    DEFAULT_CITY: "Cairo",
    FORECAST_DAYS: 3
  },
  NEWS: {
    API_KEY: "18b0be64ee1842acb707c09995172518",
    BASE_URL: "https://newsapi.org/v2/top-headlines?sources=techcrunch",
    MAX_ARTICLES: 5
  },
  DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  MONTHS: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

/* --- Weather Logic (Home Page) --- */
async function getWeatherData(city) {
  if (!city) return;
  try {
    const response = await fetch(`${CONFIG.WEATHER.BASE_URL}?key=${CONFIG.WEATHER.API_KEY}&q=${city}&days=${CONFIG.WEATHER.FORECAST_DAYS}`);
    if (response.ok && response.status !== 400) {
      const data = await response.json();
      renderWeather(data);
    }
  } catch (error) { console.error("Weather error:", error); }
}

function renderWeather(data) {
  const container = document.getElementById("forecast");
  if (!container) return;

  const current = data.current;
  const location = data.location;
  const forecast = data.forecast.forecastday;
  const date = new Date(current.last_updated.replace(" ", "T"));

  // 1. Current Day
  let html = `
        <div class="today forecast">
            <div class="forecast-header">
                <div class="day">${CONFIG.DAYS[date.getDay()]}</div>
                <div class="date">${date.getDate()} ${CONFIG.MONTHS[date.getMonth()]}</div>
            </div>
            <div class="forecast-content">
                <div class="location">${location.name}</div>
                <div class="degree">
                    <div class="num">${current.temp_c}<sup>o</sup>C</div>
                    <div class="forecast-icon"><img src="https:${current.condition.icon}" width="90"></div>
                </div>
                <div class="custom">${current.condition.text}</div>
                <span><img src="images/icon-umberella.png"> 20%</span>
                <span><img src="images/icon-wind.png"> 18km/h</span>
                <span><img src="images/icon-compass.png"> East</span>
            </div>
        </div>`;

  // 2. Following Days
  for (let i = 1; i < forecast.length; i++) {
    const d = new Date(forecast[i].date.replace(" ", "T"));
    html += `
            <div class="forecast">
                <div class="forecast-header"><div class="day">${CONFIG.DAYS[d.getDay()]}</div></div>
                <div class="forecast-content">
                    <div class="forecast-icon"><img src="https:${forecast[i].day.condition.icon}" width="48"></div>
                    <div class="degree">${forecast[i].day.maxtemp_c}<sup>o</sup>C</div>
                    <small>${forecast[i].day.mintemp_c}<sup>o</sup></small>
                    <div class="custom">${forecast[i].day.condition.text}</div>
                </div>
            </div>`;
  }
  container.innerHTML = html;
}

function getLatestNews() {
  const container = document.getElementById("news-container");

  if (!container) return;

  if (typeof MOCK_NEWS === 'undefined') {
    console.warn;
    return;
  }
  renderNews(MOCK_NEWS.articles);
}

function renderLatestUpdates() {
  const sidebarContainer = document.getElementById("sidebar-news");

  if (!sidebarContainer || typeof LATEST_UPDATES === 'undefined') return;

  let htmlContent = "";

  LATEST_UPDATES.forEach(item => {
    htmlContent += `
            <li>
                <small style="color: #009ad8; display: block;">${item.time}</small>
                <a href="#" style="pointer-events: none;">${item.title}</a>
            </li>`;
  });

  sidebarContainer.innerHTML = htmlContent;
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof getLatestNews === 'function') {
    getLatestNews();
  }
  renderLatestUpdates();
});

function renderNews(articles) {
  const container = document.getElementById("news-container");
  let newsHtml = "";

  articles.forEach(art => {
    newsHtml += `
        <div class="post">
            <h2 class="entry-title"><a href="${art.url}" target="_blank">${art.title}</a></h2>
            <div class="featured-image">
                <img src="${art.urlToImage}" alt="${art.title}" style="width:100%; border-radius:8px;">
            </div>
            <p>${art.description}</p>
            <a href="${art.url}" target="_blank" class="button">Read More</a>
        </div>
        <hr style="opacity:0.1; margin:30px 0;">`;
  });

  container.innerHTML = newsHtml;
}
document.addEventListener('DOMContentLoaded', getLatestNews);

function renderNews(articles) {
  const container = document.getElementById("news-container");
  let newsHtml = "";
  articles.slice(0, 5).forEach(art => {
    newsHtml += `
        <div class="post">
            <h2 class="entry-title"><a href="${art.url}">${art.title}</a></h2>
            <div class="featured-image"><img src="${art.urlToImage || 'images/default-news.jpg'}"></div>
            <p>${art.description || 'No description available for this article.'}</p>
            <a href="${art.url}" class="button">Read More</a>
        </div><hr style="opacity:0.1; margin:20px 0;">`;
  });
  container.innerHTML = newsHtml;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  if (menuToggle && navigation) {
    menuToggle.onclick = () => navigation.classList.toggle("opened");
  }

  const searchInput = document.getElementById("search");
  const submitBtn = document.getElementById("submit");
  if (searchInput) {
    searchInput.onkeyup = (e) => getWeatherData(e.target.value);
    if (submitBtn) submitBtn.onclick = () => getWeatherData(searchInput.value);
    getWeatherData(CONFIG.WEATHER.DEFAULT_CITY);
  }
  getLatestNews();
});

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filterValue = this.getAttribute('data-filter');
    if (typeof $ !== 'undefined' && $('.filterable-items').isotope) {
      $('.filterable-items').isotope({ filter: filterValue });
    }
  });
});