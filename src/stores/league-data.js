/* eslint-disable */

import { defineStore } from 'pinia';
import {
  firebaseAuth,
  firestoreDb,
} from 'boot/firebase'
import {
  runTransaction,
  collection, query, where, orderBy,
  doc, getDoc, getDocs, serverTimestamp,
} from "firebase/firestore";

export const useLeagueDataStore = defineStore('leagueData', {
  state: () => ({
    id: '',
    name: '',
    season: '',
    status: '',
  }),
  getters: {
    getId: (state) => state.id,
    getName: (state) => state.name,
    getSeason: (state) => state.season,
    getStatus: (state) => state.status,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "leagues")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("name", "asc"),
        )
        const querySnapshot = await getDocs(docQuery);
        if (!querySnapshot.empty){
          querySnapshot.forEach((doc) => {
            let hDoc = doc.data()
            hDoc["id"] = doc.id
            returnList.push(hDoc)
          })
        }
        resolve(returnList);
      });
    },
    getRecords() {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "leagues")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("name", "asc"),
        )
        const querySnapshot = await getDocs(docQuery);
        if (!querySnapshot.empty){
          querySnapshot.forEach((doc) => {
            let hDoc = doc.data()
            hDoc["id"] = doc.id
            returnList.push(hDoc)
          })
        }
        resolve(returnList);
      });
    },
    getRecord(id) {
      return new Promise(async (resolve, reject) => {
        if (!id) reject('string id is required')
        let returnValue = {}
        if (id){
          let docRef = doc(firestoreDb, "leagues", id)
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            let hDoc = docSnap.data()
            hDoc["id"] = docSnap.id
            returnValue = hDoc;
          }
        }
        resolve(returnValue);
      });
    },
    addRecord(data) {
      return new Promise(async (resolve, reject) => {
        if (!data.name) { reject('string name is required'); return }
        if (!data.season) { reject('string season is required'); return }
        if (!data.status) { reject('string status is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            const currentUserId = firebaseAuth.currentUser.uid
            const leaguesColRef = collection(firestoreDb, "leagues");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // User Information
            const leagueDocRef = doc(leaguesColRef);
            const leagueId = leagueDocRef.id
            const postData = {
              name: data.name || '',
              season: data.season || '',
              status: data.status || '',
              createdOn: serverTimestamp(),
              createdBy: currentUserId || '',
            }
            transaction.set(leagueDocRef, postData);
            returnValue = leagueId;
            // Add Event Logs
            const eventData = {
              type: 'LEAGUE_NEW',
              message: "League " + data.name + " added.",
              subjectId: leagueId,
              senderId: currentUserId || '',
              createdOn: serverTimestamp(),
            }
            transaction.set(doc(logsColRef), eventData);
          });
          console.log("Transaction successfully committed!")
          resolve(returnValue)
        } catch (e) {
          reject("Transaction failed: ", e)
        }
      })
    },
    updateRecord(data) {
      return new Promise(async (resolve, reject) => {
        if (!data.id) { reject('string id is required'); return }
        if (!data.updates) { reject('object updates is required'); return }
        let returnValue = {}
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            const currentUserId = firebaseAuth.currentUser.uid
            const leagueDocRef = doc(firestoreDb, "leagues", data.id);
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Get Document Data
            const leagueDoc = await transaction.get(leagueDocRef);
            if (!leagueDoc.exists()) {
              throw 'League document not found!'
            }
            let hDoc = leagueDoc.data()
            hDoc["id"] = leagueDoc.id
            returnValue = hDoc;
            // Update User Data
            transaction.update(leagueDocRef, data.updates);
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'LEAGUE_UPDATED',
              message: "League " + data.id + " updated.",
              subjectId: data.id,
              senderId: currentUserId || '',
              createdOn: serverTimestamp(),
            });
          });
          resolve(returnValue)
        } catch (e) {
          reject("Transaction failed: ", e)
        }
      })
    },
  },
});
