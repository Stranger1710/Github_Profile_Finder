const loader = document.getElementById("loader");
const backdrop = document.getElementById("backdrop");
const fetchGithubUser = async () => {
  let username = document.getElementById("searchInput").value;

  const userDetailCard = document.getElementById("userDetails");
  backdrop.style.display = "block";
  loader.style.display = "block";

  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = await response.json();

  if (data.message == "Not Found") {
    alert(data.message);
    backdrop.style.display = "none";
    loader.style.display = "none";
  } else {
    backdrop.style.display = "none";
    loader.style.display = "none";
    fetchRepositories();
    document.querySelector(".searchContainer").style.width = "100%";
    document.querySelector(".resultsContainer").style.display = "flex";
    console.log(data);

    userDetailCard.innerHTML = `
        <div class="profile">
            <div class="profile-image">
                <img class="profile-image-icon" src="${data.avatar_url}" />
            </div>
            <div class="profile-details">
                <h2 class="name">${data.name ? data.name : data.login}</h2>
                <p class="username">@${data.login}</p>
                <p class="bio">${
                  data.bio ? data.bio : "This account don't have bio"
                }</p>

                <div class="stats">
                    <div>
                        <div class="stats-name">Public Repos</div>
                        <div class="stats-name">${data.public_repos}</div>
                    </div>
                    <div>
                        <div class="stats-name">Followers</div>
                        <div class="stats-name">${data.followers}</div>
                    </div>
                    <div>
                        <div class="stats-name">Following</div>
                        <div class="stats-name">${data.following}</div>
                    </div>
                </div>

               <!-- <div class="media">
                    <p>
                        <span class="media-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </span>
                        <span class="media-name">${
                          data.location ? data.location : "Not Available"
                        }</span>
                    </p>
                    <p>
                        <span class="media-icon">
                            <i class="fas fa-link"></i>
                        </span>
                        <span class="media-name">${
                          data.blog ? data.blog : "Not Available"
                        }</span>
                    </p>
                    <p>
                        <span class="media-icon">
                            <i class="fab fa-twitter"></i>
                        </span>
                        <span class="media-name">${
                          data.twitter_username
                            ? data.twitter_username
                            : "Not Available"
                        }</span>
                    </p>
                    <p>
                        <span class="media-icon">
                            <i class="fas fa-building"></i>
                        </span>
                        <span class="media-name">${
                          data.company ? data.company : "Not Available"
                        }</span>
                    </p>
                </div> -->
            </div>
        </div>
        `;
  }
};

async function fetchRepositories() {
  const username = document.getElementById("searchInput").value;
  const apiUrl = `https://api.github.com/users/${username}/repos`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    displayRepositories(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayRepositories(repositories) {
  const repositoriesContainer = document.getElementById("repositories");
  const paginationContainer = document.getElementById("pagination");

  repositoriesContainer.innerHTML = "";
  paginationContainer.innerHTML = "";

  const repositoriesPerPage = 10;
  const pageCount = Math.ceil(repositories.length / repositoriesPerPage);
  const noRepoFound = document.getElementById("noRepoFound");
  if (repositories.length === 0) {
    noRepoFound.style.display = "block";
  } else {
    noRepoFound.style.display = "none";
    for (let i = 0; i < repositories.length; i++) {
      if (i % repositoriesPerPage === 0) {
        const page = i / repositoriesPerPage;
        const button = document.createElement("button");
        button.innerText = page + 1;
        button.addEventListener("click", () =>
          displayPage(repositories, page, repositoriesPerPage)
        );
        paginationContainer.appendChild(button);
      }

      const repository = repositories[i];
      const languagesUsedRes = await fetch(repository.languages_url);
      const languagesUsedData = await languagesUsedRes.json();
      const languages = Object.keys(languagesUsedData);

      const card = document.createElement("div");
      card.classList.add("repository-card");
      card.innerHTML = `
            <h2 class="repoName">${repository.name}</h2>
            <!-- <p>${
              repository.description || "No description available"
            }</p> -->
            <div class="languagesUsed">${languages
              .map((lng) => `<button> ${lng} </button>`)
              .join("")}</div>
            <a href="${repository.html_url}" target="_blank">Visit Repo</a>
        `;
      repositoriesContainer.appendChild(card);
    }

    displayPage(repositories, 0, repositoriesPerPage);
  }
}

function displayPage(repositories, page, repositoriesPerPage) {
  const startIndex = page * repositoriesPerPage;
  const endIndex = startIndex + repositoriesPerPage;
  const allCards = document.querySelectorAll(".repository-card");

  allCards.forEach((card, index) => {
    if (index >= startIndex && index < endIndex) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}
