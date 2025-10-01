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

export const useGameEventDataStore = defineStore('gameEventData', {
  state: () => ({
    id: '',
    gameId: '',
    leagueId: '',
    leagueName: '',
    homeTeam: '',
    awayTeam: '',
    inning: '',
    half: '',
    batterId: '',
    batterNumber: '',
    batterName: '',
    pitcherId: '',
    pitcherNumber: '',
    pitcherName: '',
    description: '',
    type: '',
    runnerFirstId: '',
    runnerFirstNumber: '',
    runnerFirstName: '',
    runnerSecondId: '',
    runnerSecondNumber: '',
    runnerSecondName: '',
    runnerThirdId: '',
    runnerThirdNumber: '',
    runnerThirdName: '',
    fielderLFId: '',
    fielderLFNumber: '',
    fielderLFName: '',
    fielderCFId: '',
    fielderCFNumber: '',
    fielderCFName: '',
    fielderRFId: '',
    fielderRFNumber: '',
    fielderRFName: '',
    fielderFirstId: '',
    fielderFirstNumber: '',
    fielderFirstName: '',
    fielderSecondId: '',
    fielderSecondNumber: '',
    fielderSecondName: '',
    fielderThirdId: '',
    fielderThirdNumber: '',
    fielderThirdName: '',
    fielderSSId: '',
    fielderSSNumber: '',
    fielderSSName: '',
    outs: 0,
    status: '',
  }),
  getters: {
    getId: (state) => state.id,
    getGameId: (state) => state.gameId,
    getLeagueId: (state) => state.leagueId,
    getLeagueName: (state) => state.leagueName,
    getHomeTeam: (state) => state.homeTeam,
    getAwayTeam: (state) => state.awayTeam,
    getInning: (state) => state.inning,
    getHalf: (state) => state.half,
    getBatterId: (state) => state.batterId,
    getBatterNumber: (state) => state.batterNumber,
    getBatterName: (state) => state.batterName,
    getPitcherId: (state) => state.pitcherId,
    getPitcherNumber: (state) => state.pitcherNumber,
    getPitcherName: (state) => state.pitcherName,
    getDescription: (state) => state.description,
    getType: (state) => state.type,
    getRunnerFirstId: (state) => state.runnerFirstId,
    getRunnerFirstNumber: (state) => state.runnerFirstNumber,
    getRunnerFirstName: (state) => state.runnerFirstName,
    getRunnerSecondId: (state) => state.runnerSecondId,
    getRunnerSecondNumber: (state) => state.runnerSecondNumber,
    getRunnerSecondName: (state) => state.runnerSecondName,
    getRunnerThirdId: (state) => state.runnerThirdId,
    getRunnerThirdNumber: (state) => state.runnerThirdNumber,
    getRunnerThirdName: (state) => state.runnerThirdName,
    getFielderLFId: (state) => state.fielderLFId,
    getFielderLFNumber: (state) => state.fielderLFNumber,
    getFielderLFName: (state) => state.fielderLFName,
    getFielderCFId: (state) => state.fielderCFId,
    getFielderCFNumber: (state) => state.fielderCFNumber,
    getFielderCFName: (state) => state.fielderCFName,
    getFielderRFId: (state) => state.fielderRFId,
    getFielderRFNumber: (state) => state.fielderRFNumber,
    getFielderRFName: (state) => state.fielderRFName,
    getFielderFirstId: (state) => state.fielderFirstId,
    getFielderFirstNumber: (state) => state.fielderFirstNumber,
    getFielderFirstName: (state) => state.fielderFirstName,
    getFielderSecondId: (state) => state.fielderSecondId,
    getFielderSecondNumber: (state) => state.fielderSecondNumber,
    getFielderSecondName: (state) => state.fielderSecondName,
    getFielderThirdId: (state) => state.fielderThirdId,
    getFielderThirdNumber: (state) => state.fielderThirdNumber,
    getFielderThirdName: (state) => state.fielderThirdName,
    getFielderSSId: (state) => state.fielderSSId,
    getFielderSSNumber: (state) => state.fielderSSNumber,
    getFielderSSName: (state) => state.fielderSSName,
    getOuts: (state) => state.outs,
    getStatus: (state) => state.status,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "gameEvents")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("createdOn", "asc"),
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
        let docRef = collection(firestoreDb, "gameEvents")
        let docQuery = query(docRef,
          //where("status", "==", "active"),
          orderBy("createdOn", "asc"),
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
    getRecordsByGame(gameId){
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "gameEvents")
        let docQuery = query(docRef,
          where("gameId", "==", gameId),
          orderBy("createdOn", "desc"),
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
          let docRef = doc(firestoreDb, "gameEvents", id)
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
        console.log("addRecord", data)
        if (!data.gameId) { reject('string gameId is required'); return }
        if (!data.leagueId) { reject('string leagueId is required'); return }
        if (!data.leagueName) { reject('string leagueName is required'); return }
        if (!data.team1Id) { reject('string team1Id is required'); return }
        if (!data.team1Name) { reject('string team1Name is required'); return }
        if (!data.team2Id) { reject('string team2Id is required'); return }
        if (!data.team2Name) { reject('string team2Name is required'); return }
        if (data?.team1Score === undefined) { reject('number team1Score is required'); return }
        if (data?.team2Score === undefined) { reject('number team2Score is required'); return }
        if (!data.inning) { reject('number inning is required'); return }
        if (!data.half) { reject('string half is required'); return }
        if (!data.playingTeam) { reject('number playingTeam is required'); return }
        if (!data.description) { reject('string description is required'); return }
        if (!data.type) { reject('string type is required'); return }
        if (!data.status) { reject('string status is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            //const currentUserId = firebaseAuth.currentUser.uid
            const gameEventsColRef = collection(firestoreDb, "gameEvents");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Information
            const gameEventDocRef = doc(gameEventsColRef);
            const gameEventId = gameEventDocRef.id

            let postData = data;
            postData.createdOn = serverTimestamp()
            postData.createdBy = '' //currentUserId || ''

            transaction.set(gameEventDocRef, postData);
            returnValue = gameEventId;
            // Add Event Logs
            const eventData = {
              type: 'GAME_EVENT_NEW',
              message: "Game Event added.",
              subjectId: gameEventId,
              senderId: '', //currentUserId || '',
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
            // const currentUserId = firebaseAuth.currentUser.uid
            const gameEventDocRef = doc(firestoreDb, "gameEvents", data.id);
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Get Document Data
            const gameEventDoc = await transaction.get(gameEventDocRef);
            if (!gameEventDoc.exists()) {
              throw 'Game Event document not found!'
            }
            let hDoc = gameEventDoc.data()
            hDoc["id"] = gameEventDoc.id
            returnValue = hDoc;
            // Update User Data
            transaction.update(gameEventDocRef, data.updates);
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'GAME_EVENT_UPDATED',
              message: "Game Event " + data.id + " updated.",
              subjectId: data.id,
              senderId: '', // currentUserId || '',
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
