/**
 * when webhook was executed, `doPost` will execute
 * @param e event
 */
function doPost(e: { postData: { contents: string } }) {
    // var json = JSON.parse(e.postData.contents)
    // var UID = json.events[0].source.userId
    // var GID = json.events[0].source.groupId
    // line.sendMessage(`user id: ${UID}\ngroup id: ${GID}`)

    // get events
    const events = JSON.parse(e.postData.contents).events
    events.forEach((event: { type: string; message: { text: string } }) => {
        if (event.type === "message") {
            const text = event.message.text
            if (text === "課題リスト") {
                const taskMsg = Impl.getTaskMessage()
                const content = LineUtil.makeContent(
                    taskMsg,
                    `Task list - ${DateUtil.getAsMMDD(new Date())}`
                )
                LINE.replyMsgByOfficial(event, content)
            } else if (text.includes("get info")) {
                // debug for `today's info`
                const runtime = new Date()
                const taskMsg = Impl.getTaskMessage()
                const timetableMsg = Impl.getTimetableMessage()
                const infoMsg = Impl.getInfoMessage()
                const scheduleMsg = Impl.getScheduleMessage(
                    "今日のスケジュール",
                    runtime
                )
                if (text === "get info") {
                    const messageContent = [
                        [scheduleMsg, timetableMsg, infoMsg],
                        taskMsg,
                    ]
                    const content = LineUtil.makeContent(
                        messageContent,
                        DateUtil.getAsMMDD(runtime, "/") + " information"
                    )
                    LINE.replyMsgByOfficial(event, content)
                } else if (text === "get info oneline") {
                    const messageContent = [
                        scheduleMsg,
                        timetableMsg,
                        infoMsg,
                        taskMsg,
                    ]
                    const content = LineUtil.makeContent(
                        messageContent,
                        DateUtil.getAsMMDD(runtime, "/") + " information"
                    )
                    LINE.replyMsgByOfficial(event, content)
                }
            } else {
                LINE.sendDebugLog(text)
                // LINE.replyMsgByOfficial(event, text, "text")
            }
        }
    })
}
