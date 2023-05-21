// Selecting the card container from the DOM
let cardContainer = document.getElementById('container');

// Event listener attached to dom which is executed when the page is loaded
window.addEventListener("load", function() {
    // Getting the favourites array fom localStorage
    let favourites = localStorage.getItem("favouriteCharacters");

    // if favourites is null the we display nothing and return from there 
    if (favourites == null) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>"
        return;
    }
    // if NOT NULL the paring it to convert it to array
    else {
        favourites = JSON.parse(this.localStorage.getItem("favouriteCharacters"));
    }

    // if all the characters are deleted from favourites and not character left for displaying
    if (favourites.length == 0) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
        return;
    }

    cardContainer.innerHTML = "";
    // console.log(favourites)
    favourites.forEach(character => {
            // console.log(character);
            cardContainer.innerHTML +=
                `
               <div class="flex-col card">
                    <img src="${character.squareImage}" alt="">
                    <span class="name">${character.name}</span>
                    <span class="id">Id : ${character.id}</span>
                    <span class="comics">Comics : ${character.comics}</span>
                    <span class="series">Series : ${character.series}</span>
                    <span class="stories">Stories : ${character.stories}</span>
                    <a class="character-info" href="./more-info.html">
                         <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button>
                    </a>
                    <div style="display:none;">
                         <span>${character.id}</span>
                         <span>${character.name}</span>
                         <span>${character.comics}</span>
                         <span>${character.series}</span>
                         <span>${character.stories}</span>
                         <span>${character.description}</span>
                         <span>${character.landscapeImage}</span>
                         <span>${character.portraitImage}</span>
                         <span>${character.squareImage}</span>
                    </div>
                    <button class="btn remove-btn"><i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites</button>
               </div>
          `

        })
        // Adding the appropritate events to the buttons after they are inserted in dom 
    addEvent();
})

// Function for attacthing eventListener to buttons
function addEvent() {
    let removeBtn = document.querySelectorAll(".remove-btn");
    removeBtn.forEach((btn) => btn.addEventListener("click", removeCharacterFromFavourites))

    let characterInfo = document.querySelectorAll(".character-info");
    characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage));
}


//function to remove the super hero from the favorites list
function removeCharacterFromFavourites() {
    const characterId = this.parentElement.children[2].innerHTML.substring(5);

    let favourites = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];
    let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

    favouritesCharacterIDs.delete(characterId);

    favourites = favourites.filter(favourite => favourite.id !== characterId);

    if (favourites.length === 0) {
        cardContainer.innerHTML = "<p class=\"no-characters\">No characters present in Favourites</p>";
    }

    localStorage.setItem("favouriteCharacters", JSON.stringify(favourites));
    localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));

    this.parentElement.remove();

    showToast(".remove-toast");
}

function showToast(selector) {
    const toast = document.querySelector(selector);
    toast.setAttribute("data-visiblity", "show");
    setTimeout(() => {
        toast.setAttribute("data-visiblity", "hide");
    }, 1000);
}





function addInfoInLocalStorage() {
    // This function basically stores the data of character in localStorage.
    // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data  
    let heroInfo = {
        name: this.parentElement.children[7].children[1].innerHTML,
        description: this.parentElement.children[7].children[5].innerHTML,
        comics: this.parentElement.children[7].children[2].innerHTML,
        series: this.parentElement.children[7].children[3].innerHTML,
        stories: this.parentElement.children[7].children[4].innerHTML,
        portraitImage: this.parentElement.children[7].children[7].innerHTML,
        id: this.parentElement.children[7].children[0].innerHTML,
        landscapeImage: this.parentElement.children[7].children[6].innerHTML
    }

    localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}


/*-----------------------------------------------------  Theme Changing  -------------------------------------------------  */

// Selection of theme button
let themeButton = document.getElementById("theme-btn");

themeButton.addEventListener("click", themeChanger);

// function which checks the localStorage and applies the previously set theme
(function() {
    const themeData = {
        light: {
            attribute: "light",
            icon: '<i class="fa-solid fa-moon"></i>',
            backgroundColor: "#0D4C92"
        },
        dark: {
            attribute: "dark",
            icon: '<i class="fa-solid fa-sun"></i>',
            backgroundColor: "#FB2576",
            iconColor: "black"
        }
    };

    let currentTheme = localStorage.getItem("theme");

    if (currentTheme == null || !themeData[currentTheme]) {
        currentTheme = "light";
        localStorage.setItem("theme", currentTheme);
    }

    const { attribute, icon, backgroundColor, iconColor } = themeData[currentTheme];

    root.setAttribute("color-scheme", attribute);
    themeButton.innerHTML = icon;
    themeButton.style.backgroundColor = backgroundColor;

    if (iconColor) {
        themeButton.childNodes[0].style.color = iconColor;
    }
})();


// // function for handling theme button changes

function themeChanger() {
    const themeData = {
        light: {
            attribute: "light",
            icon: '<i class="fa-solid fa-moon"></i>',
            backgroundColor: "#0D4C92",
            iconColor: "white"
        },
        dark: {
            attribute: "dark",
            icon: '<i class="fa-solid fa-sun"></i>',
            backgroundColor: "#FB2576",
            iconColor: "black"
        }
    };

    const root = document.getElementById("root");
    const currentTheme = root.getAttribute("color-scheme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    const { attribute, icon, backgroundColor, iconColor } = themeData[newTheme];

    root.setAttribute("color-scheme", attribute);
    themeButton.innerHTML = icon;
    themeButton.style.backgroundColor = backgroundColor;

    if (iconColor) {
        themeButton.childNodes[0].style.color = iconColor;
    }

    localStorage.setItem("theme", newTheme);
}