<template>
  <div>
    <div class="row q-pa-md ">
      <div class="col-1"> &nbsp;</div>
      <div class="col-10 text-center">
        <div style="font-size: 25px;font-weight: bold; text-align: center;margin: 10px;">{{ $t('stats') }}</div></div>
      <div class="col-1 text-right float-right">
        <q-btn class="text-blue" style="font-size: 18px;" color="primary" flat dense icon="more_vert" />
      </div>
    </div>
    <div class="row stats" style="width: 100%;">
        <q-tabs
          v-model="model"
          dense
          flat
          color="gray"
          active-color="primary"
          indicator-color="primary"
          style="width: 100%; text-align: justify;"
        >
          <q-tab name="team1" style="font-size: 25px;" label="AG Team" />
          <q-tab name="team2" style="font-size: 25px;" label="TBD Mar 27, 2025" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="model" animated>
          <q-tab-panel name="team1" style="width: 100%;">
            <div  class="col-12 text-center" style="padding: 10px 35px;">
              <q-btn-toggle
                v-model="gateclass"
                class="my-custom-toggle"
                no-caps
                rounded
                spread
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                  {label: $t('batting'), value: 'batting'},
                  {label: $t('pitching'), value: 'pitching'},
                  {label: $t('fielding'), value: 'fielding'}
                ]"
              />
            </div>
            <div v-show="gateclass=='batting'">
              <q-tabs
                v-model="gametype"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="standard" :label="$t('standard')"/>
                <q-tab name="advance" :label="$t('advance')"/>
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="gametype" animated>
                <q-tab-panel name="standard">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="advance">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>

              </q-tab-panels>
            </div>
            <div v-show="gateclass=='pitching'">
              <q-tabs
                v-model="gametype2"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="standard" :label="$t('standard')"/>
                <q-tab name="advance" :label="$t('advance')"/>
                <q-tab name="breakdown" :label="$t('breakdown')" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="gametype2" animated>
                <q-tab-panel name="standard">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="advance">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>
                <q-tab-panel name="breakdown">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
            <div v-show="gateclass=='fielding'">
              <q-tabs
                v-model="gametype3"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab name="standard" :label="$t('standard')"/>
                <q-tab name="catching" :label="$t('catching')"/>
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="gametype3" animated>
                <q-tab-panel name="standard">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>

                <q-tab-panel name="catching">
                  <div class="row">
                    <q-table
                      class="standard-batting-team"
                      flat bordered
                      :rows="rows"
                      :columns="columns"
                      row-key="name"
                      virtual-scroll
                      hide-bottom
                    />
                  </div>
                  <div class="row q-pa-md">
                    <div class="col-5">
                      <span style="font-weight: bold;">1B</span> - Singles<br>
                      <span style="font-weight: bold;">2B</span> - Doubles<br>
                      <span style="font-weight: bold;">3B</span> - Triples<br>
                      <span style="font-weight: bold;">AB</span> - At bats<br>
                      <span style="font-weight: bold;">BB</span> - Base on balls (walks)<br>
                      <span style="font-weight: bold;">CS</span> - Caught stealing<br>
                      <span style="font-weight: bold;">FC</span> - Hit into fielder's choice<br>
                      <span style="font-weight: bold;">H</span> - Hits<br>
                      <span style="font-weight: bold;">HBP</span> - Hit by pitch<br>
                      <span style="font-weight: bold;">HR</span> - Home runs<br>
                    </div>
                    <div class="col-5">
                      <span style="font-weight: bold;">K-L</span> - Strikeouts looking<br>
                      <span style="font-weight: bold;">PA</span> - Plate appearances<br>
                      <span style="font-weight: bold;">PIK</span> - Picked off<br>
                      <span style="font-weight: bold;">R</span> - Runs scored<br>
                      <span style="font-weight: bold;">RBI</span> - Runs batted in<br>
                      <span style="font-weight: bold;">ROE</span> - Reached on error<br>
                      <span style="font-weight: bold;">SAC</span> - Sacrifice hits & bunts<br>
                      <span style="font-weight: bold;">SB</span> - Stolen bases<br>
                      <span style="font-weight: bold;">SF</span> - Sacrifice flies<br>
                      <span style="font-weight: bold;">SO</span> - Strikeouts<br>
                    </div>
                  </div>
                </q-tab-panel>

              </q-tab-panels>
            </div>
          </q-tab-panel>

          <q-tab-panel name="team2">
            <div class="text-h6">Alarms</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
    </div>
  </div>


</template>

<!-- 0BBINN - Zero-walk innings
123INN - 1-2-3 Innings
1ST2OUT - Innings with 1st 2 batters out
<13 - Innings of 13 pitches or fewer
<3 - Batters on or out in three pitches or less
AO - Air outs
BA/RISP - Opponent batting average with runners in scoring position
BABIP - Opponent batting average on balls in play
BB/INN - Walks per inning
BBS - Walks that score
BF - Total batters faced
FB - Total batted balls that are fly balls
FPS% - First pitch strike percentage
FPSH% - % of FPS at-bats that result in a hit
FPSO% - % of FPS at-bats that result in an out
FPSW% - % of FPS at-bats that

A - Assists
DP - Double Plays
E - Errors
FPCT - Fielding Percentage

GO - Ground outs
HHB - Number of batted balls that are line drives or hard ground balls
HR - Home runs allowed
IP - Innings Pitched
K/BB - Strikeouts per walk
LBFP# - Pitch count number of first pitch to last batter faced
LD - Line drives
LOBB - Leadoff walk (1st batter of inning)
LOBB S - Leadoff walk that scored (1st batter of inning)
LOO - Leadoff out (1st batter of inning)
P/BF - Pitches per batter faced
P/IP - Pitches per inning
S% - Strike percentage
SM - Opposing batter swings-and-misses
SW - Total pitches batters swung at
WHB - Number of batted balls weakly hit (fly balls and ground balls)

#P - Total pitches
CB - Number of pitches thrown as Curveballs
CBS - Number of Curveballs thrown for strikes
CBS% - Percentage of Curveballs thrown for strikes
CBSM% - Percentage of Curveballs swung at and missed
CBSW% - Percentage of Curveballs swung at
CH - Number of pitches thrown as Changeups
CHS - Number of Changeups thrown for strikes
CHS% - Percentage of Changeups thrown for strikes
CHSM% - Percentage of Changeups swung at and missed
CHSW% - Percentage of Changeups swung at
CT - Number of pitches thrown as Cutters
CTS - Number of Cutters thrown

FB - Number of pitches thrown as Fastballs
FBS - Number of Fastballs thrown for strikes
FBS% - Percentage of Fastballs thrown for strikes
FBSM% - Percentage of Fastballs swung at and missed
FBSW% - Percentage of Fastballs swung at
OS - Number of pitches thrown Offspeed (Curveball, Screwball, Changeup)
OSS - Number of pitches thrown Offspeed for strikes
OSS% - Percentage of Offspeed pitches thrown as strikes
OSSM% - Percentage of Offspeed pitches swung at and missed
OSSW% - Percentage of Offspeed pitches swung at
SL - Number of pitches thrown as Sliders
SLS - Number of Sliders thrown for strikes

CI - Batter advances on catcher's interference
CS - Runners caught stealing
CS% - Runners caught stealing percentage
INN - Innings caught

PO - Putouts
TC - Total Chances
TP - Triple Plays

PB - Passed balls allowed
PIK - Runners picked off
SB - Stolen bases allowed
SBATT - Stolen base attempts


#P - Total pitches
BAA - Opponent batting average
BB - Base on balls (walks)
BF - Total batters faced
BK - Balks
BS - Blown saves
CS - Runners caught stealing
ER - Earned runs allowed
GS - Games started as the pitcher
H - Hits allowed
HBP - Hit batters
IP - Innings Pitched

K-L - Strikeouts Looking
L - Losses
LOB - Runners left on base
PIK - Runners picked off
R - Runs allowed
SB - Stolen bases allowed
SO - Strikeouts
SV - Saves
TB - Total balls
TS - Total strikes
W - Wins
WP - Wild pitches

2OUTRBI - 2-out RBI
2S+3 - Plate appearances in which batter sees 3+ pitches after 2 strikes
6+ - Plate appearances with 6+ pitches
AB - At bats
BA/RISP - Batting average with runners in scoring position
BABIP - Batting average on balls in play
CI - Batter advances on catcher’s interference
FB - Fly ball
GB - Ground ball
GIDP - Hit into double play

HHB - Hard hit balls: Total line drives and hard ground balls
LD - Line drive
LOB - Runners left on base when batter is out
PA - Plate appearances
PS - Pitches seen
PS/PA - Pitches seen per plate appearance
QAB - Quality at bats (any one of: 3 pitches after 2 strikes, 6+ pitch ABs, XBH, HHB, BB, SAC Bunt, SAC Fly)
TB - Total bases
XBH - Extra-base hits

CTS - Number of Cutters thrown for strikes
CTS% - Percentage of Cutters thrown for strikes
CTSM% - Percentage of Cutters swung at and missed
CTSW% - Percentage of Cutters swung at

SLS% - Percentage of Sliders thrown for strikes
SLSM% - Percentage of Sliders swung at and missed
SLSW% - Percentage of Sliders swung at  -->

<script>
const columns = [
  {
    name: 'Player',
    required: true,
    align: 'left',
    field: row => row.name,
    format: val => `${val}`,
    sortable: true
  },
  { name: 'PA', align: 'center', label: 'PA', field: 'pa' },
  { name: 'AB', align: 'center', label: 'AB', field: 'ab'},
  { name: 'H', align: 'center', label: 'H', field: 'h', sortable: true },
  { name: '1B', align: 'center', label: '1B', field: 'b1'},
  { name: '2B', align: 'center', label: '2B', field: 'b2'},
  { name: '3B', align: 'center', label: '3B', field: 'b3'},
  { name: 'HR', align: 'center', label: 'HR', field: 'hr'},
  { name: 'RBI', align: 'center', label: 'RBI', field: 'rbi'},
  { name: 'R', align: 'center', label: 'R', field: 'r'},
  { name: 'BB', align: 'center', label: 'BB', field: 'bb' },
  { name: 'SO', align: 'center', label: 'SO', field: 'so' },
  { name: 'K-L', align: 'center', label: 'K-L', field: 'kl' },
  { name: 'HBP', align: 'center', label: 'HBP', field: 'hbp' },
  { name: 'SAC', align: 'center', label: 'SAC', field: 'sac' },
  { name: 'SF', align: 'center', label: 'SF', field: 'sf' },
  { name: 'ROE', align: 'center', label: 'ROE', field: 'roe' },
  { name: 'FC', align: 'center', label: 'FC', field: 'fc' },
  { name: 'SB', align: 'center', label: 'SB', field: 'sb' },
  { name: 'PIK', align: 'center', label: 'PIK', field: 'pik' },
]
const rows = [
  {
    name: 'K. Ab, #01',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1

  },
  {
    name: 'J. Black #18',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },
  {
    name: 'N. Smith, #21',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },
  {
    name: 'G. Lopez, 04',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },
  {
    name: 'L. Cruz, #13',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },
  {
    name: 'J. Rodriguez, #40',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },
  {
    name: 'M. Rivera, #29',
    pa: 18,
    ab: 8,
    h: 24,
    b1: 14,
    b2: 27,
    b3: 12,
    hr: 18,
    rbi:27,
    r:36,
    bb:25,
    so:15,
    kl:21,
    hbp:0,
    sac:12,
    sf:0,
    roe:0,
    fc:1,
    sb:0,
    pik:1
  },

]
import { defineComponent,ref  } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'IndexPage',
  setup() {
            let { locale} = useI18n({
                useScope: 'global'
              })
            const router = useRoute()

    return {
            columns,
            rows,
            locale,router,
            model: ref('team1'),
            gateclass:ref('batting'),
            gateclass2:ref('batting'),
            gametype: ref('standard'),
            gametype2: ref('standard'),
            gametype3: ref('standard'),
            pagination: {
              rowsPerPage: 0
            }
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
  .stats .q-tab-panel {
    padding: 0px;
  }
  .standard-batting-team{
    max-width: 600px
  }
  .standard-batting-team
  td:first-child{
    background-color: #ffffff;
  }
 .standard-batting-team
  tr th{
    position: sticky;
    z-index: 2;
    background: #daeef7
  }
  .standard-batting-team
  thead tr:last-child th{
    top: 48px;
    z-index: 3;
  }
  .standard-batting-team
  thead tr:first-child th{
    top: 0;
    z-index: 1;
  }
  .standard-batting-team
  tr:first-child th:first-child{
    /* highest z-index */
    z-index: 3
  }
  .standard-batting-team
  td:first-child{
    z-index: 1
  }
  .standard-batting-team
  td:first-child, th:first-child{
    position: sticky;
    left: 0
  }
  tbody{
    scroll-margin-top: 48px
  }
</style>
