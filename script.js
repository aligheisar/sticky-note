let root = document.querySelector(":root");
let pattern = document.querySelector(".pattern");
let main = document.getElementsByTagName("main")[0];
let settingMenu = document.getElementById("setting-menu");
let settingIcon = document.getElementById("setting-icon");
let saveIcon = document.getElementById("save-icon");
let addColor = document.querySelector(".add-note-section input");
let checkButtons = Array.from(
  document.querySelectorAll(".setting-menu .check-button")
);
let colorSetting = Array.from(
  document.querySelectorAll(".setting-menu .color-setting")
);
let resetSettingButton = document.getElementById("reset-setting");
let setting;
let defaultSetting = {
  showPattern: true,
  autoSave: true,
  bgColor: "#151515",
  patternColor: "#1d1d1d",
  addColor: "#ff9500",
};

// start code

loadSetting();
setSetting();

// event handle

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("mousedown", handleMouseDown);
document.addEventListener("mousemove", handleMouseMove);
document.addEventListener("mouseup", handleMouseUp);
addColor.addEventListener("change", updateSetting);
saveIcon.addEventListener("click", () => saveSetting(setting));
settingIcon.addEventListener("click", toggleSettingMenu);

checkButtons.forEach((element) => {
  element.addEventListener("click", handleCheckButton);
});

colorSetting.forEach((element) =>
  element.addEventListener("input", handleColorInput)
);

resetSettingButton.addEventListener("click", resetSetting);

// functions
let isSpaceDown = false;
let isDragging = false;
let lastMouseMoveTime = 0;
let startX, startY, scrollLeft, scrollTop;

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32) {
    e.preventDefault();
    isSpaceDown = true;
    if (!isDragging) root.style.cursor = "grab";
  }
});

function handleMouseDown(e) {
  if (e.button === 1) {
    e.preventDefault();
    isDragging = true;
    startX = e.pageX;
    startY = e.pageY;
    scrollLeft = window.scrollX;
    scrollTop = window.scrollY;
    root.style.cursor = "grabbing";
  }
  if (isSpaceDown && e.button === 0) {
    isDragging = true;
    // e.preventDefault();
    startX = e.pageX;
    startY = e.pageY;
    scrollLeft = window.scrollX;
    scrollTop = window.scrollY;
    root.style.cursor = "grabbing";
    e.preventDefault();
  }
}

function handleMouseMove(e) {
  if (isDragging) {
    const now = Date.now();

    if (now - lastMouseMoveTime < 16) return; // ~60fps
    lastMouseMoveTime = now;

    const xDiff = e.pageX - startX;
    const yDiff = e.pageY - startY;
    window.scrollTo({
      left: scrollLeft - xDiff,
      top: scrollTop - yDiff,
      behavior: "instant"
    });
  }
}

function handleMouseUp(e) {
  // e.preventDefault();
  isDragging = false;
  !isSpaceDown ? (root.style.cursor = "default") : null;
}

function handleKeyUp(e) {
  if (e.keyCode == 32) {
    isDragging = false;
    isSpaceDown = false;
    root.style.cursor = "default";
  }
}

function handleKeyDown(e) {
  if (e.code === "KeyS" && e.shiftKey) toggleSettingMenu();
  else if (e.code === "KeyR" && e.shiftKey) resetSetting();
  else if (e.key === "Escape") {
    if (document.getElementById("alert"))
      removeElement(document.getElementById("alert"), "hide", 1);
    else if (document.getElementById("popup")) null; // add close popup
    else if (settingMenu.classList.contains("show")) closeSetting();
  }
}

function handleColorInput(e) {
  e.target.getAttribute("id") == "bg-color"
    ? root.style.setProperty("--bg-color", e.target.value)
    : root.style.setProperty("--pattern-color", e.target.value);
  updateSetting();
}

function handleCheckButton(e) {
  e.target.classList.toggle("on");
  updateSetting();
}

function addTransitionClass(element, className = "show") {
  setTimeout(() => element.classList.add(className), 0);
}

async function resetSetting() {
  if (JSON.stringify(setting) === JSON.stringify(defaultSetting)) {
    if (document.getElementById("alert")) return;
    displayAlert(
      "warning",
      "Nothing changes",
      "you can't reset setting while it the same as defalt !"
    );
  } else {
    let result = await popUp(
      "Reset setting",
      "are you sure if you reset setting it not possible to return"
    );
    if (result) {
      localStorage.removeItem("setting");
      loadSetting();
      setSetting();
    }
  }
}

function closeSetting() {
  addRemoveClass(settingMenu, "show", -1);
  addRemoveClass(settingIcon, "open", -1);
}

function removeElement(
  element,
  className = "show",
  opration = -1,
  time = 1000
) {
  addRemoveClass(element, className, opration);
  setTimeout(() => element.remove(), time);
}

function addRemoveClass(element, className = "show", opration) {
  switch (opration) {
    case -1:
      element.classList.remove(className);
      break;
    case 1:
      element.classList.add(className);
      break;
    default:
      element.classList.toggle(className);
  }
}

function toggleSettingMenu() {
  addRemoveClass(settingIcon, "open");
  addRemoveClass(settingMenu);
}

function popUp(title, description) {
  return new Promise((resolve) => {
    let popUpContainer = document.createElement("div");
    popUpContainer.classList.add("popup-container");
    let popUp = document.createElement("div");
    popUp.classList.add("popup");
    popUp.id = "popup";
    popUp.innerHTML = `
      <h3>${title}</h3>
      <p>${description}</p>
      <div class="button-container">
      <button id="confirm">Confirm</button>
      <button id="decline">Decline</button>
      </div>
      `;
    popUpContainer.append(popUp);
    document.body.appendChild(popUpContainer);
    addTransitionClass(popUpContainer);
    addTransitionClass(popUp);
    popUpContainer.addEventListener("click", (e) => {
      // e.stopPropagation();
      if (e.target.classList.contains("popup-container")) {
        resolve(false);
        removeElement(popUp);
        removeElement(popUpContainer);
      }
    });
    document.addEventListener("keydown", (e) => {
      e.preventDefault(),
        e.key === "Escape"
          ? (removeElement(popUp),
            removeElement(popUpContainer),
            resolve(false))
          : e.keyCode === 13
          ? (removeElement(popUp), removeElement(popUpContainer), resolve(true))
          : null;
    });
    let confirmButton = popUp.querySelector("#confirm");
    let declineButton = popUp.querySelector("#decline");
    confirmButton.addEventListener("click", () => {
      removeElement(popUp);
      removeElement(popUpContainer);
      resolve(true);
    });
    declineButton.addEventListener("click", () => {
      removeElement(popUp);
      removeElement(popUpContainer);
      resolve(false);
    });
  });
}

function displayAlert(type, title, description, decay = 3000) {
  let alertWindow = document.createElement("div");
  let classes = ["alert"];
  switch (type) {
    case "danger":
      classes.push("danger");
      break;
    case "warning":
      classes.push("warning");
      break;
    case "success":
      classes.push("success");
      break;
    default:
      break;
  }
  alertWindow.className = classes.join(" ");
  alertWindow.id = "alert";
  alertWindow.innerHTML = `
  <h3>${title}</h3>
  <p>${description}</p>
  `;
  addTransitionClass(alertWindow);
  setTimeout(() => removeElement(alertWindow), decay);
  document.body.appendChild(alertWindow);
}

function getSetting() {
  return JSON.parse(localStorage.getItem("setting"));
}

function loadSetting() {
  let localSetting = getSetting();
  if (localSetting) {
    setting = localSetting;
  } else {
    setting = defaultSetting;
    saveSetting(setting);
  }
}

function saveSetting(setting) {
  JSON.stringify(setting) !== JSON.stringify(getSetting()) &&
    localStorage.setItem("setting", JSON.stringify(setting));
}

function setSetting() {
  if (setting.showPattern) {
    checkButtons[0].classList.add("on");
    pattern.classList.remove("hide");
  } else {
    checkButtons[0].classList.remove("on");
    pattern.classList.add("hide");
  }
  if (setting.autoSave) {
    checkButtons[1].classList.add("on");
    saveIcon.classList.remove("show");
  } else {
    checkButtons[1].classList.remove("on");
    saveIcon.classList.add("show");
  }
  colorSetting[0].value = setting.bgColor;
  colorSetting[1].value = setting.patternColor;
  addColor.value = setting.addColor;
  root.style.setProperty("--bg-color", setting.bgColor);
  root.style.setProperty("--pattern-color", setting.patternColor);
}

function updateSetting() {
  setting = {
    showPattern: checkButtons[0].classList.contains("on"),
    autoSave: checkButtons[1].classList.contains("on"),
    bgColor: colorSetting[0].value,
    patternColor: colorSetting[1].value,
    addColor: addColor.value,
  };
  if (setting.autoSave) saveSetting(setting);
  setSetting();
}
