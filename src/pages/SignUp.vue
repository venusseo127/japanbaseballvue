<template>
  <q-page class="padding">
    <div color="primary" style="text-align:center;padding: 20px 5px;color:red;">
      {{ this.errMsg }}
    </div>
    <q-form @submit.prevent="submitForm">
      <div style="padding: 5px 15px;">
        <q-card flat class="container-card">
          <q-card-section>
            <span style="size: 16px; font-weight: bold;">Registration Form</span>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="row q-mb-md col-6">
              <q-input outlined class="col" ref="emailAddress" v-model="formData.emailAddress"
              :rules="[ val => isValidEmailAddress(val) || 'Valid Email Address Please.']"
              lazy-rules label="Email" />
            </div>
            <div class="row q-mb-md col-3">
              <q-input outlined class="col" ref="firstName"
              :rules="[val => !!val || 'Field is required']"
              v-model="formData.firstName" label="First Name"  />
            </div>
            <div class="row q-mb-md col-3">
              <q-input outlined class="col" ref="lastName"
              :rules="[val => !!val || 'Field is required']"
              v-model="formData.lastName" label="Last Name"  />
            </div>
            <div class="row q-mb-md col-6">
              <q-btn :loading="loading" @click="submitForm()" color="primary full-width">
                Save
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Loading...
                </template>
              </q-btn>
            </div>
            <div class="col-12" color="primary" style="text-align:center;">
              <q-btn @click="this.router.push('/login')" class="full-width" flat :label="$t('backtoLogin')"  />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </q-page>
</template>
<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useUserDataStore } from '../stores/user-data'
import { useSessionDataStore } from '../stores/session-data'
import { firebaseAuth } from 'boot/firebase'
import { useAuthStore } from "../stores/auth-store"
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    let { locale} = useI18n({ useScope: 'global' })
    const router = useRouter()
    const loading = ref(false)
    const progress = ref(false)
    const $q = useQuasar()
    const userDataStore = useUserDataStore()
    const sessionDataStore = useSessionDataStore()
    const authStore = useAuthStore()
    return {
      router, authStore,
      loading,locale,
      progress,businessFiles: ref(null),
      $q, userDataStore,sessionDataStore,
      step: ref(3),
      onRejected (rejectedEntries) {
        $q.notify({
          type: 'negative',
          position:'top',
          message: `${rejectedEntries.length} file(s) did not pass validation constraints`
        })
      }
    }
  },
  data() {
		return {
      formData: {
        emailAddress        : ref(''),
        firstName           : ref(''),
        lastName            : ref(''),
        password            : ref(''),
        confirmpassword     : ref(''),
        businessFiles       : ref([]),
			},
      autocomplete :null,
      imageData :'',
      errMsg: ''
		}
	},
  mounted() {
    this.LoadUserData()
  },
  methods: {
    async LoadUserData(){
      //this.formData.firstName = firebaseAuth.currentUser.displayName
      //this.formData.emailAddress = firebaseAuth.currentUser.email
      let userdata = await this.authStore.getCurrentUser()
      if(userdata){
        this.formData.emailAddress = userdata.email
      }
    },
    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    async fileToBlob(file){
      return new Blob([new Uint8Array(await file.arrayBuffer())], {type: file.type,name:file.name });
    },
    handleUpload(){
      this.formData.businessFiles = []
      if (this.businessFiles) {
        this.businessFiles.forEach(file => {
          const reader = new FileReader()
          reader.onload = e => {
            const fileData = {
              name : file.name,
              value : this.dataURItoBlob(reader.result)
            }
            this.formData.businessFiles.push(fileData)
          }
          reader.readAsDataURL(file);
        });
      }
    },
    async captureImage () {
      const image = await Camera.getPhoto({
        quality: 90,
        width: 300,
        height: 300,
        resultType: CameraResultType.DataUrl
      })
      .then((Photo) => {
         console.log(Photo, 'Photo')

          this.avatarEmpty = false
          this.imageCaptured = true

          this.imageSrc = document.querySelector('#myImg');
          this.imageSrc.src = Photo.dataUrl

          this.formData.avatar = Photo.dataUrl //imgNewConverted
          this.imagesUploaded = this.dataURItoBlob(Photo.dataUrl) //imgNewConverted

      }).catch((error) => {
           //console.error(error)
      })
    },
    dataURItoBlob(dataURI){
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);

      // create a view into the buffer
      var ia = new Uint8Array(ab);

      // set the bytes of the buffer to the correct values
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      // write the ArrayBuffer to a blob, and you're done
      var blob = new Blob([ab], {type: mimeString});
      return blob;
    },
    async submitForm() {
      this.loading = true
      this.$refs.emailAddress.validate()
      this.$refs.firstName.validate()
      this.$refs.lastName.validate()

      if (!this.$refs.emailAddress.hasError && !this.$refs.firstName.hasError && !this.$refs.lastName.hasError ) {

        const postData = {
          displayName       : this.formData.firstName + ' ' + this.formData.lastName,
          firstName         : this.formData.firstName,
          lastName          : this.formData.lastName,
          email             : this.formData.emailAddress,
          role              : "Staff",
          entityId          : null,
        }
        await this.userDataStore.checkIfEmailExist(this.formData.emailAddress)
        .then(async (result) => {
          if (result == null){
            await this.authStore.addUser(postData)
            .then(response => {
              this.loading = false
              this.errMsg = $t('emailAlreadyExist')
              this.$q.notify({
                message: "Email confirmation has been sent from Pilaludere, you may want to check your Spam folder.",
                position:'top',
                color: 'green',
              })
              this.router.push('/login')

            }).catch(error => {
              this.loading = false
              console.error(error)
            })
          } else {
            this.loading = false
            this.errMsg = $t('emailAlreadyExist')
            this.$q.notify({
              message: "Email Address already exist.",
              position:'top',
              color: 'red',
            })
          }
        })
      } else {
        this.loading = false
        this.errMsg = "Please complete required fields"
        this.$q.notify({
          message: "Please complete required fields",
          position:'top',
          color: 'red',
        })
      }
    }
  }
}
</script>
