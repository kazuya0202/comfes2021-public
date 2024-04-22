// Types
type DateType = Date | GoogleAppsScript.Base.Date
type Spreadsheet = GoogleAppsScript.Spreadsheet.Spreadsheet
type URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
type CalendarEvent = GoogleAppsScript.Calendar.CalendarEvent
type Trigger = GoogleAppsScript.Script.Trigger
type Sheet = GoogleAppsScript.Spreadsheet.Sheet
type HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse

const THRESH_UNDECIDED_DATE_LIMIT = 2030 // !important

const isUndecidedDate = (date: DateType): boolean => {
    return date.getFullYear() >= THRESH_UNDECIDED_DATE_LIMIT
}

// properties
const setProperties = (): void => {
    PropertiesService.getScriptProperties().setProperties({
        CALENDAR_ID_FOR_EVENT: "",
        LINE_BOT_ID: "",
        LINE_GROUP_ID: "",
        LINE_NOTIFY_TOKEN: "",
        LINE_NOTIFY_TOKEN_FOR_GROUP: "",
        LINE_CHANNEL_ACCESS_TOKEN: "",
        SHEET_ID_FOR_CLASSES: "",
        SHEET_ID_FOR_PAST_TASK: "",
        SHEET_ID_FOR_FORM_ANSWER: "",
        SHEET_ID_FOR_TRIGGER: "",
    })
}

const _props: {
    [key: string]: string
} = PropertiesService.getScriptProperties().getProperties()

const props = {
    // * line
    LINE_BOT_ID: _props.LINE_BOT_ID,
    LINE_GROUP_ID: _props.LINE_GROUP_ID,
    LINE_CHANNEL_ACCESS_TOKEN: _props.LINE_CHANNEL_ACCESS_TOKEN,
    // default (user | group)
    LINE_SEND_DEFAULT_ID: _props.LINE_GROUP_ID,
    // notify
    LINE_NOTIFY_TOKEN: _props.LINE_NOTIFY_TOKEN,
    LINE_NOTIFY_TOKEN_FOR_GROUP: _props.LINE_NOTIFY_TOKEN_FOR_GROUP,

    // * calendar
    CALENDAR_ID_FOR_EVENT: _props.CALENDAR_ID_FOR_EVENT,

    // * sheet
    SHEET_ID_FOR_TRIGGER: _props.SHEET_ID_FOR_TRIGGER,
    SHEET_ID_FOR_FORM_ANSWER: _props.SHEET_ID_FOR_FORM_ANSWER,
    SHEET_ID_FOR_CLASSES: _props.SHEET_ID_FOR_CLASSES,
    SHEET_ID_FOR_PAST_TASK: _props.SHEET_ID_FOR_PAST_TASK,
} as const

/**
 * Emoji
 */
const emoji = {
    star: "\uDBC0\uDCB2", // 0x1000B2
    light: "\uDBC0\uDC77", // 0x100077
} as const

const dayOfWeek2dayString = {
    en: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ],
    jp: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
} as const

/**
 * Date Utility
 */
const DateUtil = class {
    static getAsMMDD(date: DateType, delimiter: string = "/"): string {
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return [m, d].join(delimiter) // `MM-DD`
    }

    static getAsMMDDjp(date: DateType): string {
        const m = date.getMonth() + 1
        const d = date.getDate()
        return `${m}月${d}日`
    }

    static getAsYYYYMMDD(date: DateType, delimiter: string = "-"): string {
        const y = date.getFullYear()
        const m = ("0" + (date.getMonth() + 1)).slice(-2)
        const d = ("0" + date.getDate()).slice(-2)
        return [y, m, d].join(delimiter) // `YYYY-MM-DD`
    }

    static getAsYYYYMMDDhhmm(date: DateType): string {
        return `${DateUtil.getAsYYYYMMDD(date)} ${DateUtil.getAsHHMM(date)}`
    }

    static getAsHHMM(date: DateType, delimiter: string = ":"): string {
        const h = ("0" + date.getHours()).slice(-2)
        const m = ("0" + date.getMinutes()).slice(-2)
        return [h, m].join(delimiter)
    }

    static getXYMinuteBeforeDate(date: DateType, minutes: number): DateType {
        const MILI_SEC_PER_MINUTE = 60000
        return new Date(date.getTime() - minutes * MILI_SEC_PER_MINUTE)
    }

    static getMonday(date: DateType): DateType {
        const dayOfWeek = date.getDay()
        const diff = date.getDate() - dayOfWeek + (dayOfWeek == 0 ? -6 : 1) // adjust when day is sunday
        return new Date(date.setDate(diff))
    }

    static getNextWeekDay(date: DateType): DateType {
        return new Date(date.setDate(date.getDate() + 7))
    }

    static getNextDay(date: DateType): DateType {
        return new Date(date.setDate(date.getDate() + 1))
    }

    static getTaskDeadlineString(date: DateType): string {
        return isUndecidedDate(date) ? "未定" : DateUtil.getAsYYYYMMDDhhmm(date)
    }

    static datesAreOnSameDay = (d1: DateType, d2: DateType): boolean => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        )
    }

    static isWorkday = (dayOfWeek: number): boolean => {
        return 1 <= dayOfWeek && dayOfWeek <= 5
    }
}

const deleteTargetTrigger = (triggerName: string): void => {
    ScriptApp.getProjectTriggers().forEach((trigger) => {
        if (trigger.getHandlerFunction() === triggerName) {
            ScriptApp.deleteTrigger(trigger)
        }
    })
}
