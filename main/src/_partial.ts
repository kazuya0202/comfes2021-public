const __pushTaskList = () => {
    const taskMsg = Impl.getTaskMessage()
    const content = LineUtil.makeContent(
        taskMsg,
        `課題リスト - ${DateUtil.getAsMMDD(new Date())}`
    )
    LINE.pushMsgByOfficial(content)
}

/** this function executes between 00:00 and 01:00 */
const __setTriggerForSchedule = () => {
    const runtime = new Date()

    // whether tommorow's schedule has event
    let hasEvent: boolean = false
    SpreadsheetApp.openById(props.SHEET_ID_FOR_TRIGGER)
        .getDataRange()
        .getValues()
        .forEach((row) => {
            const startDate = new Date(row[3])
            if (DateUtil.datesAreOnSameDay(runtime, startDate)) {
                hasEvent = true
            }
        })
    if (!hasEvent) {
        return
    }

    const createNewTrigger = (
        triggerName: string,
        hour: number = 0,
        min: number = 0
    ): Trigger => {
        deleteTargetTrigger(triggerName)
        const time = new Date()
        time.setHours(hour, min, 0, 0)
        // time.setDate(time.getDate() + 1)
        return ScriptApp.newTrigger(triggerName).timeBased().at(time).create()
    }

    // ! remove this code (2021-02-17)
    const endDate = new Date("2021/04/06 23:59") // unitl 2021-04-06
    if (new Date().getTime() <= endDate.getTime()) {
        createNewTrigger("__pushScheduleOnTrigger", 6, 0)
        LINE.sendDebugLog(`【INFO】\nSet '__pushScheduleOnTrigger' trigger.`)
    }
}

const __pushScheduleOnTrigger = () => {
    const date = new Date()
    const fmSchedule = new flexMessageForSchedule("今日のスケジュール")
    const scheduleMsg = fmSchedule.template

    SpreadsheetApp.openById(props.SHEET_ID_FOR_TRIGGER)
        .getDataRange()
        .getValues()
        .forEach((row) => {
            const startDate = new Date(row[3])

            if (DateUtil.datesAreOnSameDay(date, startDate)) {
                const title = row[2]
                const scheduleRow = fmSchedule.getScheduleRow(
                    `${DateUtil.getAsHHMM(startDate)}～`,
                    title
                )
                scheduleMsg.body.contents.push(scheduleRow)
            }
        })
    if (scheduleMsg.body.contents.length === 0) {
        return
    }

    const content = LineUtil.makeContent(
        scheduleMsg,
        `${DateUtil.getAsMMDDjp(new Date())} のスケジュール`
    )
    LINE.pushMsgByOfficial(content)
}
