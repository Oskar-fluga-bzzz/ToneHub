let accessToken = 'BQA7nEt32CdGDUPxl-nyXp2yx4sbR-RXcL9MDKkOJBnNCqLgrNtBZ2dXhfYeMzKUI8NGLs0eK5305UDppPV9ucgxn92jNn1QUwgWEVOICZWkrUHiDqCMG-QOt16AKeyX4KwZCnIp8nR2FqH1WQNrXBe_vhHuuxvThuDfbWzUpgs1GAkj9u65di9IUrpfFvnuwTrdT7hQ'


  
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

