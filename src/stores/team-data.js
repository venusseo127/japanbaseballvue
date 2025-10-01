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

export const useTeamDataStore = defineStore('teamData', {
  state: () => ({
    id: '',
    name: '',
    homeField: '',
    division: '',
    city: '',
    ageRange: '',
    status: '',
    season:'',
    score:'',
  }),
  getters: {
    getId: (state) => state.id,
    getName: (state) => state.name,
    getHomeField: (state) => state.homeField,
    getDivision: (state) => state.division,
    getCity: (state) => state.city,
    getAgeRange: (state) => state.ageRange,
    getStatus: (state) => state.status,
    getSeason: (state) => state.season,
    getScore: (state) => state.score,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "teams")
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
        let docRef = collection(firestoreDb, "teams")
        let docQuery = query(docRef,
          //where("status", "==", "active"),
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
          let docRef = doc(firestoreDb, "teams", id)
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
        if (!data.homeField) { reject('string homeField is required'); return }
        if (!data.division) { reject('string division is required'); return }
        if (!data.city) { reject('string city is required'); return }
        if (!data.ageRange) { reject('string ageRange is required'); return }
        if (!data.status) { reject('string status is required'); return }
        if (!data.season) { reject('string season is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {

            const currentUserId = firebaseAuth.currentUser.uid
            const teamsColRef = collection(firestoreDb, "teams");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // User Information
            const teamDocRef = doc(teamsColRef);
            const teamId = teamDocRef.id
            const postData = {
              name: data.name || '',
              homeField: data.homeField || '',
              division: data.division || '',
              city: data.city || '',
              ageRange: data.ageRange || '',
              createdOn: serverTimestamp(),
              season: data.season || '',
              score:data.score || '',
              createdBy: currentUserId || '',
            }
            transaction.set(teamDocRef, postData);
            returnValue = teamId;
            // Add Event Logs
            const eventData = {
              type: 'TEAM_NEW',
              message: "Team " + data.name + " added.",
              subjectId: teamId,
              senderId: currentUserId || '',
              createdOn: serverTimestamp(),
            }
            transaction.set(doc(logsColRef), eventData);
          });
          console.log("Transaction successfully committed!")
          resolve(returnValue)
        } catch (e) {
          console.log(e)
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
            const teamDocRef = doc(firestoreDb, "teams", data.id);
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Get Document Data
            const teamDoc = await transaction.get(teamDocRef);
            if (!teamDoc.exists()) {
              throw 'Team document not found!'
            }
            let hDoc = teamDoc.data()
            hDoc["id"] = teamDoc.id
            returnValue = hDoc;
            // Update User Data
            transaction.update(teamDocRef, data.updates);
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'TEAM_UPDATED',
              message: "Team " + data.id + " updated.",
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
