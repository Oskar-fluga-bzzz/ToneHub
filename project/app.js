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


// --- Hämtar rekommendationer --- //
async function getRecommendations() {
    fetch('https://api.spotify.com/v1/playlists/0sOfCMEfYeMhwDJQFQFPpZ?si=9d999c244722467c', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        fullList = data
        for (let i = 0; i < Number(resultLimit); i++) {
            listItem = fullList.tracks.items[i].track.name
            resultsDiv.insertAdjacentHTML("beforeend", "<div id='resultbox"+[i]+"'></div>")
            document.getElementById("resultbox"+[i]).innerHTML = "<h3>" + listItem + "</h3>"
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


// --- skriver ut resultat --- //
function printResults(resultList) {
    let fullList = resultList
    for (let i = 0; i < Number(resultLimit); i++) {
        if (typeSelect.value === "artist") {
        listItem = fullList.artists.items[i].name
        } else if (typeSelect.value === "album") {
            listItem = fullList.albums.items[i].name
        } else if (typeSelect.value === "track") {
        listItem = fullList.tracks.items[i].name
        } 
        resultsDiv.insertAdjacentHTML("beforeend", "<div id='resultbox"+[i]+"'></div>")
        document.getElementById("resultbox"+[i]).innerHTML = "<h3>" + listItem + "</h3>"
    }
}


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// --- Kör token funktionen --- //
tokenRequest() .then(token => {


// skriver ut rekommendationer --- //
getRecommendations()


// --- Sökfält ... //
searchText.onkeydown = async function (event) {
    if (event.key === "Enter") {
      event.preventDefault()

      let searchString = searchText.value
      let searchType = typeSelect.value
      console.log("Searching for... " + searchString + ", in " + searchType + "s")

      let results = await search(searchString, searchType)

      console.log(results)
      document.getElementById("searchResults").innerHTML = ""
      printResults(results)
    }
  }


});


//--------------------------------------------------------------------------------------------------------