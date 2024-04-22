const notifyForDebug = () => {
    const taskMsg = Impl.getTaskMessage()
    const timetableMsg = Impl.getTimetableMessage()
    const infoMsg = Impl.getInfoMessage()

    const today = new Date()
    const scheduleMsg = Impl.getScheduleMessage("今日のスケジュール", today)

    const data = {
        type: "carousel",
        contents:
            timetableMsg === null
                ? [taskMsg, scheduleMsg, infoMsg]
                : [taskMsg, timetableMsg, scheduleMsg, infoMsg],
    }

    // for debug
    const DOC_ID = ""
    const doc = DocumentApp.openById(DOC_ID)
    doc.getBody().appendParagraph(JSON.stringify(data))
    doc.saveAndClose()
}

const Impl = class {
    static getTimetableMessage = () => {
        const runtimeDate = new Date()
        const dayOfWeek = runtimeDate.getDay() // get day of week

        let timetableMsg = null
        if (DateUtil.isWorkday(dayOfWeek)) {
            const dateMMDD = DateUtil.getAsMMDDjp(runtimeDate)

            // get timetable of day of week
            const tableSheet = new TimetableForDay(dayOfWeek)

            let title = `${dateMMDD} (${dayOfWeek2dayString.jp[dayOfWeek][0]}) の時間割`
            if (tableSheet.note !== "") {
                title = `${title}\n［${tableSheet.note}］` // note (schedule changed...)
            }
            // flex message utility for timetable
            const fmTimetable = new flexMessageForTimetable(title)
            // get template of timetable
            timetableMsg = fmTimetable.template
            // append class to timetable
            tableSheet.classesTable.forEach((x) => {
                const classRow: any = fmTimetable.getClassRow(
                    x.period,
                    x.subject
                )
                timetableMsg.body.contents.push(classRow)
            })
        }
        return timetableMsg
    }

    static getInfoMessage = () => {
        // flex message utility for infomation
        const fmInfo = new flexMessageForInfo()
        // get template
        const infoMsg = fmInfo.template

        // ! remove this code (2021-01-26)
        const endDate = new Date("2021/02/10 23:59") // append unitl 2021-02-10
        if (new Date().getTime() <= endDate.getTime()) {
            infoMsg.body.contents.push(fmInfo.getContentOfExamDetail())
        }

        return infoMsg
    }

    static getScheduleMessage = (header: string, date: DateType) => {
        // const fmSchedule = new flexMessageForSchedule("明日のスケジュール")
        const fmSchedule = new flexMessageForSchedule(header)
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
            scheduleMsg.body.contents.push(getNoneTextMessage())
        }

        // ! remove this code (2021-01-26)
        const endDate = new Date("2021/02/10 23:59") // append unitl 2021-02-10
        if (new Date().getTime() <= endDate.getTime()) {
            scheduleMsg.body.contents.push(
                fmSchedule.getContentOfTimetableImg()
            )
        }
        return scheduleMsg
    }

    static getTaskMessage = () => {
        const fmTask = new flexMessageForTask(`課題リスト`)
        // get template of task
        const taskMsg = fmTask.template

        deletePastTask()

        // append taskContent to task
        SpreadsheetApp.openById(props.SHEET_ID_FOR_FORM_ANSWER)
            .getSheetByName("Task")
            .getDataRange()
            .getValues()
            .slice(1) // ignore header
            .forEach((row) => {
                const taskContent = new TaskContent(row)
                let mainContent = `【${taskContent.subject}】${taskContent.title}`
                // append `note`
                if (taskContent.note !== "") {
                    mainContent = `${mainContent}（${taskContent.note}）`
                }

                const dateYYYYMMDDhhmm = DateUtil.getTaskDeadlineString(
                    taskContent.timeLimit
                )
                const taskRow: any = fmTask.getTaskRow(
                    mainContent,
                    taskContent.timeLimit,
                    `～ ${dateYYYYMMDDhhmm}`
                )
                taskMsg.body.contents.push(taskRow)
            })
        if (taskMsg.body.contents.length === 0) {
            taskMsg.body.contents.push(getNoneTextMessage())
        }

        // ! remove this code (2021-01-26)
        const endDate = new Date("2021/02/10 23:59") // append unitl 2021-02-10
        if (new Date().getTime() <= endDate.getTime()) {
            taskMsg.body.contents.push(
                fmTask.getFooterOfExamNote()
            )
        }

        return taskMsg
    }
}
