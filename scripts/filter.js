import { eventsStore } from "./mockData.js";

const events = eventsStore;
const typeSelector = document.querySelector(".type-filter");
const distanceSelector = document.querySelector(".distance-filter");
const categorySelector = document.querySelector(".category-filter");

function getUniqueDistance(events) {
  const uniqueDistances = events.reduce((acc, event) => {
    if (!acc.includes(event.distance)) {
      acc.push(event.distance);
    }
    return acc;
  }, []);
  return uniqueDistances.sort((a, b) => a - b);
}
function getUniqueEventType(events) {
  const uniqueEventType = events.reduce((acc, event) => {
    if (!acc.includes(event.type)) {
      acc.push(event.type);
    }
    return acc;
  }, []);
  return uniqueEventType.sort((a, b) => a.length - b.length);
}
function getUniqueCategory(events) {
  const uniqueCategory = events.reduce((acc, event) => {
    if (!acc.includes(event.category)) {
      acc.push(event.category);
    }
    return acc;
  }, []);
  return uniqueCategory.sort();
}
function fillFilterOptions(selector, options) {
  options.forEach((e) => {
    const option = createOption(e);
    selector.appendChild(option);
  });
}
function createOption(option) {
  const optionElement = document.createElement("option");
  if (Number.isInteger(option)) {
    optionElement.setAttribute("value", option);
    optionElement.textContent = `${option} km`;
    return optionElement;
  }
  optionElement.setAttribute("value", option);
  optionElement.textContent = option;
  return optionElement;
}

function formatDate(date) {
  const weekDay = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const dayNumber = date.toLocaleDateString("en-US", { day: "numeric" });
  const hours = date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    timeZoneName: "short",
  });
  return `${weekDay}, ${month} ${dayNumber} · ${hours}`;
}

function createEvent(event) {
  const eventContainer = document.createElement("div");
  eventContainer.classList.add("event");
  const eventImg = document.createElement("img");
  eventImg.setAttribute("src", event.image);
  eventImg.setAttribute("alt", "event_img");
  const eventContent = document.createElement("div");
  eventContent.classList.add("event__content");
  const date = document.createElement("p");
  date.classList.add("date");
  date.textContent = formatDate(event.date);
  const eventTitle = document.createElement("h3");
  eventTitle.textContent = event.title;
  const eventDistance = document.createElement("p");
  eventDistance.classList.add("distance");
  eventDistance.textContent = `${event.category} (${event.distance} km)`;
  if (event.attendees) {
    const eventAttendees = document.createElement("p");
    eventAttendees.classList.add("attendees");
    eventAttendees.textContent = `${event.attendees} attendees`;
    eventContent.append(date, eventTitle, eventDistance, eventAttendees);
  } else {
    eventContent.append(date, eventTitle, eventDistance);
  }
  eventContainer.append(eventImg, eventContent);
  return eventContainer;
}

function renderEvent(events) {
  const eventContainer = document.querySelector(".event-container");
  if (eventContainer.hasChildNodes) {
    eventContainer.innerHTML = "";
  }
  if (events.length === 0) {
    document.querySelector(".no-events").style.display = "flex";
  } else {
    document.querySelector(".no-events").style.display = "none";
  }
  events.forEach((e) => {
    eventContainer.append(createEvent(e));
  });
}
function getOptions() {
  const type = document.querySelector(".type-filter");
  const distance = document.querySelector(".distance-filter");
  const category = document.querySelector(".category-filter");
  const options = {
    type: type.value,
    distance: Number(distance.value) || "any",
    category: category.value,
  };
  return options;
}
function filterEvents(options, events) {
  const filteredEvents = events
    .filter((e) => {
      if (options.type === "any" || options.type === e.type) {
        return true;
      }
    })
    .filter((e) => {
      if (options.distance === "any" || options.distance === e.distance) {
        return true;
      }
    })
    .filter((e) => {
      if (options.category === "any" || options.category === e.category) {
        return true;
      }
    });
  return filteredEvents;
}

fillFilterOptions(typeSelector, getUniqueEventType(events));
fillFilterOptions(distanceSelector, getUniqueDistance(events));
fillFilterOptions(categorySelector, getUniqueCategory(events));

renderEvent(events);

const selects = document.querySelectorAll("select");
selects.forEach((e) => {
  e.addEventListener("change", () => {
    renderEvent(filterEvents(getOptions(), events));
    console.log(filterEvents(getOptions(), events));
    console.log(getOptions());
  });
});

const resetFilterBtn = document.querySelector(".reset-filters");
resetFilterBtn.addEventListener("click", () => {
  selects.forEach((e) => {
    e.selectedIndex = 0;
    renderEvent(filterEvents(getOptions(), events));
  });
});
