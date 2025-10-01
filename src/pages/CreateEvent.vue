<template>
  <q-form >
    <div style="border-bottom: solid 1px #c0c0c0;padding: 15px 20px 10px;">
      <div class="row center-justify">
        <div class="col-1" style="padding: 0px !important;">
          <q-btn class="text-blue" color="primary" @click="this.$router.push('/teamPortal/'+this.teamId)" dense flat icon="close" />
        </div>
        <div class="col" style="padding-left: 15px;">
          <div class="text-h6">Add Event</div>
          <div style="color:gray">Team Lemon</div>
        </div>
        <div class="col-2 text-right"><q-btn class="text-blue" color="primary" @click="submitAddEventForm()" dense flat icon="check" /></div>
      </div>
    </div>
    <div class="q-gutter-md" style="padding: 20px 20px;">
      <q-select
        label="Event Type" ref="gameType"
        v-model="formData.gameType"
        :options="eventTypes"
        emit-value outlined
        map-options
      />

      <q-toggle
        v-model="formData.isScrimmage"
        label="Scrimmage" ref="isScrimmage"
        left-label
      />

      <q-select
        label="Home / Away" outlined ref="homeAway"
        v-model="formData.homeAway"
        :options="homeAwayOptions"
      />

      <q-select
        label="Opponent" ref="opponent"
        v-model="formData.opponent"
        :options="eventOpponents"
        emit-value outlined
        map-options
      />

      <q-input
        v-model="formData.location"
        label="Location" ref="location"  :rules="[  val => val.length >= 5 || 'At least 5 Characters']"
        placeholder="Enter location" outlined
      />

      <q-toggle
        v-model="formData.allDay"
        label="All Day Event" ref="allDay"
        left-label outlined
        @update:model-value="val => allDaySelect(val)"
      />

      <q-input outlined="" v-model="formData.startDate" ref="startDate" :rules="[val => !!val || 'Please select Start Date']" mask="##-##-#### ##:##">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formData.startDate" mask="MM-DD-YYYY HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="formData.startDate" mask="MM-DD-YYYY HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        readonly outlined
        v-model="formData.duration"
        label="Duration" value="1 hr"
        @click="showDurationPicker = true"
      />

      <!-- <q-select outlined
        v-model="formData.arrivalTime"
        label="Arrive" ref="arrivalTime"
        :options="arrivalOptions"
        placeholder="No arrival time"
      /> -->

      <q-select outlined
        v-model="formData.repeats"
        label="Repeats" ref="repeats"
        :options="repeatOptions"
      />

      <q-input
        type="textarea" outlined
        v-model="formData.notes" ref="notes"
        label="Notes (Optional)"
      />
      <q-dialog v-model="showDurationPicker">
        <q-card>
          <q-card-section class="text-h6">
            Duration
          </q-card-section>

          <q-card-section class="row justify-around">
            <q-select
              v-model="formData.selectedHour"
              :options="hours"
              @update:model-value="val => selectDuration(1,val)"
              label="hr" ref="selectedHour"
              dense
              emit-value
              map-options
              options-dense
              style="width: 100px"
              hide-bottom-space
              popup-content-class="q-pa-none"
            />
            <q-select
              v-model="selectedMinute"
              :options="minutes"
              @update:model-value="val => selectDuration(2,val)"
              label="min"
              dense ref="selectedMinute"
              emit-value
              map-options
              options-dense
              style="width: 100px"
              hide-bottom-space
              popup-content-class="q-pa-none"
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Save" @click="saveDuration()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-form>
</template>

<script>
import { defineComponent,ref,computed } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useGameDataStore } from '../stores/game-data'
import { useTeamDataStore } from '../stores/team-data'
import { Timestamp } from 'firebase/firestore'
//


export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router          = useRoute()
    const gameDataStore   = useGameDataStore()
    const teamStore       = useTeamDataStore()
    const loading         = ref(false)
    let startDate         = ref(new Date(Timestamp.now().seconds*1000),"YYYY-MM-DD HH:II")

    return { locale,router,gameDataStore,
             loading,startDate, teamStore
    }
  },
  data() {
		return {
      eventTypes:[
          { value: 'Game', label: this.$t('game') },
          { value: 'Practice', label: this.$t('practice') },
          { value: 'Other', label: this.$t('other') },
      ],
      eventOpponents:[
          { value: 'TBD', label: this.$t('tbd') },
      ],
      homeAwayOptions:[
          { value: 'Home', label: this.$t('home') },
          { value: 'Away', label: this.$t('away') },
          { value: 'TBD', label: this.$t('tbd') },
      ],
      repeatOptions:[
          { value: 'Never', label: this.$t('never') },
          { value: 'Every Week', label: this.$t('eweek') },
          { value: 'Every 2 Weeks', label: this.$t('e2week') },
          { value: 'Every Months', label: this.$t('emonth') },
      ],
      minutes             : [0, 5, 10, 15, 30, 45, 55],
      hours               : Array.from({ length: 25 }, (_, i) => i),
      showDurationPicker  : ref(false),
      selectedHour        : ref(1),
      selectedMinute      : ref(0),
      teamId              : '',
      teamData            : {},
      formData: {
        gameType        : ref('Game'),
        isScrimmage     : false,
        homeAway        : ref('TBD'),
        opponent        : ref(''),
        location        : ref(''),
        durationDisplay : ref(1+'hr'),
        allDay          : ref(false),
        startDate       : ref(''),
        duration        : ref(1+' hr'),
        //arrivalTime     : ref(''),
        repeats         : ref('Never'),
        notes           : ref(''),
        leagueId        : ref(''),
        leagueName      : ref(''),
        season          : ref(''),
			},
    }
  },
  async mounted() {
    this.teamId = this.router.params.id
    this.getTeamDetails(this.teamId)
    this.formData.durationDisplay = computed(() => {
      if (this.selectedHour.value === 0 && this.selectedMinute.value === 0) return '0 min'
      const h = this.selectedHour.value > 0 ? `${this.selectedHour.value} hr` : ''
      const m = this.selectedMinute.value > 0 ? `${this.selectedMinute.value} min` : ''
      return `${h} ${m}`.trim()
    })
  },
  methods: {
    saveDuration() {
      this.showDurationPicker.value = false
    },
    getValueFromArray(alist, findValue){
      return alist.find(
        (o) => o.value == findValue
      )
    },
    selectDuration(param,val){
      if(param==1){
        this.selectedHour = val
      }
      if(param==2){
        this.selectedMinute = val
      }
      this.formData.duration = this.selectedHour+" hr "+this.selectedMinute+" min"
    },
    allDaySelect(){

    },
    async getTeamDetails(teamId){
      await this.teamStore.getRecord(teamId)
      .then(async (response) => {
        if (response){
            this.teamData = response
            console.log(response)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    },
    createTeam(field,value){
      if(field==1){
        this.formData.type=value
      }
      if(field==2){
        this.formData.age_range=value
      }
      if(field==3){
        this.formData.city=value
      }
    },
    async submitAddEventForm() {

      this.loading = true
      this.$refs.location.validate()
      this.$refs.startDate.validate()

      if (!this.$refs.location.hasError && !this.$refs.startDate.hasError) {
          const entityData = {

            gameType        : this.formData.gameType,
            scrimmage       : this.formData.isScrimmage,
            homeTeam        : this.formData.homeAway,
            awayTeam        : this.formData.opponent,
            venue           : this.formData.location,
            allDay          : this.formData.allDay,
            startDate       : this.formData.startDate,
            duration        : this.formData.duration,
            //arrivalTime     : this.formData.arrivalTime,
            notes           : this.formData.notes,
            status          : "New",
            repeats         : this.formData.repeats,

            repeatsEndDate  : '',//data.repeatsEndDate || '',
            leagueId        : this.teamData.id || '',
            leagueName      : this.teamData.name || '',
            season          : this.teamData.season || '',

          }
          console.log(entityData)
          await this.gameDataStore.addRecord(entityData)
          .then(response => {
            this.loading = false
             this.$router.push("/teamPortal/"+this.teamId)
             console.log(response)
          }).catch(error => {
            this.loading = false
            console.log(error)
            this.$q.notify({
                type: 'negative',
                position:'top',
                message: error
            })
          })

      } else {
        this.loading = false
        this.$q.notify({
          message: "Please complete required fields",
          position:'top',
          color: 'red',
        })
      }
    }
  }
});
</script>
<style >

</style>
