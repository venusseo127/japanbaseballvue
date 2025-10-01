<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="q-pa-md bg-white rounded-borders shadow-2">
      <div class="row items-center q-mb-md">
        <q-avatar size="60px" color="dark" text-color="white">VS</q-avatar>
        <div class="q-ml-md">
          <div class="text-h6">Venus Sanchez</div>
          <q-btn flat label="Edit Your Account" color="primary" size="sm" />
        </div>
      </div>

      <q-separator spaced />

      <q-list bordered separator>
        <q-item clickable>
          <q-item-section>Change Password</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Fan Pricing</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>
            <q-avatar size="24px" class="q-mr-sm">
            </q-avatar>
            Add Your GC Classic Teams
          </q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Help Center</q-item-section>
        </q-item>
        <q-item clickable>
          <q-item-section>Contact Support</q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-red">Delete Account</q-item-section>
        </q-item>
      </q-list>

      <q-separator spaced />

      <div class="q-mt-md text-center">
        <q-btn color="primary" @click="logoutUser()" label="Sign Out" rounded />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from "../stores/auth-store"

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()
    const authStore = useAuthStore()

    return { authStore,locale,router,model: ref('one')}
  },
  data() {
		return {
      getTgame:{},
    }
  },mounted() {

  },
  methods: {
    logoutUser(){
      this.authStore.signOutUser()
      .then(response => {
        this.$router.push("/login")
      }).catch(error => {
        console.error(error)
      })
    },
  }
});
</script>

<style scoped>
.q-avatar img {
  object-fit: cover;
}
</style>
