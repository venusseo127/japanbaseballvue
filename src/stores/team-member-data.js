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

export const useteamMemberDataStore = defineStore('teamMemberData', {
  state: () => ({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    type: '',
    teamId: '',
    status:'',
    createdBy:'',
  }),
  getters: {
    getId: (state) => state.id,
    getFirstName: (state) => state.firstName,
    getLastName: (state) => state.lastName,
    getEmail: (state) => state.email,
    getType: (state) => state.type,
    getTeamId: (state) => state.teamId,
    getStatus: (state) => state.status,
    getcreatedBy: (state) => state.createdBy,
  },
  actions: {
    getRecordPages(criteria, sort, order, page, size) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "teammembers")
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
        let docRef = collection(firestoreDb, "teammembers")
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
        let docRef = collection(firestoreDb, "teammembers")
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
          let docRef = doc(firestoreDb, "teammembers", id)
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

        if(data.firstName=='currentUser'){
          let getdisplayName = firebaseAuth.currentUser.displayName
          let displayName = getdisplayName.split(" ")
          let newData = {
            firstName         : displayName[0],
            lastName          : displayName[1],
            email             : firebaseAuth.currentUser.email,
            type              : "Staff",
            teamId            : data.teamId,
            userId            : firebaseAuth.currentUser.uid,
            status            : "active"
          }
          data = newData
        }
        if (!data.firstName) { reject('string firstName is required'); return }
        if (!data.lastName) { reject('string lastName is required'); return }
        if (!data.email) { reject('string email is required'); return }
        if (!data.type) { reject('string member type is required'); return }
        if (!data.teamId) { reject('string teamId is required'); return }
        if (!data.status) { reject('string member status is required'); return }
        let returnValue = ''
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            const currentUserId = firebaseAuth.currentUser.uid
            const teamMembersColRef = collection(firestoreDb, "teammembers");
            const logsColRef = collection(firestoreDb, "eventlogs")
            // User Information
            const teamMembersDocRef = doc(teamMembersColRef);
            const teamMemberId = teamMembersDocRef.id
            const postData = {
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              teamId: data.teamId || '',
              type: data.type || '',
              userId:data.userId || '',
              email: data.email || '',
              status: data.status || '',
              createdOn: serverTimestamp(),
              createdBy: currentUserId || '',
            }
            console.log(postData)
            transaction.set(teamMembersDocRef, postData);
            returnValue = teamMemberId;
            // Add Event Logs
            const eventData = {
              type: 'TEAM_MEMBERS_NEW',
              message: "Team member " + data.firstName +" "+ data.lastName + " added. on Team "+data.teamId,
              subjectId: teamMemberId,
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
            const teamDocRef = doc(firestoreDb, "teammembers", data.id);
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
              type: 'TEAM_MEMBERS_UPDATED',
              message: "Team members " + data.id + " updated.",
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
