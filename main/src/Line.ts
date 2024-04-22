type LineMessageContentType = {
    data: any[]
    types: string[]
    altTexts: string[]
}

const LineUtil = class {
    static notifyErrMsgByLineNotify = (response: HTTPResponse): void => {
        if (response.getResponseCode() !== 200) {
            LINE.sendDebugLog(response.getContentText())
        }
    }

    static makeContent = (
        messageContent: any,
        altText: string
    ): LineMessageContentType => {
        const content = {
            data: [] as any[],
            types: [] as string[],
            altTexts: [] as string[],
        }
        if (messageContent instanceof Array) {
            messageContent.forEach((elm) => {
                if (elm === null) return

                if (elm instanceof Array) {
                    const _tmp = elm.filter((e) => e) // remove null
                    if (_tmp.length === 0) return

                    content.data.push(
                        _tmp.length === 1
                            ? _tmp[0]
                            : {
                                  type: "carousel",
                                  contents: _tmp,
                              }
                    )
                } else {
                    content.data.push(elm)
                }

                content.types.push(typeof elm === "string" ? "text" : "flex")
                content.altTexts.push(altText)
            })
        } else {
            content.data.push(messageContent)
            content.types.push(
                typeof messageContent === "string" ? "text" : "flex"
            )
            content.altTexts.push(altText)
        }
        return content
    }

    static makeMessages = (content: LineMessageContentType): any[] => {
        const messages = []
        content.data.forEach((data, i) => {
            messages.push(
                content.types[i] === "text"
                    ? { type: "text", text: data }
                    : {
                          type: "flex",
                          altText: content.altTexts[i],
                          contents: data,
                      }
            )
        })
        return messages
    }

    static makeOptions = (
        headerToken: string,
        payload: string
    ): URLFetchRequestOptions => {
        return {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${headerToken}`,
            },
            payload: payload,
        }
    }
}

const LINE = class {
    static sendDebugLog = (message: string): void => {
        const options: URLFetchRequestOptions = {
            method: "post",
            headers: {
                Authorization: `Bearer ${props.LINE_NOTIFY_TOKEN}`,
            },
            payload: { message: message },
        }
        const response = UrlFetchApp.fetch(
            "https://notify-api.line.me/api/notify",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static pushNotify = (message: string): void => {
        const options = LineUtil.makeOptions(
            props.LINE_NOTIFY_TOKEN_FOR_GROUP,
            JSON.stringify({ message: message })
        )
        const response = UrlFetchApp.fetch(
            "https://notify-api.line.me/api/notify",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static sendCustomDebugLog = (options: URLFetchRequestOptions): void => {
        const response = UrlFetchApp.fetch(
            "https://notify-api.line.me/api/notify",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static pushMsgByOfficial = (content: LineMessageContentType): void => {
        const options = LineUtil.makeOptions(
            props.LINE_CHANNEL_ACCESS_TOKEN,
            JSON.stringify({
                to: props.LINE_SEND_DEFAULT_ID,
                messages: LineUtil.makeMessages(content),
            })
        )
        const response = UrlFetchApp.fetch(
            "https://api.line.me/v2/bot/message/push",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static replyMsgByOfficial = (
        e: {
            type?: string
            replyToken?: any
            message?: any
        },
        content: LineMessageContentType
    ) => {
        const options = LineUtil.makeOptions(
            props.LINE_CHANNEL_ACCESS_TOKEN,
            JSON.stringify({
                replyToken: e.replyToken,
                messages: LineUtil.makeMessages(content),
            })
        )
        const response = UrlFetchApp.fetch(
            "https://api.line.me/v2/bot/message/reply",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }
}
