<template>
  <div class="row q-pa-md " style="border-bottom: solid 1px #c0c0c0;">
    <div class="col-1"> &nbsp;</div>
    <div class="col-10 text-center">
      <div style="font-size: 25px;font-weight: bold; text-align: center;margin: 10px;">{{ $t('opponent') }}</div></div>
    <div class="col-1 text-right float-right">
      <q-btn class="text-blue" style="font-size: 18px;" color="primary" flat dense icon="more_vert" />
    </div>
    <div class="col-12 text-center">
      <div style="font-size: 20px; text-align: center;margin: 10px 0px 20px;">AG Team</div>
    </div>
    <div  class="col-12 text-center" style="padding: 10px 35px;">
      <q-btn-toggle
        v-model="model"
        class="my-custom-toggle"
        no-caps
        rounded
        spread
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: $t('lineUp'), value: 'one'},
          {label: 'Roster', value: 'two'}
        ]"
      />
    </div>
    <q-separator />
  </div>
  <div v-show="model=='one'">
    <div class="q-pa-md">
      <div class="" style="width: 100%;">
        <q-card bordered style="width: 100%;margin-left: 0px !important;">
          <q-card-section>
            <div class="row" style="width: 100%;">
              <div class="col-2">
                <q-btn class="text-blue" style="font-size: 25px;" color="primary" flat dense icon="qr_code_2" />
              </div>
              <div class="col"><div style="font-size: 20px;padding-top: 10px;font-weight: bold;">{{ $t('shareyourTeamlineup') }}</div></div>
              <div class="col-2">
                <q-btn class="text-blue" style="font-size: 25px;" color="primary" flat dense icon="chevron_right" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <draggable v-model="players" tag="transition-group" :component-data="{name:'fade'}">
      <template #item="{element, index}">
        <div style="padding: 10px 20px 5px;">
          <q-card style="width: 100%;margin-left: 0px !important;">
            <div class="row" style="width: 100%;">
              <div class="col-1"> &nbsp;</div>
              <div class="col">
                <div style="font-size: 18px;padding-top: 10px;">{{index+1 }}. {{element.name}}, #{{element.unum}}</div></div>
              <div class="col-1 text-right">
                <div style="font-size: 18px;padding-top: 10px;color: green;font-weight: bold;">{{element.atype}}</div>
              </div>
              <div class="col-2">
                <q-btn style="font-size: 18px;margin-top: 3px;color: gray;margin-right: 15px;" flat dense icon="menu" />
              </div>
            </div>
          </q-card>
        </div>
      </template>
    </draggable>
  </div>
  <div v-show="model=='two'">
    <div class="q-pa-md" style="width: 100%">
      <q-list bordered>
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>V. Palma, #09</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>M Rivera, #35</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>V. Palma, #09</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>M Rivera, #35</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>V. Palma, #09</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>

          <q-item-section>M Rivera, #35</q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </div>
  </div>
  <div style="float: right; margin-right: 20px;">
    <q-fab
        v-model="fabRight"
        vertical-actions-align="right"
        color="primary"
        glossy
        icon="add"
        direction="up"
      >
        <q-fab-action label-position="left" color="orange" @click="onClick" icon="chair_alt" :label="$t('addFromBench')" />
        <q-fab-action label-position="left" color="accent" @click="onClick" icon="person_add" :label="$t('createNewPlayer')" />
        <q-fab-action label-position="left" color="primary" @click="onClick" icon="delete" :label="$t('clearLineUp')" />
      </q-fab>
  </div>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'IndexPage',
  components: {
            draggable,
  },
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()

    return { locale,router,model: ref('one'),
              fabRight: ref(false),
              onClick () {
                // console.log('Clicked on a fab action')
              }
    }
  },
  data() {
		return {
      players:[
          {id:1, name: "J. Smith", unum:"29",atype:"P"},
          {id:2, name: "V. Palma", unum:"40",atype:"EH"},
          {id:3, name: "G ROdriguez",unum:"05",atype:"EH"},
          {id:4, name: "K Marquez", unum:"35",atype:"EH"},
          {id:5, name: "M Cruz", unum:"13",atype:"EH"},
          {id:6, name: "K Rivera", unum:"09",atype:"EH"},
          {id:7, name: "D Lopez", unum:"26",atype:"EH"},
      ],
      teams:[{
        id:1, season:"Winter 2024",games:[
          {id:1, name: "Winn Baseball Navy 10U", score:"9-9-1",atype:"staff"},
          {id:2, name: "Winn Baseball Navy 8U", score:"3-1",atype:"staff"},
          {id:3, name: "Winn Baseball Red 10U",score:"2-3-1",atype:"staff"},
          {id:4, name: "Winn Baseball Red 11U", score:"1-4",atype:"staff"},
        ]},{
        id:2, season:"Fall 2024",games:[
          {id:1, name: "Winn Baseball 10U", score:"9-12",atype:"staff"},
          {id:2, name: "Winn Baseball 12U", score:"17-18-3",atype:"staff"},
          {id:3, name: "Winn Baseball 8U",score:"10-21-2",atype:"staff"},
          {id:4, name: "Winn Baseball Navy 11U", score:"28-9-3",atype:"staff"},
        ]},
      ],
      teamId:'',
      gameId:'',
      team:{},
      gameData:{},
      getTgame:{},
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
    border-radius: 10px;
    border:solid 1px #0170c9;
    box-shadow: none;
    text-transform:uppercase;
    font-size: 11px;
    color: #0170c9;
  }
  .my-custom-toggle{
    border: 1px solid #027be3
  }
  .q-pa-md2{
    padding: 10px;
  }
</style>
