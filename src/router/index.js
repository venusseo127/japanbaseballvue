import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { firebaseAuth } from 'boot/firebase'
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "../stores/auth-store";
import { useUserDataStore } from "../stores/user-data";
import { useSessionDataStore } from "../stores/session-data";
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const removeListener = onAuthStateChanged(
        firebaseAuth,
        async (user) => {
          if (user) {
            await user.getIdTokenResult(true).then((idTokenResult) => {
              // console.log("idTokenResult", idTokenResult)
              const authStore = useAuthStore();
              const userDataStore = useUserDataStore();
              authStore.idToken = idTokenResult;
              userDataStore.role = idTokenResult.claims.role || 'customer'
              userDataStore.verified = idTokenResult.claims.verified || false
              userDataStore.paymentGatewayId = idTokenResult.claims.paymentGatewayId || ''
            })
            .catch((error) => {
              console.error(error);
            });
          }
          removeListener()
          resolve(user)
        },
        reject
      )
    })
  }

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    const userDataStore = useUserDataStore();
    const sessionStore = useSessionDataStore()


    if (to.matched.some((record) => record.meta.requiresAuth)){
      if (await getCurrentUser()) {
        // if (to.fullPath.substring(0, 10) == '/dashboard'){
        //   routeDashboard(to, next);
        // } else
        if (to.fullPath == '/' && authStore && authStore.idToken){
          if (userDataStore && userDataStore.role == 'admin'){
            next('/dashboardAdmin');
          } else {
            next('/dashboard');
          }
          //routeDashboard(to, next);
        } else
        if (to.fullPath == '/dashboard/m' && authStore && authStore.idToken){
          if (userDataStore && (userDataStore.role == 'merchant' || userDataStore.role == 'storemanager')){
            if(userDataStore.verified==true){
              next();
            }else{
              next('/registrations?u=m');
            }
          } else {
            next('/restaurant_registration');
          }
        } else
        if (to.fullPath == '/agent_registration' && authStore && authStore.idToken){
            if (userDataStore && (userDataStore.role == 'salesman')){
              next('/dashboard_agent');

            } else {
              next('/agent_registration');
            }

        } else
        if (to.fullPath == '/dashboard_agent' && authStore && authStore.idToken){
          if (userDataStore && userDataStore.role == 'salesman'){
            next();
          } else {
            next('/agent_registration');
          }
        } else
        if (to.fullPath == '/registrations?u=m' && authStore && authStore.idToken){
          if (userDataStore && (userDataStore.role == 'merchant'  || userDataStore.role == 'storemanager')){
            next();
          } else {
            next('/restaurant_registration');
          }
        } else {
          if (userDataStore){
            if (to.meta.requiredAuthRoles.includes(userDataStore.role)){
              next();
            } else {
              if (userDataStore.role == 'admin'){
                next('/dashboardAdmin');
              } else {
                console.error('Your not allowed to this route: ' + to.fullPath.toString())
                next('/dashboard');
              }
            }
          } else {
            console.error('Your not allowed to this route: ' + to.fullPath.toString())
            next('/dashboard');
          }
        }
      } else {
        next('/');
      }
    } else {
      if (to.fullPath == '/'){
        if (await getCurrentUser()) {
          if (authStore && authStore.idToken){
            next('/dashboard');
            //routeDashboard(to, next);
          }
        } else {
          next();
        }
      } else {
        next();
      }
    }
  })

  return Router
})
