// const tracksEl = document.querySelector('.tracks')
const sortItems = [
  { short: "", long: "Please select" },
  { short: "artist", long: "Artist" },
  { short: "title", long: "Title" },
  { short: "price-asc", long: "Price (ascending)" },
  { short: "price-desc", long: "Price (descending)" }
];
class TrackList {
  // Creating our Class
  constructor(domSelector, data) {
    // Getting a domelement
    this.container = document.querySelector(domSelector);
    // Store my data
    this.data = data;
    // Represents the currently displayed data
    this.viewData = data;

    // Show stuff
    this.render();
    // this.modViewData(this.sortPricing());
  }

  modViewData(newData) {
    this.viewData = newData;
    this.render();
  }

  template(music) {
    // Mapping over data and returning HTML String
    // For now we just assume that all data is there and that it is
    // from datatype string
    // TODO: create a template function
    const htmlString = music
      .map(track => {
        return `
      <div class="row">
      <img src="${track.artworkUrl100}" />
      <div>${track.trackName}</div>
      <div>${track.artistName}</div>
      <div>${track.trackPrice}</div>
      </div>
      `;
      })
      .join("");
    return htmlString;
  }

  sortAlphabet() {}

  sortPricing(direction) {
    // TODO: Create a Methode to sort by pricing
    let mapped = music.map((track, index) => {
      return { index: index, value: track.trackPrice };
    });
    let val;
    mapped.sort((a, b) => {
      return (a.value - b.value) * direction;
    });
    const sortedTracks = mapped.map(tracknr => {
      return music[tracknr.index];
    });
    return sortedTracks;
  }

  render() {
    // Out put will hold the complete view
    let output = "";

    // Setting up data for our view
    const header = "<h1>My Tracks</h1>";
    // template methode accepts data to view and returns html string
    const template = this.template(this.viewData);
    // Adding data in to our view !Order Matters!
    output += header;
    output += "<p>Data from iTunes</p>";
    const dropdown = new DropDown("togglesort", "togglesort");
    const dropdownHTML = dropdown.buildIt(sortItems);
    output += dropdownHTML;
    output += template;
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output;
  }
}

class DropDown {
  constructor(name, id) {
    // this.container = document.querySelector(domSelector);
    this.name = name;
    this.id = id;
  }
  buildIt(options) {
    return (
      `<select name="${this.name}" id="${this.id}">` +
      options
        .map(option => {
          return `<option value="${option.short}">${option.long}</option>`;
        })
        .join("") +
      `</select>`
    );
  }
}

const myTrackList = new TrackList("#tracks", music);
document.querySelector("#togglesort").addEventListener("input", () => {
  const sortValue = document.querySelector("#togglesort").value;
  let sorted;
  switch (sortValue) {
    case "artist":
      break;
    case "price-asc":
      sorted = myTrackList.sortPricing(1);
      myTrackList.modViewData(sorted);
      break;
    case "price-desc":
      sorted = myTrackList.sortPricing(-1);
      myTrackList.modViewData(sorted);
      break;
    default:
      myTrackList.modViewData(myTrackList.data);
  }
});
