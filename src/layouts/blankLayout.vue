<template>
  <q-layout view="lHh Lpr lFf" style="background-color: white !important;">
    <q-page-container>
      <router-view />
    </q-page-container>
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
      }
    }
  },
  data() {
    return {
      fttab: this.route.meta.tab,
    }
  },
})
</script>
<style scoped>
body{
  font-family: "Metropolis", sans-serif;
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
