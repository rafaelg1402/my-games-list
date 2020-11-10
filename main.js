let displayDiv = document.getElementById("page-wrapper");
let inputSearch = document.getElementById("search-game");
let gameList = document.getElementById("game-list");
let sortedGamesList = [];
let gamesArray;
let sort = 0;
let pastSort = 1;


const letsFetch = () => {
    fetch('ps.txt').then(x => x.text()).then(games => {
        gamesArray = games.split('\n')
        for (gameProps of gamesArray) {
            sortedGamesList.push(gameProps.split(","))
        }
       while (pastSort >= 1) {
           sortArr();
       }
    })
}

const displayResults = () => {
        gameList.innerHTML = "";
        for(const game of sortedGamesList){
            let [gameTitle, yearOfRelease, platform, purchased] = game;
            if (gameTitle.toLowerCase().includes(inputSearch.value.toLowerCase())) { 
                let gameDiv = document.createElement("div");
                 if (purchased) {
                    gameDiv.classList.add("bought");
                 }
                gameDiv.classList.add("gameContainer");
                let displayGameName = document.createElement("p");
                let displayGameYear = document.createElement("p");
                let displayGameConsole = document.createElement("p");
                displayGameName.classList.add("game-name");
                displayGameYear.classList.add("game-year");
                displayGameConsole.classList.add("game-console");
                displayGameName.textContent = gameTitle;
                displayGameYear.textContent = yearOfRelease;
                displayGameConsole.textContent = platform;
                gameDiv.appendChild(displayGameName);
                gameDiv.appendChild(displayGameYear);
                gameDiv.appendChild(displayGameConsole);
                gameList.appendChild(gameDiv);
            }
        }
}

const sortArr = () => {
    sortedGamesList.sort(function(a,b){
        if(a[0] < b[0] && a[1] == b[1]) {
            sort ++;
            if(a[3] === "bought" && !b[3]) {
                b[3] = a[3];
                a.pop();
            } else if (b[3] === "bought" && !a[3]) {
                a[3] = b[3];
                b.pop();
            }
            if(a[2] != b[2]) {
                let temp2 = a[2];
                a[2] = b[2]
                b[2] = temp2;
            }
            let temp = a[0]
             a[0] = b[0];
            b[0] = temp;
        }
        return a[1] - b[1];
    });
    pastSort = sort;
    sort = 0;
}

    inputSearch.addEventListener('search', displayResults);
