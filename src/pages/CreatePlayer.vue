<template>
  <q-form >
    <div style="border-bottom: solid 1px #c0c0c0;padding: 15px 20px 10px;">
      <div class="row center-justify">
        <div class="col-1" style="padding: 0px !important;">
          <q-btn class="text-blue" color="primary" @click="this.$router.push('/baseballField')" dense flat icon="close" />
        </div>
        <div class="col" style="padding-left: 15px;">
          <div class="text-h6">{{ $t('addPlayer') }}</div>
        </div>
        <div class="col-2 text-right"><q-btn class="text-blue" color="primary" @click="submitAddPlayerForm()" dense flat :label="$t('addbtn')" /></div>
      </div>
    </div>
    <div style="padding: 20px 20px;">
      <div class="row" style="width: 100%;">

            <div class="col-12" style="margin-bottom: 15px;">
              <q-input v-model="formData.shirtNumber" ref="shirtNumber" outlined :label="$t('number')" />
            </div>
            <div class="col-12" style="margin-bottom: 15px;">
              <q-input v-model="formData.firstName" ref="firstName" outlined :label="$t('firstName')" />
            </div>
            <div class="col-12" style="margin-bottom: 15px;">
              <q-input v-model="formData.lastName" ref="lastName" outlined :label="$t('lastName')" />
            </div>
            <div class="col-6" style="margin-bottom: 15px;">
              <q-select v-model="formData.battingHand" ref="battingHand" outlined :options="batOptions" :label="$t('bats')" />
            </div>
            <div class="col-6" style="max-width: 300px">
              <q-select v-model="formData.throwingHand" ref="throwingHand" outlined :options="thOptions" :label="$t('throwingHand')" />
            </div>
            <div class="col-12" style="margin-bottom: 15px;">
              <q-input outlined="" ref="dob" :label="$t('dob')" v-model="formData.dateOfBirth" >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer" style="margin: 0px;">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.dateOfBirth" mask="MM/DD/YYYY">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12" style="margin-bottom: 15px;">
              <q-input outlined v-model="formData.family_contact" label="Contact Info" placeholder="Family contact email/number" hint="optional" :dense="dense" />
            </div>
            <div class="col-6" style="margin-bottom: 15px;">
              <q-input v-model="formData.weight" ref="weight" outlined :label="$t('weight')" />
            </div>
            <div class="col-6" style="max-width: 300px">
              <q-input v-model="formData.height" ref="height" outlined :label="$t('height')" />
            </div>
        </div>
    </div>
</q-form>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePlayerDataStore } from '../stores/player-data'
import { Timestamp } from 'firebase/firestore'
import { useTeamDataStore } from '../stores/team-data'


export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()
    const playerData = usePlayerDataStore()
    const loading = ref(false)
    const newDate = new Date(Timestamp.now().seconds*1000)
    const teamStore = useTeamDataStore()

    return { locale,router,teamStore,
              newDate,
              loading,playerData,
    }
  },
  data() {
		return {
      batOptions:[
          { value: 'right', label: this.$t('right') },
          { value: 'left', label: this.$t('left') },
          { value: 'both', label: this.$t('both') },
      ],
      thOptions:[
          { value: 'right', label: this.$t('right') },
          { value: 'left', label: this.$t('left') },
      ],
      formData: {
        shirtNumber     : ref(''),
        firstName         : ref(''),
        lastName          : ref(''),
        battingHand       : ref(''),
        throwingHand      : ref(''),
        avatar            : ref(''),
        email             : ref(''),
        family_contact    : ref(''),
        teamId            : ref(''),
        teamName          : ref(''),
        teamPosition      : ref(''),
        height            : ref(''),
        weight            : ref(''),
        dateOfBirth       : ref(''),
			},
      teamId              : '',
      teamData            : {},
      returnPage          : ''
    }
  },
  async mounted() {
    this.teamId = this.router.params.teamId
    this.returnPage = this.router.params.rpage
    this.getTeamDetails(this.teamId)
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
    async getTeamDetails(teamId){
      await this.teamStore.getRecord(teamId)
      .then(async (response) => {
        if (response){
            this.teamData = response
            this.formData.teamId = teamId
            this.formData.teamName = response.name
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
    async submitAddPlayerForm() {

      this.loading = true
      this.$refs.shirtNumber.validate()
      this.$refs.firstName.validate()
      this.$refs.lastName.validate()
      this.$refs.battingHand.validate()
      this.$refs.throwingHand.validate()

      if (!this.$refs.shirtNumber.hasError && !this.$refs.firstName.hasError && !this.$refs.lastName.hasError && !this.$refs.battingHand.hasError && !this.$refs.throwingHand.hasError) {
          const entityData = {

              avatar          : this.formData.avatar,
              firstName       : this.formData.firstName,
              lastName        : this.formData.lastName,
              dateOfBirth     : this.formData.dateOfBirth,
              shirtNumber     : this.formData.shirtNumber,
              teamId          : this.formData.teamId,
              teamName        : this.formData.teamName,
              playerType      : "Team Member",
              height          : this.formData.height,
              weight          : this.formData.weight,
              battingHand     : this.formData.battingHand.value,
              throwingHand    : this.formData.throwingHand.value,
              status          : "active"
          }
          console.log(entityData)
          await this.playerData.addRecord(entityData)
          .then(response => {
            this.loading = false
            if(this.returnPage==2){
              this.$router.push("/")
            }else{
              this.$router.push("/teamPortal/"+this.teamId)
            }

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
