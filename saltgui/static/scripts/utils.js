window.elapsedToString = function(date) {
  try {
    let secondsPassed = (new Date().getTime() / 1000) - (date.getTime() / 1000);

    if(secondsPassed < 0) return "Magic happened in the future";
    if(secondsPassed < 20) return "A few moments ago";
    if(secondsPassed < 120) return "A few minutes ago";

    if(secondsPassed < 60 * 60) {
      let minutes = Math.round(secondsPassed / 60);
      return minutes + " minute(s) ago";
    }

    if(secondsPassed < 60 * 60 * 24) {
      let hours = Math.round(secondsPassed / 60 / 60);
      return hours + " hour(s) ago";
    }

    if(secondsPassed < 60 * 60 * 24 * 2) {
      return "Yesterday";
    }

    if(secondsPassed < 60 * 60 * 24 * 30) {
      let days = Math.round(secondsPassed / 60 / 60 / 24);
      return days + " days ago";
    }

    return "A long time ago, in a galaxy far, far away";
  }
  catch(err) {
    console.error(err);
    return "It did happen, when I don't know";
  }
};

window.createElement = function(type, className, content) {
  let element = document.createElement(type);
  element.classList.add(className);
  if(content !== "") element.innerHTML = content;
  return element;
};

window.getQueryParam = function(name) {
  let vars = [], hash;
  let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(let i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    if(hash[0] === name) return hash[1];
  }
  return undefined;
};

window.escape = function(input) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};
