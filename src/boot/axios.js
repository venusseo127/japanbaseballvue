import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import GlobalConfigJson from '../../global-config.json'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const firebaseProjectName = GlobalConfigJson.FIREBASE_PROJECT
const apiProdUrl = 'http://47.88.16.186/api/'; // 'https://api.dineindeals.app/';
const apiStagingUrl = 'http://47.88.16.186/api/'; // 'https://api.dineindeals.app/';
// const firebaseURLProd = 'https://braintreeendpoints-vsimdvhp5q-uc.a.run.app';
const firebaseURLProd = 'https://appendpoints-vsimdvhp5q-uc.a.run.app';
// const firebaseURLStaging = 'https://braintreeendpoints-cy3hncsaoq-uc.a.run.app';
const firebaseURLStaging = 'https://appendpoints-cy3hncsaoq-uc.a.run.app';

let api; let firebaseAPI; let firebaseAPIUrl = '';
if (firebaseProjectName === 'staging'){
  api = axios.create({ baseURL: apiStagingUrl })
  firebaseAPI = axios.create({ baseURL: firebaseURLStaging })
  firebaseAPIUrl = firebaseURLStaging;
} else
if (firebaseProjectName === 'production'){
  api = axios.create({ baseURL: apiProdUrl })
  firebaseAPI = axios.create({ baseURL: firebaseURLProd })
  firebaseAPIUrl = firebaseURLProd;
}

export default defineBoot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export {
  api,
  apiProdUrl,
  apiStagingUrl,
  firebaseAPIUrl,
  firebaseAPI
}
