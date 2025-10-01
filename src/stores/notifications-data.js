/* eslint-disable */

import { defineStore } from 'pinia';
import { firebaseAuth, firestoreDb } from 'boot/firebase'
import {
  collection, onSnapshot,
  query, orderBy, where, getDocs,limit,endAt
} from "firebase/firestore";

export const useNotificationDataStore = defineStore('notificationData', {
  state: () => ({
    emitterInstance: undefined,
    notifications: [],
    unsubscribeNotificationList:null
  }),
  getters: {
    getGeoLocation: (state) => state.gpsLocation,
    getGeoAddress: (state) => state.gpsAddress,
  },
  actions: {
    setEmitterInstance(emitInstance){
      this.emitterInstance = emitInstance
    },
    async firebaseGetNotificationOnce(){
      this.notifications = []
      const currentUserId = firebaseAuth.currentUser.uid
      const docRef = collection(firestoreDb, 'notifications')
      const docQuery = query(docRef,
        where("targetUser", "==", currentUserId),
        orderBy("createdOn", "desc"),
        limit(20)
      )
      const querySnapshot = await getDocs(docQuery);
      if (!querySnapshot.empty){
        querySnapshot.forEach((doc) => {
          let hDoc = doc.data()
          hDoc["notificationId"] = doc.id
          this.notifications.push(hDoc)
        })
      }
      return JSON.stringify(this.notifications)
    },
    firebaseGetNotificationRealtime() {
      this.notifications = []
      const docRef = collection(firestoreDb, 'notifications')
      const currentUserId = firebaseAuth.currentUser.uid;
      const docQuery = query(docRef,
        where("targetUser", "==", currentUserId),
        orderBy("createdOn", "desc"),
        limit(20)
      )
      this.unsubscribeNotificationList = onSnapshot(docQuery, (docSnapshot) => {
        docSnapshot.docChanges().forEach(change => {
          this.emitterInstance.$emit('notification-update', change)
          if (change.type === 'added') {
            const hDoc = this.notifications.find(elem => elem.notificationId === change.doc.id)
            if (hDoc && hDoc.targetUser === currentUserId) {
              let hChangeDoc = change.doc.data()
              hChangeDoc["notificationId"] = change.doc.id
              this.notifications.push(hChangeDoc)
            }
          }
          if (change.type === 'modified') {
            let hMessage = this.notifications.find(elem => elem.messageId === change.doc.id)
            let hChangeDoc = change.doc.data()
            hChangeDoc["notificationId"] = change.doc.id
            if (hMessage) hMessage = hChangeDoc
          }
          if (change.type === 'removed') {
            const nIndex = this.notifications.findIndex(elem => elem.messageId === change.doc.id)
            this.notifications.splice(nIndex, 1)
          }
        })
      })
    },
    unsubscribeNotifications(){// beforeunmount
      this.unsubscribeNotificationList && this.unsubscribeNotificationList()
    },
  },
});
