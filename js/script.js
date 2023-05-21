//*-------------------------------------- Selecting the element from DOM ----------------------------------------------------
let searchBar = document.getElementById("search-bar");
let searchResults = document.getElementById("search-results");

// Adding eventListener to search bar
searchBar.addEventListener("input", () => searchHeros(searchBar.value));

// function for API call
async function searchHeros(textSearched) {

    const public_key = '56c2338bde06a5cc3be14be8810ea52c';
    const private_key = '0d8473c817b3db5cde3ff53730fe419f3bba9ab4';

    var curr_Comic_Char_ToShow = null
    const ts = Date.now();
    // console.log(ts);
    const st = ts + private_key + public_key;

    var hash = CryptoJS.MD5(st).toString();
    console.log("hash : ", hash);


    if (textSearched.length == 0) {
        searchResults.innerHTML = ``;
        return;
    }

    // API call to get the data 
    await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&ts=${ts}&apikey=${public_key}&hash=${hash}`)
        .then(res => res.json()) //Converting the data into JSON format
        .then(data => showSearchedResults(data.data.results)) //sending the searched results characters to show in HTML
}

// Function for displaying the searched results in DOM
// An array is accepted as argument 
// SearchedHero is the array of objects which matches the string entered in the searched bar
function showSearchedResults(searchedHero) {


    // IDs of the character which are added in the favorites 
    // Used for displaying the appropriate button in search results i.e
    // if the id exist in this array then we display "Remove from favorites" button otherwise we display "Add to favorites button"
    // favoritesCharacterIDs is a map which contains id of character as key and true as value 
    let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
    if (favouritesCharacterIDs == null) {
        // If we did't got the favoritesCharacterIDs then we initialize it with empty map
        favouritesCharacterIDs = new Map();
    } else if (favouritesCharacterIDs != null) {
        // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
        favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
    }

    searchResults.innerHTML = ``;
    // count is used to count the result displayed in DOM
    let count = 1;

    // iterating the searchedHero array using for loop
    for (const key in searchedHero) {
        // if count <= 5 then only we display it in dom other results are discarded
        if (count <= 5) {
            // getting the single hero 
            // hero is the object that we get from API
            let hero = searchedHero[key];
            // Appending the element into DOM
            searchResults.innerHTML +=
                `
               <li class="flex-row single-search-result">
                    <div class="flex-row img-info">
                         <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="./more-info.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                         <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                         <span>${hero.id}</span>
                         <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                         <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
               </li>
               `
          }
          count++;
     }
     // Adding the appropriate events to the buttons after they are inserted in dom
     events();
}

// Function for attaching eventListener to buttons
function events() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}

// // Function invoked when "Add to Favorites" button or "Remove from favourites" button is click appropriate action is taken according to the button clicked


function addToFavourites() {
     const isAddToFavourites = this.innerHTML.includes('Add to Favourites');
   
     const heroInfo = {
       name: this.parentElement.parentElement.children[2].children[0].innerHTML,
       description: this.parentElement.parentElement.children[2].children[1].innerHTML,
       comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
       series: this.parentElement.parentElement.children[2].children[3].innerHTML,
       stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
       portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
       id: this.parentElement.parentElement.children[2].children[6].innerHTML,
       landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
       squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
     };
   
     let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];
     let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
   
     if (isAddToFavourites) {
       favouritesCharacterIDs.set(heroInfo.id, true);
       favouritesArray.push(heroInfo);
       this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
       document.querySelector(".fav-toast").setAttribute("data-visiblity", "show");
       setTimeout(() => {
         document.querySelector(".fav-toast").setAttribute("data-visiblity", "hide");
       }, 1000);
     } else {
       const idOfCharacterToBeRemoved = heroInfo.id;
       favouritesCharacterIDs.delete(idOfCharacterToBeRemoved);
       const newFavouritesArray = favouritesArray.filter((favourite) => favourite.id !== idOfCharacterToBeRemoved);
       favouritesArray = newFavouritesArray;
       this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
       document.querySelector(".remove-toast").setAttribute("data-visiblity", "show");
       setTimeout(() => {
         document.querySelector(".remove-toast").setAttribute("data-visiblity", "hide");
       }, 1000);
     }
   
     localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
     localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
   }
   




// Function which stores the info object of character for which user want to see the info 
function addInfoInLocalStorage() {

     // This function basically stores the data of character in localStorage.
     // When user clicks on the info button and when the info page is opened that page fetches the heroInfo and display the data  
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

/*-----------------------------------------------------  Theme Changing  -------------------------------------------------  */

// Selection of theme button
let themeButton = document.getElementById("theme-btn");

themeButton.addEventListener("click",themeChanger);

// function which checks the localStorage and applies the previously set theme
(function () {
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