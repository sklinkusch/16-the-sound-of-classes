// const tracksEl = document.querySelector('.tracks')
class TrackList {
  // Creating our Class
  constructor(domSelector) {
    // Getting a domelement
    this.container = document.querySelector(domSelector)
    // Store my data
    this.data = null
    // Represents the currently displayed data
    this.viewData = null

    // Show stuff
    this.render()
    this.addEventListeners()
  }

  addEventListeners() {
    document.querySelector("#togglesort").addEventListener("input", () => {
      myTrackList.updateView("#filter", "#togglefilter", "#togglesort")
    })
    document.querySelector("#togglefilter").addEventListener("input", () => {
      myTrackList.updateView("#filter", "#togglefilter", "#togglesort")
    })
    document.querySelector("#filter").addEventListener("input", () => {
      myTrackList.updateView("#filter", "#togglefilter", "#togglesort")
    })
    if (this.data) {

      this.data.forEach(track => {
        const { trackId, previewUrl } = track
        document.querySelector(`#play_${trackId}`).addEventListener("click", () => {
          let player = document.querySelector(`#musicplay_${trackId}`)
          player.src = previewUrl
          let sounds = document.querySelectorAll("audio")
          sounds.forEach(sound => {
            if (sound.duration > 0 && !sound.paused) {
              sound.pause()
              sound.src = ""
            }
          })
          player.play()
        })
        document.querySelector(`#pause_${trackId}`).addEventListener("click", () => {
          let sounds = document.querySelectorAll("audio")
          sounds.forEach(sound => {
            if (sound.duration > 0 && !sound.paused) {
              sound.pause()
              sound.src = ""
            }
          })
        })
      })
    }
  }
  filterArray(filterValue, filterProperty) {
    return this.data.filter(track => {
      if (filterProperty == "all") {
        if (
          track.trackName.toLowerCase().includes(filterValue.toLowerCase()) ||
          track.artistName.toLowerCase().includes(filterValue.toLowerCase()) ||
          track.collectionName.toLowerCase().includes(filterValue.toLowerCase())
        ) {
          return track
        }
      } else {
        if (
          track[filterProperty]
            .toLowerCase()
            .includes(filterValue.toLowerCase())
        ) {
          return track
        }
      }
    })
  }

  getDate(rawDate) {
    return `${(rawDate.substr(8, 2))}.${(rawDate.substr(5, 2))}.${(rawDate.substr(0, 4))}`
  }
  getSongPrice(rawPrice, rawCurrency) {
    if (rawPrice === -1) {
      return "Album only"
    }
    let currency = "";
    switch (rawCurrency) {
      // US Dollar
      case "USD":
        currency = "$"
        break
      // Canadian Dollar
      case "CAD":
        currency = "C$"
        break
      // Australian Dollar
      case "AUD":
        currency = "A$"
        break
      // Euro
      case "EUR":
        currency = "€"
        break
      // Japanese Yen and Chinese Renminbi
      case "JPY":
      case "CNY":
        currency = "¥"
        break
      // British Pound
      case "GBP":
        currency = "£"
        break
      default:
        currency = rawCurrency
    }
    return `${(Number(rawPrice).toFixed(2))} ${currency}`
  }

  modViewData(newData) {
    this.viewData = newData
    this.render()
  }

  defaultTemplate() {
    return `Search to see music`
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
          trackPrice,
          trackId,
          collectionName,
          releaseDate,
          currency
        } = track
        return `
      <div class="row">
      <span class="fas fa-play" id="play_${trackId}">&nbsp;</span>
      <span class="fas fa-pause" id="pause_${trackId}">&nbsp;</span>
      <audio id="musicplay_${trackId}" loop src="${previewUrl}"></audio>
      <img src="${artworkUrl100}" />
      <div>${trackName}<br><span class="small">${collectionName}</span></div>
      <div>${artistName}<br><span class="small">${(this.getDate(releaseDate))}</span></div>
      <div>${(this.getSongPrice(trackPrice, currency))}</div>
      </div>
      `
      })
      .join("")
    return htmlString
  }

  sortAlphabet(data, property, direction) {
    let mapped = data.map((track, index) => {
      return { index: index, value: track[property] }
    })
    let nameA, nameB
    mapped.sort((a, b) => {
      nameA = a.value.toUpperCase()
      nameB = b.value.toUpperCase()
      if (nameA < nameB) {
        return -1 * direction
      } else if (nameA > nameB) {
        return 1 * direction
      }
      return 0
    })
    const sortedTracks = mapped.map(tracknr => {
      return data[tracknr.index]
    })
    return sortedTracks
  }

  sortPricing(data, direction) {
    // TODO: Create a Methode to sort by pricing
    let mapped = data.map((track, index) => {
      return { index: index, value: track.trackPrice }
    })
    mapped.sort((a, b) => {
      return (a.value - b.value) * direction
    })
    const sortedTracks = mapped.map(tracknr => {
      return data[tracknr.index]
    })
    return sortedTracks
  }

  render() {
    // Out put will hold the complete view
    let output = ""

    // Setting up data for our view
    const header = "<h1>My Tracks</h1>"
    // template methode accepts data to view and returns html string
    const template = this.viewData ? this.template(this.viewData) : this.defaultTemplate()
    // Adding data in to our view !Order Matters!
    output += header
    output += "<p>Data from iTunes</p>"
    output += template
    // Assinging view in to innerHTML of our domElement form the constructor
    this.container.innerHTML = output
  }

  updateData(data) {
    // Store my data
    this.data = data
    // Represents the currently displayed data
    this.viewData = data
    this.render()
  }

  updateView(filterElement, filterToggler, sortToggler) {
    const filterValue = document.querySelector(filterElement).value
    const filterProperty = document.querySelector(filterToggler).value
    const filtered =
      filterValue == "" || typeof filterValue == "undefined"
        ? this.data
        : this.filterArray(filterValue, filterProperty)
    const sortValue = document.querySelector(sortToggler).value
    let sorted
    switch (sortValue) {
      case "artist-asc":
        sorted = this.sortAlphabet(filtered, "artistName", 1)
        break
      case "artist-desc":
        sorted = this.sortAlphabet(filtered, "artistName", -1)
        break
      case "title-asc":
        sorted = this.sortAlphabet(filtered, "trackName", 1)
        break
      case "title-desc":
        sorted = this.sortAlphabet(filtered, "trackName", -1)
        break
      case "album-asc":
        sorted = this.sortAlphabet(filtered, "collectionName", 1)
        break
      case "album-desc":
        sorted = this.sortAlphabet(filtered, "collectionName", -1)
        break
      case "relDate-asc":
        sorted = this.sortAlphabet(filtered, "releaseDate", 1)
        break
      case "relDate-desc":
        sorted = this.sortAlphabet(filtered, "releaseDate", -1)
        break
      case "price-asc":
        sorted = this.sortPricing(filtered, 1)
        break
      case "price-desc":
        sorted = this.sortPricing(filtered, -1)
        break
      default:
        sorted = filtered
    }
    this.modViewData(sorted)
  }
}

const myTrackList = new TrackList("#tracks")

document.querySelector("#searchbutton").addEventListener("click", () => {
  let searchValue = document.querySelector("#searchfield").value
  if (searchValue !== "" && typeof searchValue !== undefined) {
    const urlSearchValue = searchValue.replace(" ", "%20")
    const url = `https://dci-fbw12-search-itunes.now.sh/?term=${urlSearchValue}`
    const req = new XMLHttpRequest()
    req.open("GET", url, true)
    req.responseType = "json"
    req.onload = function () {
      var jsonResponse = req.response
      myTrackList.updateData(jsonResponse.results)
    }
    req.send(null)
  }
})