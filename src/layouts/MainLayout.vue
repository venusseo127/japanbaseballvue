<template>
  <q-layout view="lHh Lpr lFf" style="background-color: white !important;">
    <q-header elevated  class="dashheader" style="background-color: white;">
      <q-toolbar>
        <div class="row" style="width: 100%;">
          <div class="col-10">
            <q-btn class="textgray1" align="left" style=" margin: 3px 5px;text-transform:none; width: 100%;" icon="search" :label="$t('findTeamLang')" />
          </div>
          <div class="col-2" style="padding:8px 0px 0px 5px">
            <q-btn class="text-blue" flat dense icon="add_circle_outline" @click="createTeamdialog = true"  />
            <q-btn class="text-blue" flat dense icon="language">
              <q-menu>
                <q-select
                  v-model="locale"
                  :options="localeOptions"
                  :label="$t('general_language')"
                  dense
                  borderless
                  emit-value
                  map-options
                  options-dense
                  style="min-width: 150px; color:#ffffff"
                />
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
      <q-dialog
      v-model="createTeamdialog"
      persistent
      :maximized="maximizedToggle"
    >
      <q-card class="bg-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-2"><q-btn class="text-blue" flat dense icon="add" @click="createTeamdialog = true"  /></div>
                    <div class="col">
                      <div class="text-bold">Create New Team</div>
                      <div>Roll over previous rester or add a roster from scratch</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-card @click="this.$router.push('/createTeam/1')">
                <q-card-actions style="padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-2"><q-btn class="text-blue" flat dense icon="diversity_3" @click="createTeamdialog = true"  /></div>
                    <div class="col">
                      <div>Are you a League, Tournament or Travel Org Admin?</div>
                      <div class="text-primary">Create an Organization ></div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    </q-page-container>
    <q-footer  class="dark footerbg " style="background-color: white !important;">
      <div class="footerdiv">
        <q-tabs
          v-model="fttab"
          indicator-color="transparent"
          active-color="blue"
          class="bg-white"
        >
            <a @click="router.push('/')" class="col" > <q-tab icon="home" class="text-gray homeTab" :label="$t('home')" outlined  name="Home" :title="$t('home')" /> </a>
            <a @click="router.push('/events')" class="col"> <q-tab icon="calendar_today" class="text-gray" :label="$t('events')" outlined name="Deals" :title="$t('events')" /></a>
            <a @click="router.push('/messages')" class="col"> <q-tab icon="chat" outlined class="text-gray" name="Offers" :label="$t('messages')" :title="$t('messages')" /> </a>
            <a @click="router.push('/account')" class="col"> <q-tab icon="account_circle" outline class="text-gray" :label="$t('account')" name="favorite" :title="$t('account')" /> </a>
        </q-tabs>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()
    const route = useRoute()
    let { locale} = useI18n({
        useScope: 'global'
      })

    return {
      locale,
      router, route,
      linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'ja', label: 'Japanese' },
        { value: 'ch', label: 'Chinese' }
      ],
      createTeamdialog: ref(false),
      maximizedToggle: ref(true)
    }
  },
  data() {
    return {
      fttab: this.route.meta.tab,
    }
  },
  mounted(){
    this.locale = this.$q.lang.getLocale()
  }
})
</script>
<style scoped>
body{
  font-family: "Metropolis", sans-serif;
}
.dashheader .q-toolbar {
  padding:0px;
}
.textgray1{
  color: #a0b6c8;
  background-color:#edf1fa;
  text-transform: none;
  font-size: 15px;
}
.textgray2{
  color:#edf1fa
}
.text-title{
  font-family: "Metropolis", sans-serif;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;

}
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.left-margin{
  margin-left: 15px;
}
.q-dialog__inner--minimized {
    padding: 0px;
}
.searchbox{
  background-color: #f7f7f7;
  width:80%;
}
.footerdiv .q-tab{
  padding:0 3px !important;
  font-size: 18px !important;
  text-transform:none;
}
.footerbg{
  background-color: #ffffff !important;
  color: gray;
}
.footerdiv .q-tab, .footerdiv .q-tab a {
  color:#667a88;
  text-decoration:none;
  margin:3px 18px;
}
.footertab .q-tab__icon {
    width: 24px;
    height: 24px;
    font-size: 25px;
}
.activetab{
  border: solid 1px #1976D2;
}
.homeTab{
  color:#0170c9;
  font-size: 20px !important;
}
.footertab{
  color:#ff8d2f;
}
.footerdiv{
  margin: 5px 10px;
  border-radius: 12px;
  background-color: #fff;
}
.sidebardiv{
  margin: 10px;
  background: #fff1d7;
  height: 97%;
}
.version-container{
  text-align: right;
  position: fixed;
  bottom: 15px;
  width: 90%;
}
</style>
