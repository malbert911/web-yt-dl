const file = window.location.search.substr(1)
const options = {
    headers: {
         Accept: "application/json"
     }
 };
function checkDownload(){
    let url = window.location.origin + `/downloading-check?f=${file}`;
    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.downloaded == true)
                window.location.href = window.location.origin + `/downloaded?f=${file}`;
            else
                setTimeout(checkDownload, 2000);
        })
        .catch(function (error) {
            console.error(error);
        });

}

checkDownload();