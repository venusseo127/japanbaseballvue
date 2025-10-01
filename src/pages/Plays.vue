<template>
  <div class="row q-pa-md " style="border-bottom: solid 1px #c0c0c0;">
    <div class="col-1"> &nbsp;</div>
    <div class="col-10 text-center">
      <div style="font-size: 25px;font-weight: bold; text-align: center;margin: 10px;">{{ $t('plays') }}</div></div>
    <div class="col-1 text-right float-right">
      <q-btn class="text-blue" style="font-size: 18px;" color="primary" flat dense icon="more_vert" />
    </div>
    <div class="q-pa-md example-row-all-breakpoints" style="width: 100%;">
      <div class="row"  style="border-bottom: #c0c0c0 solid 1px;">
        <div class="col-2"></div>
        <div class="col">1</div>
        <div class="col">2</div>
        <div class="col">3</div>
        <div class="col">4</div>
        <div class="col">5</div>
        <div class="col">6</div>
        <div class="col">R</div>
        <div class="col">H</div>
        <div class="col">E</div>
      </div>
      <div class="row">
        <div class="col-2">AGTM</div>
        <div class="col">3</div>
        <div class="col"><q-btn color="primary" style="height: 15px;" dense label="4"/></div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col">5</div>
        <div class="col">7</div>
        <div class="col">2</div>
        <div class="col-2">TBDM</div>
        <div class="col">5</div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col"> &nbsp; </div>
        <div class="col">5</div>
        <div class="col">5</div>
        <div class="col">3</div>
      </div>

      </div>
    <q-separator />
  </div>
  <div v-show="model=='one'">
    <div class="row" style="padding: 15px;">
      <div class="col-10" style="font-weight: 450;">Double | <span style="color: red;">1 Out</span></div>
      <div class="col-2" style="text-align: right;color: #0070c8;font-weight: 450;">{{ $t('edit') }}</div>
      <div class="col-12" style="margin-bottom: 10px;">
        Foul, Error by third baseman on foul ball, In play.
      </div>
      <div class="col-12">
        Rodriguez doubles on a bunt to right fielder, Cruz out advancing to home.
      </div>
    </div>
    <q-separator />
    <div class="row" style="padding: 15px;">
      <div class="col-10" style="font-weight: 450;">Triple</div>
      <div class="col-2" style="text-align: right;color: #0070c8;font-weight: 450;">{{ $t('edit') }}</div>
      <div class="col-12" style="margin-bottom: 10px;">
        Foul, In play.
      </div>
      <div class="col-12">
        Cruz triples on a hard ground ball to right fielder.
      </div>
    </div>
    <q-separator />
    <div class="row" style="padding: 15px;">
      <div class="col-10" style="font-weight: 450;">Home Run | <span style="color: green;">AGTM 4 - 5 TBDM</span></div>
      <div class="col-2" style="text-align: right;color: #0070c8;font-weight: 450;">{{ $t('edit') }}</div>
      <div class="col-12" style="margin-bottom: 10px;">
        In play.
      </div>
      <div class="col-12">
        Lopez hits an inside-the-park home run on a hard ground ball to second baseman.
      </div>
    </div>
    <q-separator />
    <div class="row" style="padding: 10px 15px;background: aliceblue;">
      <div class="col-12" style="font-weight: bold;">
        Bottom of the 1st - TBD Mar 27, 2025
      </div>
    </div>
    <q-separator />
    <div class="row" style="padding: 15px;">
      <div class="col-10" style="font-weight: 450;">FC Double Play | <span style="color: green;">AGTM 3 - 5 TBDM</span></div>
      <div class="col-2" style="text-align: right;color: #0070c8;font-weight: 450;">{{ $t('edit') }}</div>
      <div class="col-12" style="margin-bottom: 10px;">
        Ball 1, Strike 1 looking, In play.
      </div>
      <div class="col-12">
        Mendoza lines into a fielder's choice double play.
      </div>
    </div>
    <q-separator />
    <div class="row" style="padding: 15px;">
      <div class="col-10" style="font-weight: 450;">Home Run | <span style="color: green;">AGTM 4 - 5 TBDM</span></div>
      <div class="col-2" style="text-align: right;color: #0070c8;font-weight: 450;">{{ $t('edit') }}</div>
      <div class="col-12" style="margin-bottom: 10px;">
        In play.
      </div>
      <div class="col-12">
        Lopez hits an inside-the-park home run on a hard ground ball to second baseman.
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

    return { locale,router,model: ref('one')}
  },
  data() {
		return {
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
