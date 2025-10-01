/* eslint-disable */

import { defineStore } from 'pinia';
import {
  firebaseAuth,
  firestoreDb,
  facebookProvider,
  googleProvider,
  firebaseStorage
} from 'boot/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  FacebookAuthProvider
} from "firebase/auth";
import {
  runTransaction,
  collection, query, where, orderBy,
  doc, getDoc, getDocs, serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL
} from "firebase/storage";
//import { isNullOrUndefined } from '../utilities';

export const useUserDataStore = defineStore('userData', {
  state: () => ({
    id: '',
    name: '',
    email: '',
    role: '',
    photoUrl: '',
    status: '',
    verified : false,
    paymentGatewayId: '',
  }),
  getters: {
    getId: (state) => state.id,
    getName: (state) => state.name,
    getEmail: (state) => state.email,
    getRole: (state) => state.role,
    getPhotoUrl: (state) => state.photoUrl,
  },
  actions: {
    getRecordPages() {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "users")
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
        let docRef = collection(firestoreDb, "users")
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
    getRecordsByRole(role) {
      return new Promise(async (resolve, reject) => {
        let returnList = []
        let docRef = collection(firestoreDb, "users")
        let docQuery = query(docRef,
          where("status", "==", "active"),
          where("role", "==", role),
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
          let docRef = doc(firestoreDb, "users", id)
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
    getRecordByEmail(emailAddress){
      return new Promise(async (resolve) => {
        if (!emailAddress) reject('string emailAddress is required')
        let returnValue = null
        let docRef = collection(firestoreDb, "users")
        let docQuery = query(docRef,
          where("email", "==", emailAddress),
          orderBy("email", "asc"),
        )
        const querySnapshot = await getDocs(docQuery);
        if (!querySnapshot.empty){
          let hDoc = querySnapshot.docs[0].data()
          hDoc.userId = querySnapshot.docs[0].id
          returnValue = hDoc
        }
        resolve(returnValue);
      });
    },
    checkIfEmailExist(emailAddress){
      return new Promise(async (resolve) => {
        if (!emailAddress) reject('string emailAddress is required')
        let returnValue = null
        let docRef = collection(firestoreDb, "users")
        let docQuery = query(docRef,
          where("email", "==", emailAddress),
          orderBy("email", "asc"),
        )
        const querySnapshot = await getDocs(docQuery);
        if (!querySnapshot.empty){
          returnValue = querySnapshot.docs[0].id
        }
        resolve(returnValue);
      });
    },
    addRecord(data) {
      return new Promise(async (resolve, reject) => {
        if (!data.id) reject('string id is required')
        let returnValue = '';
        const currentUserId = (firebaseAuth.currentUser) ? firebaseAuth.currentUser.uid : null;
        // Check for User Email
        const userDocData = await this.getRecordByEmail(data.email);
        if(userDocData){
          if (data.role == userDocData.role){
            throw "This user already exist with role of " + userDocData.role;
          }
        }
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            const logsColRef = collection(firestoreDb, "eventlogs")
            if (userDocData != null){
              const userDocRef = doc(firestoreDb, "users", userDocData.userId);
              const postData = {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                role: data.role || '',
                photoUrl: data.photoUrl || (isNullOrUndefined(userDocData.photoUrl) == false ? userDocData.photoUrl : ''),
                status: "transfer",
                updatedOn: serverTimestamp(),
              }
              console.log("postData",postData)
              transaction.update(userDocRef, postData);
              returnValue = userDocData.userId
              // Add Event Logs
              const eventData = {
                type: 'USER_TRANSFER_REQUEST',
                message: "User " + data.email + " transfer request from '" + userDocData.role + "' to '" + data.role + "'.",
                subjectId: userDocData.userId,
                senderId: currentUserId,
                createdOn: serverTimestamp(),
              }
              console.log("eventData",eventData)
              transaction.set(doc(logsColRef), eventData);
            } else {
              // User Information
              const usersColRef = collection(firestoreDb, "users");
              const userDocRef = doc(usersColRef);
              const userId = userDocRef.id
              const postData = {
                name: data.name || '',
                email: data.email || '',
                role: data.role || '',
                entityId: data.entityId || '',
                photoUrl: data.photoUrl || '',
                phone: data.phone || '',
                taxId: data.taxId || '',
                avatar: data.avatar || '',
                filesId: userId,
                storeId: data.storeId || '',
                status: "pending",
                createdOn: serverTimestamp(),
                updatedOn: serverTimestamp(),
              }
              transaction.set(userDocRef, postData);
              returnValue = userId;
              // Add Event Logs
              const eventData = {
                type: 'USER_CREATED',
                message: "User " + data.name + " added.",
                subjectId: userId,
                senderId: currentUserId,
                createdOn: serverTimestamp(),
              }
              transaction.set(doc(logsColRef), eventData);
            }
          });
          if (data.files){
            data.files.forEach(async (file) => {
              const fileDir = 'userdocs/' + returnValue + '/' + file.name;
              await this.uploadFileWithURL(fileDir, file.value).then(() => {  })
            })
          }
          resolve(returnValue)
        } catch (e) {
          reject("Transaction failed: " + e)
        }
      })
    },
    updateRecord(data) {
      return new Promise(async (resolve, reject) => {
        let returnValue = {}
        const currentUserId = (firebaseAuth.currentUser) ? firebaseAuth.currentUser.uid : null;
        try {
          if (data.userId == undefined && data.userId != null) {
            throw 'Required userId is missing.'
          }
          if (data.role != undefined && data.role != null) {
            throw 'User role is not allowed to be change.'
          }
          await runTransaction(firestoreDb, async (transaction) => {
            const userDocRef = doc(firestoreDb, "users", data.userId);
            const logsColRef = collection(firestoreDb, "eventlogs")
            // Get Document Data
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw 'User document not found!'
            }
            let hDoc = userDoc.data()
            hDoc["userId"] = userDoc.id
            returnValue = hDoc;
            // Update User Data
            transaction.update(userDocRef, data.updates);
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'USER_UPDATED',
              message: "User " + data.email + " information updated.",
              subjectId: data.userId,
              senderId: currentUserId,
              createdOn: serverTimestamp(),
            });
          });
          resolve(returnValue)
        } catch (e) {
          reject("Transaction failed: " + e)
        }
      })
    },
    async uploadFile(fileDir, fileData) {
      return new Promise(async (resolve, reject) => {
        const fileRef = ref(firebaseStorage, fileDir);
        await uploadBytes(fileRef, fileData)
        .then((snapshot) => {
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error)
        });
      });
    },
    async uploadFileWithURL(fileDir, fileData) {
      return new Promise(async (resolve, reject) => {
        const fileRef = ref(firebaseStorage, fileDir);
        await uploadBytes(fileRef, fileData).then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL)
          }).catch((error) => {
            console.error('Image URL Error: ' + error)
            reject(error)
          });
        });
      });
    },
    registerConfirmWithEmailAndPassword(payload) {
      return new Promise(async (resolve, reject) => {
        await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
        .then(async response => {
          let usersNewData
          let userImageUrl = ""
          const userId = response.user.uid
          const userOldId = payload.userId
          try {
            const fileName = 'useravatars/' + userId.toString() + '/uavatar-' + userId.toString() + '.jpg'
            const usersImagesRef = ref(firebaseStorage, fileName);
            await uploadBytes(usersImagesRef, payload.avatar).then(async (snapshot) => {
              await getDownloadURL(snapshot.ref).then((downloadURL) => {
                userImageUrl = downloadURL;
              }).catch((error) => {
                console.error('Image URL Error: ' + error)
              });
              // Save to Firestore
              await runTransaction(firestoreDb, async (transaction) => {
                const usersNewDocRef = doc(firestoreDb, "users", userId)
                const usersOldDocRef = doc(firestoreDb, "users", userOldId);
                const logsColRef = collection(firestoreDb, "eventlogs")
                const usersOldDoc = await getDoc(usersOldDocRef);
                if (!usersOldDoc.exists()) {
                  throw "Users Old Document does not exist!"
                }
                const usersOldData = usersOldDoc.data();
                usersNewData = usersOldData
                usersNewData["status"] = "active"
                usersNewData["photoUrl"] = userImageUrl
                usersNewData["createdOn"] = serverTimestamp()
                usersNewData["updatedOn"] = serverTimestamp()
                if (userId === userOldId){
                  transaction.set(usersNewDocRef, usersNewData, { merge: true })
                } else {
                  transaction.set(usersNewDocRef, usersNewData)
                  transaction.delete(usersOldDocRef)
                }
                // Event Log
                transaction.set(doc(logsColRef), {
                  type: 1,
                  message: 'User '+usersNewData.name+' Confirmed Registration.',
                  subjectId: userId,
                  senderId: userId,
                  createdOn: serverTimestamp(),
                });
              })
              console.log("Transaction successfully committed!")
              resolve("Transaction successfully committed!")
            }).catch((error) => {
              throw "Users Image failed to save: " + error
            });
          } catch (e) {
            reject(e)
          }
        })
        .catch(async (error) => {
          console.log(error)
          if (error == 'Firebase: Error (auth/email-already-in-use).'){
            try {
              await runTransaction(firestoreDb, async (transaction) => {
                const userDocRef = doc(firestoreDb, "users", payload.userId);
                const logsColRef = collection(firestoreDb, "eventlogs")
                const userDoc = await getDoc(userDocRef);
                if (!userDoc.exists()) {
                  throw "Users Old Document does not exist!"
                }
                const updateData = {
                  status: "active"
                }
                transaction.update(userDocRef, updateData)
                // Event Log
                transaction.set(doc(logsColRef), {
                  type: 1,
                  message: 'User '+usersNewData.name+' Confirmed Registration.',
                  subjectId: userId,
                  senderId: userId,
                  createdOn: serverTimestamp(),
                });
              })
              console.log("Transaction successfully committed!")
              resolve("Transaction successfully committed!")
            } catch (err) {
              reject(err)
            }
          }
        })
      });
    },
    registerConfirmWithProvider(payload) {
      return new Promise(async (resolve, reject) => {
        let authProvider
        if (payload.providerStr == 'google') authProvider = googleProvider
        if (payload.providerStr == 'facebook') authProvider = facebookProvider
        await signInWithPopup(firebaseAuth, authProvider)
        .then(async response => {
          const userData = response.user;
          const userId = userData.uid
          const userOldId = payload.userId
          // Get Photo Url
          let photoURLStr = userData.photoURL;
          if (payload.providerStr == 'facebook'){
            const credential = FacebookAuthProvider.credentialFromResult(response);
            const accessToken = credential.accessToken;
            await fetch(`https://graph.facebook.com/${userData.providerData[0].uid}/picture?type=large&access_token=${accessToken}`)
            .then((resultPic) => resultPic.blob()
            .then((blob) => {
              photoURLStr = URL.createObjectURL(blob);
            }))
          }
          try {
            // Save to Firestore
            await runTransaction(firestoreDb, async (transaction) => {
              const usersNewDocRef = doc(firestoreDb, "users", userId)
              const usersOldDocRef = doc(firestoreDb, "users", userOldId);
              const logsColRef = collection(firestoreDb, "eventlogs")
              const usersOldDoc = await getDoc(usersOldDocRef);
              if (!usersOldDoc.exists()) {
                throw "Users Old Document does not exist!"
              }
              const usersOldData = usersOldDoc.data();
              let usersNewData = usersOldData
              usersNewData["email"] = userData.email
              usersNewData["status"] = "active"
              usersNewData["photoUrl"] = photoURLStr
              usersNewData["createdOn"] = serverTimestamp()
              usersNewData["updatedOn"] = serverTimestamp()
              if (userId === userOldId){
                transaction.set(usersNewDocRef, usersNewData, { merge: true })
              } else {
                transaction.set(usersNewDocRef, usersNewData)
                transaction.delete(usersOldDocRef)
              }
              // Event Log
              transaction.set(doc(logsColRef), {
                type: 1,
                message: 'User '+usersNewData.name+' Confirmed Registration.',
                subjectId: userId,
                senderId: userId,
                createdOn: serverTimestamp(),
              });
            })
            console.log("Transaction successfully committed!")
            resolve("Transaction successfully committed!")
          } catch (e) {
            reject(e)
          }
        })
        .catch(error => {
          reject(error)
        })
      });
    },
  },
});
