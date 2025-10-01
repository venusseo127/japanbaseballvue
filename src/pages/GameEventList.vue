<template>
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      :title="listTitle"
      :rows="rows"
      row-key="name"
      :filter="filter"
      borderless
      :pagination="pagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
          <q-th auto-width />
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:top>
        <q-select outlined  
        v-model="gameEvent" behavior="menu"
        @update:model-value="val => filterbyGameEvent(val)"
        :options="gameList" class="col marginRight" label="Filter by Game Event"
         />
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent,ref,inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { useTeamDataStore } from '../stores/team-data'
import { useGameDataStore } from '../stores/game-data'
import { useGameEventDataStore } from '../stores/game-event-data'
import { utilities } from '../utilities.js'

//subject: e.subject,employee: e.employeeName, type:e.requestType.value, status:e.status, location:e.locationName,  createddate:createdOn,requestId:e.requestId})
export default defineComponent({
  name: 'ReportPage',
  setup () {
    const route = useRoute()
    const store = inject('store')
    const $q = useQuasar()
    const teamStore = useTeamDataStore()
    const gameDataStore   = useGameDataStore()
    const gameEventDataStore = useGameEventDataStore()
    const utility = utilities()
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      rowsPerPage: 50,
      // rowsNumber: xx if getting data from a server
    })
    let { locale} = useI18n({
        useScope: 'global'
      })
    const months = ['January','February','March','April','May','June',
      'July','August','September','October','November','December']
    return { route,locale, store,pagination,months, secondModel: ref('one'),utility,
            gameEventDataStore,$q,teamStore,gameDataStore }
  },
  data() {
    return {
      pagename:'Signup',
      formData: {
        status : '',
      },
      pagename:'Signup',
      JobsDetails:[],
      listTitle:'Game Event List',
      rows:[],
      columns : [],
      gameList:[],
      supervisors:[],
      divisions:[],
      gameEvent:'',
      rtype : '',
      status: [
        { label: '', value: '' },
        { label: this.$t('option_new'), value: 'new' },
        { label: this.$t('option_approved'), value: 'approved' },
        { label: this.$t('option_declined'), value: 'declined' },
      ],
      oldparams:''
    }
  },
  watch: {
    locale(lang) {
      console.log(lang)
      //this.loadTable()
    },
  },
  mounted(){
    //this.loadTable()
    this.getGameList()
    //this.loadDivisions()
    //this.loadSupervisors()
  },
  beforeRouteUpdate(to, from, next) {
    //this.loadTable()
    this.loadRequestsList(this.gameEvent)
    next()

  },
  methods: {
    loadTable(){
      this.columns = [
        {
          name: 'subject',
          required: true,
          label: this.$t('column_subject'),
          align: 'left',
          field: row => row.subject,
          format: val => `${val}`,
          sortable: true
        },
        { name: 'employee',  align: 'left', label: this.$t('column_employee', { employee: 'Employee' }),  field:  'employee', sortable:  true },
        { name: 'type',  align: 'left', label: this.$t('column_request_type'),  field:  'type', sortable:  true },
        { name: 'status',   align: 'left', label: this.$t('column_status'),  field:  'status', sortable:  true },
        { name: 'createddate',   align: 'left', label: this.$t('column_createddate') ,  field:  'createddate', sortable:  true }
      ]
    },

    async filterbyGameEvent(val){
      this.formData.status = val
      this.loadRequestsList(val.value)
    },
    async loadRequestsList(gameId){
        this.rows = []
        let resultdata = await this.gameEventDataStore.getRecordsByGame(gameId)
        this.rows = resultdata
        //resultdata.forEach((e) => {
            // let shiftmonth = this.months[new Date(e.createdOn.seconds*1000).getMonth()]
            // let shiftday = new Date(e.createdOn.seconds*1000).getDate()
            // let shiftyr = new Date(e.createdOn.seconds*1000).getFullYear()
            // let createdOn = shiftmonth+" "+shiftday+" "+shiftyr
            // if(paramid==1){
            // this.rows.push({ subject: e.subject,employee: e.employeeName, type:e.requestType.value, status:e.status, createddate:createdOn,requestId:e.requestId})
            // }else{
            //this.rows.push({ subject: e.subject,employee: e.employeeName, type:e.requestType.value, status:e.status, createddate:createdOn, requestId:e.requestId})
            //}

        //})
        this.pagination.rowsPerPage = 50
    },
    async getGameList(){
      let resultData = await this.gameDataStore.getRecords()
      this.gameList = []
      resultData.forEach((e) => {
        let startDate = this.utility.convertToMoment((new Date(e.startTime)))
        let monthlyDate = startDate.format("MMMM DD YYYY hh:mm")
        let gameName = e.leagueName+' vs '+e.awayTeam+' '+monthlyDate
        this.gameList.push({label: gameName, value: e.id})
      })
    },
    async loadSupervisors(){
      let resultData = await this.store.actions.firebaseGetUsersOnceByType('supervisor')
      resultData = JSON.parse(resultData)
      this.supervisors = []
      resultData.forEach((e) => {
        this.supervisors.push({label: e.firstname+" "+e.lastname, value: e.userId})
      })
    },
    getprofile(c,pval=null){
      if(c==1){
        if(pval){
          return pval
        }else{
          return this.vprofile
        }
      }else{
        if(pval){
          return pval
        }else{
          return this.pprofile
        }
      }
    },
    submitForm1() {
      api.post('/login', this.formData)
          .then((res) => {
            console.log(res);
            if (res['data']['email'] != ""){
                this.storeData(res['data'])
                //this.$router.push("/profile")
            } else {
              alert('Error Occured: ' + res['error'])
            }
          })
          .catch((err) => {
            alert('Error Occured' + err)
            console.log(err)
          })
    },
    submitForm(){
      console.log(this.formData.speak_en)
      //if(this.formData.combat_hand.value=="Y") alert("combat")

      this.store.actions.firebaseGetFirstUserSearch(this.formData)
      this.rows = this.store.state.users
      console.log(this.rows)
    },
    async ApproveRequest(selected){
      console.log(selected)
      let payload = {
        requestId : selected,
      }
      console.log(payload)
      await this.store.actions.firebaseApproveRequest(payload)
    },
    async declineRequest(selected){
      const payloadJob = {
        requestId           : selected
      }
      this.store.actions.firebaseDisapproveRequest(payloadJob)
      .then(response => {
        //this.loading = false
        //this.$router.push("/requests?id=1")//timeoff
        const paramid = this.$route.query.id
        const status = this.$route.query.status
        console.log("mounted"+paramid+"="+status)
        this.loadRequestsList(paramid,status)
      })
      .catch(error => {
        //this.loading = false
        console.log(error.message)
      })
    },
    showhiddendiv(divname){
      var x = document.getElementById(divname);
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    },
  }
})
</script>
<style scoped>
#filterGuards .q-field, #filterGuards .q-select{
  font-size:12px !important;
}
#filterGuards{
  font-size:12px !important;
}
.padright{
  padding-right:15px;
}

</style>
