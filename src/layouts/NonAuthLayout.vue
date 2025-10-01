<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />

    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from 'vue'
import { inject } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'NonAuthLayout',
  setup () {
    const route = useRoute()
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const store = inject('store')
    let { locale} = useI18n({
        useScope: 'global'
      })

    return {
      leftDrawerOpen,
      store,
      route,router,locale
    }
  },
  data() {
    return {
      showAppNotifBanner: false,
      showAppInstallBanner: false,
      searchtext:'',
      fttab: this.route.meta.tab
    }
  },
  mounted() {
    // console.log(this.$route.meta.returnpage)
  },
  methods: {
    goto(page){
      // console.log(page)
      this.$router.push("/"+page)
    }
  }

})
</script>

<style scoped>
.q-tab{
  padding:0 3px !important;
  font-size: 13px !important;
  text-transform:none;
}
.footerbg{
  background-color: #ffffff !important;
  color: #000000;
}
.q-tab,.q-tab a {
  color:#9c9c9c;
  text-decoration:none;
  margin:0px 10px;
}
.flex-center{
  font-size:17px;
}
.activetab{
  color:#308cc1;
}
</style>
