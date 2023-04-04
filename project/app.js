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


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// --- Slumpsorterar en array --- //
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
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
        for (let i = 0; i < Number(resultLimit); i++) {
            listItem = fullList[i].track.name + " - " + fullList[i].track.artists[0].name
            listImage = fullList[i].track.album.images[1].url
            printResults(listItem, listImage, i)
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


// --- Hämtar resultat --- //
function getResults(resultList) {
    let fullList = resultList
    for (let i = 0; i < Number(resultLimit); i++) {
        if (typeSelect.value === "artist") {
        listItem = fullList.artists.items[i].name
        listImage = fullList.artists.items[i].images[1].url
        } else if (typeSelect.value === "album") {
        listItem = fullList.albums.items[i].name + " - " + fullList.albums.items[i].artists[0].name
        listImage = fullList.albums.items[i].images[1].url
        } else if (typeSelect.value === "track") {
        listItem = fullList.tracks.items[i].name + " - " + fullList.tracks.items[i].artists[0].name
        listImage = fullList.tracks.items[i].album.images[1].url
        } 
        printResults(listItem, listImage, i)
    }
}


// --- Skriver ut resultat --- //
function printResults(item, image, index) {
    resultsDiv.insertAdjacentHTML("beforeend", "<div class='resultContainer' id='resultbox"+[index]+"'></div>")
    document.getElementById("resultbox"+[index]).innerHTML = "<img src='" + image + "' alt='couldn't load image' width='275px' height='275px'> <h3>" + item + "</h3>"
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

      let results = await search(searchString, searchType)

      console.log(results)
      document.getElementById("searchResults").innerHTML = ""
      getResults(results)
    }
  }


});


//--------------------------------------------------------------------------------------------------------