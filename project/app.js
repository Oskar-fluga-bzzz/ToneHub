
// --- Hämtar en Spotify API Access Token --- //
const CLIENT_ID = '7269f024721e4773b4d4251e0616a20e'
const CLIENT_SECRET = '51bd5effc3aa4aea9a880d677034eb09'
let accessToken = ''
function tokenRequest() {
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


// --- Kör funktionen --- //
tokenRequest() .then(accessToken => {


// --- Sökparametrar --- //
let searchString = "billie eilish"
let searchType = "artist"
let artistID = ""
let countryCode = "SE"
let resultLimit = ""
let resultOffset = ""
let includeExternalAudio = ""


// --- söker efter en artist och returnerar spotify id for artisten som är högst upp i resultaten --- //
fetch(`https://api.spotify.com/v1/search?type=${searchType}&q=${searchString}`, {
    headers: {
        'Authorization': 'Bearer ' + accessToken
    }
})
.then(response => response.json())
.then(data =>
console.log(data.artists.items[0].name + ', ' + data.artists.items[0].id))
.catch(error => console.error(error))


});