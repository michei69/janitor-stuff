declare type Character = {
    avatar: string,
    created_at: Date,
    creator_id: string,
    creator_name: string,
    creator_verified: string,
    custom_tags: string[],
    description: string,
    first_published_at: Date,
    id: string,
    is_force_remove: boolean,
    is_image_nsfw: boolean,
    is_nsfw: boolean,
    is_proxy_enabled: boolean,
    is_public: boolean,
    name: string,
    scheduled_publish_at?: Date,
    stats: {
        chat: number,
        message: number
    },
    tags: CharacterTag[],
    total_tokens: number,
    updated_at: Date
}

declare type CharacterTag = {
    created_at: Date,
    description: string,
    id: number,
    name: string,
    slug: string
}

declare type CharacterListParams = {
    custom_tags?: string[],
    following?: boolean,
    favorites?: boolean,
    messages?: number,
    messages_mode?: "gte"|"lte",
    mode?: "all"|"sfw",
    proxyenabled?: boolean,
    special_mode?: "hidden_gems"|"trending"|"trending24"|"newcomer",
    sort?: "latest"|"popular"|"relevance"|"trending"|"trending24",
    tag_id?: number[],
    tokens?: number,
    tokens_mode?: "gte"|"lte",
}

declare type ChatMessage = {
    character_id?: string,
    chat_id: number,
    created_at: Date,
    id: number,
    is_bot: boolean,
    is_main: boolean,
    message: string,
    rating?: number,
}

declare type ChatCharacter = {
    allow_proxy: boolean,
    avatar: string,
    chat_name: string,
    description: string,
    first_messages: string[],
    id: string,
    is_image_nsfw: boolean,
    is_nsfw: boolean,
    is_public: boolean,
    name: string,
    soundcloud_track_id?: string
}

declare type Chat = {
    can_publish: boolean,
    character_id: string,
    created_at: Date,
    id: number,
    is_public: boolean,
    persona_id?: string,
    published_message_count?: number,
    published_slug?: string,
    summary: string,
    summary_chat_id?: string,
    user_id: string,
}

declare type Persona = {
    appearance: string,
    avatar: string,
    created_at: Date,
    groupId?: string,
    id: string,
    name: string,
    order: number,
    pronouns?: PersonaPronouns,
    updated_at: Date,
}
declare type PersonaPronouns = {
    objective: string,
    possessive: string,
    possessivePronoun: string,
    reflexive: string,
    subjective: string
}

declare type PublicProfile = {
    about_me: string,
    avatar: string,
    badges: Array<{
        id: string,
        img: string,
        sortOrder: number,
        title: string
    }>,
    created_at: Date,
    followers_count: string,
    is_verified: boolean,
    style: {
        custom_style: string
    },
    user_name: string,
}
declare type UserProfile = PublicProfile & {
    birth_date: Date,
    block_list: {
        bots: any[],
        creators: any[],
        keywords: string[],
        tags: number[]
    },
    config: UserConfig,
    id: string,
    name: string, // main persona name
    profile: string, // main persona appearance
    subscriber_check: boolean,
    user_roles: string[]
}

declare type JanitorNotification = any; // TODO