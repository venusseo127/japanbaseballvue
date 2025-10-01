<template>
  <div class="playground">
    <div class="q-pa-md">
      <div class="row center-justify">
        <div class="col-9">
          <q-btn class="noVid" dense icon-right="help" size="sm" :label="$t('NoVideo')" />
          <q-btn class="uparrow" flat dense icon="arrow_drop_up" v-if="this.gameEventData.half=='up'" />
          <q-btn class="uparrow" flat dense icon="arrow_drop_down" v-if="this.gameEventData.half=='down'" />
          <span class="scoretop" color="info">{{ this.gameEventData.inningCount || 1 }}<sup>{{ this.getRankTail(this.gameEventData.inningCount || 1) }}</sup></span>
          <span class="scorebso" color="info">B</span>
          <span class="scoretop" color="info">{{ this.gameEventData.ballCount || 0 }}</span>
          <span class="scorebso" color="info">S</span>
          <span class="scoretop" color="info">{{ this.gameEventData.strikeCount || 0 }}</span>
          <span class="scorebso" color="info">O</span>
          <span class="scoretop" color="info">{{ this.gameEventData.outsCount || 0 }}</span> 
        </div>
        <div class="col text-right float-right">
          <q-btn class="text-blue" flat dense icon="language">
            <q-menu style="top: 12px !important;">
              <q-select
                v-model="locale"
                :options="localeOptions"
                :label="$t('general_language')"
                dense
                borderless
                emit-value
                map-options
                options-dense
                @update:model-value="getLocaleVal()"
                style="min-width: 130px;font-size: 11px; color:#ffffff"
              />
            </q-menu>
          </q-btn>
          <q-btn class="text-blue" style="font-size: 18px;" flat dense icon="more_vert">
            <q-menu>
              <q-list>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;"  @click="this.$router.push('/teamPortal/'+this.teamId)">{{ $t("exitGame") }}</q-item-label>
                    <q-item-label style="font-size: 12px; color:gray;">{{ $t("gamewillbesave") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px; color:red;">{{ $t("gameover") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("endHalfInning") }}</q-item-label>
                    <q-item-label style="font-size: 12px; color:gray;">{{ $t("endHalfInningAstart") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("swapHome") }}</q-item-label>
                    <q-item-label style="font-size: 12px; color:gray;">{{ $t("swatTeamResetGame") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("manualOverrides") }}</q-item-label>
                    <q-item-label style="font-size: 12px; color:gray;">{{ $t("changeScoreInningReset") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("messagefans") }}</q-item-label>
                    <q-item-label style="font-size: 12px; color:gray;">{{ $t("addCustomMessageGamestream") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("settings") }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label">
                  <q-item-section>
                    <q-item-label style="font-size: 20px;">{{ $t("helpFeedback") }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
    <div class="tblbox">
      <div class="row">
        <div class="col-6 box1">
          {{ this.gameData.team1Name }} &nbsp;
          <span class="text-right" style='float: right;'>{{ this.gameEventData.team1Score || 0 }}</span>
        </div>
        <div class="col-6 box1">
          {{ this.gameEventData.team2Score || 0 }} &nbsp;
          <span class="text-right" style="float: right;">
            {{ this.gameData.team2Name }}
            {{ this.utility.convertToMoment(this.gameData.startDate).format("MMMM DD, YYYY") }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 box2">
          <div v-if="this.gameEventData.playerBatter && this.gameEventData.playerBatter != null"
            class="row" style="background-color:#eaeaea"
          >
            <div class="col-3" style="padding:10px 15px;">
              <q-btn color="primary" dense label="AB"/>
            </div>
            <div class="col"  style="padding:5px;">
              <div>#{{ this.gameEventData.playerBatter.number }} , {{ this.gameEventData.playerBatter.lastName }}  </div>
              <div>
                Batting {{ this.gameEventData.batterCount + this.getRankTail(this.gameEventData.batterCount) }} of
                {{ this.gameEventData.playerBatter.batterRank  + this.getRankTail(this.gameEventData.playerBatter.batterRank) }}</div>
            </div>
            <q-menu
              anchor="center middle"
              self="center middle"
            >
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t("skipToDiffBatter") }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t("subOutPinchHitter") }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <div v-if="!this.gameEventData.playerBatter" class="row center-justify" style="background-color:#eaeaea">
            <div class="col-12" style="padding:10px 15px;text-align: center;">
              <q-btn color="primary" :label="$t('setBatter')" @click="setPlayerDialog('playerBatter')" style="width: 100%;text-transform:uppercase;"></q-btn>
            </div>
          </div>
        </div>
        <div class="col-6 box2">
          <div v-if="this.gameEventData.fielderPitcher && this.gameEventData.fielderPitcher != null"
            class="row" style="background-color:#eaeaea"
          >
            <div class="col" style="padding:5px;text-align:right;">
              <div>#{{ this.gameEventData.fielderPitcher.number }} , {{ this.gameEventData.fielderPitcher.lastName }}</div>
              <div>0 {{ $t('pitches') }}</div>
            </div>
            <div class="col-3" style="padding:10px 10px;">
              <q-btn color="primary" style="padding: 5px 10px;" dense label=" P "/>
            </div>
            <q-menu
              anchor="center middle"
              self="center middle"
            >
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t("viewPitchCount") }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t("subOutReliefPitcher") }}</q-item-section>
                </q-item>
                <q-item clickable v-close-popup>
                  <q-item-section>{{ $t("sprayCharts") }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <div v-if="!this.gameEventData.fielderPitcher" class="row center-justify"  style="background-color:#eaeaea">
            <div class="col-12" style="padding:10px 15px;text-align: center;">
              <q-btn color="primary" :label="$t('setPitcher')"  @click="setPlayerDialog('fielderPitcher')" style="width: 100%;text-transform:uppercase;"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tblbox" id="bbground">
      <div class="fieldersBtn" v-if="fieldersBtn==true">
        <div class="row center-justify" style="margin:10px 0px;" >
          <div class="col-12 text-center">
            <q-btn v-if="!this.gameEventData.fielderCF"
              class="playerbtn" label="CF" @click="setPlayerDialog('fielderCF')"
            />
            <div v-if="this.gameEventData.fielderCF && this.gameEventData.fielderCF != null"
              style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderCF.firstName).charAt(0) }} {{ this.gameEventData.fielderCF.lastName }}</div>
              <div>#{{ this.gameEventData.fielderCF.number }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin:10px 0px;">
          <div class="col-6">
            <q-btn v-if="!this.gameEventData.fielderLF"
              class="playerbtn" @click="setPlayerDialog('fielderLF')" label="LF"
            />
            <div v-if="this.gameEventData.fielderLF && this.gameEventData.fielderLF != null"
              class="text-left" style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderLF.firstName).charAt(0) }} {{ this.gameEventData.fielderLF.lastName }}</div>
              <div>#{{ this.gameEventData.fielderLF.number }}</div>
            </div>
          </div>
          <div class="col-6 text-right">
            <q-btn v-if="!this.gameEventData.fielderRF"
              class="playerbtn" label="RF" @click="setPlayerDialog('fielderRF')"
            />
            <div v-if="this.gameEventData.fielderRF && this.gameEventData.fielderRF != null"
              style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderRF.firstName).charAt(0) }} {{ this.gameEventData.fielderRF.lastName }}</div>
              <div>#{{ this.gameEventData.fielderRF.number }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin: 10px 0px 50px;">
          <div class="col-6 text-right">
            <q-btn v-if="!this.gameEventData.fielderSS"
              class="playerbtn" style="margin-right: 25%;" label="SS" @click="setPlayerDialog('fielderSS')"
            />
            <div v-if="this.gameEventData.fielderSS && this.gameEventData.fielderSS != null"
              class="text-center" style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderSS.firstName).charAt(0) }} {{ this.gameEventData.fielderSS.lastName }}</div>
              <div>#{{ this.gameEventData.fielderSS.number }}</div>
            </div>
          </div>
          <div class="col-6">
            <q-btn v-if="!this.gameEventData.fielderBase2"
              class="playerbtn" style="margin-left: 25%;" label="2B" @click="setPlayerDialog('fielderBase2')"
            />
            <div v-if="this.gameEventData.fielderBase2 && this.gameEventData.fielderBase2 != null"
              class="text-center" style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderBase2.firstName).charAt(0) }} {{ this.gameEventData.fielderBase2.lastName }}</div>
              <div>#{{ this.gameEventData.fielderBase2.number }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom:30px;">
          <div class="col-4">
            <q-btn v-if="!this.gameEventData.fielderBase3"
              class="playerbtn" style="margin-left: 25%;" label="3B" @click="setPlayerDialog('fielderBase3')"
            />
            <div v-if="this.gameEventData.fielderBase3 && this.gameEventData.fielderBase3 != null"
              style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderBase3.firstName).charAt(0) }} {{ this.gameEventData.fielderBase3.lastName }}</div>
              <div>#{{ this.gameEventData.fielderBase3.number }}</div>
            </div>
          </div>
          <div class="col-4 text-center">
            <q-btn v-if="!this.gameEventData.fielderPitcher"
              class="playerbtn" label="P" @click="setPlayerDialog('fielderPitcher')"
            />
            <div v-if="this.gameEventData.fielderPitcher && this.gameEventData.fielderPitcher != null"
              style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderPitcher.firstName).charAt(0) }} {{ this.gameEventData.fielderPitcher.lastName }}</div>
              <div>#{{ this.gameEventData.fielderPitcher.number }}</div>
            </div>
          </div>
          <div class="col-4 text-right">
            <q-btn v-if="!this.gameEventData.fielderBase1"
              class="playerbtn" style="margin-right: 25%;" label="1B" @click="setPlayerDialog('fielderBase1')"
            />
            <div v-if="this.gameEventData.fielderBase1 && this.gameEventData.fielderBase1 != null"
              style="font-weight: bold;text-shadow: 0 0 white;"
            >
              <div class="fieldPlayers">{{ (this.gameEventData.fielderBase1.firstName).charAt(0) }} {{ this.gameEventData.fielderBase1.lastName }}</div>
              <div>#{{ this.gameEventData.fielderBase1.number }}</div>
            </div>
          </div>
        </div>
        <div class="row center-justify"  style="margin-top:25px;">
          <div class="col-12 text-center">
            <q-btn dense flat :label="$t('pitch')" style="margin-left: 5px;" stack @click="pitchBall()">
              <q-avatar size="54px">
                <img src="icons/baseball2.svg" style="width: 32px; height: 32px;">
              </q-avatar>
            </q-btn>
          </div>
        </div>
        <div class="row">
          <div class="col-12 text-right" style="padding:20px 0px"><q-btn color="primary" dense icon="score"/></div>
        </div>
      </div>

      <div class="currentPlayer p1" v-if="this.gameEventData.playerBase1 && this.gameEventData.playerBase1 != null" id="player1">
        <div class="cPlayerInfo">{{ this.gameEventData.playerBase1.lastName }}</div>
        <div class="cPlayerInfo">#{{ this.gameEventData.playerBase1.number }}</div>
      </div>
      <div class="currentPlayer p2" v-if="this.gameEventData.playerBase2 && this.gameEventData.playerBase2 != null" id="player2">
        <div class="cPlayerInfo">{{ this.gameEventData.playerBase2.lastName }}</div>
        <div class="cPlayerInfo">#{{ this.gameEventData.playerBase2.number }}</div>
      </div>
      <div class="currentPlayer p3" v-if="this.gameEventData.playerBase3 && this.gameEventData.playerBase3 != null" id="player3">
        <div class="cPlayerInfo">{{ this.gameEventData.playerBase3.lastName }}</div>
        <div class="cPlayerInfo">#{{ this.gameEventData.playerBase3.number }}</div>
      </div>
      <!-- <div class="currentPlayer p4" v-if="showPlayer1" id="player4">
        <div class="cPlayerInfo">{{ this.playerBase1.lastName }}</div>
        <div class="cPlayerInfo">#{{ this.playerBase1.number }}</div>
      </div> -->

      <!--
      <Transition
        @before-enter="onBeforeEnterPlayer1"
        @enter="onEnterPlayer1"
        :css="false"
      >
        <div class="currentPlayer p1" v-if="showPlayer1" id="player1">
          <div class="cPlayerInfo">Mercado</div>
          <div class="cPlayerInfo">#24</div>
        </div>
      </Transition>
      <Transition
        @before-enter="onBeforeEnterPlayer2"
        @enter="onEnterPlayer2"
        :css="false"
      >
        <div class="currentPlayer p2" v-if="showPlayer1" id="player2">
          <div class="cPlayerInfo">Sanchez</div>
          <div class="cPlayerInfo">#37</div>
        </div>
      </Transition>
      <Transition
        @before-enter="onBeforeEnterPlayer3"
        @enter="onEnterPlayer3"
        :css="false"
      >
        <div class="currentPlayer p3" v-if="showPlayer1" id="player3">
          <div class="cPlayerInfo">Gonzalez</div>
          <div class="cPlayerInfo">#08</div>
        </div>
      </Transition>
      <Transition
        @before-enter="onBeforeEnterPlayer4"
        @enter="onEnterPlayer4"
        :css="false"
      >
        <div class="currentPlayer p4" v-if="showPlayer1" id="player4">
          <div class="cPlayerInfo">Lopez</div>
          <div class="cPlayerInfo">#44</div>
        </div>
      </Transition>
      -->

    </div>
    <div class="row" style="width: 100%;background-color: #eaeaea;">
      <div class="col-4" color="primary" style="padding: 5px 10px;">
        <q-btn icon="undo" @click="undoEvent()" style="font-size:15px" :label="$t('undo')"/>
      </div>
      <div class="col-4  text-center"  style="padding: 5px 0px;">
        <q-btn v-if="!this.gameEventData.fielderCatcher"
          style="font-size:15px"  @click="setPlayerDialog('fielderCatcher')" color="positive" text-color="negative" dense :label="$t('catch')"
        />
        <div v-if="this.gameEventData.fielderCatcher && this.gameEventData.fielderCatcher != null"
          style="font-weight: bold;text-shadow: 0 0 white;"
        >
        <div class="fieldPlayers">{{ (this.gameEventData.fielderCatcher.firstName).charAt(0) }} {{ this.gameEventData.fielderCatcher.lastName }}</div>
          <div>#{{ this.gameEventData.fielderCatcher.number }}</div>
        </div>
      </div>
      <div class="col-4" color="primary" style="text-align: right;padding: 5px 10px;">
        <q-btn icon-right="redo" @click="redoEvent()" style="font-size:15px" :label="$t('redo')"/>
      </div>
    </div>
    <q-dialog
      v-model="setPlayersDialog"
      persistent
      :maximized="maximizedToggle"
    >
      <div style="background-color: white;">
        <div class="PlayerBox" >
          <div class="header">

            <div class="q-pa-md row" style="border-bottom: solid 1px #c0c0c0;">
              <div class="col-2">
                <q-btn flat round dense color="primary" icon="close" @click="closeSetPlater()" />
              </div>
              <div class="col dialogTitle">
                <span>Set </span>
                {{ this.playerPositionText }}
              </div>
            </div>

            <div class="q-pa-md row" style="border-bottom: solid 1px #c0c0c0;">
              <div class="col-12" style="font-weight: bold;">
                {{ $t('whosPlaying') }} {{ this.playerPositionText }}?
                {{ shouldShowTeam1Player }} {{ shouldShowTeam2Player }}
              </div>
              <!-- <div class="col-12"  v-if="this.playerPosition == 'playerBatter'" style="font-weight: bold;">
                Who's batting {{ this.gameEventData.batterCount + this.getRankTail(this.gameEventData.batterCount) }}?
              </div> -->
            </div>

            <div class="q-pa-md">

              <q-list v-if="shouldShowTeam1Player == true"
                bordered class="rounded-borders" style="width: 100%;"
              >
                <q-item-label header style="text-transform:uppercase;">{{ $t('bench') }}</q-item-label>
                <q-item clickable v-ripple v-for="(player, index) in team1Players" :key="index">
                  <q-item-section @click="setPlayersPosition(this.playerPosition, player)">
                    <div>{{ player.firstName }} {{ player.lastName }}, # {{ player.shirtNumber }}</div>
                    <div class="text-right">{{ player.$refsplayerPosition }}</div>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-list v-if="shouldShowTeam2Player == true"
                bordered class="rounded-borders" style="width: 100%;"
              >
                <q-item-label header style="text-transform:uppercase;">{{ $t('fielder') }}</q-item-label>
                <q-item clickable v-ripple v-for="(player, index) in team2Players" :key="index">
                  <q-item-section @click="setPlayersPosition(this.playerPosition, player)">
                    <div>{{ player.firstName }} {{ player.lastName }}, # {{ player.shirtNumber }}</div>
                    <div class="text-right">{{ player.$refsplayerPosition }}</div>
                  </q-item-section>
                </q-item>
              </q-list>

            </div>
            <div class="row center-justify" style="border-bottom: solid 1px #c0c0c0;">
              <div class="col-12" style="text-align: center;">
                <q-btn color="primary"  @click="createNewPlayer=true;setPlayersDialog=false;" style="text-transform:uppercase;" :label="$t('createNewPlayer')"/></div>
            </div>
          </div>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="createNewPlayer"
      persistent
      :maximized="maximizedToggle"
    >
      <div style="background-color: white;">
        <div class="addPlayerBox">
          <q-form >
            <div class="header">
              <div class="row" style="padding:10px;border: solid 1px #c0c0c0;">
                <div class="col-2">
                  <q-btn flat round dense color="primary" icon="close" @click="createNewPlayer=false" />
                </div>
                <div class="col dialogTitle">{{ $t('addPlayer') }}</div>
                <div class="col-3" style="text-align: right;">
                  <q-btn flat dense :label="$t('addbtn')" @click="submitAddPlayerForm()" style="font-size: 15px;" color="primary"  />
                </div>
              </div>
            </div>
            <div class="row q-pa-md">
              <div class="col-12">
                <q-input v-model="formData.shirtNumber" class="newplayerFields" ref="shirtNumber" outlined :label="$t('number')" />
              </div>
              <div class="col-12">
                <q-input v-model="formData.firstName" class="newplayerFields" ref="firstName" outlined :label="$t('firstName')" />
              </div>
              <div class="col-12">
                <q-input v-model="formData.lastName" class="newplayerFields" ref="lastName" outlined :label="$t('lastName')" />
              </div>
              <div class="col-6">
                <q-select v-model="formData.battingHand" class="newplayerFields" ref="battingHand" outlined :options="batOptions" :label="$t('bats')" />
              </div>
              <div class="col-6" style="max-width: 300px">
                <q-select v-model="formData.throwingHand" ref="throwingHand" outlined :options="thOptions" :label="$t('throwingHand')" />
              </div>
            </div>
          </q-form>
        </div>
      </div>
    </q-dialog>

    <q-dialog v-model="pitchDialog" :position="position">
      <q-card style="width: 250px;height: 500px;">
          <q-toolbar>
            <q-btn flat v-if="this.currentParent === '1000'" round dense color="primary" @click="closePitch()" icon="close" />
            <q-btn flat v-if="this.currentParent != '1000'" round dense color="primary" @click="backPitch()" icon="arrow_back" />
            <q-toolbar-title class="text center"><span class="text-weight-bold">{{ pitchMenus.text  }}</span> </q-toolbar-title>
            <div class="text-primary" @click="undoEvent()" >Undo</div>
          </q-toolbar>
          <q-linear-progress v-if="pitchSubmitAction==true" :value="progress" />
          <div>
            <q-list style="min-width: 100px" v-for="i in pitchMenus.actions" :key="i.id">
              <q-item clickable @click="evaluateEvent(i.value,i)" v-if="i.value != null">
                  <q-btn color="positive" text-color="gray" dense :icon="i.icon" />
                  <q-item-section style="margin-left:10px">{{ i.text }}</q-item-section>
              </q-item>
              <q-item clickable @click="selectPitch(i.id,i.parent)" v-if="i.value == null">
                  <q-btn color="positive" text-color="gray" dense :icon="i.icon" />
                  <q-item-section style="margin-left:10px">{{ i.text }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-if="ballEnd==true">
            <q-list style="min-width: 100px">
              <q-item clickable>
                <svg-icon type="mdi" :path="path"></svg-icon>
                <q-item-section style="margin-left:10px;color:red">{{ $t("groundBall") }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
    </q-dialog>

    <q-dialog v-model="whosbattingFirst" >
      <q-card style="width: 320px;height: 170px;">
          <div class="text-bold" style="padding: 10px 25px;">{{ $t("whichTeamIsBattingFirst") }}</div>
          <div>
            <q-list style="min-width: 100px">
              <q-item clickable>
                <q-item-section>
                  <span @click="setFirstTeamBatter(1)" style="margin-left:10px; color: #0070c8;">
                    {{ this.gameData.team1Name }}
                  </span>
                </q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section>
                  <span @click="setFirstTeamBatter(2)" style="margin-left:10px; color: #0070c8">
                    {{ this.gameData.team2Name }}
                    {{ this.utility.convertToMoment(this.gameData.startDate).format("MMMM DD, YYYY") }}
                  </span>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
    </q-dialog>

    <q-dialog v-model="ballFielded"
      persistent
      :maximized="maximizedToggle"
    >
      <div class='row'>
        <div class="col-12" style="background-color:gray;text-align:center;padding:10px;">
          <div style='margin-top:40px;font-size: 20px;'>
            Drag
            <q-img src="/img/catchermitt2.png" spinner-color="white" style="height: 50px; max-width: 50px;" />
            &nbsp; to where the ball was fielded</div>
            <div>
              <q-btn flat dense :label="$t('cancel')" @click="ballFielded=false;fieldersBtn=true" style="font-size: 20px;" color="primary"  />
            </div>
        </div>
        <div class="col-12 ">
          <div class="ballFieldpop">

            <div class="row center-justify" >
              <div class="col-12 text-center">
                <q-img  name='CF' src="/img/catchermitt2.png" spinner-color="white" class="catchermitt" >
                  <div v-if="this.gameEventData.fielderCF != undefined"  class='absolute-full text-subtitle2 flex flex-center'>
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderCF.firstName).charAt(0) }} {{ this.gameEventData.fielderCF.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderCF.number }}</div>
                  </div>
                  <q-btn style="margin: 20px 25px;" class="catcherBtn" label="CF" @click="setPlayerDialog('fielderCF')" v-if="this.gameEventData.fielderCF === undefined" />
                </q-img>
              </div>
            </div>

            <div class="row" style="margin:10px 0px;">

              <div class="col-6">
                <q-img src="/img/catchermitt2.png" spinner-color="white" class="catchermitt" >
                  <div class="absolute-full text-subtitle2 flex flex-center" v-if="this.gameEventData.fielderLF != undefined">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderLF.firstName).charAt(0) }} {{ this.gameEventData.fielderLF.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderLF.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-left: 20px;" @click="setPlayerDialog('fielderLF')" label="LF" v-if="this.gameEventData.fielderLF === undefined"/>
                </q-img>
              </div>

              <div class="col-6 text-right">
                <q-img src="/img/catchermitt2.png" spinner-color="white" class="catchermitt" >
                  <div  v-if="this.gameEventData.fielderRF != undefined" class="absolute-full text-subtitle2 flex flex-center">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderRF.firstName).charAt(0) }} {{ this.gameEventData.fielderRF.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderRF.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-right: 20px;" label="RF" @click="setPlayerDialog('fielderRF')" v-if="this.gameEventData.fielderRF === undefined" />
                </q-img>
              </div>

            </div>
            <div class="row" style="margin: 10px 0px 50px;">

              <div class="col-6 text-right">
                <q-img src="/img/catchermitt2.png" spinner-color="white"  class="catchermitt" >
                  <div class="absolute-full text-subtitle2 flex flex-center" v-if="this.gameEventData.fielderSS != undefined">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderSS.firstName).charAt(0) }} {{ this.gameEventData.fielderSS.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderSS.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-right: 24%;" label="SS" @click="setPlayerDialog('fielderSS')" v-if="this.gameEventData.fielderSS === undefined"  />
                </q-img>
              </div>

              <div class="col-6">
                <q-img src="/img/catchermitt2.png" spinner-color="whshortStopite"  class="catchermitt" >
                  <div class="absolute-full text-subtitle2 flex flex-center" v-if="this.gameEventData.fielderBase2 != undefined" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderBase2.firstName).charAt(0) }} {{ this.gameEventData.fielderBase2.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderBase2.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" label="2B" @click="setPlayerDialog('fielderBase2')" v-if="this.gameEventData.fielderBase2 === undefined" />
                </q-img>
              </div>

            </div>
            <div class="row" style="margin-bottom:30px;">

              <div class="col-4">
                <q-img src="/img/catchermitt2.png" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.fielderBase3 != undefined" class="absolute-full text-subtitle2 flex flex-center" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderBase3.firstName).charAt(0) }} {{ this.gameEventData.fielderBase3.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderBase3.number }}</div>
                  </div>
                  <q-btn class="catcherBtn"  label="3B" @click="setPlayerDialog('fielderBase3')" v-if="this.gameEventData.fielderBase3 === undefined" />
                </q-img>
              </div>

              <div class="col-4 text-center">
                <q-img src="/img/catchermitt2.png" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.fielderPitcher != undefined"  class="absolute-full text-subtitle2 flex flex-center">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderPitcher.firstName).charAt(0) }} {{ this.gameEventData.fielderPitcher.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderPitcher.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" label="P" @click="setPlayerDialog('fielderPitcher')" v-if="this.gameEventData.fielderPitcher === undefined" />
                </q-img>
              </div>

              <div class="col-4 text-right">
                <q-img src="/img/catchermitt2.png" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.fielderBase1 != undefined" class="absolute-full text-subtitle2 flex flex-center" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.fielderBase1.firstName).charAt(0) }} {{ this.gameEventData.fielderBase1.lastName }}</div>
                    <div>#{{ this.gameEventData.fielderBase1.number }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-right: 25%;" label="1B" @click="setPlayerDialog('fielderBase1')" v-if="this.gameEventData.fielderBase1 === undefined" />
                </q-img>
              </div>

            </div>

          </div>
        </div>
        <div class="col-12"> </div>
      </div>
    </q-dialog>
  </div>

</template>

<script>
/* eslint-disable */

import { defineComponent, ref } from 'vue';
import SvgIcon from '@jamescoyle/vue-icon'
import gsap from 'gsap'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { usePlayerDataStore } from '../stores/player-data'
import { useGameDataStore } from '../stores/game-data'
import { useGameEventDataStore } from '../stores/game-event-data'
import { utilities } from '../utilities.js'
import {
  mdiGamepadCircle,
  mdiGamepadCircleRight,
  mdiGamepadCircleUp,
  mdiGamepadCircleLeft,
  mdiGamepadCircleOutline,
  mdiAccountAlertOutline,
  mdiLightbulbAlertOutline,
  mdiAlertCircleOutline,
  mdiGamepadRound
} from '@mdi/js'

export default defineComponent({
  name: 'IndexPage',
  components: {
		SvgIcon
	},
  setup() {
    let { locale} = useI18n({ useScope: 'global' })
    const router = useRoute()
    const pitchDialog = ref(false)
    const whosbattingFirst = ref(false)
    const position = ref('top')
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    const firstItemEnabled = ref(false)
    const playerData = usePlayerDataStore()
    const gameDataStore = useGameDataStore()
    const gameEventDataStore = useGameEventDataStore()
    const utility = utilities()

    return {
      locale,router,pitchDialog,playerData,whosbattingFirst,
      position,setPlayersDialog: ref(false),createNewPlayer:ref(false),utility,ballFielded:ref(false),
      leftDrawerOpen, gameDataStore, gameEventDataStore,fieldersBtn:ref(true),
      firstItemEnabled,
      onClick (index) {
        if (index > 1 || firstItemEnabled.value) {
          $q.notify({
            message: `Clicked on menu item #${index} and closed QMenu`,
            color: 'primary'
          })
        }
      },
      maximizedToggle: ref(true),
      open (pos) {
        position.value = pos
        pitchDialog.value = true
      },
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      localeOptions: [
        { value: 'en-US', label: 'English' },
        { value: 'ja', label: 'Japanese' },
        { value: 'ch', label: 'Chinese' }
      ],
    }
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
      pitchSubmitAction : false,
      pitchMenus:{},
      pitchAction:[],

      gameId: '',
      gameData: {},
      gameEventData: {},
      gameEvents: [],
      teamPlayers: [],
      team1Players: [],
      team2Players: [],

      getTgame:{},
      playerPositionText:'',
      playerPosition:'',

      pitchPlay:false,
      ballInplay:false,
      ballEnd:false,
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
        shirtNumber       : ref(''),
        firstName         : ref(''),
        lastName          : ref(''),
        battingHand       : ref(''),
        throwingHand      : ref(''),
        teamId            : ref(''),
        teamName          : ref(''),
			},

      firstBatter:0,
      currentList:[],
      selectedList:0,
      oldIndex:0,
      selectedPitch:this.$t("pitch"),
      fielderPositions: [
        "fielderCF",
        "fielderLF",
        "fielderRF",
        "fielderSS",
        "fielderBase1",
        "fielderBase2",
        "fielderBase3",
        "fielderPitcher",
        "fielderCatcher"
      ],
      playerPositions: [
        "playerBase1",
        "playerBase2",
        "playerBase3",
        "playerBatter"
      ],
      currentParent:'1000',
      progress : ref(0.00),
      buffer : ref(0.01),
      showPlayer1 : ref(true),
    }
  },
  async mounted() {
    this.locale = this.$q.lang.getLocale()
    this.gameId = this.router.params.id
    this.pitchMenuData()
    await this.getGameDetails(this.gameId)
    await this.getGameEvents(this.gameId)
    this.pitchMenus = this.pitchAction
  },
  computed: {
    shouldShowTeam1Player(){
      return (
        (this.gameData.playingTeam == 1 && this.playerPositions.includes(this.playerPosition)) ||
        (this.gameData.playingTeam == 2 && this.fielderPositions.includes(this.playerPosition))
      )
    },
    shouldShowTeam2Player(){
      return (
        (this.gameData.playingTeam == 2 && this.playerPositions.includes(this.playerPosition)) ||
        (this.gameData.playingTeam == 1 && this.fielderPositions.includes(this.playerPosition))
      )
    }
  },
  methods: {
    getLocaleVal(){
      this.pitchMenuData()// created a function to update if language changed
      this.pitchMenus = this.pitchAction
    },
    pitchMenuData(){
      //Dropped 3rd strike (show this if S == 2) > add this for third strike
      let localizeMenu = {
        name: 'pitch',
        text: this.$t('pitch'),
        actions:[
          {
            id: 1,
            list: 'firstList',
            parent: '0',
            name: 'ball',
            text: this.$t('ball'),
            icon: 'sports_baseball',
            value: 'ball'
          },{
            id: 2,
            list: 'firstList',
            parent: '0',
            name: 'calledStrike',
            text: this.$t('calledStrike'),
            icon: 'call_missed_outgoing',
            value: 'called-strike'
          },{
            id: 3,
            list: 'firstList',
            parent: '0',
            name: 'swingMiss',
            text: this.$t('swingMiss'),
            icon: 'call_missed',
            value: 'swing-miss'
          },{
            id: 4,
            list: 'firstList',
            parent: '0',
            name: 'foulBall',
            text: this.$t('foulBall'),
            icon: 'error_outline',
            value: 'foul-ball'
          },
          {
            id: 5,
            list: 'firstList',
            name: 'ballInPlay',
            text: this.$t('ballInPlay'),
            icon: 'sports_cricket',
            value: null,
            parent: '0',
            actions: [
              {
                id: 6,
                list: 'ballInPlayList',
                name: 'groundBall',
                text: this.$t('groundBall'),
                icon:"legend_toggle",
                value: null,
                parent: '5',
                actions:
                [
                  {
                    id: 7,
                    list: 'groundBallList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_6',
                    actions: [
                      {
                        id: 8,
                        list: 'batterOutList',
                        parent: '5_6_7',
                        name: 'batterOut',
                        text: this.$t('Outat1st'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-groundball-out-at-first'
                      },
                      {
                        id: 9,
                        list: 'batterOutList',
                        parent: '5_6_7',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-groundball-double-play'
                      },
                      {
                        id: 10,
                        list: 'batterOutList',
                        parent: '5_6_7',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-groundball-triple-play'
                      },
                    ]
                  },
                  {
                    id: 11,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-groundball-single'
                  },
                  {
                    id: 12,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-groundball-double'
                  },
                  {
                    id: 13,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-groundball-triple'
                  },
                  {
                    id: 14,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-groundball-itphomerun'
                  },
                  {
                    id: 15,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-groundball-fielderschoice'
                  },
                  {
                    id: 16,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-groundball-error'
                  },
                  {
                    id: 17,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-groundball-foul-ball'
                  },
                  {
                    id: 18,
                    list: 'groundBallList',
                    parent: '5_6',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path:"asdf",
                    color:mdiAccountAlertOutline,
                    value: 'bip-groundball-bi'
                  },
                ]
              },
              {
                id: 19,
                list: 'ballInPlayList',
                name: 'hardGroundBall',
                text: this.$t('hardGroundBall'),
                icon:"airline_stops",
                value: null,
                parent: '5',
                actions: [
                  {
                    id: 20,
                    list: 'hardGroundBallList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path:mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_19',
                    actions: [
                      {
                        id: 21,
                        list: 'batterOutList',
                        parent: '5_19_20',
                        name: 'Outat1st',
                        text: this.$t('Outat1st'),
                        path:mdiGamepadCircleRight,
                        value: 'bip-hgroundball-out-at-first'
                      },
                      {
                        id: 22,
                        list: 'batterOutList',
                        parent: '5_19_20',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-hgroundball-double-play'
                      },
                      {
                        id: 23,
                        list: 'batterOutList',
                        parent: '5_19_20',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-hgroundball-triple-play'
                      },
                    ]
                  },
                  {
                    id: 24,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-hgroundball-single'
                  },
                  {
                    id: 25,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-hgroundball-double'
                  },
                  {
                    id: 26,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-hgroundball-triple'
                  },
                  {
                    id: 27,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-hgroundball-itphomerun'
                  },
                  {
                    id: 28,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-hgroundball-fielderschoice'
                  },
                  {
                    id: 29,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'fcDoublePlay',
                    text: this.$t('fcDoublePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-hgroundball-double-play'
                  },
                  {
                    id: 30,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'fcTriplePlay',
                    text: this.$t('fcTriplePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-hgroundball-triple-play'
                  },
                  {
                    id: 31,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-hgroundball-error'
                  },
                  {
                    id: 32,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-hgroundball-foul-ball'
                  },
                  {
                    id: 33,
                    list: 'hardGroundBallList',
                    parent: '5_19',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path:"asdf",
                    color: mdiAccountAlertOutline,
                    value: 'bip-hgroundball-bi'
                  },
                ]
              },
              {
                id: 34,
                list: 'ballInPlayList',
                name: 'flyBall',
                text: this.$t('flyBall'),
                icon:"turn_slight_right",
                value: null,
                parent: '5',
                actions: [
                  {
                    id: 35,
                    list: 'flyBallList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_34',
                    actions: [
                      {
                        id: 36,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'flyOut',
                        text: this.$t('flyOut'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-out'
                      },
                      {
                        id: 37,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'flyOutFoul',
                        text: this.$t('flyOutFoul'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-foul-out'
                      },
                      {
                        id: 38,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'infieldFly',
                        text: this.$t('infieldFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-infield-fly'
                      },
                      {
                        id: 39,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'sacFly',
                        text: this.$t('sacFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-sac-fly'
                      },
                      {
                        id: 40,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-double-play'
                      },
                      {
                        id: 41,
                        list: 'batterOutList',
                        parent: '5_34_35',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-flyball-triple-play'
                      },
                    ]
                  },
                  {
                    id: 42,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-flyball-single'
                  },
                  {
                    id: 43,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-flyball-double'
                  },
                  {
                    id: 44,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-flyball-triple'
                  },
                  {
                    id: 45,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'homerun',
                    text: this.$t('homerun'),
                    path: mdiGamepadCircle,
                    value: 'bip-flyball-homerun'
                  },
                  {
                    id: 46,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-flyball-itphomerun'
                  },
                  {
                    id: 47,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-flyball-fielderschoice'
                  },
                  {
                    id: 48,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'fcDoublePlay',
                    text: this.$t('fcDoublePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-flyball-double-play'
                  },
                  {
                    id: 49,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'fcTriplePlay',
                    text: this.$t('fcTriplePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-flyball-triple-play'
                  },
                  {
                    id: 50,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-flyball-error'
                  },
                  {
                    id: 51,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'errorSac',
                    text: this.$t('errorSac'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-flyball-error-sac'
                  },
                  {
                    id: 52,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-flyball-foul-ball'
                  },
                  {
                    id: 53,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'fouldBallError',
                    text: this.$t('fouldBallError'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-flyball-foul-ball-error'
                  },
                  {
                    id: 54,
                    list: 'flyBallList',
                    parent: '5_34',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path: "asdf",
                    color: mdiAccountAlertOutline,
                    value: 'bip-flyball-bi'
                  },
                ]
              },
              {
                id: 55,
                list: 'ballInPlayList',
                name: 'lineDrive',
                text: this.$t('lineDrive'),
                icon:"moving",
                value: null,
                parent: '5',
                actions: [
                  {
                    id: 56,
                    list: 'lineDriveList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_55',
                    actions: [
                      {
                        id: 57,
                        list: 'batterOutList',
                        parent: '5_55_56',
                        name: 'lineOut',
                        text: this.$t('lineOut'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-linedrive-out'
                      },
                      {
                        id: 58,
                        list: 'batterOutList',
                        parent: '5_55_56',
                        name: 'lineOutFoul',
                        text: this.$t('lineOutFoul'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-linedrive-foul-out'
                      },
                      {
                        id: 59,
                        list: 'batterOutList',
                        parent: '5_55_56',
                        name: 'sacFly',
                        text: this.$t('sacFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-linedrive-sac-fly'
                      },
                      {
                        id: 60,
                        list: 'batterOutList',
                        parent: '5_55_56',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-linedrive-double-play'
                      },
                      {
                        id: 61,
                        list: 'batterOutList',
                        parent: '5_55_56',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-linedrive-triple-play'
                      },
                    ]
                  },
                  {
                    id: 62,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-linedrive-single'
                  },
                  {
                    id: 63,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-linedrive-double'
                  },
                  {
                    id: 64,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-linedrive-triple'
                  },
                  {
                    id: 65,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'homerun',
                    text: this.$t('homerun'),
                    path: mdiGamepadCircle,
                    value: 'bip-linedrive-homerun'
                  },
                  {
                    id: 65,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-linedrive-itphomerun'
                  },
                  {
                    id: 67,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-linedrive-fielderschoice'
                  },
                  {
                    id: 68,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'fcDoublePlay',
                    text: this.$t('fcDoublePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-linedrive-double-play'
                  },
                  {
                    id: 69,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'fcTriplePlay',
                    text: this.$t('fcTriplePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-linedrive-triple-play'
                  },
                  {
                    id: 70,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-linedrive-error'
                  },
                  {
                    id: 71,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'errorSac',
                    text: this.$t('errorSac'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-linedrive-sac-error'
                  },
                  {
                    id: 72,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-linedrive-foul-ball'
                  },
                  {
                    id: 73,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'fouldBallError',
                    text: this.$t('fouldBallError'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-linedrive-foul-ball-error'
                  },
                  {
                    id: 74,
                    list: 'lineDriveList',
                    parent: '5_55',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path: "asdf",
                    color: mdiAccountAlertOutline,
                    value: 'bip-linedrive-bi'
                  },
                ]
              },
              {
                id: 75,
                list: 'ballInPlayList',
                name: 'bunt',
                text: this.$t('bunt'),
                icon:"show_chart",
                value: null,
                parent: '5',
                actions: [
                  {
                    id: 76,
                    list: 'buntList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_75',
                    actions: [
                      {
                        id: 77,
                        list: 'batterOutList',
                        parent: '5_75_76',
                        name: 'outAtFirstNoSac',
                        text: this.$t('outAtFirstNoSac'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-bunt-out'
                      },
                      {
                        id: 78,
                        list: 'batterOutList',
                        parent: '5_75_76',
                        name:'popOut',
                        text: this.$t('popOut'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-bunt-pop-out'
                      },
                      {
                        id: 79,
                        list: 'batterOutList',
                        parent: '5_75_76',
                        name: 'sacBunt',
                        text: this.$t('sacBunt'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-bunt-sac-out'
                      },
                      {
                        id: 80,
                        list: 'batterOutList',
                        parent: '5_75_76',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-bunt-double-play'
                      },
                      {
                        id: 81,
                        list: 'batterOutList',
                        parent: '5_75_76',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-bunt-triple-play'
                      },
                    ]
                  },
                  {
                    id: 82,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'sacBuntSafe',
                    text: this.$t('sacBuntSafe'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: 'bip-bunt-sac-safe'
                  },
                  {
                    id: 83,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-bunt-single'
                  },
                  {
                    id: 84,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-bunt-double'
                  },
                  {
                    id: 85,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-bunt-triple'
                  },
                  {
                    id: 86,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-bunt-itphomerun'
                  },
                  {
                    id: 87,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-bunt-fielderschoice'
                  },
                  {
                    id: 88,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'fcDoublePlay',
                    text: this.$t('fcDoublePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-bunt-double-play'
                  },
                  {
                    id: 89,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'fcTriplePlay',
                    text: this.$t('fcTriplePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-bunt-triple-play'
                  },
                  {
                    id: 90,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-bunt-error'
                  },
                  {
                    id: 91,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-bunt-foul-ball'
                  },
                  {
                    id: 92,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'popFoulError',
                    text: this.$t('popFoulError'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-bunt-foul-ball-error'
                  },
                  {
                    id: 93,
                    list: 'buntList',
                    parent: '5_75',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path: "asdf",
                    color: mdiAccountAlertOutline,
                    value: 'bip-bunt-bi'
                  },
                ]
              },
              {
                id: 94,
                list: 'ballInPlayList',
                name: 'popFly',
                text: this.$t('popFly'),
                icon:"redo",
                parent: '5',
                value: null,
                actions: [
                  {
                    id: 95,
                    list: 'popFlyList',
                    name: 'batterOut',
                    text: this.$t('batterOut'),
                    path: mdiGamepadCircleOutline,
                    color:"red",
                    value: null,
                    parent: '5_94',
                    actions: [
                      {
                        id: 96,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'popOut',
                        text: this.$t('popOut'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-out'
                      },
                      {
                        id: 97,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'popOutFly',
                        text: this.$t('popOutFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-foul-out'
                      },
                      {
                        id: 98,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'infieldFly',
                        text: this.$t('infieldFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-infield-fly'
                      },
                      {
                        id: 99,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'sacFly',
                        text: this.$t('sacFly'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-sac-fly'
                      },
                      {
                        id: 100,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'doublePlay',
                        text: this.$t('doublePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-double-play'
                      },
                      {
                        id: 101,
                        list: 'batterOutList',
                        parent: '5_94_95',
                        name: 'triplePlay',
                        text: this.$t('triplePlay'),
                        path: mdiGamepadCircleRight,
                        value: 'bip-popfly-triple-play'
                      },
                    ]},
                  {
                    id: 102,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'single',
                    text: this.$t('single'),
                    path: mdiGamepadCircleRight,
                    value: 'bip-popfly-single'
                  },
                  {
                    id: 103,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'double',
                    text: this.$t('double'),
                    path: mdiGamepadCircleUp,
                    value: 'bip-popfly-double'
                  },
                  {
                    id: 104,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'triple',
                    text: this.$t('triple'),
                    path: mdiGamepadCircleLeft,
                    value: 'bip-popfly-triple'
                  },
                  {
                    id: 105,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'homerun',
                    text: this.$t('homerun'),
                    path: mdiGamepadCircle,
                    value: 'bip-popfly-homerun'
                  },
                  {
                    id: 106,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'intheParkHomeRun',
                    text: this.$t('intheParkHomeRun'),
                    path: mdiGamepadCircle,
                    value: 'bip-popfly-itphomerun'
                  },
                  {
                    id: 107,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'fielderschoice',
                    text: this.$t('fielderschoice'),
                    path: mdiGamepadRound,
                    value: 'bip-popfly-fielderschoice'
                  },
                  {
                    id: 108,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'fcDoublePlay',
                    text: this.$t('fcDoublePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-popfly-double-play'
                  },
                  {
                    id: 109,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'fcTriplePlay',
                    text: this.$t('fcTriplePlay'),
                    path: mdiGamepadRound,
                    value: 'bip-popfly-triple-play'
                  },
                  {
                    id: 110,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'error',
                    text: this.$t('error'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-popfly-error'
                  },
                  {
                    id: 111,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'errorSac',
                    text: this.$t('errorSac'),
                    path: mdiAlertCircleOutline,
                    value: 'bip-popfly-sac-error'
                  },
                  {
                    id: 112,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'fouldBall',
                    text: this.$t('fouldBall'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-popfly-foul-ball'
                  },
                  {
                    id: 113,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'fouldBallError',
                    text: this.$t('fouldBallError'),
                    path: mdiLightbulbAlertOutline,
                    value: 'bip-popfly-foul-ball-error'
                  },
                  {
                    id: 114,
                    list: 'popFlyList',
                    parent: '5_94',
                    name: 'batterinterference',
                    text: this.$t('batterinterference'),
                    path:"asdf",
                    color: mdiAccountAlertOutline,
                    value: 'bip-popfly-bi'
                  },
                ]
              },
            ]
          },
          {
            id: 115,
            list: 'firstList',
            parent: '0',
            name: 'hitByPitch',
            text: this.$t('hitByPitch'),
            icon: 'sports_handball',
            value: 'hit-by-pitch'
          },
          {
            id: 116,
            list: 'firstList',
            parent: '0',
            name: 'intentionalBall',
            text: this.$t('intentionalBall'),
            icon:'emoji_people',
            value: 'intent-ball'
          },
          {
            id: 117,
            list: 'firstList',
            parent: '0',
            name: 'intentionalWalk',
            text: this.$t('intentionalWalk'),
            icon: 'directions_run',
            value: 'intent-walk'
          },
          {
            id: 118,
            list: 'firstList',
            parent: '0',
            name: 'cInterference',
            text: this.$t('cInterference'),
            icon:'crisis_alert',
            value: 'catcher-interference'
          },
          {
            id: 119,
            list: 'firstList',
            parent: '0',
            name: 'balk',
            text: this.$t('balk'),
            icon: 'hail',
            value: 'balk'
          },
          {
            id: 120,
            list: 'firstList',
            name: 'illegalPitch',
            text: this.$t('illegalPitch'),
            value: null,
            parent: '0',
            actions: [
              {
                id: 121,
                parent: '120',
                name:'advanceRunner',
                text: this.$t('advanceRunner'),
                score:"9-12",
                atype:"staff",
                value: 'illegal-pitch-advance'
              },
              {
                id: 122,
                parent: '120',
                name: "dontAdvanceRunner",
                text: this.$t('dontAdvanceRunner'),
                score:"17-18-3",
                atype:"staff",
                value: 'illegal-pitch-noadvance'
              },
            ]
          },
          {
            id: 123,
            list: 'firstList',
            parent: '0',
            name: 'batterOutOther',
            text: this.$t('batterOutOther'),
            icon: 'hail',
            value: 'batter-out-other'
          },
        ]
      }
      this.pitchAction = localizeMenu
    },
    selectPitch(id,parent){

      this.currentParent = parent
        if(parent=='0'){
          this.currentList = this.pitchAction
          const hFound = this.pitchAction.actions.findIndex(elem2 => elem2.id == id)
          if (hFound >= 0){
            this.pitchMenus = this.pitchAction.actions[hFound]
          }
        }else{
          this.currentList = this.pitchMenus
          const newList = this.pitchMenus.actions.findIndex(elem => elem.id == id)
          if(newList >= 0 && this.pitchMenus.actions[newList].actions !== undefined){
            this.pitchMenus = this.pitchMenus.actions[newList]
          }
        }
      console.log(this.currentParent,this.pitchMenus)
    },
    onBeforeEnterPlayer1(el) {
      gsap.set(el, {
        top: '450px',
        left: '180px'
      })
    },
    onEnterPlayer1(el, done) {
      gsap.to(el, {
        opacity: 1,
        top:'336px',
        left : '329px',
        duration: 0.5,
        delay: 1,
      })
      gsap.to(el, {
        top: '195px',
        left: '180px',
        duration: 0.5,
        delay: 2,
      })
      gsap.to(el, {
        top: '336px',
        left: '33px',
        duration: 0.5,
        delay: 3,
      })
      gsap.to(el, {
        top: '450px',
        left: '180px',
        duration: 0.5,
        delay: 4,
        onComplete: done
      })
    },
    onBeforeEnterPlayer2(el) {
      gsap.set(el, {
        top: '336px',
        left: '329px'
      })
    },
    onEnterPlayer2(el, done) {
      gsap.to(el, {
        opacity: 1,
        top:'195px',
        left : '180px',
        duration: 0.5,
        delay: 1,
      })
      gsap.to(el, {
        top: '336px',
        left: '33px',
        duration: 0.5,
        delay: 2,
      })
      gsap.to(el, {
        top: '450px',
        left: '180px',
        duration: 0.5,
        delay: 3,
        onComplete: done
      })
    },
    onBeforeEnterPlayer3(el) {
      gsap.set(el, {
        top: '195px',
        left: '180px'
      })

    },
    onEnterPlayer3(el, done) {
      gsap.to(el, {
        opacity: 1,
        top: '336px',
        left: '33px',
        duration: 0.5,
        delay: 1,
      })
      gsap.to(el, {
        top: '450px',
        left: '180px',
        duration: 0.5,
        delay: 2,
        onComplete: done
      })
    },
    onBeforeEnterPlayer4(el) {
      gsap.set(el, {
        top: '336px',
        left: '33px'
      })
    },
    onEnterPlayer4(el, done) {

      gsap.to(el, {
        top: '450px',
        left: '180px',
        duration: 0.5,
        delay: 1,
        onComplete: done
      })
    },
    batterTeamAnimation(){
      this.showPlayer1 = !this.showPlayer1

       //const player1 = document.getElementById('player1')
      // const player2 = document.getElementById('player2')
      // const player3 = document.getElementById('player3')
      // const player4 = document.getElementById('player4')

       //this.toFirstBase(player1,1)
      // this.toSecondBase(player2,10)
      // this.toThirdBase(player3,15)
      // this.toHomeBase(player4,20)

       //this.toSecondBase(player1,'1s,5s')
      // this.toThirdBase(player2,30)
      // this.toHomeBase(player3,35)

      // this.toThirdBase(player1,40)
      // this.toHomeBase(player2,45)

      // this.toHomeBase(player1,50)

    },

    defaultValue(object, defaultValue){
      if (object){
        return object;
      } else {
        return defaultValue;
      }
    },
    evalRunnerAdvance(count){
      if (count == 1){
        if (
          this.gameEventData.playerBase1 != null &&
          this.gameEventData.playerBase2 != null &&
          this.gameEventData.playerBase3 != null
        ){
          if (confirm("Did " + this.gameEventData.playerBase3.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        }

        if (this.gameEventData.playerBase2 != null){
          this.gameEventData.playerBase3 = this.gameEventData.playerBase2
        }

        if (this.gameEventData.playerBase1 != null){
          this.gameEventData.playerBase2 = this.gameEventData.playerBase1
        }

        if (this.gameEventData.playerBatter != null){
          this.gameEventData.playerBase1 = this.gameEventData.playerBatter
        }
      } else
      if (count == 2){
        if (
          (this.gameEventData.playerBase1 != null | this.gameEventData.playerBase2 != null) &&
          this.gameEventData.playerBase3 != null
        ){
          if (confirm("Did " + this.gameEventData.playerBase3.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        }

        if (
          this.gameEventData.playerBase1 != null &&
          this.gameEventData.playerBase2 != null
        ){
          if (confirm("Did " + this.gameEventData.playerBase2.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        } else
        if (this.gameEventData.playerBase2 != null){
          this.gameEventData.playerBase3 = this.gameEventData.playerBase2
        }

        if (this.gameEventData.playerBase1 != null){
          this.gameEventData.playerBase3 = this.gameEventData.playerBase1
        }

        if (this.gameEventData.playerBatter != null){
          this.gameEventData.playerBase2 = this.gameEventData.playerBatter
          this.gameEventData.playerBase1 = null
        }
      } else
      if (count == 3){
        if (this.gameEventData.playerBase3 != null){
          if (confirm("Did " + this.gameEventData.playerBase3.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        }
        if (this.gameEventData.playerBase2 != null){
          if (confirm("Did " + this.gameEventData.playerBase2.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        }
        if (this.gameEventData.playerBase1 != null){
          if (confirm("Did " + this.gameEventData.playerBase1.lastName + " safe?") == true){
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
              this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
            }
            if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
              this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
            }
          }
        }
        if (this.gameEventData.playerBatter != null){
          this.gameEventData.playerBase3 = this.gameEventData.playerBatter
          this.gameEventData.playerBase2 = null
          this.gameEventData.playerBase1 = null
        }
      }
    },
    evalHomeRun(){
      if (this.gameEventData.playerBatter != null){
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
          this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
        }
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
          this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
        }
      }
      if (this.gameEventData.playerBase1 != null){
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
          this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
        }
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
          this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
        }
      }
      if (this.gameEventData.playerBase2 != null){
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
          this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
        }
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
          this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
        }
      }
      if (this.gameEventData.playerBase3 != null){
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 1){
          this.gameEventData.team1Score = this.defaultValue(this.gameEventData.team1Score, 0) + 1
        }
        if (this.defaultValue(this.gameEventData.playingTeam, 1) == 2){
          this.gameEventData.team2Score = this.defaultValue(this.gameEventData.team2Score, 0) + 1
        }
      }
      this.gameEventData.playerBatter = null;
      this.gameEventData.playerBase1 = null;
      this.gameEventData.playerBase2 = null;
      this.gameEventData.playerBase3 = null;
    },
    evalBall(){
      this.gameEventData.ballCount = this.defaultValue(this.gameEventData.ballCount, 0) + 1;
      if (this.gameEventData.ballCount >= 4){
        this.gameEventData.outsCount = this.defaultValue(this.gameEventData.outsCount, 0) + 1;
        return true
      } else {
        return false
      }
    },
    evalStrike(){
      this.gameEventData.strikeCount = this.defaultValue(this.gameEventData.strikeCount, 0) + 1;
      if (this.gameEventData.strikeCount >= 3){
        this.gameEventData.outsCount = this.defaultValue(this.gameEventData.outsCount, 0) + 1;
        return true
      } else {
        return false
      }
    },
    changeTeam(){
      if (this.gameEventData.half == 'down'){
        this.gameEventData.inningCount = this.defaultValue(this.gameEventData.inningCount, 1) + 1
        this.gameEventData.half = 'up'
      } else {
        this.gameEventData.half = 'down'
      }
      if (this.gameEventData.inningCount == 1){
        this.gameEventData.inningRankTail = 'st'
      } else
      if (this.gameEventData.inningCount == 2){
        this.gameEventData.inningRankTail = 'nd'
      } else
      if (this.gameEventData.inningCount == 3){
        this.gameEventData.inningRankTail = 'rd'
      } else
      if (this.gameEventData.inningCount >= 4){
        this.gameEventData.inningRankTail = 'th'
      }
      if (this.gameEventData.playingTeam == 1){
        this.gameEventData.playingTeam = 2
      } else {
        this.gameEventData.playingTeam = 1
      }
      this.gameEventData.fielderPitcher = null
      this.gameEventData.fielderCatcher = null
      this.gameEventData.fielderBase1 = null
      this.gameEventData.fielderBase2 = null
      this.gameEventData.fielderBase3 = null
      this.gameEventData.fielderLF = null
      this.gameEventData.fielderCF = null
      this.gameEventData.fielderRF = null
      this.gameEventData.fielderSS = null
      this.gameEventData.playerBase1 = null
      this.gameEventData.playerBase2 = null
      this.gameEventData.playerBase3 = null
      this.gameEventData.playerBatter = null
      this.gameEventData.ballCount = 0
      this.gameEventData.strikeCount = 0
      this.gameEventData.outsCount = 0
    },
    undoEvent(){
      const nEventID = (this.gameData.eventId - 1)
      if (nEventID >=0 && this.gameEvents.length > nEventID){
        const updateData = {
          id: this.gameEvents[this.gameData.eventId].id,
          updates: {
            status: 'deleted'
          }
        }
        console.log("updateData", updateData)
        this.updateGameEvent(updateData)
        this.gameData.eventId = nEventID
        this.gameEventData = this.gameEvents[this.gameData.eventId]
      }
    },
    redoEvent(){
      const nEventID = (this.gameData.eventId + 1)
      if (nEventID >=0 && this.gameEvents.length > nEventID){
        this.gameData.eventId = nEventID
        this.gameEventData = this.gameEvents[this.gameData.eventId]
        const updateData = {
          id: this.gameEvents[this.gameData.eventId].id,
          updates: {
            status: 'active'
          }
        }
        this.updateGameEvent(updateData)
      }
    },

    evaluateEvent(eventType, data){

      const eventBalls = [
        'ball',
        'intent-ball',
        'illegal-pitch-advance',
        'illegal-pitch-noadvance'
      ]
      const eventStrikes = [
        'called-strike',
        'swing-miss',
        'foul-ball',
        'bip-groundball-foul-ball',
        'bip-hgroundball-foul-ball',
        'bip-flyball-foul-ball',
        'bip-flyball-foul-ball-error',
        'bip-linedrive-foul-ball',
        'bip-linedrive-foul-ball-error',
        'bip-bunt-foul-ball',
        'bip-bunt-foul-ball-error',
        'bip-popfly-foul-ball',
        'bip-popfly-foul-ball-error',
      ]
      const eventHomeRuns = [
        'bip-groundball-itphomerun',
        'bip-hgroundball-itphomerun',
        'bip-flyball-homerun',
        'bip-flyball-itphomerun',
        'bip-linedrive-homerun',
        'bip-linedrive-itphomerun',
        'bip-bunt-itphomerun',
        'bip-popfly-homerun',
        'bip-popfly-itphomerun',
      ]
      const eventOuts1 = [
        'foul-ball',
        'bip-groundball-out-at-first',
        'bip-groundball-foul-ball',
        'bip-hgroundball-out-at-first',
        'bip-hgroundball-foul-ball',
        'bip-flyball-out',
        'bip-flyball-foul-out',
        'bip-flyball-sac-fly',
        'bip-flyball-foul-ball',
        'bip-flyball-foul-ball-error',
        'bip-linedrive-out',
        'bip-linedrive-foul-out',
        'bip-linedrive-sac-fly',
        'bip-linedrive-foul-ball',
        'bip-linedrive-foul-ball-error',
        'bip-bunt-out',
        'bip-bunt-pop-out',
        'bip-bunt-sac-out',
        'bip-bunt-foul-ball',
        'bip-bunt-foul-ball-error',
        'bip-popfly-out',
        'bip-popfly-foul-out',
        'bip-popfly-sac-fly',
        'bip-popfly-sac-error',
        'bip-popfly-foul-ball',
        'bip-popfly-foul-ball-error',
        'batter-out-other',
      ]
      const eventOuts2 = [
        'bip-groundball-double-play',
        'bip-hgroundball-double-play',
        'bip-flyball-double-play',
        'bip-linedrive-double-play',
        'bip-bunt-double-play',
        'bip-popfly-double-play',
      ]
      const eventOuts3 = [
        'bip-groundball-triple-play',
        'bip-hgroundball-triple-play',
        'bip-flyball-triple-play',
        'bip-linedrive-triple-play',
        'bip-bunt-triple-play',
        'bip-popfly-triple-play',
      ]
      const eventRunnerSafe1 = [
        'bip-groundball-single',
        'bip-hgroundball-single',
        'bip-flyball-single',
        'bip-linedrive-single',
        'bip-bunt-sac-safe',
        'bip-bunt-single',
        'bip-popfly-single',
      ]
      const eventRunnerSafe2 = [
        'bip-groundball-double',
        'bip-hgroundball-double',
        'bip-flyball-double',
        'bip-linedrive-double',
        'bip-bunt-double',
        'bip-popfly-double',
      ]
      const eventRunnerSafe3 = [
        'bip-groundball-triple',
        'bip-hgroundball-triple',
        'bip-flyball-triple',
        'bip-linedrive-triple',
        'bip-bunt-triple',
        'bip-popfly-triple',
      ]

      let isChangeBatter = false;

      if (eventBalls.includes(eventType)){
        isChangeBatter = this.evalBall()
      } else
      if (eventStrikes.includes(eventType)){
        isChangeBatter = this.evalStrike()
      } else
      if (eventOuts1.includes(eventType)){
        this.gameEventData.outsCount = this.defaultValue(this.gameEventData.outsCount, 0) + 1
        isChangeBatter = true
      } else
      if (eventOuts2.includes(eventType)){
        this.gameEventData.outsCount = this.defaultValue(this.gameEventData.outsCount, 0) + 2
        isChangeBatter = true
      } else
      if (eventOuts3.includes(eventType)){
        this.gameEventData.outsCount = this.defaultValue(this.gameEventData.outsCount, 0) + 3
        isChangeBatter = true
      } else
      if (eventHomeRuns.includes(eventType)){
        this.evalHomeRun()
        isChangeBatter = true
      } else
      if (eventRunnerSafe1.includes(eventType)){
        this.evalRunnerAdvance(1)
        isChangeBatter = true
      } else
      if (eventRunnerSafe2.includes(eventType)){
        this.evalRunnerAdvance(2)
        isChangeBatter = true
      } else
      if (eventRunnerSafe3.includes(eventType)){
        this.evalRunnerAdvance(3)
        isChangeBatter = true
      }

      if (isChangeBatter == true){
        this.gameEventData.playerBatter = null
        this.gameEventData.ballCount = 0
        this.gameEventData.strikeCount = 0
      }

      if (this.gameEventData.outsCount >= 3){
        this.changeTeam()
      }

      this.closePitch()

      console.log("playingTeam", this.gameEventData.playingTeam)
      console.log("this.gameEventData", this.gameEventData)

      // if (checkHomeRun >= 0){
      //   this.pitchDialog = false
      //   this.showPlayer1 = !this.showPlayer1
      // }

      // TODO: EVENT EVALUATON HERE
      let eventDescription = data.text // <---- description that will be sent to Gemini AI
      this.saveGameEvent(eventType, eventDescription)

      // this.pitchSubmitAction = true
      // this.progress = 0.00

      // let interval = setInterval(() => {
      //   if (this.progress >= 1) {
      //     clearInterval(interval)
      //     return
      //   }
      //   this.progress = this.progress + 0.2
      // }, 200)
      // this.progress = 0.00
    },
    async saveGameEvent(eventType, eventDesc){
      let postData = {
        gameId: this.gameData.gameId || '',
        leagueId: this.gameData.leagueId || '',
        leagueName: this.gameData.leagueName || '',
        team1Id: this.gameData.team1Id || '',
        team1Name: this.gameData.team1Name || '',
        team2Id: this.gameData.team2Id || '',
        team2Name: this.gameData.team2Name || '',
        team1Score: this.gameEventData.team1Score || 0,
        team2Score: this.gameEventData.team2Score || 0,

        inning: this.gameEventData.inning || 1,
        half: this.gameEventData.half || 'up',
        playingTeam: this.gameEventData.playingTeam || 1,

        description: eventDesc || '',
        type: eventType || '',

        playerBatter: this.gameEventData.playerBatter || null,
        playerBase1: this.gameEventData.playerBase1 || null,
        playerBase2: this.gameEventData.playerBase2 || null,
        playerBase3: this.gameEventData.playerBase3 || null,
        fielderPitcher: this.gameEventData.fielderPitcher || null,
        fielderCatcher: this.gameEventData.fielderCatcher || null,
        fielderLF: this.gameEventData.fielderLF || null,
        fielderCF: this.gameEventData.fielderCF || null,
        fielderRF: this.gameEventData.fielderRF || null,
        fielderSS: this.gameEventData.fielderSS || null,
        fielderBase1: this.gameEventData.fielderBase1 || null,
        fielderBase2: this.gameEventData.fielderBase2 || null,
        fielderBase3: this.gameEventData.fielderBase3 || null,

        status: 'active',
        ballCount: this.gameEventData.ballCount || 0,
        strikeCount: this.gameEventData.strikeCount || 0,
        outsCount: this.gameEventData.outsCount || 0,
        pitchCount: this.gameEventData.pitchCount || 0,
      }
      await this.gameEventDataStore.addRecord(postData)
      .then(response => {
        console.log("game event response:", response)
        postData.id = response;
        this.gameEvents.push(postData);
        this.gameEventData = postData
        this.gameData.eventId = this.gameEvents.length
      }).catch(error => {
        console.error(error)
      })
      console.log("evaluate end")
    },

    closePitch(){
      this.pitchDialog = false
      this.pitchMenus = this.pitchAction
    },
    backPitch(){
      if(this.pitchMenus.id == 5 || this.pitchMenus.id==120){
        this.pitchMenus = this.pitchAction

      }else{
        let parentList = this.currentParent.split("_")
        this.pitchMenus = this.currentList//this.pitchMenus[findParent].action
        if(parentList[0]==5){
          this.currentList = this.pitchAction.actions[4]
        }else{
          const hFound2 = this.pitchAction.findIndex(elem2 => elem2.id == 120)
          this.currentList = this.pitchAction.actions[hFound2]
        }

      }

    },
    pitchBall(){
      this.pitchMenuData()
      this.pitchCount = this.pitchCount + 1
      if(this.gameEventData.playerBatter === undefined){
        this.setPlayerDialog('playerBatter')
      }else{
        this.open("right")
      }
    },
    setPlayerDialog(pPosition) {
      // todo: if batter add field for 1st,2nd etch
      this.setPlayersDialog = true
      this.playerPositionText = this.$t(pPosition)
      this.playerPosition = pPosition
    },
    async setPlayersPosition(pPosition,pValue,nextAction) {
      if(pPosition == "playerBatter"){
        let batterRank = this.batterCount + 1
        pValue.batterRank = batterRank
      }
      this.gameEventData[pPosition] =pValue
      const eventType = 'change-player-' + pPosition
      const eventDesc = 'change-player-' + pPosition
      this.saveGameEvent(eventType, eventDesc)
      this.setPlayersDialog = false;
    },

    setFirstTeamBatter(teamNumber){
      //1=current team, 2 opponent team first
      const updateData = {
        id: this.gameData.gameId,
        updates: {
          firstTeamBatter: teamNumber
        }
      }
      this.updateGameData(updateData)
      this.whosbattingFirst = false
    },
    createNewPlayerDialog(){
      this.setPlayersDialog = true
    },
    closeSetPlater(){
      console.log(this.leftDrawerOpen)
      this.setPlayersDialog = false
    },
    closeaddPlayerBox(){
      console.log(this.leftDrawerOpen)
      this.setPlayersDialog=false
    },

    async getTeamPlayers(teamNumber, teamId){
      if(teamId){
        await this.playerData.getRecordsByTeamId(teamId)
        .then(async (response) => {
          if (response){
            this.teamPlayers = response
            response.forEach((e) => {
              if(teamNumber == 1){
                this.team1Players.push({
                  id: e.id,
                  firstName: e.firstName || '',
                  lastName: e.lastName || '',
                  number: e.shirtNumber || '',
                  position: e.playerPosition || ''
                })
              } else {
                this.team2Players.push({
                  id: e.id,
                  firstName: e.firstName || '',
                  lastName: e.lastName || '',
                  number: e.shirtNumber || '',
                  position: e.playerPosition || ''
                })
              }
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
      }
    },
    async getGameDetails(gameId){
      await this.gameDataStore.getRecord(gameId)
      .then(async (response) => {
        if (response){
          this.gameData = {
            gameId: response.id,
            gameType: response.gameType || '',
            leagueId: response.leagueId || '',
            leagueName: response.leagueName || '',
            season: response.season || '',
            duration: response.duration || '',
            scrimmage: response.scrimmage || '',
            team1Id: response.team1Id || '',
            team1Name: response.team1Name || '',
            team2Id: response.team2Id || '',
            team2Name: response.team2Name || '',
            venue: response.venue || '',
            status: response.status || '',
            startTime: response.startTime,
            firstTeamBatter: response.firstTeamBatter,
            playingTeam: response.playingTeam || 1,
            eventId: response.eventId || 0,
          }
          this.getTeamPlayers(1, response.team1Id)
          this.getTeamPlayers(2, response.team2Id)
          if (!this.gameData.firstTeamBatter){
            this.whosbattingFirst = true
          }
        }
      })
      .catch((error) => {
        console.error(error)
      })
    },
    async getGameEvents(gameId){
      await this.gameEventDataStore.getRecordsByGame(gameId)
      .then(async (response) => {
        if (response){
          // Initialize Only
          this.gameEventData = {
            gameId: this.gameData.gameId,
            leagueId: this.gameData.leagueId,
            leagueName: this.gameData.leagueName,
            team1Id: this.gameData.team1Id,
            team1Name: this.gameData.team1Name,
            team2Id: this.gameData.team2Id,
            team2Name: this.gameData.team2Name,
            team1Score: this.gameData.team1Score,
            team2Score: this.gameData.team2Score,
            inning: 1,
            half: 'up',
            playingTeam: 1,
            description: '',
            type: 'initial',
            status: 'active',
            ballCount: 0,
            strikeCount: 0,
            outsCount: 0,
            pitchCount: 0,
          }
          this.gameData.eventId = 0
          // ############################################
          let eventSet = false
          this.gameEvents = response
          if(Array.isArray(response) && response.length > 0){
            response.forEach((elem, i) => {
              if (elem.status == 'active' && eventSet == false){
                this.gameEventData = elem
                this.gameData.eventId = i
                eventSet = true
              }
            })
          }
          // if(this.gameEventData.batter != undefined){
          //   this.batterCount = this.gameEventData.batter.batterRank
          // }else{
          //   this.batterCount = 1
          // }
          // this.getTeamPlayers(response.team1Id)
          // if(response.firstTeamBatter===undefined){
          //   this.whosbattingFirst = true
          // }
        }
      })
      .catch((error) => {
        console.error(error)
      })
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

              firstName       : this.formData.firstName,
              lastName        : this.formData.lastName,
              shirtNumber     : this.formData.shirtNumber,
              teamId          : this.teamId,
              teamName        : this.teamName,
              gameId          : this.gameId,
              playerType      : "Opponent",
              battingHand     : this.formData.battingHand.value,
              throwingHand    : this.formData.throwingHand.value,
              playerPosition  : this.playerPosition,
              status          : "active"
          }
          console.log(entityData)
          await this.playerData.addRecord(entityData)
          .then(response => {
            this.loading = false
            //this.opponentPosition.push({position:this.playerPosition,playerId:response,firstName:this.formData.firstName,lastName:this.formData.lastName,shirtNumber:this.formData.shirtNumber})

            let updateData = {playerId:response,firstName:this.formData.firstName,lastName:this.formData.lastName,shirtNumber:this.formData.shirtNumber}
            if(this.playerPosition=="playerBatter"){
              let NewbatterRank = this.batterCount+1  //  set this to 0 after every round
              updateData = {playerId:response,firstName:this.formData.firstName,lastName:this.formData.lastName,shirtNumber:this.formData.shirtNumber,batterRank:NewbatterRank}
            }
            this.updateGameData(this.gameId,"setPlayer", updateData,this.playerPosition)
            this.gameEventData[this.playerPosition]=updateData
            this.createNewPlayer=false
            //todo update this.gameEventData value
            //let pname = this.formData.firstName.charAt(0)+". "+this.formData.lastName
            //this.cfPlayer = {playerId:response, pName:pname,shirtNumber:this.formData.shirtNumber}
          }).catch(error => {
            this.loading = false
            console.log(error)
            // this.$q.notify({
            //     type: 'negative',
            //     position:'top',
            //     message: error
            // })
          })

      } else {
        this.loading = false
        // this.$q.notify({
        //   message: "Please complete required fields",
        //   position:'top',
        //   color: 'red',
        // })
      }
    },
    updateGameData(updateData){
      return new Promise(async (resolve, reject) => {
        await this.gameDataStore.updateRecord(updateData)
        .then(response => {
          resolve();
        }).catch(error => {
          console.log(error)
          reject();
        })
      });
    },
    updateGameEvent(updateData){
      return new Promise(async (resolve, reject) => {
        await this.gameEventDataStore.updateRecord(updateData)
        .then(response => {
          resolve();
        }).catch(error => {
          console.log(error)
          reject();
        })
      });
    },
    getLastArray(arr) {
      if (!Array.isArray(arr)) {
        return undefined;
      }
      return arr[arr.length - 1];
    },
    getRankTail(x){
      let text = ''
      switch (x) {
        case 2:
          text = "nd";
          break;
        case 3:
          text = "rd";
          break;
        case x>=4:
          text = "th";
          break;
        default:
          text = "st";
      }
      return text
    }
  }
});
</script>
<style >
  .centerball{
    border: solid 1px #c0c0c0;
    padding: 20px 10px;
    border-radius: 50%;
  }
  .q-drawer{
    width: 414px !important;
  }
  #bbground{
    background: url('/img/pilaludere_bg.jpg') no-repeat;
    padding: 80px 20px 30px;
    height: 590px;
    background-position: center;
    background-size: cover;
    position: relative;
    background-color: black;
  }
  .box1{
    border: solid 1px #c0c0c0;
    padding:8px 15px;
  }
  .box2{
    border: solid 1px #c0c0c0;
  }
  .playerbtn{
    background:#ffffff;
    color:#0070c8;
    font-size:23px;
    font-weight: bold;
    padding:5px 5px;
    min-height: 20px !important;
  }
  .catcherBtn{
    background:#ffffff;
    color:#753131;
    font-size:23px;
    font-weight: bold;
    padding:5px 5px;
    min-height: 20px !important;
  }
  .noVid{
    border-radius: 5px;
    box-shadow: none;
    text-transform:uppercase;
    font-size: 12px;
    background:#35373d;
    color: white;
    padding: 3px 6px;
    margin-left:10px;
  }
  sup {
    vertical-align: super;
    font-size: smaller;
  }
  .scoretop{
    font-weight: 450;
    font-size: 16px;
    margin-right: 5px;
  }
  .scorebso{
    font-size:18px;
    margin-right: 5px;
    vertical-align: text-bottom;
  }
  .uparrow{
    font-size:18px;
    padding:0px !important;

  }
  .dialogTitle{
    padding-top: 5px;
    font-weight: bold;
    font-size: 20px;
  }
  .newplayerFields{
    margin-bottom: 10px;
  }
  .fieldPlayers{
    color: green;
  }
  .fieldPlayersPop{
    color: white;
    font-weight: bold;
    font-size: 18px;
    width:100%;
    text-align:center;
  }
  .currentPlayer{
    width: 60px;
    height: 50px;
    background-color: #0070c8;
    color: white;
    position: absolute;

    text-align: center;
    font-size: 12px;
    font-weight: bold;
    padding-top: 6px;
    border: solid 1px white;
    border-radius: 5px;
  }
  .p1{
    top: 336px;
    left: 329px;
  }
  .p2{
    top: 195px;
    left: 180px;
  }
  .p3{
    top: 336px;
    left: 33px;
  }
  .p4{
    top: 450px;
    left: 180px;
  }
  .ballFieldpop{
    background-color: #35373d;
    opacity: 0.8;
    height:600px;
    padding-top: 57px;
  }
  .catchermitt{
    height: 80px;
    max-width: 90px;
    margin:10px;
  }
  .fielderText{
    font-weight: bold;
    text-shadow: 0 0 white;
    position:relative;
    width:150px;
    text-align:center
  }
  .q-img__content > div {
    background:none !important;
  }
  .q-img__content > div {
    padding:10px 0px 0px !important
}
</style>
