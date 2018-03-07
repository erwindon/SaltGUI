window.elapsedToString = function(date) {
  var secondsPassed = (new Date().getTime() / 1000) - (date.getTime() / 1000);
  if(secondsPassed < 20) return "A few moments ago";
  if(secondsPassed < 120) return "A few minutes ago";

  if(secondsPassed < 60 * 60) {
    var minutes = Math.round(secondsPassed / 60);
    return minutes + " minutes ago";
  }

  if(secondsPassed < 60 * 60 * 24) {
    var hours = Math.round(secondsPassed / 60 / 60);
    return hours + " hours ago";
  }

  if(secondsPassed < 60 * 60 * 24 * 2) {
    return "Yesterday";
  }

  if(secondsPassed < 60 * 60 * 24 * 30) {
    var days = Math.round(secondsPassed / 60 / 60 / 24);
    return days + " days ago";
  }

  return "A long time ago, in a galaxy far, far away";
};

window.createElement = function(type, className, content) {
  var element = document.createElement(type);
  element.classList.add(className);
  if(content !== "") element.innerHTML = content;
  return element;
};

window.getQueryParam = function(name) {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      if(hash[0] === name) return hash[1];
  }
  return undefined;
}

window.escape = function(input) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
}
