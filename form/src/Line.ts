const LineUtil = class {
    static getOptionsForMessage = (
        message: string,
        token: string
    ): URLFetchRequestOptions => {
        return {
            method: "post",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            payload: { message: message },
        }
    }

    static notifyErrMsgByLineNotify = (response: HTTPResponse): void => {
        if (response.getResponseCode() !== 200) {
            LINE.sendDebugLog(response.getContentText())
        }
    }
}

const LINE = class {
    static sendDebugLog = (message: string): void => {
        const options = LineUtil.getOptionsForMessage(
            message,
            props.LINE_NOTIFY_TOKEN
        )
        const response = UrlFetchApp.fetch(
            "https://notify-api.line.me/api/notify",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static _innerPushFunction = (messages: any): HTTPResponse => {
        const options: URLFetchRequestOptions = {
            method: "post",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                Authorization: `Bearer ${props.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            payload: JSON.stringify({
                to: props.LINE_SEND_DEFAULT_ID,
                messages: messages,
            }),
        }
        return UrlFetchApp.fetch(
            "https://api.line.me/v2/bot/message/push",
            options
        )
    }

    static pushNotify = (message: string): void => {
        const options = LineUtil.getOptionsForMessage(
            message,
            props.LINE_NOTIFY_TOKEN_FOR_GROUP
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

    static pushMultiMsgOfficial = (
        postData: any[],
        type: string[],
        altText: string[]
    ): void => {
        const messages = []
        type.forEach((t, i) => {
            messages.push(
                t === "text"
                    ? { type: "text", text: postData[i] }
                    : {
                          type: "flex",
                          altText: altText[i],
                          contents: postData[i],
                      }
            )
        })
        const response = LINE._innerPushFunction(messages)
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static pushMsgByOfficial = (
        postData: any,
        type: string,
        altText: string = "A message"
    ): void => {
        const messages = [
            type === "text"
                ? { type: "text", text: postData }
                : {
                      type: "flex",
                      altText: altText,
                      contents: postData,
                  },
        ]
        const response = LINE._innerPushFunction(messages)
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static replyMsgByOfficial = (
        e: {
            type?: string
            replyToken?: any
            message?: any
        },
        replyData: any,
        type: string,
        altText: string = "A message"
    ) => {
        const options: URLFetchRequestOptions = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            payload: JSON.stringify({
                replyToken: e.replyToken,
                messages: [
                    type === "text"
                        ? { type: "text", text: replyData }
                        : {
                              type: "flex",
                              altText: altText,
                              contents: replyData,
                          },
                    // { type: "text", text: e.message.text } // echo
                ],
            }),
        }
        const response = UrlFetchApp.fetch(
            "https://api.line.me/v2/bot/message/reply",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }

    static replyMultiMsgOfficial = (
        e: {
            type?: string
            replyToken?: any
            message?: any
        },
        replyData: any[],
        type: string[],
        altText: string[]
    ): void => {
        const messages = []
        type.forEach((t, i) => {
            messages.push(
                t === "text"
                    ? { type: "text", text: replyData[i] }
                    : {
                          type: "flex",
                          altText: altText[i],
                          contents: replyData[i],
                      }
            )
        })

        const options: URLFetchRequestOptions = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.LINE_CHANNEL_ACCESS_TOKEN}`,
            },
            payload: JSON.stringify({
                replyToken: e.replyToken,
                messages: messages,
            }),
        }
        // const response = LINE._innerPushFunction(messages)
        const response = UrlFetchApp.fetch(
            "https://api.line.me/v2/bot/message/reply",
            options
        )
        LineUtil.notifyErrMsgByLineNotify(response)
    }
}
