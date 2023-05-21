// Selecting the elements from the DOM
let info = document.getElementById('info-container');
let title = document.getElementById('page-title');

// getting the heroInfo object which was stored when the user clicked on more info
let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));

// Changing the title of the page according to the characters name
title.innerHTML = heroInfo.name + " | SH";

window.addEventListener("load", function() {
            // getting the favouritesCharacterIDs for displaying the appropriate button accoring to the existance of character in favourites
            let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
            if (favouritesCharacterIDs == null) {
                favouritesCharacterIDs = new Map();
            } else if (favouritesCharacterIDs != null) {
                favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
            }

            // adding the information into DOM 
            info.innerHTML =
                `
               <div class="flex-row hero-name">${heroInfo.name}</div>
               <div class="flex-row hero-img-and-more-info">
                    <img id="portraitImage" class="hero-img" src="${heroInfo.portraitImage}" alt="">
                    <img style="display:none;" id="landscapeImage" src="${heroInfo.landscapeImage}" alt="">
                    <div class="flex-col more-info">
                         <div class="flex-row id">
                              <b>ID:</b><span>${heroInfo.id}</span>
                         </div>
                         <div class="flex-row comics">
                              <b>Comics:</b><span>${heroInfo.comics}</span>
                         </div>
                         <div class="flex-row series">
                              <b>Series:</b><span>${heroInfo.series}</span>
                         </div>
                         <div class="flex-row stories">
                              <b>Stories:</b><span>${heroInfo.stories}</span>
                         </div>
                    </div>
               </div>
               <div class="flex-col hero-discription">
                    <b>Discription:</b>
                    <p>${heroInfo.description != "" ? heroInfo.description : "No Description Available"}</p>
               </div>
               <div style="display:none;">
                    <span>${heroInfo.name}</span>
                    <span>${heroInfo.portraitImage}</span>
                    <span>${heroInfo.landscapeImage}</span>
                    <span>${heroInfo.id}</span>
                    <span>${heroInfo.comics}</span>
                    <span>${heroInfo.series}</span>
                    <span>${heroInfo.stories}</span>
                    <span>${heroInfo.squareImage}</span>
                    <span>${heroInfo.description}</span>
               </div>
               <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${heroInfo.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}

          `
     // Calling the function so that event is added
     addEvent();
})

// Changing the character image based on the different screen sizes 
// landscape image for small screen size and portrait image for bigger screen sizes
window.addEventListener('resize', function () {
     let portraitImage = document.getElementById('portraitImage');
     let landscapeImage = document.getElementById('landscapeImage');

     if (document.body.clientWidth < 678) {
          portraitImage.style.display = "none";
          landscapeImage.style.display = "block";
     } else {
          landscapeImage.style.display = "none";
          portraitImage.style.display = "block";
     }
})

// this function would run after content of the page is loaded
function addEvent() {
     let favouriteButton = document.querySelector('.add-to-fav-btn');
     favouriteButton.addEventListener("click", addToFavourites);
}



// Function invoked when "Add to Favorites" button or "Remove from favourites" button is click appropriate action is taken according to the button clicked

function addToFavourites() {
     const button = this;
     const isAddToFavourites = button.innerHTML === '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
   
     if (isAddToFavourites) {
       const heroInfo = {
         name: getFieldValue(button, 3, 0),
         description: getFieldValue(button, 3, 8),
         comics: getFieldValue(button, 3, 4),
         series: getFieldValue(button, 3, 5),
         stories: getFieldValue(button, 3, 6),
         portraitImage: getFieldValue(button, 3, 1),
         id: getFieldValue(button, 3, 3),
         landscapeImage: getFieldValue(button, 3, 2),
         squareImage: getFieldValue(button, 3, 7)
       };
   
       let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters")) || [];
       let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
       
       favouritesCharacterIDs.set(heroInfo.id, true);
       favouritesArray.push(heroInfo);
   
       localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
       localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));
   
       button.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
   
       showToast(".fav-toast");
     } else {
       const idOfCharacterToBeRemoveFromFavourites = getFieldValue(button, 3, 3);
   
       let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
       let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
       let newFavouritesArray = [];
   
       favouritesCharacterIDs.delete(idOfCharacterToBeRemoveFromFavourites);
   
       favouritesArray.forEach((favourite) => {
         if (idOfCharacterToBeRemoveFromFavourites !== favourite.id) {
           newFavouritesArray.push(favourite);
         }
       });
   
       localStorage.setItem("favouriteCharacters", JSON.stringify(newFavouritesArray));
       localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
   
       button.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
   
       showToast(".remove-toast");
     }
   }
   
   function getFieldValue(button, index1, index2) {
     return button.parentElement.children[index1].children[index2].innerHTML;
   }
   
   function showToast(selector) {
     const toast = document.querySelector(selector);
     toast.setAttribute("data-visiblity", "show");
     setTimeout(function () {
       toast.setAttribute("data-visiblity", "hide");
     }, 1000);
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