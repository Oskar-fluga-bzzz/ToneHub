// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// --- Hämtar en Spotify API Access Token --- //
const CLIENT_ID = '7269f024721e4773b4d4251e0616a20e'
const CLIENT_SECRET = '51bd5effc3aa4aea9a880d677034eb09'
let accessToken = ''
async function tokenRequest() {
    var authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    return fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(res => res.json())
        .then(data => {
            const accessToken = data.access_token
            console.log('Access Token: ' + accessToken)
            return accessToken
        })
        .then(token => {
            accessToken = token})
        .catch(error => console.error(error))
}


// --- Sökparametrar --- //
let searchString = ""
let searchType = ""
let artistID = ""
let countryCode = ""
let resultLimit = "50"
let resultOffset = ""
let includeExternalAudio = ""


// --- getelementbyid --- //
let searchText = document.getElementById("txtSearch")
let resultsDiv = document.getElementById("searchResults")
let typeSelect = document.getElementById("typeselect")
let titleText = document.getElementById("titleTxt")


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// --- Slumpsorterar en array --- //
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }


// --- Hämtar rekommendationer om användaren klickar på tonehub loggan --- //
function homeClick() {
    document.getElementById("searchResults").innerHTML = ""
    searchText.value = ""
    getRecommendations()
}


// --- Skriver ut rekommendationer --- //
async function getRecommendations() {
    
    fetch('https://api.spotify.com/v1/playlists/30Vqlaj8thTDahV45hY8ok?si=2b0a63290fba4ffe', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        fullList = shuffle(data.tracks.items)
        console.log(data)
        for (let i = 0; i < 90; i++) {
            listItem = "<h3 class='itemName'>" + fullList[i].track.name + "</h3><h3 class='creatorName'>" + fullList[i].track.artists[0].name + "</h3>"
            imageNinfo = HTMLtemplate(fullList[i].track.album.images[1].url, "released " + fullList[i].track.album.release_date, fullList[i].track.popularity + "% popularity", fullList[i].track.explicit)
            printResults(listItem, imageNinfo, i)
        }
    })
    .catch(error => console.error(error))
}


// --- Sökfunktion --- //
async function search(string, type) {
return fetch(`https://api.spotify.com/v1/search?type=${type}&q=${string}&limit=${resultLimit}`, {
    headers: {
        'Authorization': 'Bearer ' + accessToken
    }
})
.then(response => response.json())
.then(data => {
    return data
})
.catch(error => console.error(error))
}


// --- template för html --- //
function HTMLtemplate(image, info1, info2, info3) {
    return imageNinfo = "<div id='album_art'><img src='" + image + "' alt='couldn't load image' width='200px' height='200px' class='image'><div class='text'> <h3>" + info1 + "</h3> <h3>" + info2 + "</h3> <h3>" + info3 + "</h3> </div></div>"
}


// --- Hämtar resultat --- //
function getResults(resultList) {
    let fullList = resultList
    for (let i = 0; i < Number(resultLimit); i++) {
        if (typeSelect.value === "artist") {
        listItem = "<h3 class='itemName'>" + fullList.artists.items[i].name + "</h3>" 
        imageNinfo = HTMLtemplate(fullList.artists.items[i].images[1].url, "info1", "info 2", "info3")
        } else if (typeSelect.value === "album") {
        listItem = "<h3 class='itemName'>" + fullList.albums.items[i].name + "</h3><h3 class='creatorName'>" + fullList.albums.items[i].artists[0].name + "</h3>"
        imageNinfo = HTMLtemplate(fullList.albums.items[i].images[1].url, "info1", "info2", "info3")
        } else if (typeSelect.value === "track") {
        listItem = "<h3 class='itemName'>" + fullList.tracks.items[i].name + "</h3><h3 class='creatorName'>" + fullList.tracks.items[i].artists[0].name + "</h3>"
        imageNinfo = HTMLtemplate(fullList.tracks.items[i].album.images[1].url, "info1", "info2", "info3")
        } 
        printResults(listItem, imageNinfo, i)
    }
}


 // --- Skriver ut resultat --- //
function printResults(item, image, index) {
    resultsDiv.insertAdjacentHTML("beforeend", "<div class='resultContainer' id='resultbox"+index+"'></div>")
    document.getElementById(`resultbox${index}`).innerHTML = image + item 
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// --- Kör token funktionen --- //
tokenRequest() .then(token => {


// --- skriver ut rekommendationer --- //
getRecommendations()


// --- Sökfält --- //
searchText.onkeydown = async function (event) {
    if (event.key === "Enter") {
      event.preventDefault()

      let searchString = searchText.value
      let searchType = typeSelect.value
      console.log("Searching for... " + searchString + ", in " + searchType + "s")
      document.getElementById("searchResults").innerHTML = ""
      if (searchString === "") {
        getRecommendations()
      } else {
        let results = await search(searchString, searchType)
        console.log(results)
        getResults(results)
      }
    }
  }


});


//--------------------------------------------------------------------------------------------------------