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
        if (
          track.trackName.includes(filterValue) ||
          track.artistName.includes(filterValue)
        ) {
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
      .map((track, index) => {
        const {
          previewUrl,
          artworkUrl100,
          trackName,
          artistName,
          trackPrice
        } = track;
        return `
      <div class="row">
      <span class="fas fa-play" onclick="Play_Title(${index})">&nbsp;</span>
      <span class="fas fa-pause" onclick="Pause_Title(${index})">&nbsp;</span>
      <audio id="musicplay_${index}" loop><source="${previewUrl}"></audio>
      <img src="${artworkUrl100}" />
      <div>${trackName}</div>
      <div>${artistName}</div>
      <div>${trackPrice} $</div>
      </div>
      `;
      })
      .join("");
    return htmlString;
  }

  Pause_Title(number){
    let audioplayer = document.querySelector(`#musicplay_${number}`);
    audioplayer.pause();
  }

  Play_Title(number){
    let audioplayer = document.querySelector(`#musicplay_${number}`);
    let all_players = document.querySelectorAll('audio');
    for (let element of ...all_players){
      element.pause();
    }
    audioplayer.play();
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
        return -1 * direction;
      } else if (nameA > nameB) {
        return 1 * direction;
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
    const filtered =
      filterValue == "" || typeof filterValue == "undefined"
        ? this.data
        : this.filterArray(filterValue, filterProperty);
    const sortValue = document.querySelector(sortToggler).value;
    let sorted;
    switch (sortValue) {
      case "artist-asc":
        sorted = this.sortAlphabet(filtered, "artistName", 1);
        break;
      case "artist-desc":
        sorted = this.sortAlphabet(filtered, "artistName", -1);
        break;
      case "title-asc":
        sorted = this.sortAlphabet(filtered, "trackName", 1);
        break;
      case "title-desc":
        sorted = this.sortAlphabet(filtered, "trackName", -1);
        break;
      case "price-asc":
        sorted = this.sortPricing(filtered, 1);
        break;
      case "price-desc":
        sorted = this.sortPricing(filtered, -1);
        break;
      default:
        sorted = filtered;
    }
    this.modViewData(sorted);
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
