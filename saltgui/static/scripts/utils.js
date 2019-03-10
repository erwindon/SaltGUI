window.elapsedToString = function(date) {
  try {
    const secondsPassed = (new Date().getTime() / 1000) - (date.getTime() / 1000);

    if(secondsPassed < 0) return "Magic happened in the future";
    if(secondsPassed < 20) return "A few moments ago";
    if(secondsPassed < 120) return "A few minutes ago";

    if(secondsPassed < 60 * 60) {
      const minutes = Math.round(secondsPassed / 60);
      return minutes + " minute(s) ago";
    }

    if(secondsPassed < 60 * 60 * 24) {
      const hours = Math.round(secondsPassed / 60 / 60);
      return hours + " hour(s) ago";
    }

    if(secondsPassed < 60 * 60 * 24 * 2) {
      return "Yesterday";
    }

    if(secondsPassed < 60 * 60 * 24 * 30) {
      const days = Math.round(secondsPassed / 60 / 60 / 24);
      return days + " days ago";
    }

    return "A long time ago, in a galaxy far, far away";
  }
  catch(err) {
    //console.error(err);
    return "It did happen, when I don't know";
  }
};

window.createElement = function(type, className, content) {
  const element = document.createElement(type);
  element.classList.add(className);
  if(content !== "") element.innerHTML = content;
  return element;
};

window.getQueryParam = function(name) {
  const vars = [];
  const hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
  for(const hash of hashes) {
    const hashparts = hash.split("=");
    vars.push(hashparts[0]);
    if(hashparts[0] === name) return hashparts[1];
  }
  return undefined;
};

window.makeTargetText = function(targetType, targetPattern) {
  // note that "glob" is the most common case
  // when used from the command-line, that target-type
  // is not even specified.
  // therefore we suppress that one

  // note that due to bug in 2018.3, all finished jobs
  // will be shown as if of type "list"
  // therefore we suppress that one

  let returnText = "";
  if(targetType !== "glob" && targetType !== "list") {
    returnText = targetType + " ";
  }
  returnText += targetPattern;
  return returnText;
};
