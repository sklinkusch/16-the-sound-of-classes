// const tracksEl = document.querySelector('.tracks')
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

  filterArray(filterValue, filterProperty) {
    return this.data.filter(track => {
      if (filterProperty == "all") {
        if (track.trackName.includes(filterValue) || track.artistName.includes(filterValue)) {
          return track;
        }
      } else {
        if (track[filterProperty].includes(filterValue)) {
          return track;
        }
      }
    });
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
      <div>${track.trackPrice} $</div>
      </div>
      `;
      })
      .join("");
    return htmlString;
  }

  sortAlphabet(data, property, direction) {
    let mapped = data.map((track, index) => {
      return { index: index, value: track[property] };
    });
    let nameA, nameB;
    mapped.sort((a, b) => {
      nameA = a.value.toUpperCase();
      nameB = b.value.toUpperCase();
      if (nameA < nameB) {
        return (-1 * direction);
      } else if (nameA > nameB) {
        return (1 * direction);
      }
      return 0;
    });
    const sortedTracks = mapped.map(tracknr => {
      return data[tracknr.index];
    });
    return sortedTracks;
  }

  sortPricing(data, direction) {
    // TODO: Create a Methode to sort by pricing
    let mapped = data.map((track, index) => {
      return { index: index, value: track.trackPrice };
    });
    mapped.sort((a, b) => {
      return (a.value - b.value) * direction;
    });
    const sortedTracks = mapped.map(tracknr => {
      return data[tracknr.index];
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
    output += template;
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output;
  }

  updateView(filterElement, filterToggler, sortToggler) {
    const filterValue = document.querySelector(filterElement).value;
    const filterProperty = document.querySelector(filterToggler).value;
    const filtered = filterValue == "" || typeof filterValue == "undefined" ? myTrackList.data : myTrackList.filterArray(filterValue, filterProperty);
    const sortValue = document.querySelector(sortToggler).value;
    let sorted;
    switch (sortValue) {
      case "artist-asc":
        sorted = myTrackList.sortAlphabet(filtered, "artistName", 1);
        break;
      case "artist-desc":
        sorted = myTrackList.sortAlphabet(filtered, "artistName", -1);
        break;
      case "title-asc":
        sorted = myTrackList.sortAlphabet(filtered, "trackName", 1);
        break;
      case "title-desc":
        sorted = myTrackList.sortAlphabet(filtered, "trackName", -1);
        break;
      case "price-asc":
        sorted = myTrackList.sortPricing(filtered, 1);
        break;
      case "price-desc":
        sorted = myTrackList.sortPricing(filtered, -1);
        break;
      default:
        sorted = filtered;
    }
    myTrackList.modViewData(sorted);
  }
}

const myTrackList = new TrackList("#tracks", music);
document.querySelector("#togglesort").addEventListener("input", () => {
  myTrackList.updateView("#filter", "#togglefilter", "#togglesort");
});
document.querySelector("#togglefilter").addEventListener("input", () => {
  myTrackList.updateView("#filter", "#togglefilter", "#togglesort");
});
document.querySelector("#filter").addEventListener("input", () => {
  myTrackList.updateView("#filter", "#togglefilter", "#togglesort");
});
