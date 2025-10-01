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

export const useGameDataStore = defineStore('gameData', {
  state: () => ({
    id: '',
    scrimmage: '',
    homeTeam: '',
    awayTeam: '',
    startTime: '',
    finalScore: '',
    venue: '',
    leagueId: '',
    leagueName: '',
    season: '',
    duration: '',
    repeats: '',
    repeatsEndDate: '',
    notes: '',
    status: '',
  }),
  getters: {
    getId: (state) => state.id,
    getScrimmage: (state) => state.scrimmage,
    getHomeTeam: (state) => state.homeTeam,
    getAwayTeam: (state) => state.awayTeam,
    getStartTime: (state) => state.startTime,
    getFinalScore: (state) => state.finalScore,
    getVenue: (state) => state.venue,
    getLeagueId: (state) => state.leagueId,
    getLeagueName: (state) => state.leagueName,
    getSeason: (state) => state.season,
    getDuration: (state) => state.duration,
    getRepeats: (state) => state.repeats,
    getRepeatsEndDate: (state) => state.repeatsEndDate,
    getNotes: (state) => state.notes,
    getStatus: (state) => state.status,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "games")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          orderBy("startTime", "asc"),
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
        let docRef = collection(firestoreDb, "games")
        let docQuery = query(docRef,
          //where("status", "==", "New"),
          orderBy("leagueName", "asc"),
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
    getRecordsByTeam(teamId){
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "games")
        let docQuery = query(docRef,
          where("team1Id", "==", teamId),
          orderBy("startTime", "asc"),
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
          let docRef = doc(firestoreDb, "games", id)
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
        if (!data.gameType) { reject('string gameType is required'); return }
        if (!data.homeTeam) { reject('string homeTeam is required'); return }
        //if (!data.awayTeam) { reject('string awayTeam is required'); return }
        if (!data.startDate) { reject('string startDate is required'); return }
        //if (!data.finalScore) { reject('string finalScore is required'); return }
        if (!data.venue) { reject('string venue is required'); return }
        if (!data.leagueId) { reject('string leagueId is required'); return }
        if (!data.leagueName) { reject('string leagueName is required'); return }
        if (!data.season) { reject('string season is required'); return }
        if (!data.duration) { reject('string duration is required'); return }
        if (!data.repeats) { reject('string repeats is required'); return }
        //if (!data.repeatsEndDate) { reject('string repeatsEndDate is required'); return }
        //if (!data.notes) { reject('string notes is required'); return }
        if (!data.status) { reject('string status is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            //const currentUserId = firebaseAuth.currentUser.uid
            const gamesColRef = collection(firestoreDb, "games");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // User Information
            const gameDocRef = doc(gamesColRef);
            const gameId = gameDocRef.id
            const postData = {
              gameType: data.gameType || '',
              scrimmage: data.scrimmage || '',
              homeTeam: data.homeTeam || '',
              awayTeam: data.awayTeam || '',
              startTime: data.startDate || '',
              //finalScore: data.finalScore || '',
              venue: data.venue || '',
              leagueId: data.leagueId || '',
              leagueName: data.leagueName || '',
              season: data.season || '',
              duration: data.duration || '',
              repeats: data.repeats || '',
              repeatsEndDate: data.repeatsEndDate || '',
              notes: data.notes || '',
              status: data.status || '',
              createdOn: serverTimestamp(),
              batterCount:0,
              ballCount:0,
              StrikeCount:0,
              outsCount:0,
              createdBy: '',//currentUserId || '',
            }
            transaction.set(gameDocRef, postData);
            returnValue = gameId;
            // Add Event Logs
            const eventData = {
              type: 'GAME_NEW',
              message: "Game " + data.homeTeam + " vs " + data.awayTeam + " added.",
              subjectId: gameId,
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
            //const currentUserId = firebaseAuth.currentUser.uid
            const gameDocRef = doc(firestoreDb, "games", data.id);
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Get Document Data
            const gameDoc = await transaction.get(gameDocRef);
            if (!gameDoc.exists()) {
              throw 'Game document not found!'
            }
            let hDoc = gameDoc.data()
            hDoc["id"] = gameDoc.id
            returnValue = hDoc;
            // Update User Data
            transaction.update(gameDocRef, data.updates);
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'GAME_UPDATED',
              message: "Game " + data.id + " updated.",
              subjectId: data.id,
              senderId: '',//currentUserId || '',
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
