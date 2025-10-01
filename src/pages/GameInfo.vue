<template>
  <q-page class="q-pa-md bg-white">
    <!-- Header -->
    <div class="row justify-between items-center q-mb-md">
      <q-btn flat round icon="close" @click="this.$router.push('/teamPortal/'+this.gameData.leagueId)" />
      <q-btn flat :label="$t('edit')" color="primary" />
    </div>

    <!-- Date Card -->
    <div class="row items-center q-mb-md">
      <div class="column items-center bg-white q-pa-sm q-mr-md shadow-1" style="border-radius: 8px;">
        <div class="text-caption text-grey">{{ this.gameData.month }}</div>
        <div class="text-h6">{{ this.gameData.day }}</div>
      </div>
      <div>
        <div class="text-caption">{{ this.gameData.leagueName }}</div>
        <div class="text-h6">{{ this.gameData.gameType }}</div>
        <div class="text-caption text-grey">{{ this.gameData.time }}</div>
      </div>
    </div>

    <!-- RSVP Status -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-avatar color="dark" text-color="white" class="q-mr-sm">VS</q-avatar>
        <span>{{ $t('yourgoing') }}</span>
        <q-icon name="check_circle" color="green" size="18px" class="q-ml-xs" />
      </div>
      <q-btn outline :label="$t('editrsvp')" color="primary" style="border-radius: 5px;" dense />
    </div>
    <div class="row items-center justify-between q-mb-md">
      <div class="col-6">
        <q-btn color="primary" label="Resume Scoring" @click="this.$router.push('/baseballField/'+this.gameEventId)" class="q-mb-sm full-width" rounded />
      </div>
      <div class="col-6">
        <q-btn color="red" label="Record Video" @click="this.$router.push('/baseballField'+this.gameEventId)" class="full-width q-mb-sm" rounded />
      </div>
    </div>
    <!-- Upload Full Event Video -->
    <div class="q-mb-md text-center">
      <q-btn flat :label="$t('uploadvideo')" color="primary" />
      <q-chip dense label="BETA" color="grey-5" text-color="black" style="border-radius: 5px;" class="q-ml-xs" />
    </div>

    <!-- Location -->
    <div class="bg-white q-pa-md rounded-borders shadow-1 q-mb-md">
      <div class="row justify-between items-center">
        <div>
          <div class="text-subtitle2">{{ this.gameData.venue }}</div>
          <div class="text-caption text-grey">434-450 Gray St NW<br />Atlanta, GA 30318</div>
        </div>
        <q-btn outline :label="$t('viewMap')" color="primary" dense style="border-radius: 5px;" />
      </div>
      <q-img
src="https://maps.googleapis.com/maps/api/staticmap?center=Atlanta,GA&zoom=15&size=600x200&markers=color:red%7C33.767633,-84.550527"
        class="q-mt-md"
        style="border-radius: 8px"
      />
    </div>
    <div style="background-color: white;">
      <!-- Player RSVP Footer -->
      <div class="row items-center justify-between q-mt-md">
        <div class="text-subtitle2">{{ $t('playerRvsp') }}</div>
        <div class="row items-center q-gutter-sm">
          <q-icon name="check_circle" color="green" />
          <div>0</div>
          <q-icon name="cancel" color="red" />
          <div>0</div>
          <q-icon name="help_outline" color="grey" />
          <div>6</div>
        </div>
      </div>
      <div class="row items-center justify-between q-mt-md">
        <div class="text-subtitle2">{{ $t('staffFamiliRvsp') }}</div>
        <div class="row items-center q-gutter-sm">
          <q-icon name="check_circle" color="green" />
          <div>1</div>
          <q-icon name="cancel" color="red" />
          <div>0</div>
          <q-icon name="help_outline" color="grey" />
          <div>2</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent,ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTeamDataStore } from '../stores/team-data'
import { useGameDataStore } from '../stores/game-data'
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

    return { locale,router,teamStore,gameDataStore,utility}
  },
  data() {
		return {
      team:{},
      gameData:{},
      gameEventId: ref('')
    }
  },
  mounted() {
    this.gameEventId = this.router.params.id
    this.getGameEventDetailsById(this.gameEventId)

  },
  methods: {
    async getGameEventDetailsById(gameId){
      await this.gameDataStore.getRecord(gameId)
      .then(async (response) => {
        if (response){
            let startDate = this.utility.convertToMoment((new Date(response.startTime)))
            this.gameData = response
            this.gameData['month'] = startDate.format("MMMM")
            this.gameData['day'] = startDate.format("DD")
            this.gameData['time'] = startDate.format("hh:mm a")
            console.log(response)
        }
      })
      .catch((error) => {
        console.error(error)
      })
    },
  }
});
</script>
