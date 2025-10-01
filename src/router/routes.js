const routes = [
  {
    path: '/',
    component: () => import('layouts/NonAuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/LoginUser.vue'), meta: { htitle: 'LOGIN' } },
      { path: 'signup', component: () => import('pages/SignUp.vue'), meta: { htitle: 'Sign Up' } },
      { path: 'createTeam', component: () => import('pages/CreateTeam.vue'), meta: { htitle: 'create team' } },
      { path: 'createEvent/:id', component: () => import('pages/CreateEvent.vue'), meta: { htitle: 'create event' } },
      { path: 'createPlayer/:teamId/:rpage', component: () => import('pages/CreatePlayer.vue'), meta: { htitle: 'create player' } },
      { path: 'gameinfo/:id', component: () => import('pages/GameInfo.vue'), meta: { htitle: 'Game Info' } },
    ]
  },
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'dashboard', component: () => import('pages/IndexPage.vue'), meta: { tab: 'Home' } },
    ]
  },
  {
    path: '',
    component: () => import('layouts/BaseballFieldLayout.vue'),
    children: [
      { path: 'baseballField/:id', component: () => import('pages/BaseBallField.vue'), meta: { tab: 'score' } },
      { path: 'myteam', component: () => import('pages/MyTeam.vue'), meta: { tab: 'myteam' } },
      { path: 'opponent', component: () => import('pages/OpponentTeam.vue'), meta: { tab: 'opponent' } },
      { path: 'gameEvents', component: () => import('pages/GameEventList.vue'), meta: { tab: 'plays' } },
      { path: 'plays', component: () => import('pages/Plays.vue'), meta: { tab: 'plays' } },
      { path: 'stats', component: () => import('pages/Statistics.vue'), meta: { tab: 'stats' } },
      { path: 'testbfield/:id', component: () => import('pages/testbfield.vue'), meta: { tab: 'score' } },
    ]
  },
  {
    path: '',
    component: () => import('layouts/blankLayout.vue'),
    children: [
      { path: 'testbfield1', component: () => import('pages/testbfield.vue'), meta: { tab: 'score' } },
    ]
  },
  {
    path: '',
    component: () => import('layouts/PageLayout.vue'),
    children: [
      { path: 'teamPortal/:id', component: () => import('pages/teamPortal.vue'), meta: { htitle: 'addEvent' } },
      { path: 'events', component: () => import('src/pages/EventList.vue'), meta: { tab: 'events' } },
      { path: 'messages', component: () => import('src/pages/MessageList.vue'), meta: { tab: 'messages' } },
      { path: 'account', component: () => import('src/pages/AccountPage.vue'), meta: { tab: 'account' } },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
