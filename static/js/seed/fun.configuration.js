/*
 Configuration seed
*/

var environment, url, productionURL, developmentURL;
var tokken, tokkenRUN, tokkenDEV;

environment = 'production';

productionURL = 'http://201.149.49.175:9027';
developmentURL = 'http://201.149.49.181:9027';

tokkenRUN = 'MBl9MnCcCvcqpXUWMbLeLbvBlE+ker65O4LWQx0ULp4=';
tokkenDEV = '/r+1NILWP7jwHK1sDsy35P5dE77sdae6ZSoK4v6FVz8=';

if (environment === 'production'){
    url = productionURL;
    tokken = tokkenRUN;
} else {
    if (environment === 'development'){
        url = developmentURL;
        tokken = tokkenDEV;
    }
};

fun.conf = {
    account: 'account',
    context: 'context', // dashboard context "organization"

    environment: environment,

    // CLX conf stuff
    clxUrl: url,

    clxPartner: 'Preway CR',
    clxCulture: 'en-US',
    clxAppId: '26',
    clxTKN: tokken,
    clxUserId: '1517', // this is the userId of preway

    html: '/static/html',
    domain: 'iofun.io',

    urlRoot: '/api/',

    uuidRecord: 'record_uuid',
    uuidBilling: 'billing_uuid',

    uuidPayment: 'payment_uuid',
    uuidTransaction: 'transaction_uuid',

    uuidError: 'error_uuid',
    // end CLX stuff

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
 Common timeouts
*/
fun.conf.timeouts = {
    big: 60000,
    medium: 15000,
    small: 5000
};


/*
 System urls
*/
fun.conf.urls = {
    login: '/login/',
    logout: '/logout/',

    register: '/cuallix/register/',
    customerRegister: '/cuallix/customer/register',
    assign: '/cuallix/assign/',
    funds: '/cuallix/funds/',

    // --- start new api

    transaction: fun.utils.format('/cuallix/transactions/%s', fun.conf.uuidTransaction),
    transactions: '/cuallix/transactions/',

    customerSearch: '/cuallix/customer/search', 
    
    paymentUrl: '/cuallix/payment/url/',
    
    sendMoney: '/cuallix/send/money/',

    settle: '/cuallix/settle/',

    transactionStatus: '/cuallix/transactions/status/',
    searchTransactions: '/cuallix/transactions/search/',

    dateRangeTransactions: '/cuallix/transactions/range/',


    // --- end new api

    payment: fun.utils.format('/cuallix/payments/%s', fun.conf.uuidPayment),
    payments: '/cuallix/payments/',

    user: fun.utils.format('/users/%s', fun.conf.account),
    users: '/users/',

    record: fun.utils.format('/records/%s', fun.conf.uuidRecord),
    records: '/records/',

    billing: fun.utils.format('/billings/%s', fun.conf.uuidBilling),
    billings: '/billings/',
    
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
    headNavReports: fun.utils.format('%s/headNavReports.html', fun.conf.html),
    
    landing: fun.utils.format('%s/landing.html', fun.conf.html),
    
    support: fun.utils.format('%s/support.html', fun.conf.html),
    features: fun.utils.format('%s/features.html', fun.conf.html),
    enterprise: fun.utils.format('%s/enterprise.html', fun.conf.html),
    status: fun.utils.format('%s/status.html', fun.conf.html),

    security: fun.utils.format('%s/security.html', fun.conf.html),

    terms: fun.utils.format('%s/terms.html', fun.conf.html),

    privacy: fun.utils.format('%s/privacy.html', fun.conf.html),
    
    signup: fun.utils.format('%s/signup.html', fun.conf.html),

    login: fun.utils.format('%s/login.html', fun.conf.html),
    
    dashboard: fun.utils.format('%s/dashboard.html', fun.conf.html),

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

    sendMoney: fun.utils.format('%s/sendMoney.html', fun.conf.html),

    cuallixError: fun.utils.format('%s/cuallixError.html', fun.conf.html),
    bannerImage: fun.utils.format('%s/bannerImage.html', fun.conf.html),

    profile: fun.utils.format('%s/profile.html', fun.conf.html),

    activity: fun.utils.format('%s/activity.html', fun.conf.html),
    
    members: fun.utils.format('%s/members.html', fun.conf.html),
    memberRow: fun.utils.format('%s/memberRow.html', fun.conf.html),

    teams: fun.utils.format('%s/teams.html', fun.conf.html),
    teamRow: fun.utils.format('%s/teamRow.html', fun.conf.html),

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
    send: '#send',
    error: '#error',
    banner: '#banner',
    features: '#features',
    enterprise: '#enterprise',
    terms: '#terms',
    privacy: '#privacy',
    security: '#security',
    status: '#status',
    signup: '#signup',
    login: '#login',

    dashboard : '#dashboard',
    dashboardWithAccount: '#dashboard/a{account}',

    profile: '#profile',
    profileWithAccount: '#profile/a{account}',

    activity: '#activity',
    orgs: '#orgs',
    members: '#members',
    teams: '#teams',
    reports: '#reports',
    reportsWithPage: '#reports/p{page}',
    
    settings: '#settings'
};