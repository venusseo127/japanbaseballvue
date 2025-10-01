/* eslint-disable */

import { defineStore } from 'pinia';
import {
  firebaseAuth,
  firestoreDb,
  facebookProvider,
  googleProvider
} from 'boot/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import {
  runTransaction,
  collection,
  doc, getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useUserDataStore } from "./user-data";

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    idToken: undefined,
  }),
  getters: {
    getIdToken: (state) => state.idToken,
  },
  actions: {
    addUser(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          await runTransaction(firestoreDb, async (transaction) => {
            const userColRef = collection(firestoreDb, "users");
            const logsColRef = collection(firestoreDb, "eventlogs")
            const userDocRef = doc(userColRef);
            const userId = userDocRef.id
            transaction.set(userDocRef, {
              name: payload.displayName,
              email: payload.email,
              role: payload.role,
              entityId: payload.entityId,
              status: "pending",
              createdOn: serverTimestamp(),
              updatedOn: serverTimestamp(),
            });
            // Add Event Logs
            transaction.set(doc(logsColRef), {
              type: 'USER_CREATED',
              message: "User " + payload.displayName + " registered as " + payload.role,
              subjectId: userId,
              senderId: userId,
              createdOn: serverTimestamp(),
            });
            resolve("Transaction successfully committed!")
          });
        } catch (e) {
          reject("Transaction failed: " + e)
        }
      })
    },
    registerUser(payload) {
      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
        .then(async response => {
          const userData = response.user;
          try {
            await runTransaction(firestoreDb, (transaction) => {
              const userDocRef = doc(firestoreDb, "users", userData.uid);
              const logsColRef = collection(firestoreDb, "eventlogs")
              // Add User
              transaction.set(userDocRef, {
                name: userData.displayName,
                email: userData.email,
                role: payload.role,
                entityId: payload.entityId,
                photoUrl: payload.photoUrl,
                status: "pending",
                createdOn: serverTimestamp(),
                updatedOn: serverTimestamp(),
              });
              // Add Event Logs
              transaction.set(doc(logsColRef), {
                type: 'USER_CREATED',
                message: "User " + userData.displayName + " registered as " + payload.role,
                subjectId: userData.uid,
                senderId: userData.uid,
                createdOn: serverTimestamp(),
              });
            });
            resolve("Transaction successfully committed!" + response)
          } catch (e) {
            reject("Transaction failed: " + e)
          }
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    sendPasswordResetEmail(email){
      return new Promise((resolve, reject) => {
        sendPasswordResetEmail(firebaseAuth, email)
        .then(() => {
          resolve('Password reset email sent!')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          reject('ERROR: ' + errorCode + ' - ' + errorMessage)
        });
      })
    },

    async signInWithEmail(payload) {
      return new Promise((resolve, reject) => {
        signInWithEmailAndPassword(firebaseAuth, payload.email, payload.password)
        .then(async response => {
          const userData = response.user
          // try {
          //   await runTransaction(firestoreDb, async (transaction) => {
          //     const logsColRef = collection(firestoreDb, "eventlogs")
          //     // Add Event Logs
          //     const logsInfo = {
          //       type: 1,
          //       message: "User " + userData.email + " logged in.",
          //       subjectId: userData.uid,
          //       senderId: userData.uid,
          //       createdOn: serverTimestamp(),
          //     }
          //     transaction.set(doc(logsColRef),logsInfo )
          //   })
          //   resolve("Transaction successfully committed!" + userData)
          // } catch (e) {
          //   reject("Transaction failed: " + e)
          // }
          resolve(userData)
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    async signInWithProvider(providerStr, userRole, entityId) {
      const userDataStore = useUserDataStore();
      return new Promise((resolve, reject) => {
        let authProvider
        if (providerStr == 'google') authProvider = googleProvider
        if (providerStr == 'facebook') authProvider = facebookProvider
        signInWithPopup(firebaseAuth, authProvider)
        .then(async response => {
          const userData = response.user;
          // Get Photo Url
          let photoURLStr = userData.photoURL;
          if (providerStr == 'facebook'){
            const credential = FacebookAuthProvider.credentialFromResult(response);
            const accessToken = credential.accessToken;
            await fetch(`https://graph.facebook.com/${response.user.providerData[0].uid}/picture?type=large&access_token=${accessToken}`)
            .then((resultPic) => resultPic.blob()
            .then((blob) => {
              photoURLStr = URL.createObjectURL(blob);
            }))
          }
          // User Information
          const userInfo = {
            name: userData.displayName,
            email: userData.email,
            role: userRole,
            entityId: entityId,
            photoUrl: photoURLStr,
            status: 'active',
            createdOn: serverTimestamp(),
            updatedOn: serverTimestamp(),
          }
          try {
            await runTransaction(firestoreDb, async (transaction) => {
              const userDocRef = doc(firestoreDb, "users", userData.uid);
              const logsColRef = collection(firestoreDb, "eventlogs")
              // Check If User Exists
              const userDoc = await transaction.get(userDocRef);
              if (!userDoc.exists()) {
                transaction.set(userDocRef, userInfo);
                userDataStore.role = userRole;
              }
              //console.log(providerStr+" login",userInfo)
              //console.log("login user response",response)
              //this.$q.sessionStorage.set("user uid", userData.uid)
              // Add Event Logs
              transaction.set(doc(logsColRef), {
                type: 1,
                message: "User " + userData.displayName + " registered as " + userRole,
                subjectId: userData.uid,
                senderId: userData.uid,
                createdOn: serverTimestamp(),
              });
            });
            resolve("Transaction successfully committed!" + response)
          } catch (e) {
            reject("Transaction failed: " + e)
          }
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    signOutUser() {
      return new Promise((resolve, reject) => {
        signOut(firebaseAuth).then(response => {
          this.idToken = undefined;
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
      })
    },

    handleAuthStateChanged() {
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          // User is logged in.
          const userDataStore = useUserDataStore();
          if (user.displayName == null | user.photoURL == null){
            // console.log("Blank Found", userDataStore.name, userDataStore.photoUrl)
            const userData = await userDataStore.getRecord(user.uid)
            // console.log("Data Found", userData)
            await updateProfile(user, {
              displayName: userData.name,
              photoURL: userData.photoUrl
            }).then(() => {
              console.log("Firebase User Profile Update Success")
            }).catch((error) => {
              console.error("Firebase User Profile Update Error: ", error)
            });
          }
          userDataStore.id = user.uid || ''
          userDataStore.name = user.displayName || ''
          userDataStore.email = user.email || ''
          userDataStore.photoUrl = user.photoURL || ''

          // user.getIdTokenResult(true).then(async (idTokenResult) => {
          //   this.idToken = idTokenResult;
          //   if (idTokenResult.claims.role){
          //     userDataStore.role = idTokenResult.claims.role
          //     userDataStore.paymentGatewayId = idTokenResult.claims.paymentGatewayId
          //     console.log("User Claims: ", idTokenResult.claims);
          //   } else {
          //     userDataStore.role = "customer"
          //     console.log("Logged Role Not Found. Defaulted to customer");
          //   }
          // })
          // .catch((error) => {
          //   console.error("Logged Role Error", error);
          // });

          window.smartlook('identify', user.uid, {
            "name": userDataStore.name,
            "email": userDataStore.email
          })
          .then((response) => {
            // console.log("smartlook saved",response)
          })
          .catch((error) => {
            // console.error("smartlook Error", error);
          });
        } else {
          // console.log("Logged Out");
        }
      })
    },

    async getUserClaims() {
      const currentUser = firebaseAuth.currentUser
      await currentUser.getIdTokenResult(true).then((idTokenResult) => {
        return idTokenResult.claims
      })
      .catch((error) => {
        console.log(error);
        return {}
      });
    },

    async getCurrentUser(){
      if (firebaseAuth.currentUser){
        const currentUserId = firebaseAuth.currentUser.uid // vqF2ojhqdYDUTtN385WM
        console.log("currentUserId", currentUserId)
        const userDocRef = doc(firestoreDb, "users", currentUserId);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          let hDoc = docSnapshot.data()
          hDoc["userId"] = docSnapshot.id
          return hDoc
        } else {
          return {}
        }
      } else {
        return {}
      }
    },
  },
});
