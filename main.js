let inputSearch = document.getElementById("search-game");
let gameList = document.getElementById("game-list");
let mainBtnDiv = document.getElementById("header");
let gamesObj = [];
let limit = 12;

const getGamesFile = async () => {
    try {
        let response = await fetch('https://raw.githubusercontent.com/rafaelg1402/my-games-list/main/ps.txt')
        let data = await response.text();
        return data;
    }
    catch (e) {
        console.log(e);
    }
}

const splitFile = (data) => {
    let gamesArray = data.split('\n')
    for (games of gamesArray) {
        let game = games.split(",")
        let [year, month] = game[1].split(" ");
        gamesObj.push({
            title: game[0],
            release: new Date(`${month} 01 ${year}`),
            platform: game[2],
            purchased: game[3] === undefined ? false : game[3]
        })
        sortObj();
    }
}

const displayNumOfGames = () => {
    let platformOfGames = { allPlats: 0, pc: 0, ps1: 0, ps2: 0, ps3: 0, ps4: 0, ps5: 0, switch: 0 };
    platformOfGames.allPlats = gamesObj.length;
    Object.values(gamesObj).forEach(game => {
        switch (game.platform) {
            case "pc":
                platformOfGames.pc++;
                break;
            case "ps1":
                platformOfGames.ps1++;
                break;
            case "ps2":
                platformOfGames.ps2++
                break;
            case "ps3":
                platformOfGames.ps3++;
                break;
            case "ps4":
                platformOfGames.ps4++;
                break;
            case "ps5":
                platformOfGames.ps5++
                break;
            case "switch":
                platformOfGames.switch++;
                break;
        }
    })
    let div = document.createElement("div");
    let divContent = "";
    div.classList.add("grid", "sm:grid-cols-3", "grid-flow-row", "sm:gap-6", "text-lg", "xl:text-xl", "text-left", "place-content-center");
    Object.entries(platformOfGames).forEach(platform => {
        divContent += `<div class="${platform[0] != "allPlats"?"hidden":""} tracking-wide sm:inline sm:relative sm:overflow-hidden sm:h-48 lg:h-60 rounded">
        <img class="hidden sm:inline relative object-top object-cover h-full w-full" src="resources/images/${platform[0]}-game.webp">
        <span class="sm:absolute sm:bottom-0 sm:-left-4 sm:bg-blue-2000  sm:py-1 sm:pl-5 sm:pr-3 sm:rounded-full">
            <strong>${platform[0] === "allPlats" ? "GAMES" : platform[0].toUpperCase()}:</strong> ${platform[1]}
        </span>
       </div>`
    })
    div.innerHTML = divContent
    mainBtnDiv.appendChild(div);


}

const results = (game) => {
    let gameDiv = document.createElement("div");
    if (game.purchased) {
        gameDiv.classList.add("border-4", "border-gray-700");
    }
    gameDiv.classList.add("tracking-wide", "bg-blue-2000", "rounded", "mb-4", "sm:mb-0", "p-7", "grid", "grid-cols-3", "relative", "overflow-hidden", "text-left");
    let gameDivContent = `<p class="font-semibold w-full col-span-3 mb-4">${game.title}</p>
                          <p class="font-mono self-end">${(game.release.getMonth() + 1) < 10 ? `0${(game.release.getMonth() + 1)}` : (game.release.getMonth() + 1)}/${game.release.getFullYear()}</p>
                            <img src="resources/images/${game.platform}.webp" class="max-h-6 col-start-3 col-end-3 place-self-end">`
    gameDiv.innerHTML = gameDivContent;
    gameList.appendChild(gameDiv);
}

const displayResults = () => {
    gameList.innerHTML = "";
    for (const game of gamesObj) {
        if (game.title.toLowerCase().includes(inputSearch.value.toLowerCase()) && gameList.childNodes.length < limit) {
            results(game);
        }
    }
}

window.onscroll = function (ev) {
    if (((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) && gameList.childNodes.length > 10 && limit < gamesObj.length && inputSearch.value.length < 1) {
        let newLength = Array.from(gamesObj.slice(limit, (limit + 12)))
        limit = limit + 12;
        for (const game of newLength) {
            results(game);
        }
    }
}

window.onwheel = function (ev) {
    if (((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) && gameList.childNodes.length > 1 && gameList.childNodes.length < 14 && inputSearch.value.length < 1) {
        let newLength = Array.from(gamesObj.slice(limit, (limit + 12)))
        limit = limit + 12;
        for (const game of newLength) {
            results(game);
        }
    }
}

window.ontouchmove = function (ev) {
    if (gameList.childNodes.length >= 11 && limit < gamesObj.length && inputSearch.value.length < 1) {
        let newLength = Array.from(gamesObj.slice(limit, gamesObj.length))
        limit = gamesObj.length;
        for (const game of newLength) {
            results(game);
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

getGamesFile()
    .then(splitFile)
    .then(displayNumOfGames)
    .catch(e => console.log(`Error: ${e}`));

inputSearch.addEventListener('keyup', displayResults);