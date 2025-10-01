<template>
  <div class="q-pa-md">
    <q-dialog v-model="createNewMember"
      persistent
    >
      <div style="background-color: white;">
        <div class="addMemberBox">
          <q-form >
            <div class="header">
              <div class="row" style="padding:10px;border: solid 1px #c0c0c0;">
                <div class="col-2">
                  <q-btn flat round dense color="primary" icon="close" @click="createNewMember=false" />
                </div>
                <div class="col dialogTitle">{{ $t('addStaffMember') }}</div>
                <div class="col-3" style="text-align: right;">
                  <q-btn flat dense :label="$t('addbtn')" @click="submitTeamMember()" style="font-size: 15px;" color="primary"  />
                </div>
              </div>
            </div>
            <div class="row q-pa-md">
              <div class="col-12">
                <q-input outlined class="col" ref="emailAddress" v-model="formData.emailAddress"
                :rules="[ val => isValidEmailAddress(val) || 'Valid Email Address Please.']"
                lazy-rules label="Email" />
              </div>
              <div class="col-12">
                <q-input v-model="formData.firstName" class="col newplayerFields" ref="firstName" outlined :label="$t('firstName')" />
              </div>
              <div class="col-12">
                <q-input v-model="formData.lastName" class="col newplayerFields" ref="lastName" outlined :label="$t('lastName')" />
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </q-dialog>
    <div class="row center-justify">
      <div class="col" style="padding: 0px !important;">
        <q-btn class="text-blue" color="primary" @click="this.$router.push('/')" dense flat icon="west" />
      </div>
      <div class="col">
        <div class="row justify-center">
          <q-btn round>
            <q-avatar size="64px">
              <img src="icons/baseball2.svg" style="width: 42px; height: 42px;">
            </q-avatar>
          </q-btn>
        </div>
      </div>
      <div class="col text-right float-right"  style="padding: 0px !important;">
        <q-btn class="text-blue" color="primary" flat dense icon="share" />
        <q-btn class="text-blue" color="primary" flat dense icon="settings" />
      </div>
    </div>

    <div class="row justify-center" style="margin-top: 10px;">
      <div class="col-12 text-center" style="font-weight: bold; font-size: 18px;">{{ this.gameData.name}}</div>
      <div class="col-12 text-center">{{ this.gameData.season }} {{ this.gameData.score}}</div>
      <div class="col-12" style="text-align: center;"><q-btn class="staff" dense :label="$t('staff')" /></div>
      <div class="col-12 text-center">
        <q-btn class="msgTeam" :label="$t('messageTeam')" />
      </div>
    </div>
    <div class="" style="width: 100%">
      <q-list padding bordered class="rounded-borders">
        <q-expansion-item>
          <template v-slot:header>
            <q-item-section avatar>
              <q-btn icon="format_list_bulleted" outline color="primary"/>
            </q-item-section>

            <q-item-section style="font-size: 15px;font-weight: bold;">
              {{ $t('completeTeamSetup') }}
            </q-item-section>

            <q-item-section side>
              <div class="row items-center">
                <q-btn round size="sm" color="negative"  label="3" />
              </div>
            </q-item-section>
          </template>
          <q-separator />
          <q-card style="padding: none;">
            <q-card-section>
              <q-list>

                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-btn color="primary" size="sm" round :outline="staffs.length>0?true:false" :icon="(staffs.length>0)?'done':'add'" />
                  </q-item-section>

                  <q-item-section>{{ $t('addStaffMember') }} ( {{ staffs.length }}/1)</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-btn color="primary" size="sm" round   :icon="(teamPlayers.length>0)?'done':'add'" />
                  </q-item-section>

                  <q-item-section @click="this.$router.push('/createPlayer/'+this.teamId+'/1')">{{ $t('addplayer') }} ( {{ this.teamPlayers.length }} /4)</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-btn color="primary" size="sm" round outline  :icon="(fans.length>=5)?'done':'add'" />
                  </q-item-section>

                  <q-item-section>{{ $t('addFansContacts') }} ({{ fans.length }}/5)</q-item-section>
                </q-item>
                <q-item clickable v-ripple>
                  <q-item-section avatar>
                    <q-btn color="primary" size="sm" round outline  icon="add" />
                  </q-item-section>

                  <q-item-section>{{ $t('addEvents') }} (2/5)</q-item-section>
                </q-item>

              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
  <div style="max-height: 420px;">
    <div class="teamPlay">
      <div style="width: 100%;">
        <q-tabs
          v-model="tabList"
          align="justify"
        >
          <q-tab class="text-purple" name="schedule" :label="$t('schedule')" />
          <q-tab class="text-orange" name="team" :label="$t('team')"  />
          <q-tab class="text-teal" name="video" :label="$t('video')" />
          <q-tab class="text-blue" name="stats" :label="$t('Stats')"  />
          <q-tab class="text-pink" name="opponents" :label="$t('opponents')"  />
        </q-tabs>
        <div class="schedule">
          <q-tab-panels
            v-model="tabList"
            animated
            transition-prev="scale"
            transition-next="scale"
            style="background-color: #edf1fa;"
          >
            <q-tab-panel name="schedule">
              <div class="row" v-for="item in schedules" :key="item.id" style="background-color: #edf1fa;" >
                  <div class="col-12" style="padding: 0px 15px 10px;">{{ item.monthly }}</div>
                  <div class="col-12" v-for="i in item.dateSched" :key="i.id" @click="this.$router.push('/gameinfo/'+i.id)" style="background-color: white;padding: 15px;border-bottom: 1px solid #c0c0c0;cursor: pointer;">
                    <div class="row">
                      <div class="col-1 column text-right">
                        <div class="col" style="font-size: 12px;margin-top: 10px;">{{ i.dayName }}</div>
                        <div class="col" style="font-weight: bold;font-size: 20px;">{{ i.day }}</div>
                      </div>
                      <div class="col column" style="padding-left: 15px;">
                        <div class="col" v-if="i.gameType=='Game'"><q-btn class="live" color="negative" dense :label="$t('live')" /></div>
                        <div class="col">@{{ i.awayTeam }} {{ i.cdate }}</div>
                      </div>
                      <div class="col-2" v-if="i.score" style="vertical-align: middle;margin-top: 20px;" color="negative">0-0</div>
                      <div class="col-2" v-if="!i.score" style="vertical-align: middle;margin-top: 20px;" color="negative">{{ i.hr }}:{{ i.min }} {{ i.ampm }}</div>
                    </div>
                  </div>
                  <!-- <div class="col-12" style="background-color: white;padding: 15px;">
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
                  </div> -->
              </div>
              <!-- <div class="row" style="background-color: #edf1fa;" @click="this.$router.push('/gameinfo')">
                  <div class="col-12" style="padding: 0px 15px;">May 2025</div>
                  <div class="col-12" @click="this.$router.push('/gameinfo')" style="background-color: white;padding: 15px;border-bottom: 1px solid #c0c0c0;">
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
              </div> -->
            </q-tab-panel>

            <q-tab-panel name="team">
              <div class="q-gutter-y-md">
                <q-btn-toggle
                  v-model="teamTab"
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  spread
                  style="padding: 0px 20px;"
                  rounded
                  unelevated
                  :options="[
                    { label: 'Staff', value: 'staff' },
                    { label: 'Players', value: 'players' },
                    { label: 'Fans', value: 'fans' }
                  ]"
                />
                <q-tab-panels
                  v-model="teamTab"
                  animated
                  transition-prev="scale"
                  transition-next="scale"
                  style="background-color: #edf1fa;"
                >
                  <q-tab-panel name="staff">
                    <!-- Team Staff -->
                    <div class="text-subtitle1 text-weight-medium" style="padding: 0px 20px;">
                      Team Staff ({{staffs.length}}/4)
                    </div>
                    <div style="background-color: white;">
                      <q-btn flat icon="control_point" @click="createNewMember=true;" label="Add Staff" color="primary" class="q-mb-sm" />
                      <q-list bordered class="rounded-borders">
                        <q-item v-for="(member, index) in staffs" :key="index">
                          <q-item-section avatar>
                            <q-avatar color="dark" text-color="white">
                              {{ member.firstName.charAt(0).toUpperCase() }}{{ member.lastName.charAt(0).toUpperCase() }}
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <div>{{ member.firstName }} {{ member.lastName }}
                              <span v-if="member.createdBy === member.userId" class="text-grey-6">(you)</span>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                    <div class="text-subtitle2 text-weight-medium q-mt-lg q-mb-sm"  style="padding: 0px 20px;">
                      Team Permissions
                    </div>
                    <div style="background-color: white;">
                      <q-list separator>
                        <q-item>
                          <q-item-section>
                            <div class="text-weight-medium">Videographers</div>
                          </q-item-section>
                          <q-item-section side>
                            All confirmed members
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section>
                            <div class="text-weight-medium">Scorekeepers</div>
                          </q-item-section>
                          <q-item-section side>
                            Only selected members
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="players">
                    <div class="text-subtitle1 text-weight-medium" style="padding: 0px 20px;">
                      Players ({{ this.teamPlayers.length }})
                    </div>
                    <div class="row" style="background-color: white;">
                      <q-btn flat class="col-12 q-mb-sm" @click="this.$router.push('/createPlayer/'+this.teamId+'/1')" icon="control_point" label="Add Players" color="primary"  />
                      <q-list bordered class="rounded-borders" style="width: 100%;">
                        <q-item v-for="(player, index) in teamPlayers" :key="index">
                          <q-item-section avatar>
                            <q-avatar color="dark" text-color="white">
                              <span style="font-style: italic;">{{ player.firstName.charAt(0) }}{{ player.lastName.charAt(0) }}</span>
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <div>{{ player.firstName }} {{ player.lastName }}</div>
                            <div color="gray"># {{ player.shirtNumber }}</div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-tab-panel>
                  <q-tab-panel name="fans">
                    <div class="text-subtitle1 text-weight-medium" style="padding: 0px 20px;">
                      Fans ({{fans.length}}/4)
                    </div>
                    <div style="background-color: white;">
                     <q-btn flat icon="add_circle" label="Invite Fans" @click="createNewMember=true;memberType='Fans'" color="primary" class="q-mb-sm" />
                      <q-list bordered class="rounded-borders">
                        <q-item v-for="(member, index) in fans" :key="index">
                          <q-item-section avatar>
                            <q-avatar color="dark" text-color="white">
                              {{ member.firstName.charAt(0).toUpperCase() }}{{ member.lastName.charAt(0).toUpperCase() }}
                            </q-avatar>
                          </q-item-section>
                          <q-item-section>
                            <div>{{ member.firstName }} {{ member.lastName }}
                              <span v-if="member.createdBy === member.userId" class="text-grey-6">(you)</span>
                            </div>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </div>
            </q-tab-panel>

            <q-tab-panel name="video">
              <div class="text-h6">Movies</div>
              Nostrum necessitatibus expedita dolores? Voluptatem.
            </q-tab-panel>
          </q-tab-panels>

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="fade"
            transition-next="fade"
            class="bg-orange text-white text-center"
          >
            <q-tab-panel name="mails">
              <div class="text-h6">Mails</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="alarms">
              <div class="text-h6">Alarms</div>
              Ad molestiae non facere animi nobis, similique nemo.
            </q-tab-panel>

            <q-tab-panel name="movies">
              <div class="text-h6">Movies</div>
              Nostrum necessitatibus expedita dolores? Voluptatem.
            </q-tab-panel>
          </q-tab-panels>

          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="jump-up"
            transition-next="jump-down"
            class="bg-teal text-white text-center"
          >
            <q-tab-panel name="mails">
              <div class="text-h6">Mails</div>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </q-tab-panel>

            <q-tab-panel name="alarms">
              <div class="text-h6">Alarms</div>
              Ad molestiae non facere animi nobis, similique nemo.
            </q-tab-panel>

            <q-tab-panel name="movies">
              <div class="text-h6">Movies</div>
              Nostrum necessitatibus expedita dolores? Voluptatem.
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" glossy="" @click="this.$router.push('/createEvent/'+this.teamId)" />
    </q-page-sticky>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTeamDataStore } from '../stores/team-data'
import { useGameDataStore } from '../stores/game-data'
import { usePlayerDataStore } from '../stores/player-data'
import { useteamMemberDataStore } from '../stores/team-member-data'
import { utilities } from '../utilities.js'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
          useScope: 'global'
        })
    const router = useRoute()
    const teamStore = useTeamDataStore()
    const gameDataStore   = useGameDataStore()
    const utility = utilities()
    const playerData = usePlayerDataStore()
    const teamMemberStore = useteamMemberDataStore()

    return { locale,router,tabList: ref('schedule'),teamStore,gameDataStore,
             teamMemberStore,utility,playerData,createNewMember:ref(false)
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
      formData: {
        emailAddress        : ref(''),
        firstName           : ref(''),
        lastName            : ref('')
			},
      teamId:'',
      gameId:'',
      team:{},
      teamPlayers:[],
      gameData:{},
      getTgame:{},
      schedules:[],
      staffs:[],
      fans:[],
      staffs2 : [
        { initials: 'VS', name: 'Venus Sanchez', you: true },
        { initials: 'CO', name: 'connie82565@gmail.com', you: false }
      ],
      teamTab : ref('staff'),
      memberType:"Staff"
    }
  },mounted() {
    this.teamId = this.router.params.id
    this.getTeamDetails(this.teamId)
    this.getTeamGameEvent(this.teamId)
    this.getTeamPlayers(this.teamId)
    this.getTeamMembers(this.teamId)
    // const hFound = this.teams.findIndex(elem2 => elem2.id == this.teamId)
    // if (hFound >= 0){
    //   this.team = this.teams[hFound]
    //   this.getTgame = this.teams[hFound].games
    //   console.log(this.teams[hFound].games)
    //   const nIndex = this.getTgame.findIndex(elem => elem.id == this.gameId)
    //   if(nIndex >= 0){
    //     this.gameData = this.getTgame[nIndex]
    //     //this.restaurants.push(elem)
    //     console.log(this.getTgame,this.gameData,this.teamId,this.gameId,nIndex)
    //   }
    // }

  },
  methods: {
    async getTeamDetails(teamId){
      await this.teamStore.getRecord(teamId)
      .then(async (response) => {
        if (response){
            this.gameData = response
            console.log(response)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    },
    async getTeamMembers(teamId){
      this.staffs = []
      this.fans = []
      let resultdata = await this.teamMemberStore.getRecordsByTeamId(teamId)
        if (resultdata){
            resultdata.forEach((e) => {
              if(e.type=="Staff"){
                 this.staffs.push(e)
              }else{
                this.fans.push(e)
              }
            })

        }
    },
    selectPitch(id,name){
      // if(name=='ballInPlay'){
      //   this.pitchMenus = this.pitchAction[id][name]
      // }
      const hFound = this.pitchAction.findIndex(elem2 => elem2.id == id)
      if (hFound >= 0){
        this.pitchMenus = this.pitchAction[hFound][name]
        console.log(this.teams[hFound].games)

        // const nIndex = this.getTgame.findIndex(elem => elem.id == this.gameId)
        // if(nIndex >= 0){
        //   this.gameData = this.getTgame[nIndex]
        //   //this.restaurants.push(elem)
        //   console.log(this.getTgame,this.gameData,this.teamId,this.gameId,nIndex)
        // }
      }
    },
    async submitTeamMember() {
      this.loading = true
      this.$refs.emailAddress.validate()
      this.$refs.firstName.validate()
      this.$refs.lastName.validate()

      if (!this.$refs.emailAddress.hasError && !this.$refs.firstName.hasError && !this.$refs.lastName.hasError ) {

        const postData = {
          firstName         : this.formData.firstName,
          lastName          : this.formData.lastName,
          email             : this.formData.emailAddress,
          type              : this.memberType,
          teamId            : this.teamId,
          status            : "active"
        }

        await this.teamMemberStore.addRecord(postData)
        .then(response => {
          this.loading = false
          this.$q.notify({
            message: "Email confirmation has been sent from Pilaludere, you may want to check your Spam folder.",
            position:'top',
            color: 'green',
          })
          this.getTeamMembers(this.teamId)
        }).catch(error => {
          this.loading = false
          console.error(error)
        })
        this.createNewMember = false
      } else {
        this.loading = false
        this.errMsg = "Please complete required fields"
        this.$q.notify({
          message: "Please complete required fields",
          position:'top',
          color: 'red',
        })
        this.createNewMember = false
      }
    },
    async getTeamPlayers(teamId){
      await this.playerData.getRecordsByTeamId(teamId)
      .then(async (response) => {
        if (response){
            this.teamPlayers = response
            console.log(response)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    },
    async getTeamGameEvent(teamId){
        this.schedules = []
        let receivedData = await this.gameDataStore.getRecordsByTeam(teamId)
        if(receivedData.length > 0){
          console.log("receivedData", receivedData)
          const groupedTech = Object.entries(
            receivedData.reduce((acc, value) => {
              let startDate = this.utility.convertToMoment((new Date(value.startTime)))
              let monthlyDate = startDate.format("MMMM YYYY")
              if (!acc[monthlyDate]) {
                acc[monthlyDate] = [];
              }
              value.dayName = startDate.format("ddd")
              value.day = startDate.format("DD")
              value.hr = startDate.format("hh")
              value.min = startDate.format("mm")
              value.ampm = startDate.format("a")
              value.cdate = startDate.format("MMM DD, YYYY")
              acc[monthlyDate].push(value);
              return acc;
            }, {}))
          .map(([monthly, dateSched]) => ({
            monthly,
            dateSched
          }));
          this.schedules = groupedTech
          //console.log("groupedTech",groupedTech)
        }
      },
    isValidEmailAddress(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
  }
});
</script>
<style >
  .q-item__section--side {
    min-width: auto;
  }
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
  .newplayerFields{
    margin-bottom: 10px;
  }
</style>
