
document.getElementById('download-button').href = window.location.origin + "/get-download?" +  window.location.search.substr(1);
document.getElementById('download-button').setAttribute("download", window.location.search.substr(1).substring(window.location.search.substr(1).indexOf('f=') + 2));