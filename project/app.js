import {useEffect } from 'react'


// API Access Token
const CLIENT_ID = '7269f024721e4773b4d4251e0616a20e'
const CLIENT_SECRET = '51bd5effc3aa4aea9a880d677034eb09'

useEffect(() => {
    var authParameters = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-from-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json)
        .then(data => console.log(data))
}, [])


  // use artist name to get top tracks
    let artistName = "radiohead"
    let countryCode = 'GB'
    fetch(`https://api.spotify.com/v1/search?type=artist&q=${artistName}`, {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        let artistId = data.artists.items[0].id;
        return fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${countryCode}`, {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        });
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));