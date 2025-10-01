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

export const usePlayerDataStore = defineStore('playerData', {
  state: () => ({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    shirtNumber: '',
    teamId: '',
    teamPosition: '',
    height: '',
    weight: '',
    battingHand: '',
    throwingHand: '',
    status: '',
  }),
  getters: {
    getId: (state) => state.id,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getDateOfBirth: (state) => state.dateOfBirth,
    getShirtNumber: (state) => state.shirtNumber,
    getTeamId: (state) => state.teamId,
    getTeamPosition: (state) => state.teamPosition,
    getHeight: (state) => state.height,
    getWeight: (state) => state.weight,
    getBattingHand: (state) => state.battingHand,
    getThrowingHand: (state) => state.throwingHand,
    getStatus: (state) => state.status,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "players")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("lastName", "asc"),
          orderBy("firstName", "asc"),
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
        let docRef = collection(firestoreDb, "players")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("lastName", "asc"),
          orderBy("firstName", "asc"),
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
    getRecordsByTeamId(teamId) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "players")
        let docQuery = query(docRef,
          where("teamId", "==", teamId),
          orderBy("lastName", "asc"),
          orderBy("firstName", "asc"),
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
          let docRef = doc(firestoreDb, "players", id)
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
        if (!data.firstName) { reject('string firstName is required'); return }
        if (!data.lastName) { reject('string lastName is required'); return }
        //if (!data.dateOfBirth) { reject('string dateOfBirth is required'); return }
        if (!data.shirtNumber) { reject('string shirtNumber is required'); return }
        if (!data.teamId) { reject('string teamId is required'); return }
        if (!data.teamName) { reject('string teamName is required'); return }
        //if (!data.teamPosition) { reject('string teamPosition is required'); return }
        //if (!data.height) { reject('string height is required'); return }
        //if (!data.weight) { reject('string weight is required'); return }
        if (!data.battingHand) { reject('string battingHand is required'); return }
        if (!data.throwingHand) { reject('string throwingHand is required'); return }
        if (!data.status) { reject('string status is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            //const currentUserId = firebaseAuth.currentUser.uid
            const playersColRef = collection(firestoreDb, "players");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // User Information
            const playerDocRef = doc(playersColRef);
            const playerId = playerDocRef.id
            const postData = {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              dateOfBirth: data.dateOfBirth || '',
              shirtNumber: data.shirtNumber || '',
              teamId: data.teamId || '',
              teamName: data.teamName || '',
              //teamPosition: data.teamPosition || '',
              playerPosition:data.playerPosition || '',
              playerType:data.playerType || '',
              gameId: data.gameId || '',
              height: data.height || '',
              weight: data.weight || '',
              battingHand: data.battingHand || '',
              throwingHand: data.throwingHand || '',
              status: data.status || '',
              createdOn: serverTimestamp(),
              createdBy: ''//currentUserId || '',
            }
            transaction.set(playerDocRef, postData);
            returnValue = playerId;
            // Add Event Logs
            const eventData = {
              type: 'PLAYER_NEW',
              message: "Player " + data.firstName +" "+ data.lastName + " added.",
              subjectId: playerId,
              senderId: '',//currentUserId || '',
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
            const teamDocRef = doc(firestoreDb, "players", data.id);
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
              type: 'PLAYER_UPDATED',
              message: "Player " + data.id + " updated.",
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
