/**
 * set tomorrow trigger
 *  this function executes between 22:00 and 23:00
 * @param e event
 */
const setProjectTrigger = (e: any): void => {
    const createNewTrigger = (
        triggerName: string,
        hour: number = 0,
        min: number = 0
    ): Trigger => {
        deleteTargetTrigger(triggerName)
        const time = new Date()
        time.setHours(hour, min, 0, 0)
        // time.setHours(time.getHours(), time.getMinutes() + 1) // debug
        time.setDate(time.getDate() + 1)
        return ScriptApp.newTrigger(triggerName).timeBased().at(time).create()
    }

    createNewTrigger("registerRemindEventTrigger", 0, 0)
    createNewTrigger("pushTodayInformation", 6, 0)
    // createNewTrigger("notifyTomorrowInfo", 18, 0)

    LINE.sendDebugLog(`【INFO】\n'setProjectTrigger' was executed.`)
}

/**
 * push flex message for today's information
 * @param e event
 */
function pushTodayInformation(e: any): void {
    // get date on runtime
    const runtimeDate = new Date()

    // ! don't push message during vacation
    const endDate = new Date("2021/02/12 23:59")
    if (endDate.getTime() < runtimeDate.getTime()) {
        LINE.sendDebugLog("【INFO】\nToday is not a workday.")
        return
    }

    const dayOfWeek = runtimeDate.getDay()
    if (!DateUtil.isWorkday(dayOfWeek)) {
        LINE.sendDebugLog("【INFO】\nToday is a holiday.")
        return
    }

    const taskMsg = Impl.getTaskMessage()
    const timetableMsg = Impl.getTimetableMessage()
    const infoMsg = Impl.getInfoMessage()
    const scheduleMsg = Impl.getScheduleMessage(
        "今日のスケジュール",
        runtimeDate
    )

    // * for one hot bubble (line message card)
    // const messageContent = [scheduleMsg, taskMsg, timetableMsg, infoMsg]

    const messageContent = [[scheduleMsg, timetableMsg, infoMsg], taskMsg]
    const content = LineUtil.makeContent(
        messageContent,
        DateUtil.getAsMMDD(runtimeDate, "/") + " information"
    )
    LINE.pushMsgByOfficial(content)

    // reset
    resetTimetableNextWeek()
}

/**
 * notify 18:00
 */
const notifyTomorrowInfo = (e: any): void => {
    return // TODO: 2021-01-13 無料数を超えてしまうため，実行しない（notifyによるテキストメッセージの代用を検討）

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const scheduleMsg = Impl.getScheduleMessage("明日のスケジュール", tomorrow)
    const taskMsg = Impl.getTaskMessage()

    // TODO: 2021-01-13 無料数を超えてしまうため，実行しない（notifyによるテキストメッセージの代用を検討）
    // const messageContent = [scheduleMsg, taskMsg]
    // const content = LineUtil.makeContent(messageContent, "[message]")
    // LINE.pushMsgByOfficial(content)
}
