<template>
  <div>
    <div ref="map" class="w-full h-[400px]" />
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return {}
      },
    },
    zoom: {
      type: Number,
      default: 15,
    },
    coords: {
      type: Object,
      default: () => {
        return {
          lat: 0,
          lng: 0,
        }
      },
    },
  },
  data() {
    return {
      mValue: null,
      map: null,
      google: null,
      geocoder: null,
      markerCluster: null,
      marker: null,
      placeService: null,
      position: {},
      events: [
        'bounds_changed',
        'center_changed',
        'click',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'heading_changed',
        'idle',
        'maptypeid_changed',
        'mousemove',
        'mouseout',
        'mouseover',
        'projection_changed',
        'resize',
        'rightclick',
        'tilesloaded',
        'tilt_changed',
        'zoom_changed',
      ],
      markerEvents: [
        'animation_changed',
        'click',
        'clickable_changed',
        'contextmenu',
        'cursor_changed',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'flat_changed',
        'icon_changed',
        'maptypeid_changed',
        'mousedown',
        'mouseout',
        'mouseover',
        'mouseup',
        'resize',
        'rightclick',
        'position_changed',
        'title_changed',
        'visible_changed',
        'zindex_changed',
      ],
    }
  },
  mounted() {
    this.initMap()
  },
  methods: {
    /**
     * Initial load google map
     */
    async initMap() {
      try {
        const google = await this.$gMaps.load()
        const { PlacesService } = await google.maps.importLibrary('places')

        // Loaded the Map
        const map = await new google.maps.Map(this.$refs.map, {
          center: this.coords,
          zoom: this.zoom,
          ...this.options,
        })

        // Loaded the custom marker
        const markerIcon = '/icon/pin-map.svg'

        const marker = await new google.maps.Marker({
          map,
          position: this.coords,
          icon: markerIcon,
          draggable: true,
        })

        this.geocoder = new google.maps.Geocoder()
        this.google = google
        this.map = map
        this.marker = marker

        this.placeService = await new PlacesService(map)
      } catch (e) {
        console.error(e)
      }

      this.setMapEvent()
      this.setMarkerEvent()
    },
    /**
     * Set event map
     */
    setMapEvent() {
      this.events.forEach((event) => {
        this.map.addListener(event, (e) => {
          this.$emit(`${event}:map`, {
            position: this.coords,
            map: this.map,
            event: e,
          })
          this.marker.setPosition({
            lat: this.coords.lat,
            lng: this.coords.lng,
          })
          this.geocodeLatLng(this.geocoder, this.map, this.coords)
        })
      })
    },
    /**
     * Set event marker
     */
    setMarkerEvent() {
      this.markerEvents.forEach((event) => {
        this.marker.addListener(event, (e) => {
          this.$emit(`${event}:marker`, {
            position: this.coords,
            event: e,
            map: this.map,
          })
          this.geocodeLatLng(this.geocoder, this.map, this.coords)
        })
      })
    },
    /**
     * @function: to get location
     */
    geocodeLatLng(geocoder, map, coords) {
      geocoder
        .geocode({ location: coords })
        .then((response) => {
          if (response.results[0]) {
            const { place_id: placeId } = response.results[0]
            this.getPlaceDetail(placeId)
          } else {
            console.error('No results found')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * @function: to get Place Detail
     */
    getPlaceDetail(placeId) {
      const request = {
        placeId,
        fields: ['name', 'formatted_address', 'place_id'],
      }
      this.placeService.getDetails(request, (place, status) => {
        if (status === 'OK') {
          this.$emit('set:place', place)
        }
      })
    },
  },
}
</script>
