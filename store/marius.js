import Vue from 'vue'

export const state = () => ({
  itineraries: {
    current: { sections: [{ geojson: { coordinates: [] } }] },
    alternatives: [{ sections: [{ geojson: { coordinates: [] } }] }]
  },
  seeModal: false,



})

export const getters = ({
  // Current Details

  co2current: state => state.itineraries.current.co2Emission["value"],
  getMode: state => state.itineraries.current.tags[0],
  durationcurrent: state => Math.round(state.itineraries.current.duration / 60),

  // Alternative Details

  AlternativesDetails: state => {
    let detailsAlters = []
    console.log(detailsAlters, 'TEST 51')
    state.itineraries.alternatives.forEach(section => {
      if (section) {
        detailsAlters.push({
          co2: Math.round(section.co2Emission["value"]),
          duration: Math.round(section.duration / 60),
          mode: section.tags[0],

        })
      }
    });

    return detailsAlters

  },



  // Current Itineraries Vehicule
  latLngs: state => {
    let latLngs = []

    state.itineraries.current.sections.forEach(section => {
      if (section.geojson) latLngs.push(...section.geojson.coordinates)
    });
    return latLngs
  },


  // Alternative itineraries Vehicule


  latLngsAlternatives: state => {
    let latLngsAlters = []
    state.itineraries.alternatives.forEach(itinerary => {
      let latLngs = []
      itinerary.sections.forEach(section => {
        if (section.geojson) latLngs.push(...section.geojson.coordinates)
      });
      latLngsAlters.push(latLngs)
    });
    console.log(latLngsAlters, ' TEST 43')
    return latLngsAlters

  }



})

export const mutations = {
  'SET'(state, payload) {
    for (const key in payload) Vue.set(state, key, payload[key])
  },
  SET_ITINERARIES(state, payload) {
    payload.current.sections.map(section => {
      if (section.geojson) return section.geojson.coordinates.map(x => x.reverse())
    })
    payload.alternatives.map(itinerary => {
      return itinerary.sections.map(section => {
        if (section.geojson) return section.geojson.coordinates.map(x => x.reverse())
      })
    })
    state.itineraries = payload;
  },


  // MODAL DETAILS

  TOGGLE_MODAL(state) {
    state.seeModal = !state.seeModal;
  },
}



export const actions = {
  async fetchitineraries({ commit }, { from, to, mode }) {
    const itineraries = await this.$axios.$get(
      "/itineraries/calculate", { params: { departure_address: from, arrival_address: to, mode } }
    )

    commit("SET_ITINERARIES", itineraries);
  },
}

//http://marcelle-mobi-api.herokuapp.com/itineraries/calculate?departure_address=metro%20dromel&arrival_address=12%20impasse%20abeille&mode=bike

