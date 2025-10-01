<template>
  <div class="q-pa-md">
    <div class="row center-justify">
      <div class="col-2" style="padding: 0px !important;">
        <q-btn class="text-blue" color="primary" @click="this.$router.push('/')" dense flat icon="west" />
      </div>
      <div class="col">Create Your Baseball Team</div>
      <div class="col-2">&nbsp;</div>
    </div>
  </div>
  <div>
    <form @submit.prevent="submitUsingCard(null)">
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        vertical
      >
        <q-step
          :name="1"
          title="Team Type"
          icon="settings"
          :done="step > 1"
          :header-nav="step > 1"
        >
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon="home_filled" @click="() => { done1 = true; step = 2;createTeam(1,1) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">Local League / Rec / Other</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon="luggage" @click="() => { done1 = true; step = 2;createTeam(1,2) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">Select / Travel</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon="school" @click="() => { done1 = true; step = 2;createTeam(1,3) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">School</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn @click="() => { done1 = true; step = 2 }" color="primary" label="Continue" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="Players"
          icon="create_new_folder"
          :done="step > 2"
          :header-nav="step > 2"
        >
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon=" format_overline" @click="() => { done2 = true; step = 3;createTeam(2,1) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">Under 13</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon=" trip_origin" @click="() => { done2 = true; step = 3;createTeam(2,2) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">Between 13-18</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>
          <div class="row" style="margin: 30px 0px;">
            <div class="col-12 text-center">
              <q-card @click="this.$router.push('/createTeam')">
                <q-card-actions style="padding: 10px;">
                  <div class="row" style="width: 100%;">
                    <div class="col-12"><q-btn class="text-blue" flat dense icon="circle" @click="() => { done2 = true; step = 3;createTeam(2,3) }"  /></div>
                    <div class="col-12">
                      <div class="text-bold">Over 18</div>
                    </div>
                  </div>
                </q-card-actions>
              </q-card>
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn @click="() => { done2 = true; step = 3 }" color="primary" label="Continue" />
            <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          title="Location"
          icon="add_comment"
          :done="step > 3"
          :header-nav="step > 3"
        >
          <div class="row">
              <div class="col-12 text-bold">Where is your team based?</div>
              <div class="col-12">Team location can later be adjusted in team</div>
              <div class="col-12">
                <q-select clearable color="orange" standout bottom-slots v-model="formData.city" :options="cityOptions" label="Ex. Easton,Pa" counter>
                  <template v-slot:prepend>
                    <q-icon name="place" />
                  </template>
                  <template v-slot:hint>
                    City or Town
                  </template>
                </q-select>
              </div>
          </div>

          <q-stepper-navigation>
            <q-btn @click="() => { done3 = true; step = 4; }" color="primary" label="Continue" />
            <q-btn flat @click="step = 2" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
        <q-step
          :name="4"
          title="Info"
          icon="add_comment"
          :done="step > 4"
          :header-nav="step > 4"
        >
        <div class="row" style="width: 100%;">
          <div class="col-6 col-md-3 team"  v-for="i in seasons" :key="i.id" style="">
            <q-card class="my-card" @click="() => { done4 = true; step = 5;createTeam(5,i.name) }">
              <q-card-actions>
                <div class="row" style="width: 100%;">
                  <div class="col-12">
                    <div class="row justify-center">
                      <q-btn dense flat :icon="i.icon" />
                    </div>
                  </div>
                  <div class="col-12"><div class="row justify-center text-bold" style="padding: 5px 20px;text-align: center;">{{ i.name }}</div></div>

                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
          <q-stepper-navigation>
            <q-btn @click="() => { done4 = true; step = 5; }" color="primary" label="Continue" />
            <q-btn flat @click="step = 3" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
        <q-step
          :name="5"
          title="Season"
          icon="snowing"
          :header-nav="step > 5"
        >

        <div class="row">
              <div class="col-12 text-bold">What is yo ur team's name?</div>
              <div class="col-12">Make sure team members will recognize your team's name. Team name can later be adjusted in team setting.</div>
              <div class="col-12">
                <q-input outlined v-model="formData.team_name" :rules="[  val => val.length >= 5 || 'At least 5 Digits' ]"
                  label="Team Name" placeholder="ex. Manheim Tigers" ref="team_name" hint="Team Name" :dense="dense" />
              </div>
              <div class="col-12">
                <q-select outlined v-model="formData.association" :rules="[val => !!val || 'Please select your Association']"
                   :options="govAsscOptions" ref="association" label="Select a government body" />
              </div>
              <!-- <div class="col-12">
                <div class="row" style="margin: 30px 0px;">
                  <div class="col-12 col-md-2 text-center">
                    <q-card @click="this.$router.push('/createTeam')">
                      <q-card-actions style="padding: 10px;padding: 10px;">
                        <div class="row" style="width: 100%;">
                          <div class="col-12"><q-btn class="text-blue" flat dense icon="home_filled" @click="createTeamdialog = true"  /></div>
                          <div class="col-12">
                            <div class="text-bold">Local League / Rec / Other</div>
                          </div>
                        </div>
                      </q-card-actions>
                    </q-card>
                  </div>
                </div>
              </div> -->

          </div>
          <q-stepper-navigation>
            <q-btn :loading="loading" @click="submitAddTeamForm();done4 = true" color="primary" >
              Submit
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Loading...
              </template>
            </q-btn>
            <q-btn flat @click="step = 4" color="primary" label="Back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </form>
  </div>
</template>

<script>
/* eslint-disable */

import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTeamDataStore } from '../stores/team-data'
import { useteamMemberDataStore } from '../stores/team-member-data'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    let { locale} = useI18n({
        useScope: 'global'
      })
    const router = useRoute()
    const teamStore = useTeamDataStore()
    const teamMemberStore = useteamMemberDataStore()
    const loading = ref(false)
    const q = useQuasar()
    const d = new Date();

    return { locale,router,tabList: ref('schedule'),step: ref(1),
              cityOptions: [
                'Atlanta', 'New york', 'Los Angeles'
              ],q,d,
              loading,teamMemberStore,
              cityTeam:ref(null),govAssociation:ref(null),teamStore
    }
  },
  data() {
		return {
      batOptions:[
          { value: 'right', label: this.$t('right') },
          { value: 'left', label: this.$t('left') },
          { value: 'both', label: this.$t('both') },
      ],
        govAsscOptions:[
          { value: 'l1', label: this.$t('l1') },
          { value: 'l2', label: this.$t('l2') },
          { value: 'l3', label: this.$t('l3') },
          { value: 'l4', label: this.$t('l4') },
          { value: 'l5', label: this.$t('l5') },
          { value: 'l6', label: this.$t('l6') },
          { value: 'l7', label: this.$t('l7') },
      ],
      seasons:[
          { id: '1', icon:'local_florist', name: this.$t('spring')+" "+this.d.getFullYear() },
          { id: '2', icon:'light_mode', name: this.$t('summer')+" "+this.d.getFullYear() },
          { id: '3', icon:'spa', name: this.$t('fall')+" "+this.d.getFullYear() },
          { id: '4', icon:'ac_unit', name: this.$t('winter')+" "+this.d.getFullYear() },
          { id: '5', icon:'local_florist', name: this.$t('spring')+" "+(this.d.getFullYear() + 1) },
          { id: '6', icon:'light_mode', name: this.$t('summer')+" "+(this.d.getFullYear() + 1) },
      ],
      formData: {
        type            : ref(''),
        age_range       : ref(''),
        city            : ref(''),
        address         : ref(''),
        team_name       : ref(''),
        association     : ref(''),
        season          : ref(''),
        score           : ref(''),
			},
    }
  },
  methods: {
    getValueFromArray(alist, findValue){
      return alist.find(
        (o) => o.value == findValue
      )
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
      if(field==5){
        this.formData.season=value
      }
    },
    async submitAddTeamForm() {

      this.loading = true
      this.$refs.team_name.validate()
      this.$refs.association.validate()

      if (!this.$refs.team_name.hasError && !this.$refs.association.hasError) {
          const entityData = {
            homeField       : this.formData.type,
            ageRange        : this.formData.age_range,
            city            : this.formData.city,
            name            : this.formData.team_name,
            division        : this.formData.association.value,
            status          : 'new',
            season          : this.formData.season,
            score           : "0-0"
          }
          await this.teamStore.addRecord(entityData)
          .then(async response => {
            // add current user as teamMember
            const teamMemberData = {
              firstName     : "currentUser",
              teamId        : '3AjNa2d4JRyLeqBOW5Hj',
            }
            await this.teamMemberStore.addRecord(teamMemberData)
            .then(response2 => {
              console.log(response,response2)
              this.loading = false
              this.$router.push("/dashboard")
            }).catch(error => {
              console.log(error)
              this.loading = false
            })

          }).catch(error => {
            this.loading = false
            console.log(error)
          })

      } else {
        this.loading = false
        this.q.notify({
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
.team .my-card{
    padding: 2px;
    margin:8px 8px 5px;
    border-radius: 12px;
    height: 95px;
  }
</style>
