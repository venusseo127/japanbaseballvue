<template>
  <q-page class="flex flex-center" style="background-color: #edf1fa;">
    <!-- <img
      alt="Quasar logo"
      src="img/ds.jpg"
      style="width: 400px; height: 800px"
    > -->
    <div class="" style="padding:10px 5px;width: 100%;">
      <div class="row" v-for="item in teams" :key="item.id">
        <div class="col-12" style="color: #667a88; font-weight: 500; font-size: 14px;padding: 10px 10px 5px">{{ item.season }}</div>
        <div class="col-6 col-md-3 dashboard"  v-for="i in item.games" :key="i.id">
          <q-card class="my-card" @click="this.$router.push('/teamPortal/'+i.id)">
            <q-card-actions>
              <div class="row" style="width: 100%;cursor: pointer;">
                <div class="col-12 ccard"><q-btn class="staff" dense :label="$t('staff')" /></div>
                <div class="col-12">
                  <div class="row justify-center">
                    <q-btn round @click="this.$router.push('/teamPortal/'+i.id)">
                      <q-avatar size="54px">
                        <img src="icons/baseball2.svg" style="width: 32px; height: 32px;">
                      </q-avatar>
                    </q-btn>
                  </div>
                </div>
                <div class="col-12"><div @click="this.$router.push('/teamPortal/'+i.id)" class="row justify-center text-bold" style="padding: 5px 20px;text-align: center;">{{ i.name }}</div></div>
                <div class="col-12"><div class="row justify-center">{{ i.score }}</div></div>
              </div>
            </q-card-actions>
          </q-card>
        </div>
    </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTeamDataStore } from '../stores/team-data'
import { firebaseAuth } from 'boot/firebase'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()
    const teamStore = useTeamDataStore()
    //console.log(firebaseAuth.currentUser)
    return { locale,router, teamStore
    }
  },
  data() {
		return {
      teams:[{
        id:1, season:"Winter 2024",games:[
          {id:1, name: "Winn Baseball Navy 10U", score:"9-9-1",atype:this.$t('staff')},
          {id:2, name: "Winn Baseball Navy 8U", score:"3-1",atype:this.$t('staff')},
          {id:3, name: "Winn Baseball Red 10U",score:"2-3-1",atype:this.$t('staff')},
          {id:4, name: "Winn Baseball Red 11U", score:"1-4",atype:this.$t('staff')},
        ]},{
        id:2, season:"Fall 2024",games:[
          {id:1, name: "Winn Baseball 10U", score:"9-12",atype:this.$t('staff')},
          {id:2, name: "Winn Baseball 12U", score:"17-18-3",atype:this.$t('staff')},
          {id:3, name: "Winn Baseball 8U",score:"10-21-2",atype:this.$t('staff')},
          {id:4, name: "Winn Baseball Navy 11U", score:"28-9-3",atype:this.$t('staff')},
        ]},
      ],
      teamDetails:{},
    }
  },
  mounted() {
    this.getTeamList()
  },
  methods: {
    async getTeamList(){
        this.teams = []
          let receivedData = await this.teamStore.getRecords()
          if(receivedData.length > 0){
            const groupedTech = Object.entries(
              receivedData.reduce((acc, value) => {
                if (!acc[value.season]) {
                  acc[value.season] = [];
                }
                acc[value.season].push(value);
                return acc;
              }, {}))
            .map(([season, games]) => ({
              season,
              games
            }));
            this.teams = groupedTech
          }
      },
  }
});
</script>
<style>
  .ccard .q-btn:before {
    box-shadow: none !important;
  }
  .staff{
    border-radius: 3px;
    border:solid 1px #becdd7;
    box-shadow: none;
    text-transform:uppercase;
    font-size: 11px;
    color: #484f5f;
  }
  .dashboard .my-card{
    padding: 2px;
    margin:10px 10px 5px;
    border-radius: 12px;
    height: 185px;
    cursor: pointer;
  }
</style>
