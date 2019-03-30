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

window.getQueryParam2 = function(url, name) {
  const questionmarkPos = url.indexOf("?");
  if(questionmarkPos < 0) return undefined;
  const parameters = url.slice(questionmarkPos + 1).split("&");
  for(const parameter of parameters) {
    const namevalue = parameter.split("=");
    if(namevalue.length !== 2) continue;
    if(namevalue[0] === name) return namevalue[1];
  }
  return undefined;
};

window.getQueryParam = function(name) {
  if(!window.location) return undefined;
  return window.getQueryParam2(window.location.href, name);
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
