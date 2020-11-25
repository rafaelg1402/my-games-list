let displayDiv = document.getElementById("page-wrapper");
let inputSearch = document.getElementById("search-game");
let gameList = document.getElementById("game-list");
let gamesObj = [];


async function letsFetch() {
    const response = await fetch('ps.txt')
        if (response.ok) {
            const data = await response.text()
                let gamesArray = data.split('\n')
                for (games of gamesArray) {
                    let game = games.split(",")
                    gamesObj.push({ title: game[0], 
                                    release: new Date(game[1]), 
                                    platform: game[2], 
                                    purchased: game[3] === undefined ? false : game[3] })
                }
                sortObj();
            }
        }

async function getGameArt(game) {
    const res = await fetch (`https://api.rawg.io/api/games?key=de9084d514ad43f4ac46fa3101f4fafd&search=${game}`);
        if (res.ok) {
            const data = await res.json();
            return data.results[0].background_image;
        }
        else {
            return res.status;
        }
}

async function displayResults() {
    gameList.innerHTML = "";
    for (const game of gamesObj) {
        if (game.title.toLowerCase().includes(inputSearch.value.toLowerCase())) {
            let gameDiv = document.createElement("div");
            if (game.purchased) {
                gameDiv.classList.add("bought");
            }
            gameDiv.classList.add("gameContainer");
            let displayGameName = document.createElement("p");
            let displayGameYear = document.createElement("p");
            let displayGameConsole = document.createElement("p");
            let img = document.createElement("img")
            if (screen.width > 768) {
                console.log(await getGameArt(game.title))
                if(await getGameArt(game.title) === 401) {
                    gameDiv.style.backgroundColor = 'black';
                } else {
                    img.src =  getGameArt(game.title);
                }
            } else {
                gameDiv.style.backgroundColor = 'black';
            }
            displayGameName.classList.add("game-name");
            displayGameYear.classList.add("game-year");
            displayGameConsole.classList.add("game-console");
            displayGameName.textContent = game.title;
            displayGameYear.textContent = `${game.release.getMonth()+1}`.padStart(2, "0") + `/${game.release.getFullYear()}`;
            displayGameConsole.textContent = game.platform;
            gameDiv.appendChild(displayGameName);
            gameDiv.appendChild(displayGameYear);
            gameDiv.appendChild(displayGameConsole);
            gameDiv.appendChild(img)
            gameList.appendChild(gameDiv);
        }
    }
}

const sortObj = () => {
    cmp = function (a, b) {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
    }
    gamesObj.sort((a, b) => {
        return cmp(a.release, b.release) || cmp(a.title, b.title)
    })
}

inputSearch.addEventListener('search', displayResults);