/* -------------------------------------------------------------------------- */
/*                               HTMLs for Jikan                              */
/* -------------------------------------------------------------------------- */

function createPoster(mediaList, defaultType) {
  let html = "";
  mediaList.forEach((el) => {
    const title = el.title || "Unknown Title";
    const type = el.type || defaultType;
    const year = el.start_year || "?";
    const imgUrl =
      el.images?.webp?.image_url || el.images?.jpg?.image_url || "";

    html += `
      <div class="poster-item">
        <img src="${imgUrl}" alt="${title}" loading="lazy" />
          <div class="poster-overlay">
            <span class="poster-top">${type} • ${year}</span>
            <span class="poster-bottom">${title}</span>
          </div>
        </div>
      `;
  });
  return html;
}

function createStatus(mediaList, type) {
  let html = "";
  mediaList.forEach((el) => {
    const title = el.entry.title;
    const coverUrl = el.entry.images.webp.image_url;

    let progressText = "";
    if (type === "Anime") {
      const totalEps = el.episodes_total ?? "?";
      const watchedEps = el.episodes_seen ?? "?";
      progressText = `Episodes: ${watchedEps}/${totalEps}`;
    } else {
      const totalChaps = el.chapters_total ?? "?";
      const readChaps = el.chapters_read ?? "?";
      progressText = `Chapters: ${readChaps}/${totalChaps}`;
    }

    html += `
      <div class="status-poster">
        <img src="${coverUrl}" alt="${type} Cover" loading="lazy" />
        <div class="status-info">
          <span class="status-title">${title}</span>
          <span class="status-desc">${progressText}</span>
        </div>
      </div>
    `;
  });
  return html;
}

/* -------------------------------------------------------------------------- */
/*                            Status bar bottom sheet mobile                  */
/* -------------------------------------------------------------------------- */

function openTab(tabId) {
  const sections = document.querySelectorAll(".tab-content");
  sections.forEach((sec) => {
    sec.style.display = "none";
  });

  document.getElementById(tabId).style.display = "block";

  const buttons = document.querySelectorAll(".nav-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = document.getElementById("btn-" + tabId);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  const sidebar = document.querySelector(".sidebar");
  if (sidebar.classList.contains("active")) {
    sidebar.classList.remove("active");
  }

  window.scrollTo({ top: 0, behavior: "instant" });

  const mainContent = document.querySelector(".main-content");
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("active");
}

function toggleBottomSheet() {
  const sheet = document.querySelector(".status-sidebar");
  sheet.classList.toggle("active");

  if (!sheet.classList.contains("active")) {
    sheet.scrollTop = 0;
  }
}

const tabButtons = document.querySelectorAll(".nav-btn[data-tab]");

tabButtons.forEach((el) => {
  button.addEventListener("click", function () {
    const targetTab = this.getAttribute("data-tab");

    openTab(targetTab);
  });
});

const bottomSheet = document.querySelector(".status-sidebar");
const sheetHandle = document.querySelector(".bottom-sheet-handle");
let handleStartY;
let sheetStartY;

sheetHandle.addEventListener("touchstart", (e) => {
  handleStartY = e.touches[0].clientY;
});

sheetHandle.addEventListener("touchend", (e) => {
  let handleEndY = e.changedTouches[0].clientY;

  if (handleStartY - handleEndY > 40) {
    bottomSheet.classList.add("active");
  } else if (handleEndY - handleStartY > 40) {
    bottomSheet.classList.remove("active");
  }
});

bottomSheet.addEventListener("touchstart", (e) => {
  if (e.target.closest(".bottom-sheet-handle")) return;
  sheetStartY = e.touches[0].clientY;
});

bottomSheet.addEventListener("touchend", (e) => {
  if (e.target.closest(".bottom-sheet-handle")) return;
  let sheetEndY = e.changedTouches[0].clientY;

  if (sheetEndY - sheetStartY > 50 && bottomSheet.scrollTop <= 0) {
    bottomSheet.classList.remove("active");
  }
});

/* -------------------------------------------------------------------------- */
/*                             Discord Lanyard API                            */
/* -------------------------------------------------------------------------- */

const discordID = "388320022340173834";

async function fetchDiscordStatus() {
  try {
    const response = await fetch(
      `https://api.lanyard.rest/v1/users/${discordID}`,
    );
    const json = await response.json();

    if (json.success) {
      const data = json.data;
      const discordUser = data.discord_user;

      document.getElementById("discord-username").innerText =
        discordUser.display_name || discordUser.username;

      const avatarUrl = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : "https://cdn.discordapp.com/embed/avatars/0.png";
      document.getElementById("discord-avatar").src = avatarUrl;

      const statusDot = document.getElementById("discord-status-dot");
      statusDot.className = `status-dot ${data.discord_status}`;

      const statusTextElement = document.getElementById("discord-status-text");
      const statusMap = {
        online: "Currently Online",
        idle: "Currently Idle",
        dnd: "Do Not Disturb",
        offline: "Currently Offline",
      };
      statusTextElement.innerText = statusMap[data.discord_status] || "Offline";

      const subtextContainer = document.getElementById("discord-subtext");
      const activityTextElement = document.getElementById(
        "discord-activity-text",
      );

      let hasActivity = false;

      if (data.listening_to_spotify) {
        activityTextElement.innerHTML = `<i class="fa-solid fa-music" style="color:#1DB954;"></i> ${data.spotify.song} - ${data.spotify.artist}`;
        hasActivity = true;
      } else if (data.activities.length > 0) {
        const act = data.activities[0];

        if (act.name.toLowerCase().includes("youtube music")) {
          const songTitle = act.details || "Unknown Song";
          const artist = act.state || "";

          const displayText = artist ? `${artist} - ${songTitle}` : songTitle;

          activityTextElement.innerHTML = `is listening to <span class="glow-text">${displayText}</span>`;
        } else {
          if (act.details && act.state) {
            activityTextElement.innerHTML = `is playing <span class="glow-text">${act.name}: ${act.details}</span>`;
          } else {
            const fallbackText = act.name || act.state;
            activityTextElement.innerHTML = `is playing <span class="glow-text">${fallbackText}</span>`;
          }
        }
        hasActivity = true;
      }
      if (hasActivity) {
        subtextContainer.classList.add("has-activity");
      } else {
        subtextContainer.classList.remove("has-activity");
      }
    }
  } catch (error) {
    console.error("Fetch Lanyard failed:", error);
  }
}
fetchDiscordStatus();
setInterval(fetchDiscordStatus, 15000);

/* -------------------------------------------------------------------------- */
/*                       Jikan API - MyAnimeList status                       */
/* -------------------------------------------------------------------------- */

const malUsername = "vanillaine";

async function fetchMALStatus() {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/users/${malUsername}/userupdates`,
    );

    if (!response.ok) throw new Error("Jikan API Error");

    const updateData = await response.json();

    if (updateData && updateData.data) {
      const animeList = updateData.data.anime || [];
      const currentlyWatching = animeList
        .filter((a) => a.status.toLowerCase() === "watching")
        .slice(0, 3);

      const staticAnime = document.getElementById("static-anime");
      if (staticAnime && currentlyWatching.length > 0) {
        staticAnime.insertAdjacentHTML(
          "beforebegin",
          createStatus(currentlyWatching, "Anime"),
        );
      }

      const mangaList = updateData.data.manga || [];
      const currentlyReading = mangaList
        .filter((m) => m.status.toLowerCase() === "reading")
        .slice(0, 3);

      const staticManga = document.getElementById("static-manga");
      if (staticManga && currentlyReading.length > 0) {
        staticManga.insertAdjacentHTML(
          "beforebegin",
          createStatus(currentlyReading, "Manga"),
        );
      }
    }
  } catch (error) {
    console.error("MAL Fetch Error:", error);
  }
}

fetchMALStatus();

/* -------------------------------------------------------------------------- */
/*                      Jikan API - MyAnimeList Favorites                     */
/* -------------------------------------------------------------------------- */

async function fetchMALFavorites() {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/users/${malUsername}/favorites`,
    );

    if (!response.ok) throw new Error("Failed fetching MAL Favorites");

    const favData = await response.json();

    if (favData && favData.data) {
      const animeFavs = favData.data.anime || [];
      const animeContainer = document.querySelector(".anime-posters");

      if (animeContainer && animeFavs.length > 0) {
        animeContainer.innerHTML = createPoster(animeFavs, "Anime");
      }

      const mangaFavs = favData.data.manga || [];
      const mangaContainer = document.querySelector(".manga-posters");

      if (mangaContainer && mangaFavs.length > 0) {
        mangaContainer.innerHTML = createPoster(mangaFavs, "Manga");
      }
    }
  } catch (error) {
    console.error("MAL Favorites Fetch Error:", error);
  }
}

fetchMALFavorites();

/* -------------------------------------------------------------------------- */
/*                                Overfast API                                */
/* -------------------------------------------------------------------------- */

const owPlayerId = "Broflovskye-1857";

async function fetchOverwatchStatus() {
  try {
    const response = await fetch(
      `https://overfast-api.tekrop.fr/players/${owPlayerId}`,
    );

    if (!response.ok) throw new Error("Failed fetching Overwatch Data");

    const owData = await response.json();

    const username = owData.summary.username || "Unknown";

    const owDesc1 = document.getElementById("ow-desc-1");
    if (owDesc1) {
      owDesc1.innerHTML = `<strong>${username}</strong>`;
    }

    const owDesc2 = document.getElementById("ow-desc-2");
    if (owDesc2 && owData.summary.competitive?.pc?.support) {
      const supportData = owData.summary.competitive.pc.support;

      const division = supportData.division
        ? supportData.division.charAt(0).toUpperCase() +
          supportData.division.slice(1)
        : "Unranked";

      const tier = supportData.tier ?? "";

      owDesc2.textContent = `Support - ${division} ${tier}`.trim();
    } else if (owDesc2) {
      owDesc2.textContent = "Support - Unranked";
    }
  } catch (error) {
    console.error("Overwatch Fetch Error:", error);
    document.getElementById("ow-desc-1").innerHTML =
      "<strong>Broflovskye</strong>";
    document.getElementById("ow-desc-2").textContent = "Support - Unknown";
  }
}

fetchOverwatchStatus();
