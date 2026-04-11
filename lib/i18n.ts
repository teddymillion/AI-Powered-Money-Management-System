export type Lang = 'en' | 'am';

const translations = {
  en: {
    // Nav
    dashboard:        'Dashboard',
    aiAssistant:      'AI Assistant',
    budget:           'Budget',
    analytics:        'Analytics',
    profile:          'Profile',
    signOut:          'Sign Out',
    menu:             'Menu',

    // Header
    searchPlaceholder: 'Search transactions...',
    lightMode:         'Light mode',
    darkMode:          'Dark mode',

    // Dashboard
    aiPoweredActive:   'AI-Powered Insights Active',
    financialOverview: "Here's your financial overview for this month.",
    goodMorning:       'Good morning',
    goodAfternoon:     'Good afternoon',
    goodEvening:       'Good evening',

    // Overview cards
    totalBalance:  'Total Balance',
    totalIncome:   'Total Income',
    totalExpenses: 'Total Expenses',
    totalSavings:  'Total Savings',
    thisMonth:     'This month',

    // Transactions
    recentTransactions: 'Recent Transactions',
    addTransaction:     'Add Transaction',
    noTransactions:     'No transactions yet',
    income:             'Income',
    expense:            'Expense',
    amount:             'Amount',
    category:           'Category',
    description:        'Description',
    date:               'Date',
    type:               'Type',
    save:               'Save',
    cancel:             'Cancel',

    // AI
    aiInsights:         'AI Insights',
    generatingInsights: 'Generating insights...',
    noInsights:         'No insights yet. Add transactions to get started.',
    high:               'High',
    medium:             'Medium',
    low:                'Low',

    // Analytics
    incomeVsExpenses:   'Income vs Expenses',
    savingsTrend:       'Savings Trend',
    categoryBreakdown:  'Category Breakdown',
    weekly:             'Weekly',
    monthly:            'Monthly',
    yearly:             'Yearly',
    avgMonthlyExpense:  'Average Monthly Expense',
    highestSpendingDay: 'Highest Spending Day',
    savingsRate:        'Savings Rate',

    // Budget
    budgetGoals:        'Budget Goals',
    newGoal:            'New Goal',
    target:             'Target',
    current:            'Current',
    deadline:           'Deadline',
    progress:           'Progress',
    noGoals:            'No budget goals yet.',
    createFirstGoal:    'Create your first goal to start tracking.',

    // Auth
    welcomeBack:        'Welcome back',
    signIn:             'Sign In',
    register:           'Register',
    createAccount:      'Create account',
    email:              'Email',
    password:           'Password',
    confirmPassword:    'Confirm Password',
    fullName:           'Full Name',
    forgotPassword:     'Forgot password?',
    sendResetLink:      'Send Reset Link',
    verifyEmail:        'Verify your email',
    verifyAndContinue:  'Verify & Continue',
    resendCode:         'Resend code',
    backToSignIn:       'Back to sign in',
    checkInbox:         'Check your inbox',

    // Profile
    editProfile:        'Edit Profile',
    changePassword:     'Change Password',
    uploadAvatar:       'Upload Photo',
    deleteAccount:      'Delete Account',
    saveChanges:        'Save Changes',
    memberSince:        'Member since',

    // Notifications
    notifications:      'Notifications',
    allCaughtUp:        'All caught up!',
    noNotifications:    'No notifications yet.',
    markAllRead:        'Mark all read',

    // General
    loading:            'Loading...',
    error:              'Something went wrong.',
    retry:              'Retry',
    back:               'Back',
    comingSoon:         'Coming soon',
    noData:             'No data yet',
    etb:                'ETB',
  },

  am: {
    // Nav
    dashboard:        'ዳሽቦርድ',
    aiAssistant:      'AI ረዳት',
    budget:           'በጀት',
    analytics:        'ትንታኔ',
    profile:          'መገለጫ',
    signOut:          'ውጣ',
    menu:             'ምናሌ',

    // Header
    searchPlaceholder: 'ግብይቶችን ፈልግ...',
    lightMode:         'ብርሃን ሁነታ',
    darkMode:          'ጨለማ ሁነታ',

    // Dashboard
    aiPoweredActive:   'AI ትንታኔ ንቁ ነው',
    financialOverview: 'የዚህ ወር የፋይናንስ ሁኔታዎ እዚህ አለ።',
    goodMorning:       'እንደምን አደሩ',
    goodAfternoon:     'እንደምን ዋሉ',
    goodEvening:       'እንደምን አመሹ',

    // Overview cards
    totalBalance:  'ጠቅላላ ቀሪ ሂሳብ',
    totalIncome:   'ጠቅላላ ገቢ',
    totalExpenses: 'ጠቅላላ ወጪ',
    totalSavings:  'ጠቅላላ ቁጠባ',
    thisMonth:     'በዚህ ወር',

    // Transactions
    recentTransactions: 'የቅርብ ጊዜ ግብይቶች',
    addTransaction:     'ግብይት ጨምር',
    noTransactions:     'እስካሁን ምንም ግብይት የለም',
    income:             'ገቢ',
    expense:            'ወጪ',
    amount:             'መጠን',
    category:           'ምድብ',
    description:        'መግለጫ',
    date:               'ቀን',
    type:               'አይነት',
    save:               'አስቀምጥ',
    cancel:             'ሰርዝ',

    // AI
    aiInsights:         'AI ምክሮች',
    generatingInsights: 'ምክሮች እየተዘጋጁ ነው...',
    noInsights:         'እስካሁን ምንም ምክር የለም። ግብይቶችን ጨምር።',
    high:               'ከፍተኛ',
    medium:             'መካከለኛ',
    low:                'ዝቅተኛ',

    // Analytics
    incomeVsExpenses:   'ገቢ እና ወጪ',
    savingsTrend:       'የቁጠባ አዝማሚያ',
    categoryBreakdown:  'በምድብ ክፍፍል',
    weekly:             'ሳምንታዊ',
    monthly:            'ወርሃዊ',
    yearly:             'ዓመታዊ',
    avgMonthlyExpense:  'አማካይ ወርሃዊ ወጪ',
    highestSpendingDay: 'ከፍተኛ ወጪ ቀን',
    savingsRate:        'የቁጠባ መጠን',

    // Budget
    budgetGoals:        'የበጀት ግቦች',
    newGoal:            'አዲስ ግብ',
    target:             'ዒላማ',
    current:            'አሁናዊ',
    deadline:           'የመጨረሻ ቀን',
    progress:           'እድገት',
    noGoals:            'እስካሁን ምንም የበጀት ግብ የለም።',
    createFirstGoal:    'የመጀመሪያ ግብዎን ይፍጠሩ።',

    // Auth
    welcomeBack:        'እንኳን ደህና መጡ',
    signIn:             'ግባ',
    register:           'ተመዝገብ',
    createAccount:      'መለያ ፍጠር',
    email:              'ኢሜይል',
    password:           'የይለፍ ቃል',
    confirmPassword:    'የይለፍ ቃል አረጋግጥ',
    fullName:           'ሙሉ ስም',
    forgotPassword:     'የይለፍ ቃል ረሳህ?',
    sendResetLink:      'የዳግም ማስጀመሪያ ሊንክ ላክ',
    verifyEmail:        'ኢሜይልዎን ያረጋግጡ',
    verifyAndContinue:  'አረጋግጥ እና ቀጥል',
    resendCode:         'ኮድ እንደገና ላክ',
    backToSignIn:       'ወደ መግቢያ ተመለስ',
    checkInbox:         'ሳጥንዎን ይፈትሹ',

    // Profile
    editProfile:        'መገለጫ አርትዕ',
    changePassword:     'የይለፍ ቃል ቀይር',
    uploadAvatar:       'ፎቶ ጫን',
    deleteAccount:      'መለያ ሰርዝ',
    saveChanges:        'ለውጦችን አስቀምጥ',
    memberSince:        'አባል ከሆኑ',

    // Notifications
    notifications:      'ማሳወቂያዎች',
    allCaughtUp:        'ሁሉም ታይቷል!',
    noNotifications:    'እስካሁን ምንም ማሳወቂያ የለም።',
    markAllRead:        'ሁሉንም እንደተነበበ ምልክት አድርግ',

    // General
    loading:            'እየጫነ ነው...',
    error:              'ችግር ተፈጥሯል።',
    retry:              'እንደገና ሞክር',
    back:               'ተመለስ',
    comingSoon:         'በቅርቡ ይመጣል',
    noData:             'እስካሁን ምንም ውሂብ የለም',
    etb:                'ብር',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export default translations;
