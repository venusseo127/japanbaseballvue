<template>
  <div class="playground">
    <div class="q-pa-md">
      <div class="row center-justify">
        <div class="col-9">
          <q-btn class="noVid" dense icon-right="help" size="sm" :label="$t('NoVideo')" />
          <q-btn class="uparrow" flat dense icon="arrow_drop_up" v-if="half=='up'" />
          <q-btn class="uparrow" flat dense icon="arrow_drop_down" v-if="half=='down'" />
          <span class="scoretop" color="info">{{ inningCount }}<sup>{{ inningTail }}</sup></span>
          <span class="scorebso" color="info">B</span>
          <span class="scoretop" color="info">{{ ballCount }}</span>
          <span class="scorebso" color="info">S</span>
          <span class="scoretop" color="info">{{ strikeCount }}</span>
          <span class="scorebso" color="info">O</span>
          <span class="scoretop" color="info">{{ outsCount }}</span>
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
          {{ this.gameEventData.leagueName }} &nbsp;
          <span class="text-right" style='float: right;'>{{ team1Score }}</span>
        </div>
        <div class="col-6 box1">
          {{ team2Score }} &nbsp;
          <span class="text-right" style="float: right;">
            {{ this.gameEventData.awayTeam }}
            {{ this.utility.convertToMoment(this.gameEventData.startDate).format("MMMM DD, YYYY") }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 box2">
          <div v-if="this.gameEventData.batter != undefined" class="row"  style="background-color:#eaeaea">
            <div class="col-3" style="padding:10px 15px;">
              <q-btn color="primary" dense label="AB"/>
            </div>
            <div class="col"  style="padding:5px;">
              <div>#{{ this.gameEventData.batter.shirtNumber }} , {{ this.gameEventData.batter.firstName }}  </div>
              <div>Batting {{ this.getTextRank(this.batterCount) }} of {{ this.gameEventData.batter.batterRank }}</div>
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
          <div v-if="this.gameEventData.batter===undefined" class="row center-justify"  style="background-color:#eaeaea">
            <div class="col-12" style="padding:10px 15px;text-align: center;">
              <q-btn color="primary" :label="$t('setBatter')" @click="setPlayerDialog('batter')" style="width: 100%;text-transform:uppercase;"></q-btn>
            </div>
          </div>
        </div>
        <div class="col-6 box2">
          <div v-if="this.gameEventData.pitcher != undefined" class="row" style="background-color:#eaeaea">
            <div class="col" style="padding:5px;text-align:right;">
              <div>#{{ this.gameEventData.pitcher.shirtNumber }} , {{ this.gameEventData.pitcher.firstName }}</div>
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
          <div v-if="this.gameEventData.pitcher === undefined" class="row center-justify"  style="background-color:#eaeaea">
            <div class="col-12" style="padding:10px 15px;text-align: center;">
              <q-btn color="primary" :label="$t('setPitcher')"  @click="setPlayerDialog('pitcher')" style="width: 100%;text-transform:uppercase;"></q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tblbox" id="bbground">
      <div class="fieldersBtn" :class="(fieldersBtn==true)?invisible:''">
        <div class="row center-justify" style="margin:10px 0px;" >
          <div class="col-12 text-center">
            <q-btn v-if="this.gameEventData.centerField===undefined" class="playerbtn" label="CF" @click="setPlayerDialog('centerField')" />
            <div v-if="this.gameEventData.centerField !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.centerField.firstName).charAt(0) }} {{ this.gameEventData.centerField.lastName }}</div>
              <div>#{{ this.gameEventData.centerField.shirtNumber }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin:10px 0px;">
          <div class="col-6">
            <q-btn v-if="this.gameEventData.leftField===undefined" class="playerbtn" @click="setPlayerDialog('leftField')" label="LF"/>
            <div class="text-left" v-if="this.gameEventData.leftField!=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.leftField.firstName).charAt(0) }} {{ this.gameEventData.leftField.lastName }}</div>
              <div>#{{ this.gameEventData.leftField.shirtNumber }}</div>
            </div>
          </div>
          <div class="col-6 text-right">
            <q-btn v-if="this.gameEventData.rightField===undefined" class="playerbtn" label="RF" @click="setPlayerDialog('rightField')" />
            <div  v-if="this.gameEventData.rightField !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.rightField.firstName).charAt(0) }} {{ this.gameEventData.rightField.lastName }}</div>
              <div>#{{ this.gameEventData.rightField.shirtNumber }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin: 10px 0px 50px;">
          <div class="col-6 text-right">
            <q-btn v-if="this.gameEventData.shortStop===undefined" class="playerbtn" style="margin-right: 25%;" label="SS" @click="setPlayerDialog('shortStop')" />
            <div class="text-center" v-if="this.gameEventData.shortStop !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.shortStop.firstName).charAt(0) }} {{ this.gameEventData.shortStop.lastName }}</div>
              <div>#{{ this.gameEventData.shortStop.shirtNumber }}</div>
            </div>
          </div>
          <div class="col-6">
            <q-btn v-if="this.gameEventData.secondBase===undefined" class="playerbtn" style="margin-left: 25%;" label="2B" @click="setPlayerDialog('secondBase')" />
            <div class="text-center" v-if="this.gameEventData.secondBase !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.secondBase.firstName).charAt(0) }} {{ this.gameEventData.secondBase.lastName }}</div>
              <div>#{{ this.gameEventData.secondBase.shirtNumber }}</div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-bottom:30px;">
          <div class="col-4">
            <q-btn v-if="this.gameEventData.thirdBase===undefined" class="playerbtn" style="margin-left: 25%;" label="3B" @click="setPlayerDialog('thirdBase')" />
            <div v-if="this.gameEventData.thirdBase !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.thirdBase.firstName).charAt(0) }} {{ this.gameEventData.thirdBase.lastName }}</div>
              <div>#{{ this.gameEventData.thirdBase.shirtNumber }}</div>
            </div>
          </div>
          <div class="col-4 text-center">
            <q-btn v-if="this.gameEventData.pitcher===undefined" class="playerbtn" label="P" @click="setPlayerDialog('pitcher')" />
            <div v-if="this.gameEventData.pitcher !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.pitcher.firstName).charAt(0) }} {{ this.gameEventData.pitcher.lastName }}</div>
              <div>#{{ this.gameEventData.pitcher.shirtNumber }}</div>
            </div>
          </div>
          <div class="col-4 text-right">
            <q-btn v-if="this.gameEventData.firstBase===undefined" class="playerbtn" style="margin-right: 25%;" label="1B" @click="setPlayerDialog('firstBase')" />
            <div v-if="this.gameEventData.firstBase !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
              <div class="fieldPlayers">{{ (this.gameEventData.firstBase.firstName).charAt(0) }} {{ this.gameEventData.firstBase.lastName }}</div>
              <div>#{{ this.gameEventData.firstBase.shirtNumber }}</div>
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
        <div class="row" style="margin-top: 50px;">
          <div class="col-12 text-right" style="padding:20px 0px"><q-btn color="primary" dense icon="score"/></div>
        </div>
      </div>
      <div class="row fieldRunner">
        <Transition :css="false">
          <div class="currentPlayer p1" v-if="showPlayer1" id="player1">
            <div class="cPlayerInfo">Mercado</div>
            <div class="cPlayerInfo">#24</div>
          </div>
        </Transition>
        <Transition :css="false">
          <div class="currentPlayer p2" v-if="showPlayer1" id="player2">
            <div class="cPlayerInfo">Sanchez</div>
            <div class="cPlayerInfo">#37</div>
          </div>
        </Transition>
        <Transition :css="false">
          <div class="currentPlayer p3" v-if="showPlayer1" id="player3">
            <div class="cPlayerInfo">Gonzalez</div>
            <div class="cPlayerInfo">#08</div>
          </div>
        </Transition>
        <Transition :css="false">
          <div class="currentPlayer p4" v-if="showPlayer1" id="player4">
            <div class="cPlayerInfo">Lopez</div>
            <div class="cPlayerInfo">#44</div>
          </div>
        </Transition>

      </div>
    </div>
    <div class="row" style="width: 100%;background-color: #eaeaea;">
        <div class="col-4" color="primary" style="padding: 5px 10px;"><q-btn icon="undo" @click="batterTeamAnimation()" style="font-size:15px" :label="$t('undo')"/></div>
        <div class="col-4  text-center"  style="padding: 5px 0px;">
          <!-- @click="setPlayerDialog('catcher')"  -->
          <q-btn v-if="this.gameEventData.catcher===undefined" style="font-size:15px" @click="firstRunnerMove()"  color="positive" text-color="negative" dense :label="$t('catch')"/>
          <div v-if="this.gameEventData.catcher !=undefined" style="font-weight: bold;text-shadow: 0 0 white;">
            <div class="fieldPlayers">{{ (this.gameEventData.catcher.firstName).charAt(0) }} {{ this.gameEventData.catcher.lastName }}</div>
            <div>#{{ this.gameEventData.catcher.shirtNumber }}</div>
          </div>
        </div>
        <div class="col-4" color="primary" style="text-align: right;padding: 5px 10px;"><q-btn @click="batterTeamAnimation2();fieldersBtn=false;" icon-right="redo" style="font-size:15px" :label="$t('redo')"/></div>
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
              <span v-if="this.playerPosition =='batter' || this.playerPosition =='pitcher'">Set </span>
              {{ this.playerPositionText }}
            </div>
          </div>
          <div class="q-pa-md row" style="border-bottom: solid 1px #c0c0c0;">
            <div class="col-12" v-if="this.playerPosition !='batter'" style="font-weight: bold;">{{ $t('whosPlaying') }} {{ this.playerPositionText }}?</div>
            <div class="col-12"  v-if="this.playerPosition =='batter'" style="font-weight: bold;">Who's batting {{ this.getTextRank(this.batterCount) }}?</div>
          </div>
          <div class="q-pa-md">
            <q-list bordered v-if="this.playerPosition =='batter'" class="rounded-borders" style="width: 100%;">
              <q-item-label header style="text-transform:uppercase;">{{ $t('bench') }}</q-item-label>
              <q-item clickable v-ripple v-for="(player, index) in bench" :key="index">
                <q-item-section @click="setPlayersPosition('batter',player,'pitch')">
                  <div>{{ player.firstName }} {{ player.lastName }}, # {{ player.shirtNumber }}</div>
                  <div class="text-right">{{ player.$refsplayerPosition }}</div>
                </q-item-section>
              </q-item>
            </q-list>
            <q-list bordered v-if="this.playerPosition !='batter'" class="rounded-borders" style="width: 100%;">
              <q-item-label header style="text-transform:uppercase;">{{ $t('fielder') }}</q-item-label>
              <q-item clickable v-ripple v-for="(player, index) in opponentList" :key="index">
                <q-item-section @click="setPlayersPosition(this.playerPosition,player,'')">
                  <div>{{ player.firstName }} {{ player.lastName }}</div>
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
    <q-dialog  v-model="createNewPlayer"
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
            <div class="text-primary">Undo</div>
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
                <q-item-section><span @click="setFirstTeamBatter(1)" style="margin-left:10px; color: #0070c8;">{{ this.gameEventData.leagueName }}</span></q-item-section>
              </q-item>
              <q-item clickable>
                <q-item-section><span @click="setFirstTeamBatter(2)" style="margin-left:10px; color: #0070c8">
                  {{ this.gameEventData.awayTeam }}
                  {{ this.utility.convertToMoment(this.gameEventData.startDate).format("MMMM DD, YYYY") }}</span></q-item-section>
              </q-item>
            </q-list>
          </div>

        </q-card>
    </q-dialog>
    <q-dialog
      v-model="ballFielded"
      persistent
      :maximized="maximizedToggle"
    >
      <div class='row'>
        <div class="col-12" style="background-color:gray;text-align:center;padding:10px;">
            <div style='margin-top:40px;font-size: 20px;'>Drag
              <q-img src="/img/Baseball_ball_logo.png" spinner-color="white" style="height: 50px; max-width: 50px;" />
               to where the ball was fielded</div>
            <div ><q-btn flat dense :label="$t('cancel')" @click="ballFielded=false;fieldersBtn=true" style="font-size: 20px;" color="primary"  /></div>
        </div>
        <div class="col-12 ">
          <div class="ballFieldpop">

            <div class="row center-justify" >
              <div class="col-12 text-center ballFieldpopBox">
                <q-img  name='CF' src="/img/Baseball_ball_logo.png" @click="ballFieledTo('centerField')" spinner-color="white" class="catchermitt" >
                  <div v-if="this.gameEventData.centerField1 !=undefined"  class=' text-subtitle2 flex flex-center'>
                    <div class="fieldPlayersPop">{{ (this.gameEventData.centerField.firstName).charAt(0) }} {{ this.gameEventData.centerField.lastName }}</div>
                    <div class="text-primary">#{{ this.gameEventData.centerField.shirtNumber }}</div>
                  </div>
                  <q-btn style="margin: 20px 25px;" class="catcherBtn" label="CF" v-if="this.gameEventData.centerField1===undefined" />
                </q-img>
              </div>
            </div>
            <div class="row" style="margin:10px 0px;">
              <div class="col-6">
                <q-img src="/img/Baseball_ball_logo.png"  @click="ballFieledTo('leftField')" spinner-color="white" class="catchermitt" >
                  <div class="text-subtitle2 flex flex-center" v-if="this.gameEventData.leftField!=undefined">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.leftField.firstName).charAt(0) }} {{ this.gameEventData.leftField.lastName }}</div>
                    <div>#{{ this.gameEventData.leftField.shirtNumber }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-left: 20px;"  label="LF" v-if="this.gameEventData.leftField===undefined"/>
                </q-img>
              </div>
              <div class="col-6 text-right">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('rightField')" spinner-color="white" class="catchermitt" >
                  <div  v-if="this.gameEventData.rightField !=undefined" class="text-subtitle2 flex flex-center">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.rightField.firstName).charAt(0) }} {{ this.gameEventData.rightField.lastName }}</div>
                    <div>#{{ this.gameEventData.rightField.shirtNumber }}</div>
                  </div>
                  <q-btn class="catcherBtn" style="margin-right: 20px;" label="RF" v-if="this.gameEventData.rightField===undefined" />
                </q-img>
              </div>
            </div>
            <div class="row" style="margin: 10px 0px 50px;">
              <div class="col-6 text-right">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('shortStop')" spinner-color="white"  class="catchermitt" >
                  <div class="text-subtitle2 flex flex-center" v-if="this.gameEventData.shortStop !=undefined">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.shortStop.firstName).charAt(0) }} {{ this.gameEventData.shortStop.lastName }}</div>
                    <div>#{{ this.gameEventData.shortStop.shirtNumber }}</div>
                  </div>
                  <q-btn v-if="this.gameEventData.shortStop===undefined" class="catcherBtn" style="margin-right: 24%;" label="SS" />
                </q-img>
              </div>
              <div class="col-6">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('secondBase')" spinner-color="white"  class="catchermitt" >
                  <div class="text-subtitle2 flex flex-center" v-if="this.gameEventData.secondBase !=undefined" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.secondBase.firstName).charAt(0) }} {{ this.gameEventData.secondBase.lastName }}</div>
                    <div>#{{ this.gameEventData.secondBase.shirtNumber }}</div>
                  </div>
                  <q-btn v-if="this.gameEventData.secondBase===undefined" class="catcherBtn" label="2B" />
                </q-img>
              </div>
            </div>
            <div class="row" style="margin-bottom:30px;">
              <div class="col-4">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('thirdBase')" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.thirdBase !=undefined" class="text-subtitle2 flex flex-center" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.thirdBase.firstName).charAt(0) }} {{ this.gameEventData.thirdBase.lastName }}</div>
                    <div>#{{ this.gameEventData.thirdBase.shirtNumber }}</div>
                  </div>
                  <q-btn v-if="this.gameEventData.thirdBase===undefined" class="catcherBtn"  label="3B"  />
                </q-img>
              </div>
              <div class="col-4 text-center">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('pitcher')" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.pitcher !=undefined"  class="text-subtitle2 flex flex-center">
                    <div class="fieldPlayersPop">{{ (this.gameEventData.pitcher.firstName).charAt(0) }} {{ this.gameEventData.pitcher.lastName }}</div>
                    <div>#{{ this.gameEventData.pitcher.shirtNumber }}</div>
                  </div>
                  <q-btn v-if="this.gameEventData.pitcher===undefined" class="catcherBtn" label="P" />
                </q-img>
              </div>
              <div class="col-4 text-right">
                <q-img src="/img/Baseball_ball_logo.png" @click="ballFieledTo('firstBase')" spinner-color="white"  class="catchermitt" >
                  <div v-if="this.gameEventData.firstBase !=undefined" class="text-subtitle2 flex flex-center" >
                    <div class="fieldPlayersPop">{{ (this.gameEventData.firstBase.firstName).charAt(0) }} {{ this.gameEventData.firstBase.lastName }}</div>
                    <div>#{{ this.gameEventData.firstBase.shirtNumber }}</div>
                  </div>
                  <q-btn v-if="this.gameEventData.firstBase===undefined" class="catcherBtn" style="margin-right: 25%;" label="1B" />
                </q-img>
              </div>
            </div>

          </div>
        </div>
        <div class="col-12"> </div>
      </div>
    </q-dialog>
    <q-dialog
      v-model="runnerScore"
      persistent :maximized="maximizedToggle"
    >
      <div class='row'>
        <div class="col-12" style="background-color:gray;text-align:center;padding:10px;">
            <div style='margin-top:40px;font-size: 20px;'>Did runner score?</div>
            <div ><q-btn flat dense :label="$t('cancel')" @click="runnerScore=false;fieldersBtn=true" style="font-size: 20px;" color="primary"  /></div>
        </div>
        <div class="col-12 ">
          <div class="runnerScorePop">
            <div class="fixed-bottom" id="runnerScorePop"  style="text-align: center;margin-bottom: 32%;">
              <q-btn  style="background-color: red;color: white;margin-right: 10px;" label="Out" @click="setRunnerScore('out')" />
              <q-btn  style="background-color: green;color: white;margin-right: 10px;" label="Safe" @click="setRunnerScore('safe')" />
              <q-btn  style="background-color: gray;color: white;margin-right: 10px;" label="Didn't score" @click="setRunnerScore('zero')" />
            </div>
          </div>
        </div>
      </div>
    </q-dialog>
  </div>

</template>

<script>
import { defineComponent,ref  } from 'vue';
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
    const runnerScore = ref(false)
    const position = ref('top')
    const leftDrawerOpen = ref(false)
    const $q = useQuasar()
    const firstItemEnabled = ref(false)
    const playerData = usePlayerDataStore()
    const gameDataStore = useGameDataStore()
    const gameEventDataStore = useGameEventDataStore()
    const utility = utilities()

    return {
      locale,router,pitchDialog,playerData,whosbattingFirst,runnerScore,
      position,setPlayersDialog: ref(false),createNewPlayer:ref(false),didScore:ref(0),utility,ballFielded:ref(false),
      leftDrawerOpen, gameDataStore, gameEventDataStore,fieldersBtn:ref(true),showPlayer1 : ref(true),
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
      teamId:'',
      teamName:'',
      gameId:'',
      team:{},

      gameData: {},
      playingTeam: 1,

      playerBatter: null,
      playerFirstBase: null,
      playerSecondBase: null,
      playerThirdBase: null,

      fielderPitcher: null,
      fielderCatcher: null,
      fielderCF: null,
      fielderLF: null,
      fielderRF: null,
      fielderSS: null,

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
      batterList:[],
      pitcherList:[],
      teamPlayers:[],
      bench:[],
      opponentList:[],
      opponentPosition:[],
      gameEventData:{},
      firstBatter:0,
      currentList:[],
      selectedList:0,
      oldIndex:0,
      selectedPitch:this.$t("pitch"),
      listOfFields:[
        "centerField",
        "leftField",
        "rightField",
        "shortStop",
        "secondBase",
        "thirdBase",
        "pitcher",
        "firstBase",
        "catcher",
        "batter"
      ],

      inningCount:1,
      inningTail:'st',
      half:'up',
      team1Score:0,
      team2Score:0,

      ballCount:0,
      strikeCount:0,
      outsCount:0,
      batterCount:0,
      pitchCount:0,

      currentParent:'1000',
      progress : ref(0.00),
      buffer : ref(0.01),
      runnerAdvance:'',
      homerunVal:false,
      intervalCount:1,
      intervalId:null
    }
  },
  mounted() {
    this.locale = this.$q.lang.getLocale()
    this.pitchMenuData()
    this.gameId = this.router.params.id
    this.getGameEventDetails(this.gameId)
    this.pitchMenus = this.pitchAction

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

    onEnterPlayer1(done) {
      // if single move player1 to base 1
      // if double move player 1 to base1 and base 2
      // if triple move player 1 to base1,2 and 3
      // if home base move player 1 to base2,3 and home run
      const player1 = document.getElementById('player1')
      //player1 move to base1
      gsap.to(player1, {// move to base1
        opacity: 1,
        top:'58%',
        left : '83%',
        transform: 'translate(0%,0)',
        duration: 0.5,
        delay: 1,
      })
      if(this.runnerAdvance >= 2){//move to base 2
        gsap.to(player1, {
          top: '30%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 2,
        })
      }
      if(this.runnerAdvance >= 3){ // move to base 3
        gsap.to(player1, {
          top: '58%',
          left: '5%',
          transform: 'translate(0%,0)',
          duration: 0.5,
          delay: 3,
        })
      }
      if(this.runnerAdvance >= 4){ // move to homebase
        gsap.to(player1, {
          top: '80%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 4,
          onComplete: done
        })
      }
    },
    onEnterPlayer2(done) {
      // location base 1
      // if single move player 2 to base 2
      // if double move player 2 to base 2 and base 3
      // if triple move player 2 to base 2, and 3 and home run
      // if home base move player 2 to base 2,3 and home run
      const player2 = document.getElementById('player2')
      //player2 move to base2 57px
        gsap.to(player2, {
          opacity: 1,
          top:'30%',
          left : '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 1,
        })
      if(this.runnerAdvance >= 2){//move player2 to base 3
        gsap.to(player2, {
          top: '58%',
          left: '5%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 2,
        })
      }
      if(this.runnerAdvance == 3){
        //move player2 to homebase,
        // if plater 4 safe/out- move to home left
        // if player 3 sage/out - move to homerun
        gsap.to(player2, {
          top: '80%',
          left: '20%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 3,
          onComplete: done
        })
      }
      if(this.runnerAdvance >= 4){//move player2 to homebase
        gsap.to(player2, {
          top: '80%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 3,
          onComplete: done
        })

      }
    },
    onEnterPlayer3(done) {
      // location base 2
      // if single move player 3 to base 3
      // if double move player 3 to base 3 and homebase
      // if triple move player 3 to base 3 and homebase
      // if home base move player 3 to base 3 and homebase
      const player3 = document.getElementById('player3')
      //player3 move to base3
      gsap.to(player3, {
        opacity: 1,
        top: '58%',
        left: '5%',
        transform: 'translate(0%,0)',
        duration: 0.5,
        delay: 1,
      })

      if(this.runnerAdvance === 2 || this.runnerAdvance === 3){ // move to beside homebase for double and triple
        // if player player 4 safe/out- move to homerun
        gsap.to(player3, {
          top: '80%',
          left: '28%',
          duration: 0.5,
          transform: 'translate(0%,0)',
          delay: 2,
          onComplete: done
        })
      }
      if(this.runnerAdvance >= 4){ // move to homebase if home run
        gsap.to(player3, {
          top: '80%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 2,
          onComplete: done
        })
        this.homerunVal=true
      }

    },
    onEnterPlayer4(done) {
      // location base 3
      // if single move player 3 to homebase , show popup question safe or out
      // if double move player 3 to  homebase, show popup question safe or out, player 3 show next to homerun
      // if triple move player 3 to  homebase, show popup question safe or out, player 3 show next to homerun
      // if home base move player 3  homebase // no popup for score = score = number of player
      const player4 = document.getElementById('player4')
      //player4 move to homebase
      gsap.to(player4, {
        top: '80%',
        left: '51%',
        transform: 'translate(-50%,0)',
        duration: 0.5,
        delay: 1,
        onComplete: done
      })

    },
    player2Score() {
      if(this.runnerAdvance==3){
        const player2 = document.getElementById('player2')
        gsap.to(player2, {// home
          transform: 'translateX(30px)',
          opacity: 0,
          duration: 0.5,
          delay: 1,
        })
      }
    },
    player3Score() {
      const player2 = document.getElementById('player2')
      const player3 = document.getElementById('player3')
      if(this.runnerAdvance>=2){
        gsap.to(player3, {// hide
          transform: 'translateX(30px)',
          opacity: 0,
          duration: 0.5,
          delay: 1,
        })
      }
      if(this.runnerAdvance==3){
        gsap.to(player2, {//home
          top: '80%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 2,
          zIndex  : 9999
        })
      }
    },
    player4Score() {
      const player2 = document.getElementById('player2')
      const player3 = document.getElementById('player3')
      const player4 = document.getElementById('player4')
      gsap.to(player4, {// hide
        transform: 'translateX(30px)',
        opacity: 0,
        duration: 0.5,
        delay: 1,
      })
      if(this.runnerAdvance>=2){
        gsap.to(player3, {//home
          top: '80%',
          left: '51%',
          transform: 'translate(-50%,0)',
          duration: 0.5,
          delay: 2,
          zIndex  : 9999
        })
      }
      if(this.runnerAdvance==3){
        gsap.to(player2, {//left1 of home
            top: '80%',
            left: '28%',
            duration: 0.5,
            delay: 2,
        })
      }

    },
    setRunnerScore(score){
      if(score=='safe'){
        if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
        if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
      }
      const runnerScorePop = document.getElementById('runnerScorePop')
      runnerScorePop.style.opacity  = 0
      console.log("save score to db",score)
      this.team1Score = this.team1Score+1
      // save to db
      // hide homeRun player
      // hide button score
      //move 4.1 to homerun
      // move 4.2 to 4.1
      //show button scoree again
      //if single check if theres player 4
      // if double check of theres player 4 and 3
      // if triple check if theres player 4,3,2
      console.log("runnerAdvance",this.runnerAdvance,"didScore",this.didScore)
      if(this.didScore==0 && this.runnerAdvance==1){
        this.player4Score()
        this.runnerScore=false
      }
      if(this.didScore==0 && this.runnerAdvance>=2){
        this.player4Score()
        setTimeout(() => {
          runnerScorePop.style.opacity  = 1
        }, 2000)
      }
      if(this.didScore==1 && this.runnerAdvance>=2){
        this.player3Score()
        if(this.runnerAdvance==3){
          setTimeout(() => {
            runnerScorePop.style.opacity  = 1
          }, 2000)
        }else{
          this.runnerScore=false
        }
      }
      if(this.didScore==2 && this.runnerAdvance==3){
        this.player2Score()
        this.runnerScore=false
        // new pitch
      }
      this.didScore = this.didScore +1


    },
    onAfterEnter(el){

      setTimeout(function() {
        this.runnerScore=true
        console.log('done animation')
      }, 20000);
      this.runnerScore=true
    },
    batterTeamAnimation2(){
      //this.showPlayer1 = !this.showPlayer1

      const player1 = document.getElementById('player1')
      this.runnerAdvance = 3
        gsap.to(player1, {// move to base1
        opacity: 1,
        top: '80%',
        left: '51%',
        transform: 'translate(-50%,0)',
        duration: 0.5,
        delay: 1,
      })

    },
    async batterTeamAnimation(){
      let done = function(){ console.log('finish'); }
      this.onEnterPlayer1(done)
      this.onEnterPlayer2(done)
      this.onEnterPlayer3(done)
      this.onEnterPlayer4(done)
      const player1 = document.getElementById('player1')
      const player2 = document.getElementById('player2')
      const player3 = document.getElementById('player3')
      const player4 = document.getElementById('player4')
      if(this.runnerAdvance <= 3){

        setTimeout(() => {
          player4.style.zIndex  = 9999;
          this.runnerScore=true
        }, 4000)
      }else{
        setTimeout(() => {
          player1.style.opacity  = 0
          player2.style.opacity  = 0
          player3.style.opacity  = 0
          player4.style.opacity  = 0
        }, 5000)

      }

    },
    firstRunnerMove() {
      const el = document.getElementById('player1')
      let done = function(){ console.log('finish') }
      // location base 1
      // if single move player 2 to base 2
      // if double move player 2 to base 2 and base 3
      // if triple move player 2 to base 2, and 3 and home run
      // if home base move player 2 to base 2,3 and home run
      gsap.set(el, {
        top: '450px',
        left: '180px'
      })
      //player2 move to base2 57px
        gsap.to(el, {
          opacity: 1,
          top:'195px',
          left : '180px',
          duration: 0.5,
          delay: 1,
        })
      if(this.runnerAdvance >= 2){//move player2 to base 3
        gsap.to(el, {
          top: '336px',
          left: '33px',
          duration: 0.5,
          delay: 2,
        })
      }
      if(this.runnerAdvance == 3){
        //move player2 to homebase,
        // if plater 4 safe/out- move to home left
        // if player 3 sage/out - move to homerun
        gsap.to(el, {
          top: '450px',
          left: '57px',
          duration: 0.5,
          delay: 3,
          onComplete: done
        })
      }
      if(this.runnerAdvance >= 4){//move player2 to homebase
        gsap.to(el, {
          top: '450px',
          left: '180px',
          duration: 0.5,
          delay: 3,
          onComplete: done
        })
      }
    },
    ballFieledTo(fieldLocaction){
      // TODO
      // save data db
      console.log('save this to db',fieldLocaction)
      // hide ballFielded
      // show animation of runner
      // move all runner on next base automatically
      // if 3rdbase runner run to home run? -> player on homerrun(active) other low opacity, then show Out or Sage Choices
      // if safe, score +1, save score to db
      // asign next batter if none, show set batter button
      // set fieldersBtn=true
      this.ballFielded = false
      this.fieldersBtn = true
      this.batterTeamAnimation()
      //this.evalRunnerAdvance()
    },
    evalRunnerAdvance(){
      let count = this.runnerAdvance
      if (count == 1){
        if (this.playerThirdBase != null){
          if (confirm("Did " + this.playerThirdBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerSecondBase != null){
          this.playerThirdBase = this.playerSecondBase
        }
        if (this.playerFirstBase != null){
          this.playerSecondBase = this.playerFirstBase
        }
        if (this.playerBatter != null){
          this.playerFirstBase = this.playerBatter
        }
      } else
      if (count == 2){
        if (this.playerThirdBase != null){
          if (confirm("Did " + this.playerThirdBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerSecondBase != null){
          if (confirm("Did " + this.playerSecondBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerFirstBase != null){
          this.playerThirdBase = this.playerFirstBase
        }
        if (this.playerBatter != null){
          this.playerSecondBase = this.playerBatter
        }
      } else
      if (count == 3){
        if (this.playerThirdBase != null){
          if (confirm("Did " + this.playerThirdBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerSecondBase != null){
          if (confirm("Did " + this.playerSecondBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerFirstBase != null){
          if (confirm("Did " + this.playerFirstBase.name + " safe?") == true){
            if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
            if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
          }
        }
        if (this.playerBatter != null){
          this.playerThirdBase = this.playerBatter
        }
      }
    },
    evalHomeRun(){
      if (this.playerBatter != null){
        if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
        if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
      }
      if (this.playerFirstBase != null){
        if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
        if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
      }
      if (this.playerSecondBase != null){
        if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
        if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
      }
      if (this.playerThirdBase != null){
        if (this.playingTeam == 1) this.team1Score = this.team1Score + 1
        if (this.playingTeam == 2) this.team2Score = this.team2Score + 1
      }
      this.playerBatter = null;
      this.playerFirstBase = null;
      this.playerSecondBase = null;
      this.playerThirdBase = null;
    },
    evalBall(){
      this.ballCount = this.ballCount + 1;
      if (this.ballCount >= 4){
        this.outsCount = this.outsCount + 1;
      }
    },
    evalStrike(){
      this.strikeCount = this.strikeCount + 1;
      if (this.strikeCount >= 3){
        this.outsCount = this.outsCount + 1;
      }
    },
    changeTeam(){
      if (this.half == 'down'){
        this.inningCount = this.inningCount + 1
        this.half = 'up'
      } else {
        this.half = 'down'
      }
      if (this.inningCount == 1){
        this.inningTail = 'st'
      } else
      if (this.inningCount == 2){
        this.inningTail = 'nd'
      } else
      if (this.inningCount == 3){
        this.inningTail = 'rd'
      } else
      if (this.inningCount >= 4){
        this.inningTail = 'th'
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
        'bip-groundball-out-at-first',
        'bip-hgroundball-out-at-first',
        'bip-flyball-out',
        'bip-flyball-foul-out',
        'bip-flyball-infield-fly',
        'bip-flyball-sac-fly',
        'bip-linedrive-out',
        'bip-linedrive-foul-out',
        'bip-linedrive-sac-fly',
        'bip-bunt-out',
        'bip-bunt-pop-out',
        'bip-bunt-sac-out',
        'bip-popfly-out',
        'bip-popfly-foul-out',
        'bip-popfly-infield-fly',
        'bip-popfly-sac-fly',
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

      if (eventBalls.includes(eventType)){
        this.evalBall()
      } else
      if (eventStrikes.includes(eventType)){
        this.evalStrike()
      } else
      if (eventOuts1.includes(eventType)){
        this.outsCount = this.outsCount + 1
      } else
      if (eventOuts2.includes(eventType)){
        this.outsCount = this.outsCount + 2
      } else
      if (eventOuts3.includes(eventType)){
        this.outsCount = this.outsCount + 3
      } else
      if (eventHomeRuns.includes(eventType)){
        this.pitchDialog = false
        this.runnerAdvance = 4
        this.ballFielded=true
        this.fieldersBtn=false
        this.evalHomeRun()
      } else
      if (eventRunnerSafe1.includes(eventType)){
        //this.evalRunnerAdvance(1)
        this.pitchDialog = false
        this.runnerAdvance = 1
        this.ballFielded=true
        this.fieldersBtn=false
      } else
      if (eventRunnerSafe2.includes(eventType)){
        //this.evalRunnerAdvance(2)
        this.pitchDialog = false
        this.runnerAdvance = 2
        this.ballFielded=true
        this.fieldersBtn=false
      } else
      if (eventRunnerSafe3.includes(eventType)){
        // this.evalRunnerAdvance(3)
        this.pitchDialog = false
        this.runnerAdvance = 3
        this.ballFielded=true
        this.fieldersBtn=false
      }

      if (this.outsCount >= 3){
        this.changeTeam()
      }

      // if (checkHomeRun >= 0){
      //   this.pitchDialog = false
      //   this.showPlayer1 = !this.showPlayer1
      // }

      // TODO: EVENT EVALUATON HERE
      let eventDescription = data.text // <---- description that will be sent to Gemini AI
      // TODO: SUPPLY DATA FOR EVENT HERE
      const eventData = {
        gameId: this.gameId,
        leagueId: this.teamId,
        leagueName: this.teamName,
        homeTeam: (this.gameEventData.homeTeam)?this.gameEventData.homeTeam : '',
        awayTeam: (this.gameEventData.awayTeam)?this.gameEventData.awayTeam : '',
        inning: (this.gameEventData.inning)?this.gameEventData.inning : '1',
        half: (this.gameEventData.half)?this.gameEventData.half : '1',
        batterId: (this.gameEventData.batter !=undefined)?this.gameEventData.batter.playerId : '',
        batterNumber: (this.gameEventData.batter !=undefined)?this.gameEventData.batter.shirtNumber : '',
        batterName: (this.gameEventData.batter !=undefined)?(this.gameEventData.batter.firstName).charAt(0) +". "+this.gameEventData.batter.lastName : '',
        pitcherId: (this.gameEventData.pitcher !=undefined)?this.gameEventData.pitcher.playerId : '',
        pitcherNumber: (this.gameEventData.pitcher !=undefined)?this.gameEventData.pitcher.shirtNumber : '',
        pitcherName: (this.gameEventData.pitcher !=undefined)?(this.gameEventData.pitcher.firstName).charAt(0) +". "+this.gameEventData.pitcher.lastName : '',

        description: eventDescription,
        type: eventType,

        runnerFirstId: (this.gameEventData.runnerFirstBase !=undefined)?this.gameEventData.runnerFirstBase.playerId : '',
        runnerFirstNumber:(this.gameEventData.runnerFirstBase !=undefined)?this.gameEventData.runnerFirstBase.shirtNumber : '',
        runnerFirstName: (this.gameEventData.runnerFirstBase !=undefined)?(this.gameEventData.runnerFirstBase.firstName).charAt(0) +". "+this.gameEventData.runnerFirstBase.lastName : '',
        runnerSecondId: (this.gameEventData.runnerSecondBase !=undefined)?this.gameEventData.runnerSecondBase.playerId : '',
        runnerSecondNumber: (this.gameEventData.runnerSecondBase !=undefined)?this.gameEventData.runnerSecondBase.shirtNumber : '',
        runnerSecondName: (this.gameEventData.runnerSecondBase !=undefined)?(this.gameEventData.runnerSecondBase.firstName).charAt(0) +". "+this.gameEventData.runnerSecondBase.lastName : '',
        runnerThirdId: (this.gameEventData.runnerThirdBase !=undefined)?this.gameEventData.runnerThirdBase.playerId : '',
        runnerThirdNumber: (this.gameEventData.runnerThirdBase !=undefined)?this.gameEventData.runnerThirdBase.shirtNumber : '',
        runnerThirdName: (this.gameEventData.runnerThirdBase !=undefined)?(this.gameEventData.runnerThirdBase.firstName).charAt(0) +". "+this.gameEventData.runnerThirdBase.lastName : '',

        fielderLFId: (this.gameEventData.leftField !=undefined)?this.gameEventData.leftField.playerId : '',
        fielderLFNumber: (this.gameEventData.leftField !=undefined)?this.gameEventData.leftField.shirtNumber : '',
        fielderLFName: (this.gameEventData.leftField !=undefined)?(this.gameEventData.leftField.firstName).charAt(0) +". "+this.gameEventData.leftField.lastName : '',
        fielderCFId: (this.gameEventData.centerField !=undefined)?this.gameEventData.centerField.playerId : '',
        fielderCFNumber: (this.gameEventData.centerField !=undefined)?this.gameEventData.centerField.shirtNumber : '',
        fielderCFName: (this.gameEventData.centerField !=undefined)?(this.gameEventData.centerField.firstName).charAt(0) +". "+this.gameEventData.centerField.lastName : '',
        fielderRFId: (this.gameEventData.rightField !=undefined)?this.gameEventData.rightField.playerId : '',
        fielderRFNumber: (this.gameEventData.rightField !=undefined)?this.gameEventData.rightField.shirtNumber : '',
        fielderRFName: (this.gameEventData.rightField !=undefined)?(this.gameEventData.rightField.firstName).charAt(0) +". "+this.gameEventData.rightField.lastName : '',
        fielderFirstId: (this.gameEventData.firstBase !=undefined)?this.gameEventData.firstBase.playerId : '',
        fielderFirstNumber: (this.gameEventData.firstBase !=undefined)?this.gameEventData.firstBase.shirtNumber : '',
        fielderFirstName: (this.gameEventData.firstBase !=undefined)?(this.gameEventData.firstBase.firstName).charAt(0) +". "+this.gameEventData.firstBase.lastName : '',
        fielderSecondId: (this.gameEventData.secondBase !=undefined)?this.gameEventData.secondBase.playerId : '',
        fielderSecondNumber: (this.gameEventData.secondBase !=undefined)?this.gameEventData.secondBase.shirtNumber : '',
        fielderSecondName: (this.gameEventData.secondBase !=undefined)?(this.gameEventData.secondBase.firstName).charAt(0) +". "+this.gameEventData.secondBase.lastName : '',
        fielderThirdId: (this.gameEventData.thirdBase !=undefined)?this.gameEventData.thirdBase.playerId : '',
        fielderThirdNumber: (this.gameEventData.thirdBase !=undefined)?this.gameEventData.thirdBase.shirtNumber : '',
        fielderThirdName: (this.gameEventData.thirdBase !=undefined)?(this.gameEventData.thirdBase.firstName).charAt(0) +". "+this.gameEventData.thirdBase.lastName : '',
        fielderSSId: (this.gameEventData.shortStop !=undefined)?this.gameEventData.shortStop.playerId : '',
        fielderSSNumber: (this.gameEventData.shortStop !=undefined)?this.gameEventData.shortStop.shirtNumber : '',
        fielderSSName: (this.gameEventData.shortStop !=undefined)?(this.gameEventData.shortStop.firstName).charAt(0) +". "+this.gameEventData.shortStop.lastName : '',
        catcherSSId: (this.gameEventData.catcher !=undefined)?this.gameEventData.catcher.playerId : '',
        catcherSSNumber: (this.gameEventData.catcher !=undefined)?this.gameEventData.catcher.shirtNumber : '',
        catcherSSName: (this.gameEventData.catcher !=undefined)?(this.gameEventData.catcher.firstName).charAt(0) +". "+this.gameEventData.catcher.lastName : '',
        outs: (this.gameEventData.outs)?this.gameEventData.outs : '0',
        status: 'active',
        pitchActionId: data.id,
        pitchActionParent: data.parent,
        pitchActionName: data.name,
        pitchActionText: data.text,
        pitchActionIcon: data.icon,
        ballCount:this.ballCount,
        strikeCount:this.strikeCount,
        outsCount:this.outsCount,
        pitchCount: this.pitchCount,
        team1Score: this.team1Score,
        team2Score: this.team2Score,
      }
      console.log(eventData)
      this.saveGameEvent(eventData)

      this.pitchSubmitAction = true
      this.progress = 0.00

      let interval = setInterval(() => {
        if (this.progress >= 1) {
          clearInterval(interval)
          return
        }

        this.progress = this.progress + 0.2
      }, 200)
      this.progress = 0.00
      this.pitchCount = this.pitchCount +1


    },
    async saveGameEvent(data){
      const postData = {
        gameId: data.gameId || '',
        leagueId: data.leagueId || '',
        leagueName: data.leagueName || '',
        homeTeam: data.homeTeam || '',
        awayTeam: data.awayTeam || '',
        inning: data.inning || '',
        half: data.half || '',
        batterId: data.batterId || '',
        batterNumber: data.batterNumber || '',
        batterName: data.batterName || '',
        pitcherId: data.pitcherId || '',
        pitcherNumber: data.pitcherNumber || '',
        pitcherName: data.pitcherName || '',
        description: data.description || '',
        type: data.type || '',
        runnerFirstId: data.runnerFirstId || '',
        runnerFirstNumber: data.runnerFirstNumber || '',
        runnerFirstName: data.runnerFirstName || '',
        runnerSecondId: data.runnerSecondId || '',
        runnerSecondNumber: data.runnerSecondNumber || '',
        runnerSecondName: data.runnerSecondName || '',
        runnerThirdId: data.runnerThirdId || '',
        runnerThirdNumber: data.runnerThirdNumber || '',
        runnerThirdName: data.runnerThirdName || '',
        fielderLFId: data.fielderLFId || '',
        fielderLFNumber: data.fielderLFNumber || '',
        fielderLFName: data.fielderLFName || '',
        fielderCFId: data.fielderCFId || '',
        fielderCFNumber: data.fielderCFNumber || '',
        fielderCFName: data.fielderCFName || '',
        fielderRFId: data.fielderRFId || '',
        fielderRFNumber: data.fielderRFNumber || '',
        fielderRFName: data.fielderRFName || '',
        fielderFirstId: data.fielderFirstId || '',
        fielderFirstNumber: data.fielderFirstNumber || '',
        fielderFirstName: data.fielderFirstName || '',
        fielderSecondId: data.fielderSecondId || '',
        fielderSecondNumber: data.fielderSecondNumber || '',
        fielderSecondName: data.fielderSecondName || '',
        fielderThirdId: data.fielderThirdId || '',
        fielderThirdNumber: data.fielderThirdNumber || '',
        fielderThirdName: data.fielderThirdName || '',
        fielderSSId: data.fielderSSId || '',
        fielderSSNumber: data.fielderSSNumber || '',
        fielderSSName: data.fielderSSName || '',
        catcherSSId: data.catcherSSId || '',
        catcherSSNumber: data.catcherSSNumber || '',
        catcherSSName: data.catcherSSName || '',
        outs: data.outs || 0,
        status: data.status || '',
        pitchActionId: data.pitchActionId,
        pitchActionParent: data.pitchActionParent,
        pitchActionName: data.pitchActionName,
        pitchActionText: data.pitchActionText,
        pitchActionIcon: data.pitchActionIcon,
        ballCount:data.ballCount,
        strikeCount:data.strikeCount,
        outsCount:data.outsCount,
        pitchCount: data.pitchCount,
        team1Score: data.team1Score,
        team2Score: data.team2Score,
      }
      await this.gameEventDataStore.addRecord(postData)
      .then(response => {
        console.log("game event response:", response)
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
      if(this.gameEventData.batter === undefined){
        this.setPlayerDialog('batter')
      }else{
        //this.showPlayer1 = !this.showPlayer1
        this.open("right")
      }
    },
    setPlayerDialog(pPosition) {
      // todo: if batter add field for 1st,2nd etch
      this.setPlayersDialog = true
      this.playerPositionText = this.$t(pPosition)
      this.playerPosition = pPosition
    },
    setPlayersPosition(pPosition,pValue,nextAction) {
      if(pPosition=="batter"){
        let NewbatterRank = this.batterCount+1 //  set this to 0 after every round
        pValue.batterRank = NewbatterRank
      }
      this.batterList.push(pValue)
      this.updateGameData(this.gameId,"setPlayer", pValue,pPosition)
      this.gameEventData[pPosition]=pValue
      this.createNewPlayer=false
      if(nextAction=="pitch"){
        this.open("right")
      }
      //console.log(this.gameEventData)
      this.setPlayersDialog = false
    },
    setFirstTeamBatter(teamPlayer){
      //1=current team, 2 opponent team first
      this.updateGameData(this.gameId,"setPlayer", teamPlayer,'firstTeamBatter')
      //this.firstBatter = teamPlayer
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
    async getTeamPlayers(teamId){
      if(teamId){
        await this.playerData.getRecordsByTeamId(teamId)
        .then(async (response) => {
          console.log("response",response)
          if (response){
              this.teamPlayers = response
              response.forEach((e) => {
                //let pname = e.firstName.charAt(0)+". "+e.lastName
                if(e.gameId){
                  this.opponentList.push({playerId:e.id,firstName:e.firstName,lastName:e.lastName,shirtNumber:e.shirtNumber,playerPosition:e.playerPosition})
                }else{

                  this.bench.push({playerId:e.id,firstName:e.firstName,lastName:e.lastName,shirtNumber:e.shirtNumber,playerPosition:e.playerPosition})
                }
              })
              //console.log("bench",this.bench)
          }
        })
        .catch((error) => {
          console.error(error)
        })
      }
    },
    async getGameEventDetails(gameId){
      await this.gameDataStore.getRecord(gameId)
      .then(async (response) => {
        if (response){
            this.gameEventData = response
            console.log("getGameEventDetails",response)
            this.teamId = response.leagueId
            this.teamName = response.leagueName
            if(this.gameEventData.batter != undefined){
              this.batterCount = this.gameEventData.batter.batterRank
            }else{
              this.batterCount = 1
            }
            this.ballCount = response.ballCount
            this.strikeCount = response.strikeCount
            this.outsCount = response.outsCount
            this.getTeamPlayers(response.leagueId)
            if(response.firstTeamBatter===undefined){
              this.whosbattingFirst = true
            }
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
            if(this.playerPosition=="batter"){
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
    async updateGameData(gameId,action, data,fieldName){
      let entityData
      if(action=="setPlayer"){
        entityData = {
          id         : gameId,
          updates: {
            [fieldName]   : data,
          }
        }
      }else{
        entityData = {
          id         : gameId,
          updates: {
            data         : data,
          }
        }
      }
      console.log(entityData)
      await this.gameDataStore.updateRecord(entityData)
        .then(response => {
          this.loading = false
          console.log(response)

        }).catch(error => {
          this.loading = false
          console.log(error)
          this.q.notify({
              type: 'negative',
              position:'top',
              message: error
          })
        })
    },
    getLastArray(arr) {
      if (!Array.isArray(arr)) {
        return undefined;
      }
      return arr[arr.length - 1];
    },
    getTextRank(x){
      let text = ''
      switch (x) {
        case 2:
          text = "2nd";
          break;
        case 3:
          text = "3rd";
          break;
        case x>=4:
          text = x+"th";
          break;
        default:
          text = "1st";
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
    padding: 50px 20px 30px;
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
    color:#f90a0a;
    font-size:23px;
    font-weight: bold;
    padding:5px 5px;
    min-height: 20px !important;
    opacity: 0.7;
    margin-top: 15px;
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
    color: #471818;
    font-weight: bold;
    font-size: 15px;
    width:100%;
    text-align:center;
  }
  .currentPlayer{
    width: 60px;
    height: 50px;
    background-color: #0070c8;
    color: white;
    position: absolute;
    margin: auto auto auto;
    text-align: center;
    font-size: 12px;
    font-weight: bold;
    padding-top: 6px;
    border: solid 1px white;
    border-radius: 5px;
  }
  .p1{
    top: 80%;
    left: 51%;
    transform: translate(-50%,30%)
  }
  .p2{
    top: 58%;
    left: 83%;
  }
  .p3{
    top: 30%;
    left: 51%;
    transform: translate(-50%, 30%);
  }
  .p4{
    top: 58%;
    left: 5%;
  }
  .ballFieldpop{
    background-color: #0b0b0c;
    opacity: 0.8;
    height:600px;
    /* padding-top: 57px; */
  }
  .runnerScorePop{
    background-color: #0b0b0c;
    opacity: 0.8;
    height:600px;
  }
  .catchermitt{
    height: 80px;
    max-width: 90px;
    margin:10px;
    text-align: center;
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
  .ballFieldpopBox .text-subtitle2{
    width: 100%;
  }
  .fieldRunner{
    background-color: red;
  }
</style>
