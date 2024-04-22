const deletePastTask = () => {
    const runtime = new Date()
    // runtime.setHours(0, 0) // set 00:00

    const pastSheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_PAST_TASK)
    const taskSheet = SpreadsheetApp.openById(
        props.SHEET_ID_FOR_FORM_ANSWER
    ).getSheetByName("Task")

    // get index for deleting
    const deleteRowIndexs: number[] = []
    taskSheet
        .getDataRange()
        .getValues()
        .slice(1) // ignore header
        .forEach((row, i) => {
            const task = new TaskContent(row)
            if (runtime.getTime() > task.timeLimit.getTime()) {
                // append to past sheet
                pastSheet.insertRowBefore(2)
                pastSheet.getRange("A2:F2").setValues([row])
                // pastSheet.appendRow(row)
                // delete index (+2 is [ignore row offset] and [header])
                deleteRowIndexs.push(i + 2 - deleteRowIndexs.length)
            } else {
                LINE.sendDebugLog(`${DateUtil.getAsYYYYMMDDhhmm(task.timeLimit)} is invalid.`)
            }
        })
    // delete row from task sheet
    deleteRowIndexs.forEach((index) => {
        taskSheet.deleteRow(index)
    })
}

const TaskContent = class {
    protected _title: string
    protected _subject: string
    protected _timeLimit: Date
    protected _note: string

    constructor(row: any[]) {
        this._title = row[1]
        this._subject = row[2]
        this._note = row[5]

        if (row[4] === "") {
            row[4] = "23:59"
        }
        this._timeLimit = new Date(row[3])
        const [hour, min] = String(row[4]).split(":").slice(0, 2)
        this._timeLimit.setHours(parseInt(hour), parseInt(min))
    }

    get title() {
        return this._title
    }
    get subject() {
        return this._subject
    }
    get timeLimit() {
        return this._timeLimit
    }
    get note() {
        return this._note
    }
}
