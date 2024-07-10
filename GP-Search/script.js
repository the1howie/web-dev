function searchTown(town) {
  var searchResults = [];
  
  for (let i = 0; i < data.length; i++) {
    if (data[i].town.toLowerCase() === town.trim().toLowerCase()) {
      searchResults.push(data[i])
    }
  }
  
  return searchResults;
}


function printSearchTownResults() {
  var town = document.getElementById("town");
  var result = document.getElementById("result");
  var searchResults, size;
  
  searchResults = searchTown(town.value);
  size = searchResults.length;
  result.innerHTML = "Results (" + size + "): <br>";
  
  if (size > 0) {
    for (i = 0; i < size; i++) {
      result.innerHTML += "<br>";
      result.innerHTML += "<h2>" + searchResults[i].name + "</h2>";
      result.innerHTML += "<ul class='no-bullets'>";
      result.innerHTML += "<li class='no-bullets'>" + searchResults[i].streetAddress + "</li>";
      result.innerHTML += "<li class='no-bullets'>" + searchResults[i].town + "</li>";
      if (searchResults[i].county !== "") {
        result.innerHTML += "<li class='no-bullets'>" + searchResults[i].county + "</li>";
      }
      result.innerHTML += "<li class='no-bullets'>" + searchResults[i].postCode + "</li>";
      result.innerHTML += "</ul>";
    }
  }
  
  return size;
}


function resetPage() {
  var town = document.getElementById("town");
  var result = document.getElementById("result");
  
  town.value = "";
  result.innerHTML = "Results (0):";
  
  return true;
}
