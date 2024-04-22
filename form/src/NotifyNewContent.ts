const notifyForDebug_NewRegistratedContent = (e: any): void => {
    let msg = _notifyMain()

    if (msg != "") {
        msg = `◆ NEW!! ◆\n${msg}`
        LINE.sendDebugLog(msg)
    }
}

const _setTrigger_pushNewRegistratedContent = (): void => {
    deleteTargetTrigger("pushNewRegistratedContent")

    const date = new Date()
    date.setHours(date.getHours() + Math.ceil(date.getMinutes() / 60))
    date.setMinutes(0, 0, 0)

    ScriptApp.newTrigger("pushNewRegistratedContent")
        .timeBased()
        .at(date)
        .create()
}

const pushNewRegistratedContent = (e: any): void => {
    const now = new Date()
    now.setHours(now.getHours() + 1, 0, 0, 0) // adjust
    // re-create trigger before process
    deleteTargetTrigger("pushNewRegistratedContent")
    ScriptApp.newTrigger("pushNewRegistratedContent")
        .timeBased()
        .at(now)
        .create()

    let msg = _notifyMain()

    if (msg != "") {
        msg = `◆ NEW!! ◆\n${msg}`
        LINE.pushNotify(msg)
    }
}

const _notifyMain = (): string => {
    const sheet = SpreadsheetApp.openById(props.SHEET_ID_FOR_FORM_ANSWER)
    const ansSheet = sheet.getSheets()[0]

    const contents = {
        task: [],
        event: [],
    }

    const runtime = new Date()

    // runtime.setHours(0, 0, 0, 0)
    ansSheet
        .getDataRange()
        .getValues()
        .forEach((row) => {
            const timestamp = new Date(row[0])
            // timestamp.setHours(0, 0, 0, 0)

            // 3600000 == (1000 * 60 * 60)
            const diff = runtime.getTime() - timestamp.getTime()
            if (diff <= 3600000) {
                if (row[1] === "課題の登録") {
                    const date = new Date(row[4])
                    const _time =
                        row[9] !== ""
                            ? new Date(row[9])
                            : new Date("2030/01/01 23:59:00")
                    // const [hour, min] = _time.split(":").slice(0, 2)
                    // date.setHours(parseInt(hour), parseInt(min))
                    date.setHours(_time.getHours(), _time.getMinutes())

                    const dateString = DateUtil.getTaskDeadlineString(date)
                    const note = row[6] !== "" ? `（${row[6]}）` : ""
                    const _tmp = `・【${row[3]}】${row[2]}${note}\n　　～${dateString}`
                    contents.task.push(_tmp)
                }
                // * comment out (2021/02/13)
                // else if (row[1] === "イベントの登録") {
                //     const dateString = DateUtil.getAsYYYYMMDDhhmm(
                //         new Date(row[8])
                //     )
                //     const _tmp = `・${row[7]}\n　　${dateString}～`
                //     contents.event.push(_tmp)
                // }
            }
        })

    let msg = ""
    if (contents.task.length !== 0) {
        msg = `${msg}＜課題＞\n`
        contents.task.forEach((v) => {
            msg = `${msg}${v}\n`
        })
    }

    // * comment out (2021/02/13)
    // if (contents.event.length !== 0) {
    //     msg = `${msg}\n＜イベント＞\n`
    //     contents.event.forEach((v) => {
    //         msg = `${msg}${v}\n`
    //     })
    // }
    msg = msg.trim()
    return msg
}
