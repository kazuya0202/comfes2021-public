/**
 * register remind event to spreadsheet
 */
const registerRemindEventTrigger = (e: any): void => {
    // sheet for enumerating event config
    const triggerSheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_TRIGGER)

    // delete past event trigger
    deleteTargetTrigger("sendRemindEvent")
    // clear values of sheet
    // triggerSheet.getDataRange().clear()

    // get Date on runtime
    const runtimeDate = new Date()

    // get event on day of `runtimeDate`
    CalendarApp.getCalendarById(props.CALENDAR_ID_FOR_EVENT)
        .getEventsForDay(runtimeDate)
        .forEach((e: CalendarEvent) => {
            // get event date
            const startDate = e.getStartTime()
            // const endDate = e.getEndTime()

            // verify that it is not the past event
            // if (runtimeDate.getTime() < startDate.getTime()) {

            const _min = startDate.getMinutes()
            if (startDate.getHours() === 0 && 0 <= _min && _min <= 10) {
                // message
                const msg = `【リマインダー】\n「${e.getTitle()}」が始まります。`

                // * push notify
                LINE.pushNotify(msg)
            } else {
                // set trigger time 10 minutes before than `startDate`
                const time = DateUtil.getXYMinuteBeforeDate(startDate, 10)
                time.setSeconds(0, 0)
                // create trigger
                const trigger = ScriptApp.newTrigger("sendRemindEvent")
                    .timeBased()
                    .at(time)
                    .create()

                // [trigger unique id | trigger function name | title | date |]
                triggerSheet.appendRow([
                    trigger.getUniqueId(),
                    trigger.getHandlerFunction(),
                    e.getTitle(),
                    startDate,
                ])
            }

            // }
        })
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
