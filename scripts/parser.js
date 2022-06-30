
function translate() {

  var url = "https://iptv-org.github.io/iptv/countries/af.m3u";
  var result = fetch(url).then((resp) => {
    return resp.text();
  });
  return result; // As Promise
}


document.getElementById("fetch").addEventListener("click", () => {
  let promise = translate();

  promise.then((json) => {
    document.getElementById("result").innerHTML = json;
  });
});

