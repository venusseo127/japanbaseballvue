import { boot } from 'quasar/wrappers'

import VueGeolocation from "vue3-geolocation";
import GMaps from "vuejs3-google-maps";

export default boot(({ app }) => {
  app.use(VueGeolocation);
  app.use(GMaps, {
    load: {
        apiKey: 'AIzaSyBHZU6qkXyQANzL_n9UejRw0gPGTg9HkaM',
        libraries: ["places"],
    },
  });
  app.mount("#app");
})
