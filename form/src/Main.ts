type eventJsonType = {
    authMode: string
    namedValues: {
        教科: string[]
        "締め切り期限（時刻）": string[]
        イベント時刻: string[]
        "締め切り期限（日程）": string[]
        課題タイトル: string[]
        "その他（備考）": string[]
        タイプ: string[]
        タイムスタンプ: string[]
        イベントタイトル: string[]
    }
    range: {
        columnEnd: number
        columnStart: number
        rowEnd: number
        rowStart: number
    }
    source: {}
    triggerUid: string
    values: string[]
}

const onSubmit = (e: eventJsonType) => {
    const sheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_FORM_ANSWER)

    const values = e.namedValues

    /** update values */
    // const ansSheet: Sheet = sheet.getSheets[0]
    // const lastRowNum = ansSheet.getDataRange().getNumRows()
    // if (e.range.rowStart <= lastRowNum) {
    //     const range = ansSheet.getRange(
    //         e.range.rowStart,
    //         e.range.columnStart,
    //         1,
    //         e.range.columnEnd
    //     )
    //     const v = range.getValues()[0]

    //     // update when value was changed
    //     if (values.タイプ[0] === "課題の登録") {
    //         v[0] = values.タイムスタンプ[0] ?? v[0]
    //         v[1] = values.課題タイトル[0] ?? v[1]
    //         v[2] = values.教科[0] ?? v[2]
    //         v[3] = values["締め切り期限（日程）"][0] ?? v[3]
    //         v[4] = values["締め切り期限（時刻）"][0] ?? v[4]
    //         v[5] = values["その他（備考）"][0] ?? v[5]
    //     } else if (values.タイプ[0] === "イベントの登録") {
    //         v[0] = values.タイムスタンプ[0] ?? v[0]
    //         v[1] = values.イベントタイトル[0] ?? v[1]
    //         v[2] = values.イベント時刻[0] ?? v[2]
    //     }
    //     range.setValues([v])
    // } else {
    if (values.タイプ[0] === "課題の登録") {
        sheet.getSheetByName("Task").appendRow([
            values.タイムスタンプ[0],
            values.課題タイトル[0],
            values.教科[0],
            values["締め切り期限（日程）"][0],
            "'" + values["締め切り期限（時刻）"][1], // '12:00
            values["その他（備考）"][0],
        ])

        // notify log
        LINE.sendDebugLog(
            `\n【INFO】\n` +
                `【${values.教科[0]}】${values.課題タイトル[0]}（${values["その他（備考）"][0]}）\n` +
                `～ ${values["締め切り期限（日程）"][0]} ${
                    "'" + values["締め切り期限（時刻）"][1]
                }`
        )
    } else if (values.タイプ[0] === "イベントの登録") {
        sheet
            .getSheetByName("Event")
            .appendRow([
                values.タイムスタンプ[0],
                values.イベントタイトル[0],
                values.イベント時刻[0],
            ])

        // create event trigger
        const runtimeDate = new Date()
        const startDate = new Date(values.イベント時刻[0])

        if (runtimeDate.getTime() <= startDate.getTime()) {
            const remindDate = DateUtil.getXYMinuteBeforeDate(startDate, 10)
            // event begin within 10 minutes
            if (runtimeDate.getTime() >= remindDate.getTime()) {
                const diffMin = Math.round(
                    (startDate.getTime() - runtimeDate.getTime()) / 60000
                )
                // message
                const msg = `【リマインダー】\n「${values.イベントタイトル[0]}」が${diffMin}分後に始まります。`

                // * push notify
                LINE.pushNotify(msg)
            } else {
                const trigger = ScriptApp.newTrigger("sendRemindEvent")
                    .timeBased()
                    .at(remindDate)
                    .create()
                SpreadsheetApp.openById(props.SHEET_ID_FOR_TRIGGER).appendRow([
                    trigger.getUniqueId(),
                    trigger.getHandlerFunction(),
                    values.イベントタイトル[0],
                    startDate,
                ])
            }
        }

        // notify log
        LINE.sendDebugLog(
            `\n【INFO】\n${values.イベントタイトル[0]}\n${startDate} ～`
        )
    }
    // }
}

/**
 * send message to line
 * @param e event trigger
 */
const sendRemindEvent = (e: any): void => {
    let title = null

    // open sheet, get sheet table
    const triggerSheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_TRIGGER)
    triggerSheet
        .getDataRange()
        .getValues()
        .forEach((v, i) => {
            // if trigger uniqueId matched, update title
            if (e.triggerUid === v[0]) {
                title = v[2]

                // delete
                triggerSheet.deleteRow(i + 1)

                // TODO: new feature (add to another project)
                // delete trigger
                ScriptApp.getProjectTriggers().forEach((trigger) => {
                    if (trigger.getUniqueId() === e.triggerUid) {
                        ScriptApp.deleteTrigger(trigger)
                    }
                })
            }
        })

    // if trigger uniqueId does not matched, return
    if (title === null) {
        LINE.sendDebugLog(`\n【WARNING】\n${e.triggerUid} is not found.`)
        return
    }

    // message
    const msg = `【リマインダー】\n約10分後に「${title}」が始まります。`

    // * push notify
    LINE.pushNotify(msg)
}
