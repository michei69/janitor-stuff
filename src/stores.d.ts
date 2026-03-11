//! for reference
// those are nowhere close to finished, im too lazy to fully type them
// i just did the barebones and some of the functions i needed

declare type ChatStore = {
    activePronouns?: PersonaPronouns,
    canEdit: boolean,
    characterAvatar: string,
    characterId: string,
    chatId: number,
    chatInfo: {
        character: ChatCharacter,
        chat: Chat
    },
    createChatForCurrentCharacter: () => void,
    displayMessage: Toastify,
    generationStore: GenerationStore,
    // fetches and loads the chat into the UI
    getChatInfo: (chatId: string) => void,
    getPersona: () => void,
    inputStore: InputStore,
    isChatReady: boolean,
    isForbidden: boolean,
    isLoading: boolean,
    messagesStore: MessagesStore,
    onDestroy: () => void,
    sessionStartTime: number,
    setIsForbidden: (isForbidden: boolean) => void,
    settingsStore: SettingsStore,
    storageStore: StorageStore,
    summaryStore: SummaryStore,
    trackUrl?: string,
    updateChatInfo: (...args) => any, // TODO:
    userCurrentAvatar: string,
    userDisplayName: string,
    userPersonaStore: UserPersonaStore,
    userStore: UserStore,
}

declare type GenerationStore = {
    chatGenerateInstance: { nineClient: any },
    chatStore: ChatStore,
    currentGenerateMode: GenerationMode,
    hasGenerationResponse: boolean,
    isDebuggingScript: () => boolean,
    isGenerationProcessing: boolean,
    isStreamCancelled: boolean,
    runContinueMessage: (message: string, callback: (delta: string) => any) => Promise<void>,
    runGenerateAlternative: (callback: (delta: string) => any) => Promise<void>,
    runGenerateAnswer: (message: string, callback: (delta: string) => any) => Promise<void>,
    runGenerateSuggestion: (message: string, callback: (delta: string) => any, suggestionMode: "write", suggestionPerspective?: string) => Promise<void>,
    runGenerateSummary: (summaryType: "SUMMARY_FULL"|"SUMMARY_LAST", messages: ChatMessage[], callback: (delta: string) => any) => Promise<void>,
    runRegenerate: (callback: (delta: string) => any) => Promise<void>,
    saveNewMessageAndApplyId: (e: ChatMessage) => Promise<void>,
    scriptsStore: any,
    setIsGenerationProcessing: (isGenerationProcessing: boolean, currentGenerateMode: GenerationMode) => void,
    settingsStore: SettingsStore,
    stopStream: () => Promise<void>,
    storageStore: StorageStore,
    streamingMessageStore: StreamingMessageStore,
    userPersonaStore: UserPersonaStore,
    userStore: UserStore
}
declare type GenerationMode = "ALTERNATIVE"|"CONTINUE"|"NEW"|"SUGGESTION"|"SUMMARY_FULL"|"SUMMARY_LAST"|null

declare type SettingsStore = {
    endpoints: SettingsEndpoints,
    mobile: null,
    supabase: Supabase,
    userLocale: "en-US"|string,
}
declare type SettingsEndpoints = {
    abortControllers: Map<any, AbortController>, // TODO: type
    api: {},
    apiClient: (...args) => any, // axios.request() for /hampter
    logout: () => Promise<void>,
    options: {
        isServer: boolean,
        modulesBaseUrls?: any,
    },
    supabase: Supabase
}
declare type Supabase = any // TODO

declare type StorageStore = {
    OAuthRedirectUrl: null, // TODO
    // those r unused iirc
    chatSettings: {
        claudeApiKey: null,
        openAIKey: null,
        reverseProxyKey: null,
    },
    onDestroy: () => void,
    searchParams: SearchParams,
    setChatSettings: (params: {
        claudeApiKey?: null,
        openAIKey?: null,
        reverseProxyKey?: null,
    }) => void,
    setOAuthRedirectUrl: (...args) => void,
    setSearchParams: (params: SearchParams) => void,
    setTheme: (theme: "dark"|"light") => void,
    theme: "dark"|"light",
}
declare type SearchParams = { // different from CharacterListParams btw
    favorites?: boolean,
    following?: boolean,
    messages?: number,
    messages_mode?: "gte"|"lte",
    proxyenabled?: boolean,
    segment?: "hidden_gems"|"trending"|"trending24"|"newcomer",
    sort?: "latest"|"popular"|"relevance"|"trending"|"trending24",
    tokens?: number,
    tokens_mode?: "gte"|"lte",
    view?: "all"|"sfw"
}

declare type StreamingMessageStore = {
    currentGenerateMode: GenerationMode,
    isStreaming: boolean,
    startStreaming: () => void,
    stopStreaming: () => void
}

declare type UserPersonaStore = {
    addPersona: (...args) => any,
    canAddMore: boolean,
    clearPersonas: (...args) => any,
    debouncePersistOrder: (...args) => any, // TODO
    deletePersona: (...args) => any,
    displayMessage: Toastify,
    getPersonas: () => Promise<void>,
    movePersona: (...args) => any,
    persistPersonaOrder: (...args) => any,
    personas: Persona[],
    reorderTimeouts: any, // TODO
    savePersona: (...args) => any,
    settingsStore: SettingsStore,
    updatePersonaGroup: (...args) => any,
}

declare type UserStore = {
    authProcess: {
        isEmail: boolean,
        isOAuth: boolean,
    },
    clearAllPromptGenerationCacheRefetch: (...args) => any,
    config: UserConfig,
    defaultConfig: () => UserConfig,
    displayMessage: Toastify,
    endpoints: SettingsEndpoints,
    forcedPromptGenerationCacheRefetch: {
        character: boolean,
        chat: boolean,
        profile: boolean,
        script: boolean,
    },
    getProfile: () => Promise<void>,
    getUser: () => Promise<boolean>,
    hasBadges: boolean,
    isAccountOldEnough: boolean,
    isAuth: boolean,
    isAuthProcess: boolean,
    isUpdatingConfig: boolean,
    logout: () => Promise<void>,
    notifier: { notifier: Toastify },
    onDestroy: () => void,
    profile: UserProfile,
    setAuthProcess: (params: { isEmail: boolean, isOAuth: boolean }) => void,
    setIsAuth: (isAuth: boolean) => void,
    setProfile: (profile: any) => void,
    setPromptGenerationCacheRefetchByType: (params: any) => void,
    setUserConfig: (config: UserConfig?) => void,
    settingsStore: SettingsStore,
    storageStore: StorageStore,
    updateConfig: (config: UserConfig?) => Promise<void>,
    updateProfile: (profile: any) => Promise<void>,
    userAvatar: string,
    userPersonaStore: UserPersonaStore,
}
declare type UserConfig = {
    allow_mobile_nsfw: boolean,
    api: "janitor"|"openai"|"claude",
    bad_words: string[],
    bio_preview_images: boolean,
    chat_custom_edit_color: string,
    chat_custom_font_family: string,
    chat_custom_font_size: number,
    chat_custom_foreground_color: string,
    chat_custom_italic_color: string,
    debug_mode: boolean,
    disable_custom_css: boolean,
    generation_settings: {
        context_length: number,
        enable_thinking: boolean,
        frequency_penalty: number,
        max_new_token: number,
        prefill_enabled: boolean,
        prefill_text: string,
        repetition_penalty: number,
        temperature: number,
        top_k: number,
        top_p: number,
    },
    llm_prompt: string, // ?
    openAiModel: string, // proxy model
    open_ai_jailbreak_prompt: string, // proxy prompt
    open_ai_mode: "proxy",
    open_ai_reverse_proxy: string, // proxy url
    proxyConfigurations: ProxyConfig[],
    selectedProxyConfigId: string,
    show_clouds: boolean,
    show_pride: boolean,
    show_swords: boolean,
    text_streaming: boolean,
    use_pygmalion_format: boolean,
}
declare type ProxyConfig = {
    apiKey: string,
    apiUrl: string,
    id: string,
    jailbreakPrompt: string,
    model: string,
    name: string,
}

declare type InputStore = {
    canEdit: boolean,
    canSuggest: boolean,
    cancelEnhance: () => void,
    chatStore: ChatStore,
    closeAnonChatAuthModal: () => any,
    closeCommandPalette: () => any,
    closeCrisisReferral: () => any,
    closeProfileCompletion: () => any,
    crisisReferralMatch?: any,
    crisisReferralSource?: any,
    discardEnhance: () => any,
    enhanceDraft: string,
    enhanceMode: "write",
    enhancePhase: "idle",
    enhancePrompt: string,
    finalizeAnonChatAfterAuth: () => any,
    hydrateAnonChatDraft: () => any,
    isAnonChatAuthModalOpen: boolean,
    iscommandPaletteOpen: boolean,
    isCrisisReferralOpen: boolean,
    isEmpty: boolean,
    isEnhanceMode: boolean,
    isGeneratingSuggestion: boolean,
    isProfileCompletionOpen: boolean,
    isSuggestionThinking: boolean,
    keepEnhance: () => any,
    message: string,
    navigateStore: NavigateStore,
    onGenerateTextResponse: (message: string) => void,
    openAnonChatAuthModal: () => any,
    openCommandPalette: () => any,
    openCrisisReferral: () => any,
    openProfileCompletion: () => any,
    profileCompletionAppearance: string,
    profileCompletionName: string,
    runEnhance: () => any,
    send: (sth: boolean) => void,
    setMessage: () => any,
    setProfileCompletionAppearance: (appearance: string) => void,
    setProfileCompletionName: (name: string) => void,
    showStopButton: boolean,
    suggest: () => Promise<void>,
    thinkFilter: ThinkFilter,
    toggleCommandPalette: () => any,
    userStore: UserStore,
    writeForMe: () => any,
    writeFromScratch: () => any,
}
declare type ThinkFilter = {
    _isThinking: boolean,
    buffer: string,
    isThinking: boolean,
    flush: () => void,
    // removes <think></think>
    process: (message: string) => { output: string, thinkingChanged: boolean },
    reset: () => void,
}

declare type MessagesStore = {
    addOpenAvatarImageById: () => any,
    answerAnimationId?: any,
    canBeContinued: (message: ChatMessage) => boolean,
    canBeDeleted: (message: ChatMessage) => boolean,
    canBeRated: (message: ChatMessage) => boolean,
    canBeRegenerated: (message: ChatMessage) => boolean,
    canEditMessage: (message: ChatMessage) => boolean,
    canForkChat: (message: ChatMessage) => boolean,
    canGenerateNew: (message: ChatMessage) => boolean,
    changeLastMessageIndex: (index: number) => Promise<void>,
    chatStore: ChatStore,
    continueMessage: (message: ChatMessage) => Promise<void>,
    counterTimeoutId?: any,
    deleteMessage: () => any,
    editMessage: () => any,
    followStreamOutput: () => any,
    forkChat: (message: ChatMessage) => string|number,
    getIsScrollAtTop: () => boolean,
    getLastMessage: () => ChatMessage,
    handleAtBottomStateChange: () => any,
    handleAtTopStateChange: () => any,
    hasBlockAutoScroll: boolean,
    hideCounter: () => any,
    initialMessage: any, // no idea
    isMessageProcessing: boolean,
    isReplyingPlaceholder: ChatMessage,
    isScrollAtBottom: boolean,
    isScrollAtTop: boolean,
    lastMessageIndex: number,
    lockAutoScroll: () => void,
    messages: ChatMessage[],
    messagesToDisplay: ChatMessage[],
    onMessageTextStreamUpdate: () => any,
    onStreamAbort: () => Promise<void>,
    openAvatarImages: any[],
    rateMessage: (message: ChatMessage, rating: number) => Promise<void>,
    regenerateAnswer: () => Promise<void>,
    removeOpenAvatarImageById: () => any,
    restoreFirstMessage: () => any,
    scriptAppliedMessages: Set,
    selectedFirstMessageIndex: number,
    setIsScrollAtBottom: (isScrollAtBottom: boolean) => void,
    setLastMessageIndex: (index: number) => void,
    setMessages: (messages: ChatMessage[]) => void,
    setSelectedFirstMessageIndex: (index: number) => void,
    settingsStore: SettingsStore,
    showCounterTemporarily: () => any,
    showMessageCounter: boolean,
    startIsReplying: () => any,
    thinkingContentByMessageId: any,
    updateFirstMessageOptimistically: () => any,
    userStore: UserStore,
    v2ModelMessages: Set,
    virtuosoRef: { current: any }
}

declare type SummaryStore = {
    chatStore: ChatStore,
    generateSummary: () => any,
    isGeneratingSummary: boolean,
    messagesSinceLastSave: ChatMessage[],
    messagesToConsider: ChatMessage[],
    onGenerationTextResponse: (summaryResponse: string, type: "last"|"full" = "full", lastSummary = "") => any,
    restoreCursPosition: () => void,
    saveSummary: () => Promise<void>,
    settingsStore: SettingsStore,
    summaryToDisplay: string,
    updateSummary: (summary: string) => void,
    userStore: UserStore
}

declare type NavigateStore = {
    firstLocation: {
        isRootPage?: any,
        pathname: string
    },
    getBackURL: (url: string) => string|number,
    getHasBottomActiveTab: () => boolean,
    hasBottomActiveTab: boolean,
    location: {
        hash: string,
        key: string,
        pathname: string,
        search: string,
        state?: any,
    },
    // useNavigate()
    navigate: (to: string, options: any) => Promise<void>,
    params: any,
    setHasBottomActiveTab: (hasBottomActiveTab: boolean) => void,
    setLocation: (location: any) => void,
    setNavigate: (navigate: any) => void,
    setParams: (params: any) => void,
}

declare type FollowingStore = {
    addFollowingTag: (tag: string|number) => Promise<void>,
    addSubscribers: () => void,
    clear: () => any,
    endpoints: SettingsEndpoints,
    filteredFollowingAccounts: any[],
    followUser: () => any,
    followingAccounts: any[],
    followingPendingMap: any,
    followingSearchQuery: string,
    followingTags: any[],
    followingTagsInputValue: string,
    followingTagsSuggestions: any[],
    getFollowingAccounts: () => any,
    getFollowingTags: () => any,
    getIsFollowingUser: () => boolean,
    maxFollowingTags: number,
    notificationsStore: NotificationsStore,
    notifier: { notifier: Toastify },
    removeFollowingTag: () => any,
    searchFollowingTagsSuggestions: () => any,
    setFollowingPending: () => any,
    setFollowingSearchQuery: () => any,
    setFollowingTagsInputValue: () => any,
    tagsSuggestionsRequestId: number,
    toggleFollow: () => any,
    unfollowUser: () => any,
    userStore: UserStore
}

declare type NotificationsStore = {
    appendNotifications: () => any,
    archiveAllNotifications: () => Promise<void>,
    archiveNotification: (notification: JanitorNotification) => Promise<void>,
    cachedOffset: number,
    clear: () => void,
    currentUserId?: any,
    endpoints: SettingsEndpoints,
    getIsSubscribedToTopic: () => boolean,
    getNotificationsCount: () => Promise<number>,
    hasMoreNotifications: boolean,
    initNotifications: () => Promise<void>,
    initPromise?: Promise,
    isInitialSettingsLoading: boolean,
    isInitializing: boolean,
    isLoading: boolean,
    isLoadingSettings: boolean,
    isLoadingTopics: boolean,
    isReady: boolean,
    loadNotifications: () => Promise<void>,
    markAllAsRead: () => Promise<void>,
    markAsRead: (notification: JanitorNotification) => Promise<void>,
    notifications: JanitorNotification[],
    notificationsApiUrl: string,
    notificationsLimit: number,
    notificationsSettings: any, // TODO
    notifier: { notifier: Toastify },
    offset: number,
    performInitialization: () => Promise<void>,
    reconnectTimer?: any,
    setNotifications: (notifications: JanitorNotification[]) => void,
    settingsStore: SettingsStore,
    showMore: () => any,
    sortNotificationsByDate: () => any,
    toggleNotificationsSettings: () => any,
    toggleSubscribedToTopic: () => any,
    topics: any,
    unreadCount: number,
    unsubscribeToTopic: () => any,
    userStore: UserStore,
    ws: any,
}

declare type MainStore = {
    chats: Chat[],
    displayMessage: Toastify,
    getCharacterChats: (characterId: string) => Promise<void>,
    onDeleteChat: (chatId: string|number) => Promise<void>,
    settingsStore: SettingsStore
}

declare type UserPersonaGroupStore = {
    assignPersonaToGroup: () => any,
    canAddMore: boolean,
    clearGroups: () => any,
    createGroup: () => any,
    debouncePersistGroupOrder: () => any,
    deleteGroup: () => any,
    displayMessage: Toastify,
    getGroups: () => any,
    groups: any[],
    moveGroup: () => any,
    movePersonaBetweenGroups: () => any,
    persistGroupOrder: () => any,
    reorderTimeout?: any,
    settingsStore: SettingsStore,
    updateGroup: () => any,
    userPersonaStore: UserPersonaStore
}

declare type CharactersStore = {
    filters: CharacterListParams,
    page: string, // "1"
    publicProfileStore: any,
    updateFilters: (filters: CharacterListParams) => void
}

declare type PublicProfileStore = {
    blockingService: BlockingService,
    displayMessage: Toastify,
    getProfile: () => any,
    hasUnsavedCustomization: boolean,
    init: () => any,
    isBgImageModalVisible: boolean,
    isOwner: boolean,
    isProfileEditing: boolean,
    isSubscriptionActive: boolean,
    profile: PublicProfile,
    resetUnsavedCustomization: () => any,
    sR: ServerRendered,
    saveProfileCustomizations: () => any,
    setIsBgImageModalVisible: (isBgImageModalVisible: boolean) => any,
    setIsEditingProfile: (isProfileEditing: boolean) => any,
    setUnsavedProfileCustomizations: () => any,
    settingsStore: SettingsStore,
    style: {
        custom_style: string
    },
    suspense: any,
    unsavedProfileUpdates?: any,
    updateAvatar: () => any,
    userStore: UserStore
}
declare type ServerRendered = {
    hash: string,
    done: boolean,
}
declare type BlockingService = {
    blockCharacter: (characterId: string) => Promise<void>,
    blockCreator: (userId: string) => Promise<void>,
    changeTagBlockStatus: (tags: string[], keywords: string[]) => any,
    displayMessage: Toastify,
    getBlocklist: () => any,
    hasBlocked: (param: { type: "tags"|string, id: any }) => boolean,
    params: { userStore: UserStore },
    unblockCharacter: (characterId: string) => Promise<void>,
    unblockCreator: (userId: string) => Promise<void>,
    updateBlocklist: (param: { bots?: any[], creators?: any[], keywords?: any[], tags?: any[] }) => Promise<void>
}

declare type ChatCarouselStore = {
    chats: Chat[],
    displayMessage: Toastify,
    hasMoreChats: boolean,
    initialLoading: boolean,
    isLoading: boolean,
    loadMoreChats: () => Promise<void>,
    page: number,
    settingsStore: SettingsStore
}

declare type ParentStore = {
    blockingService: BlockingService,
    characters: Character[],
    deleteCharacter: (characterId: string) => Promise<void>,
    displayMessage: Toastify,
    getCharacters: (props: { page: number } & CharacterListParams) => Promise<void>,
    init: () => void,
    pageSize: number,
    requestCount: number,
    requestId: string,
    sR: ServerRendered,
    searchStateStore: SearchStateStore,
    settingsStore: SettingsStore,
    shouldHide: (param: { id?: any, creator_id?: any, tags?: any }) => boolean,
    storeProps: any,
    suspense: any,
    topCustomTags: any[],
    totalCharacters: number,
    uniqueTags: any[],
    userStore: UserStore
}
declare type SearchStateStore = {
    clearTotalCharacters: () => any,
    setTotalCharacters: () => any,
    totalCharacters?: any,
}

// mobile app thing
declare type RightActionsStore = {
    isUsed: boolean,
    portalRef: any,
    setIsUsed: (isUsed: boolean) => void,
    setPortalRef: (portalRef: any) => void,
    setShouldHideAppMenu: (shouldHideAppMenu: boolean) => void,
    setShouldHideDiscordButton: (shouldHideDiscordButton: boolean) => void,
    shouldHideAppMenu: boolean,
    shouldHideDiscordButton: boolean
}

declare type SearchStore = {
    addTagListeners: () => any,
    allTags: any[],
    charactersListStore: ParentStore,
    currentTag?: any,
    getInitialPage: () => any,
    getTag: (slug: string) => Promise<void>,
    handleChangeTags: () => any,
    init: () => void,
    isFilterPanelOpen: boolean,
    isTagsLoading: boolean,
    loadTags: () => Promise<void>,
    mobileFilterOpen: boolean,
    navigationStore: NavigateStore,
    onCharactersStore: (charactersStore: CharactersStore) => void,
    page: string,
    reinitializeSearchParams: () => any,
    resetSearchParams: () => any,
    searchParams: SearchParams,
    setMobileFilterOpen: (mobileFilterOpen: boolean) => void,
    settingsStore: SettingsStore,
    storageStore: StorageStore,
    suspense: any,
    tagsStore: TagsStore,
    toggleFilterPanel: () => any,
    topCustomTags: any[],
    updateSearchParams: (params: SearchParams) => void
}

declare type TagsStore = {
    allTags: string[],
    displayMessage: Toastify,
    getTags: () => Promise<void>,
    groupTags: {
        commonTags: [],
        eventTags: [],
    },
    hasFetchedTags: boolean,
    isFetching: boolean,
    settingsStore: SettingsStore
}