
import { defineStore } from 'pinia';

import { firebaseAuth, firestoreDb } from 'boot/firebase'
import { runTransaction, collection, doc } from "firebase/firestore";

export const useSessionDataStore = defineStore('sessionData', {
  state: () => ({
    deferredPrompt: null,
    showBanner:true,
  }),
  getters: {
    getGeoLocation: (state) => state.gpsLocation,
    getGeoAddress: (state) => state.gpsAddress,
  },
  actions: {
    serviceWorkerSupported(){
      if ('serviceWorker' in navigator) return true
      return false
    },
    pushNotificationsSupported(){
      if ('PushManager' in window) return true
      return false
    },
    enablePushNotif() {
      if (this.pushNotificationsSupported()){
        Notification.requestPermission(result => {
          if (result == 'granted'){
            this.checkExistingPushSubscription()
          }
        })
      }
    },
    checkExistingPushSubscription(){
      if (this.serviceWorkerSupported() && this.pushNotificationsSupported()){
        let reg
        navigator.serviceWorker.ready.then(swreg => {
          reg = swreg
          return swreg.pushManager.getSubscription()
        }).then(sub => {
          if (!sub){
            this.createPushSubscription(reg)
          }
          //  else {
          //   let newSubData = sub.toJSON()
          //   console.log("newSubData", newSubData)
          // }
        })
      }
    },
    createPushSubscription(reg){
      let vapidPublicKey = 'BN4TlR8G95xncYi_ooBdyFdIB155NJHRFSNetPDmsKKmYi6c8FyIYqKltI9SqifTomU_-fgMsLNSI3G303ORWNQ'
      reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      }).then(newSub => {
        let newSubData = newSub.toJSON()
        this.firebaseSetPushSubscription(newSubData)
      })
    },
    async firebaseSetPushSubscription(payload) {
      const userId = firebaseAuth.currentUser.uid
      try {
        let payloadSubscription = payload
        await runTransaction(firestoreDb, async (transaction) => {
          const pushsubscriptionsRef = collection(firestoreDb, "pushsubscriptions");
          payloadSubscription["userId"] = userId
          console.log("payloadSubscription", payloadSubscription)
          transaction.set(doc(pushsubscriptionsRef), payloadSubscription)
        });
        console.log("Transaction successfully committed!")
        Promise.resolve()
      } catch (e) {
        console.error("Transaction failed: ", e)
        Promise.reject()
      }
    },
  },
});
