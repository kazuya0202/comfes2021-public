/**
 * reset a day timetable
 *  it executes end of `pushTodayInformation`
 */
const resetTimetableNextWeek = (): void => {
    const date = new Date()
    const dayOfWeek = date.getDay()

    if (DateUtil.isWorkday(dayOfWeek)) {
        const table = new Timetable()

        const dateMMDD = DateUtil.getAsMMDD(DateUtil.getNextWeekDay(date), "/")
        const caption = `${dateMMDD} (${dayOfWeek2dayString.en[dayOfWeek]})`
        table.resetDay(caption, dayOfWeek)
    }
}

/**
 * reset all timetable
 * @param e event
 */
const resetDefaultTimetable = (): void => {
    const table = new Timetable()

    const date = DateUtil.getMonday(new Date()) // monday
    // from monday(1) to friday(5)
    for (let i = 1; i <= 5; ++i) {
        const dateMMDD = DateUtil.getAsMMDD(date, "/")
        const caption = `${dateMMDD} (${dayOfWeek2dayString.en[i]})`
        table.resetDay(caption, i)
        date.setDate(date.getDate() + 1)
    }
}

const Timetable = class {
    protected _sheet: Spreadsheet
    protected _changedSheet: Sheet
    protected _defaultSheet: Sheet

    constructor() {
        this._sheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_CLASSES)
        this._defaultSheet = this._sheet.getSheetByName("Default")
        this._changedSheet = this._sheet.getSheetByName("Changed")
    }

    resetDay = (caption: string, dayOfWeek: number) => {
        const c = String.fromCharCode("A".charCodeAt(0) + dayOfWeek) // column char
        this._defaultSheet
            .getRange(`${c}1:${c}9`)
            .copyTo(this._changedSheet.getRange(`${c}1:${c}9`))
        this._changedSheet.getRange(`${c}1`).setValue(caption)
        this._changedSheet.getRange(`${c}10`).setValue("")
    }
}

const TimetableForDay = class {
    protected _dayOfWeek: string
    protected _timetable: string[]
    protected _classesTable: { [key: string]: string }[] = []
    protected _note: string // for dayOfWeek changed ...

    constructor(dayOfWeek: number = 1) {
        // monday: 2, tuesday: 3 ...
        const dayColumn = SpreadsheetApp.openById(props.SHEET_ID_FOR_CLASSES)
            .getSheetByName("Changed")
            .getSheetValues(1, dayOfWeek + 1, 10, 1)
        // .getSheetValues(1, dayOfWeek + 1, 9, 1)

        const _day = [].concat(...dayColumn) // flatten ([[a], [b]...] -> [a, b...])
        this._dayOfWeek = _day[0]
        this._timetable = _day.slice(1, -1)
        // this._timetable = _day.slice(1)
        this._note = _day[9]

        // fill out '-' when value is empty.
        this._timetable.forEach((v, i, array) => {
            array[i] = v ? v : "-"
        })

        for (let i = 0, len = this._timetable.length; i < len; i += 2) {
            if (this._timetable[i] === this.timetable[i + 1]) {
                this.registerClass(`${i + 1}／${i + 2}`, this._timetable[i])
            } else {
                this.registerClass(`${i + 1}`, this._timetable[i])
                this.registerClass(`${i + 2}`, this._timetable[i + 1])
            }
        }
    }

    private registerClass = (period: string, subject: string): void => {
        this._classesTable.push({ period: period, subject: subject })
    }

    get timetable() {
        return this._timetable
    }
    get classesTable() {
        return this._classesTable
    }
    get note() {
        return this._note
    }
}
