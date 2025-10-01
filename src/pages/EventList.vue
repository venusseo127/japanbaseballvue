<template>
  <div class="row" style="background-color: #edf1fa;" @click="this.$router.push('/baseballField')">
    <div class="col-12" style="padding: 0px 15px;">April 2025</div>
    <div class="col-12" style="background-color: white;padding: 15px;border-bottom: 1px solid #c0c0c0;">
      <div class="row">
        <div class="col-1 column text-right">
          <div class="col" style="font-size: 12px;margin-top: 10px;">WED</div>
          <div class="col" style="font-weight: bold;font-size: 20px;">26</div>
        </div>
        <div class="col column" style="padding-left: 15px;">
          <div class="col"><q-btn class="live" color="negative" dense :label="$t('live')" /></div>
          <div class="col">@TBD April 15, 2025</div>
        </div>
        <div class="col-2" style="vertical-align: middle;margin-top: 20px;" color="negative">7-5</div>
      </div>
    </div>
    <div class="col-12" style="background-color: white;padding: 15px;">
      <div class="row">
        <div class="col-1 column text-right">
          <div class="col" style="font-size: 12px;margin-top: 10px;">WED</div>
          <div class="col" style="font-weight: bold;font-size: 20px;">29</div>
        </div>
        <div class="col column" style="padding-left: 15px;">
          <div class="col" style="margin-top:20px">Practice</div>
        </div>
        <div class="col-2" style="vertical-align: middle;margin-top: 20px;">8:00 AM</div>
      </div>
    </div>
</div>
<div class="row" style="background-color: #edf1fa;">
    <div class="col-12" style="padding: 0px 15px;">May 2025</div>
    <div class="col-12" style="background-color: white;padding: 15px;border-bottom: 1px solid #c0c0c0;">
      <div class="row">
        <div class="col-1 column text-right">
          <div class="col" style="font-size: 12px;margin-top: 10px;">WED</div>
          <div class="col" style="font-weight: bold;font-size: 20px;">03</div>
        </div>
        <div class="col column" style="padding-left: 15px;">
          <div class="col"><q-btn class="live" color="negative" dense :label="$t('live')" /></div>
          <div class="col">@TBD April 15, 2025</div>
        </div>
        <div class="col-2" style="vertical-align: middle;margin-top: 20px;" color="negative">4-9</div>
      </div>
    </div>
    <div class="col-12" style="background-color: white;padding: 15px;">
      <div class="row">
        <div class="col-1 column text-right">
          <div class="col" style="font-size: 12px;margin-top: 10px;">WED</div>
          <div class="col" style="font-weight: bold;font-size: 20px;">15</div>
        </div>
        <div class="col column" style="padding-left: 15px;">
          <div class="col" style="margin-top:20px">Practice</div>
        </div>
        <div class="col-2" style="vertical-align: middle;margin-top: 20px;">13:00 PM</div>
      </div>
    </div>
</div>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'


export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()

    return { locale,router,tabList: ref('schedule')}
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
      teamId:'',
      gameId:'',
      team:{},
      gameData:{},
      getTgame:{},
      staff : [
        { initials: 'VS', name: 'Venus Sanchez', you: true },
        { initials: 'CO', name: 'connie82565@gmail.com', you: false }
      ],
      teamTab : ref('staff')
    }
  },mounted() {
    this.teamId = this.router.params.id
    this.gameId = this.router.params.game
    console.log(this.teams,this.teamId,this.gameId)




    const hFound = this.teams.findIndex(elem2 => elem2.id == this.teamId)
    if (hFound >= 0){
      this.team = this.teams[hFound]
      this.getTgame = this.teams[hFound].games
      console.log(this.teams[hFound].games)
      const nIndex = this.getTgame.findIndex(elem => elem.id == this.gameId)
      if(nIndex >= 0){
        this.gameData = this.getTgame[nIndex]
        //this.restaurants.push(elem)
        console.log(this.getTgame,this.gameData,this.teamId,this.gameId,nIndex)
      }
    }

  },
});
</script>
<style >
  .example-row-all-breakpoints
  .row > div{
    padding: 10px 15px;
    background: rgba(#999,.15);
    border: 1px solid rgba(#999,.2);
  }
  .example-row-all-breakpoints
  .row + .row{
    margin-top: 1rem;
  }
  .centerball{
    border: solid 1px #c0c0c0;
    padding: 20px 10px;
    border-radius: 50%;
  }
  .staff{
    border-radius: 5px;
    border:solid 1px #5d6a75;
    text-transform:uppercase;
    font-size: 11px;
    color: #5d6a75;
    box-shadow: none !important;
    margin: 10px;
    padding: 2px 8px;
  }
  .live{
    border-radius: 5px;
    text-transform:uppercase;
    font-size: 11px;
    color:white;
    box-shadow: none !important;
    padding: 2px 8px;
  }
  .msgTeam{
    border-radius: 10px;
    border:solid 1px #0070c8;
    box-shadow: none;
    font-size: 13px;
    color: #0070c8;
    padding: 5px 15px;
    margin-bottom: 10px;
  }
  .schedule .q-tab-panel {
    padding: 16px 0px;
  }
  .teamPlay .q-tab {
    text-transform:capitalize;
  }
</style>
