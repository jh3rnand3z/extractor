/*
 Configuration seed
*/
fun.conf = {
    account: 'account',
    context: 'context', // dashboard context "organization"

    // CLX conf stuff
    clxUrl: 'http://201.149.49.181:9027',
    clxPartner: 'Preway',
    clxCulture: 'en-US',
    clxAppId: '26',
    clxTKN: '/r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8=',
    clxUserId: '1517',

    html: '/static/html',
    domain: 'iofun.io',

    urlRoot: '/api/',
    sw:'',
    hw:'',
    sip:'',

    uuidRecord: 'record_uuid',
    uuidBilling: 'billing_uuid',
    uuidCarrier: 'carrier_uuid',
    uuidCampaign: 'campaign_uuid',
    uuidContact: 'contact_uuid',
    uuidDirectory: 'directory_uuid',
    uuidSound: 'sound_uuid',

    uuidPayment: 'payment_uuid',

    uuidGateway: 'gateway_uuid',
    uuidPhoneNumber: 'phone_number_uuid',

    lapse: 'lapse',

    startTime: 'start_time',
    endTime: 'end_time',

    first: 'first',
    last: 'last',

    next: 'next',
    previous: 'previous',

    pageNumber: 'page_number',
    pageSize: 'page_size',
    pageSmall: 8,
    pageMedium: 13,
    pageBig: 21
};

/*
 Configuration SIP WS
*/
fun.conf.daemons = {
    ws_server: 'ws://' + fun.conf.domain,
    ws_port: '10080',
    stun_port: '19302',
    turn_port: '',
    stun_server: 'stun.' + fun.conf.domain,
    turn_server: 'turn.' + fun.conf.domain,
    sip_server: 'sip.' + fun.conf.domain
};

/*
 Common timeouts
*/
fun.conf.timeouts = {
    big: 60000,
    medium: 15000,
    small: 5000
};

/*
 Current JsSIP configuration
*/
fun.conf.sip = {
    registrar_server: fun.conf.daemons.sip_server,
    ws_servers: fun.utils.format('%s%s', fun.conf.daemons.ws_server, fun.conf.daemons.ws_port),

    stun_servers: fun.utils.format('%s:%s', fun.conf.daemons.stun_server, fun.conf.daemons.stun_port),
    turn_servers: fun.utils.format('%s:%s', fun.conf.daemons.turn_server, fun.conf.daemons.turn_port),

    register: true,
    register_expires: '600',

    connection_recovery_min_interval: '3',
    connection_recovery_max_interval: '30',

    uri: fun.utils.format('sip:%s@%s', fun.conf.account, fun.conf.domain),
    password: '',

    display_name: 'Juan Monk',
    authorization_user: '',

    no_answer_timeout: '60',
    trace_sip: false,

    use_preloaded_route: false,

    hack_via_tcp: true,
    hacK_ip_in_contact: false
};

/*
 System urls
*/
fun.conf.urls = {
    login: '/login/',
    logout: '/logout/',

    register: '/cuallix/register/',
    assign: '/cuallix/assign/',
    funds: '/cuallix/funds/',
    settle: '/cuallix/settle/',

    payment: fun.utils.format('/cuallix/payments/%s', fun.conf.uuidPayment),
    payments: '/cuallix/payments/',

    user: fun.utils.format('/users/%s', fun.conf.account),
    users: '/users/',

    org: fun.utils.format('/orgs/%s', fun.conf.account),
    orgs: '/orgs/',

    record: fun.utils.format('/records/%s', fun.conf.uuidRecord),
    records: '/records/',

    billing: fun.utils.format('/billings/%s', fun.conf.uuidBilling),
    billings: '/billings/',
    
    summary: '/records/summary',
    summaries: '/records/summaries',

    summaryStart: fun.utils.format('/records/summary/start/%s', fun.conf.startTime),
    summaryStartEnd: fun.utils.format('/records/summary/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    summariesStart: fun.utils.format('/records/summaries/start/%s', fun.conf.startTime),
    summariesStartEnd: fun.utils.format('/records/summaries/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    lapseSummary: fun.utils.format('/records/summary/%s', fun.conf.lapse),
    lapseSummaries: fun.utils.format('/records/summaries/%s', fun.conf.lapse),

    lapseSummaryStart: fun.utils.format('/records/summary/%s/start/%s', fun.conf.lapse, fun.conf.startTime),
    lapseSummaryStartEnd: fun.utils.format('/records/summary/%s/start/%s/end/%s', fun.conf.lapse, fun.conf.startTime, fun.conf.endTime),

    lapseSummariesStart: fun.utils.format('/records/summaries/%s/start/%s', fun.conf.lapse, fun.conf.startTime),
    lapseSummariesStartEnd: fun.utils.format('/records/summaries/%s/start/%s/end/%s', fun.conf.lapse, fun.conf.startTime, fun.conf.endTime),

    recordsStart: fun.utils.format('/records/start/%s', fun.conf.startTime),
    recordsStartEnd: fun.utils.format('/records/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    paymentsStart: fun.utils.format('/cuallix/payments/start/%s', fun.conf.startTime),
    paymentsStartEnd: fun.utils.format('/cuallix/payments/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    billingsRecord: fun.utils.format('/billings/records/%s', fun.conf.uuidRecord),
    billingsRecords: '/billings/records/',
    
    billingsStart: fun.utils.format('/billings/start/%s', fun.conf.startTime),
    billingsStartEnd: fun.utils.format('/billings/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    billingsRecordsStart: fun.utils.format('/billings/records/start/%s', fun.conf.startTime),
    billingsRecordsStartEnd: fun.utils.format('/billings/records/start/%s/end/%s', fun.conf.startTime, fun.conf.endTime),

    carrier: fun.utils.format('/carriers/%s', fun.conf.uuidCarrier),
    carriers: '/carriers/',

    contact: fun.utils.format('/contacts/%s', fun.conf.uuidContact),
    contacts: '/contacts/',

    directory: fun.utils.format('/directories/%s', fun.conf.uuidDirectory),
    directories: '/directories/',

    campaign: fun.utils.format('/campaigns/%s', fun.conf.uuidCampaign),
    campaigns: '/campaigns/',

    gateway: fun.utils.format('/gateways/%s', fun.conf.uuidGateway),
    gateways: '/gateways/',

    phoneNumber: fun.utils.format('/phonenumbers/%s', fun.conf.uuidPhoneNumber),
    phoneNumbers: '/phonenumbers/',


    sounds: fun.utils.format('/sounds/')

    /*sounds, recordings*/

};

/*
 HTML templates
*/
fun.conf.templates = {
    navbar: fun.utils.format('%s/navbar.html', fun.conf.html),
    
    navLanding: fun.utils.format('%s/navLanding.html', fun.conf.html),
    navDashboard: fun.utils.format('%s/navDashboard.html', fun.conf.html),
    
    navAdmin: fun.utils.format('%s/navAdmin.html', fun.conf.html), // ultimate junk!

    subheader: fun.utils.format('%s/subheader.html', fun.conf.html),
    headNav: fun.utils.format('%s/headNav.html', fun.conf.html),
    headNavCampaigns: fun.utils.format('%s/headNavCampaigns.html', fun.conf.html),
    headNavReports: fun.utils.format('%s/headNavReports.html', fun.conf.html),
    
    landing: fun.utils.format('%s/landing.html', fun.conf.html),
    
    support: fun.utils.format('%s/support.html', fun.conf.html),
    features: fun.utils.format('%s/features.html', fun.conf.html),
    enterprise: fun.utils.format('%s/enterprise.html', fun.conf.html),
    howto: fun.utils.format('%s/howto.html', fun.conf.html),
    blog: fun.utils.format('%s/blog.html', fun.conf.html),
    status: fun.utils.format('%s/status.html', fun.conf.html),
    developers: fun.utils.format('%s/developers.html', fun.conf.html),
    help: fun.utils.format('%s/help.html', fun.conf.html),
    security: fun.utils.format('%s/security.html', fun.conf.html),
    terms: fun.utils.format('%s/terms.html', fun.conf.html),

    privacy: fun.utils.format('%s/privacy.html', fun.conf.html),
    
    signup: fun.utils.format('%s/signup.html', fun.conf.html),

    login: fun.utils.format('%s/login.html', fun.conf.html),
    
    dashboard: fun.utils.format('%s/dashboard.html', fun.conf.html),

    orgs: fun.utils.format('%s/orgs.html', fun.conf.html),
    campaigns: fun.utils.format('%s/campaigns.html', fun.conf.html),

    accountListItem: fun.utils.format('%s/accountListItem.html', fun.conf.html),
    
    recordRow: fun.utils.format('%s/recordRow.html', fun.conf.html),
    typeRow: fun.utils.format('%s/typeRow.html', fun.conf.html),
    sumRow: fun.utils.format('%s/sumRow.html', fun.conf.html),

    lastRecord: fun.utils.format('%s/lastRecord.html', fun.conf.html),
    latestRecords: fun.utils.format('%s/latestRecords.html', fun.conf.html),

    recordType: fun.utils.format('%s/recordType.html', fun.conf.html),
    recordSummary: fun.utils.format('%s/recordSummary.html', fun.conf.html),

    todaySummary: fun.utils.format('%s/todaySummary.html', fun.conf.html),
    todayActivityChart: fun.utils.format('%s/todayActivityChart.html', fun.conf.html),

    dialpad: fun.utils.format('%s/dialpad.html', fun.conf.html),
    
    messages: fun.utils.format('%s/messages.html', fun.conf.html),
    videos: fun.utils.format('%s/videos.html', fun.conf.html),

    controlTo: fun.utils.format('%s/controlTo.html', fun.conf.html),
    controlFrom: fun.utils.format('%s/controlFrom.html', fun.conf.html),
    findLapse: fun.utils.format('%s/findLapse.html', fun.conf.html),
    
    message: fun.utils.format('%s/message.html', fun.conf.html),
    messageSmall: fun.utils.format('%s/messageSmall.html', fun.conf.html),
    messageMedium: fun.utils.format('%s/messageMedium', fun.conf.html),
    messageLarge: fun.utils.format('%s/messageLarge', fun.conf.html),

    warning: fun.utils.format('%s/warning.html', fun.conf.html),
    warningSmall: fun.utils.format('%s/warningSmall.html', fun.conf.html),
    warningMedium: fun.utils.format('%s/warningMedium.html', fun.conf.html),
    warningLarge: fun.utils.format('%s/warningLarge.html', fun.conf.html),

    error: fun.utils.format('%s/error.html', fun.conf.html),
    errorSmall: fun.utils.format('%s/errorSmall.html', fun.conf.html),
    errorMedium: fun.utils.format('%s/errorMedium.html', fun.conf.html),
    errorLarge: fun.utils.format('%s/errorLarge.html', fun.conf.html),

    phoneNumbers: fun.utils.format('%s/phoneNumbers.html', fun.conf.html),

    profile: fun.utils.format('%s/profile.html', fun.conf.html),

    activity: fun.utils.format('%s/activity.html', fun.conf.html),
    
    members: fun.utils.format('%s/members.html', fun.conf.html),
    memberRow: fun.utils.format('%s/memberRow.html', fun.conf.html),

    teams: fun.utils.format('%s/teams.html', fun.conf.html),
    teamRow: fun.utils.format('%s/teamRow.html', fun.conf.html),

    contacts: fun.utils.format('%s/contacts.html', fun.conf.html),
    allContacts: fun.utils.format('%s/allContacts.html', fun.conf.html),
    directoryList: fun.utils.format('%s/directoryList.html', fun.conf.html),
    contactRow: fun.utils.format('%s/contactRow.html', fun.conf.html),
    directoryRow: fun.utils.format('%s/directoryRow.html', fun.conf.html),
    sounds: fun.utils.format('%s/sounds.html', fun.conf.html),
    recordings: fun.utils.format('%s/recordings.html', fun.conf.html),
    reports: fun.utils.format('%s/reports.html', fun.conf.html),
    settings: fun.utils.format('%s/settings.html', fun.conf.html),

    extra: fun.utils.format('%s/extra.html', fun.conf.html),
    extraNavbar: fun.utils.format('%s/extraNavbar.html', fun.conf.html),
    extraNavLanding: fun.utils.format('%s/extraNavLanding.html', fun.conf.html),
    extraNavDashboard: fun.utils.format('%s/extraNavDashboard.html', fun.conf.html),
    
    social: fun.utils.format('%s/social.html', fun.conf.html),
    subscribe: fun.utils.format('%s/subscribe.html', fun.conf.html),

    footer: fun.utils.format('%s/footer.html', fun.conf.html)
};

/*
 Hash tags for backbone.js router
*/
fun.conf.hash = {
    home: '#home',
    landing: '#landing',
    howto: '#howto',
    features: '#features',
    enterprise: '#enterprise',
    terms: '#terms',
    privacy: '#privacy',
    security: '#security',
    blog: '#blog',
    status: '#status',
    developers: '#developers',
    help: '#help',
    support: '#support',
    signup: '#signup',
    login: '#login',

    dashboard : '#dashboard',
    dashboardWithAccount: '#dashboard/a{account}',

    profile: '#profile',
    profileWithAccount: '#profile/a{account}',

    activity: '#activity',
    orgs: '#orgs',
    campaigns: '#campaigns',
    members: '#members',
    teams: '#teams',
    phone: '#phone',
    reports: '#reports',
    reportsWithPage: '#reports/p{page}',
    carriers: '#carriers',

    contacts: '#contacts',
    contactsWithPage: '#contacts/p{page}',

    sounds: '#sounds',
    recordings: '#recordings',
    settings: '#settings'
};