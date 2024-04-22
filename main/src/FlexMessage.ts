const getTextMessage = (msg: string) => {
    return {
        type: "text",
        color: "#000000",
        text: msg,
    }
}

const getNoneTextMessage = () => {
    return getTextMessage("None")
}

const flexMessageForSchedule = class {
    protected _schedule: {
        type: string
        header: {
            type: string
            layout: string
            contents: any[]
            spacing: string
            margin: string
        }
        body: {
            type: string
            layout: string
            contents: any[]
            paddingTop: string
            spacing: string
        }
        // TODO: 2021-01-11 変更は自分だけでやるため除外
        // footer: {
        //     type: string
        //     layout: string
        //     contents: {
        //         type: string
        //         layout: string
        //         contents: {
        //             type: string
        //             action: { type: string; label: string; uri: string }
        //             style: string
        //             height: string
        //         }[]
        //         spacing: string
        //         margin: string
        //         paddingStart: string
        //         paddingEnd: string
        //     }[]
        //     spacing: string
        // }
    }

    constructor(header: string) {
        this._schedule = {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "SCHEDULE",
                        size: "sm",
                        weight: "bold",
                        color: "#1DB446",
                    },
                    {
                        type: "text",
                        text: header,
                        weight: "bold",
                        size: "xl",
                        align: "start",
                    },
                ],
                spacing: "none",
                margin: "none",
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [],
                paddingTop: "0%",
                spacing: "md",
            },
            // TODO: 2021-01-11 変更は自分だけでやるため除外
            // footer: {
            //     type: "box",
            //     layout: "vertical",
            //     contents: [
            //         {
            //             type: "box",
            //             layout: "vertical",
            //             contents: [
            //                 {
            //                     type: "button",
            //                     action: {
            //                         type: "uri",
            //                         label: "イベントを登録する",
            //                         uri:
            //                             "https://docs.google.com/forms/...",
            //                     },
            //                     style: "primary",
            //                     height: "sm",
            //                 },
            //             ],
            //             spacing: "none",
            //             margin: "none",
            //             paddingStart: "5%",
            //             paddingEnd: "5%",
            //         },
            //     ],
            //     spacing: "lg",
            // },
        }
    }

    get template() {
        return this._schedule
    }

    getScheduleRow = (timeString: string, title: string): any => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "text",
                            text: timeString,
                            wrap: true,
                            color: "#000000",
                        },
                        {
                            type: "text",
                            text: title,
                            wrap: true,
                            color: "#000000",
                        },
                    ],
                    paddingStart: "5%",
                    paddingEnd: "5%",
                },
                {
                    type: "separator",
                    margin: "xs",
                },
            ],
        }
    }

    // ! remove this code (2021-01-26)
    getContentOfTimetableImg = () => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "separator",
                },
                {
                    type: "image",
                    url:
                        "https://gitlab.com/ichiya/deploy-image-for-comfes2021/-/raw/image/R2-timetable-exam4.jpg",
                    aspectMode: "cover",
                    aspectRatio: "9:5",
                    size: "full",
                },
            ],
            spacing: "md",
        }
    }
}

const flexMessageForInfo = class {
    protected _info: {
        type: string
        header: {
            type: string
            layout: string
            contents: any[]
            spacing: string
            margin: string
        }
        body: {
            type: string
            layout: string
            contents: any[]
            paddingTop: string
            spacing: string
        }
    }

    constructor() {
        this._info = {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "INFORMATION",
                        size: "sm",
                        weight: "bold",
                        color: "#1DB446",
                    },
                    {
                        type: "text",
                        text: "インフォメーション",
                        weight: "bold",
                        size: "xl",
                        align: "start",
                    },
                ],
                spacing: "none",
                margin: "none",
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "button",
                        action: {
                            type: "uri",
                            label: "健康観察を入力する",
                            uri: "https://...",
                        },
                        style: "secondary",
                        height: "sm",
                    },
                ],
                paddingTop: "0%",
                spacing: "sm",
            },
        }
    }

    // ! remove this code (2021-01-26)
    getContentOfExamDetail = () => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "separator",
                    margin: "md",
                },
                {
                    type: "text",
                    text: "◆ 学年末試験について",
                    size: "lg",
                },
                {
                    type: "button",
                    action: {
                        type: "uri",
                        uri:
                            "https://docs.google.com/spreadsheets/...",
                        label: "試験・レポート詳細",
                    },
                    style: "secondary",
                    height: "sm",
                },
            ],
            spacing: "md",
        }
    }

    get template() {
        return this._info
    }
}

/**
 * flex message utility for task
 * @param header header
 * @param dateYYYYMMDD date string
 */
const flexMessageForTask = class {
    // protected _task: any

    // type was generated by auto complete (`Ctrl+.`)
    protected _task: {
        type: string
        header: {
            type: string
            layout: string
            contents: any[]
        }
        body: {
            type: string
            layout: string
            contents: any[]
            spacing: string
            margin: string
            borderWidth: string
            paddingTop: string
            paddingBottom: string
        }
        footer: {
            type: string
            layout: string
            contents: any[]
            paddingStart: string
            paddingEnd: string
            spacing: string
        }
    }
    protected deadlineColor: string
    protected runtime: DateType

    // constructor(header: string, dateYYYYMMDD: string) {
    constructor(header: string) {
        this.runtime = new Date()
        this.runtime.setHours(0, 0, 0, 0)

        this._task = {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        size: "sm",
                        weight: "bold",
                        color: "#1DB446",
                        text: "TASK",
                    },
                    {
                        type: "text",
                        text: header,
                        weight: "bold",
                        size: "xl",
                        align: "start",
                    },
                ],
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [],
                spacing: "none",
                margin: "none",
                borderWidth: "none",
                paddingTop: "0%",
                paddingBottom: "0%",
            },
            footer: {
                type: "box",
                layout: "vertical",
                contents: [
                    // TODO: 2021-01-11 変更は自分だけでやるため除外
                    // {
                    //     type: "button",
                    //     action: {
                    //         type: "uri",
                    //         label: "課題を追加する",
                    //         uri:
                    //             "https://docs.google.com/forms/...",
                    //     },
                    //     style: "primary",
                    //     height: "sm",
                    // },
                    {
                        type: "button",
                        action: {
                            type: "uri",
                            label: "過去の課題一覧を見る",
                            uri:
                                "https://docs.google.com/spreadsheets/...",
                        },
                        style: "secondary",
                        height: "sm",
                    },
                ],
                paddingStart: "10%",
                paddingEnd: "10%",
                spacing: "sm",
            },
        }
    }

    // getter
    get template() {
        return this._task
    }

    // ! remove this code (2021-01-26)
    getFooterOfExamNote = () => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "* 学年末試験代わりの課題",
                },
            ],
            margin: "md",
            spacing: "md",
        }
    }

    // partial component
    // getTaskRow(taskName: string, dateLimitString: string) {
    getTaskRow(taskName: string, date: DateType, dateLimitString: string) {
        const diffDays = Math.floor(
            (date.getTime() - this.runtime.getTime()) / (1000 * 60 * 60 * 24)
        )

        this.deadlineColor = "#aaaaaa" // default color

        if (diffDays <= 1 || (new Date().getDay() === 5 && diffDays <= 3)) {
            // within 1 day
            // OR friday (runtime) and within 3 days
            this.deadlineColor = "#dc1919"
        }

        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "box",
                    layout: "baseline",
                    contents: [
                        {
                            type: "icon",
                            url:
                                "https://gitlab.com/ichiya/deploy-image-for-comfes2021/-/raw/image/iconmonstr-check-mark-1-240.png",
                            size: "md",
                        },
                        {
                            type: "text",
                            text: taskName,
                            margin: "sm",
                            wrap: true,
                        },
                    ],
                },
                { type: "separator" },
                {
                    type: "text",
                    text: dateLimitString,
                    // color: "#aaaaaa",
                    color: this.deadlineColor,
                    align: "end",
                    size: "md",
                },
            ],
        }
    }
}

/**
 * flex message utility for timetable
 * @param header header
 * @param dateYYYYMMDD date string
 */
const flexMessageForTimetable = class {
    // protected _timetable: any

    // type was generated by auto complete (`Ctrl+.`)
    protected _timetable: {
        type: string
        header: {
            type: string
            layout: string
            contents: any[]
            spacing: string
            margin: string
        }
        body: {
            type: string
            layout: string
            contents: any[]
            spacing: string
            margin: string
            borderWidth: string
            paddingTop: string
            // paddingBottom: string
            justifyContent: string
        }
        // footer: {
        //     type: string
        //     layout: string
        //     contents: any[]
        //     paddingStart: string
        //     paddingEnd: string
        // }
    }

    // constructor(header: string, dateYYYYMMDD: string) {
    constructor(header: string) {
        this._timetable = {
            type: "bubble",
            header: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "text",
                        text: "TIMETABLE",
                        size: "sm",
                        weight: "bold",
                        color: "#1DB446",
                    },
                    {
                        type: "text",
                        text: header,
                        weight: "bold",
                        size: "xl",
                        align: "start",
                        wrap: true,
                    },
                ],
                spacing: "none",
                margin: "none",
            },
            body: {
                type: "box",
                layout: "vertical",
                contents: [
                    {
                        type: "box",
                        layout: "horizontal",
                        contents: [
                            {
                                type: "text",
                                text: "時限",
                                align: "center",
                                color: "#1DB446",
                                size: "lg",
                                weight: "bold",
                            },
                            {
                                type: "text",
                                text: "教科",
                                weight: "bold",
                                align: "center",
                                color: "#1DB446",
                                size: "lg",
                            },
                        ],
                    },
                    { type: "separator", margin: "md" },
                ],
                spacing: "none",
                margin: "none",
                borderWidth: "none",
                paddingTop: "0%",
                // paddingBottom: "0%", // TODO: 2021-01-11 見栄えの関係でコメントアウト
                justifyContent: "flex-start",
            },
            // TODO: 2021-01-11 変更は自分だけでやるため除外
            // footer: {
            //     type: "box",
            //     layout: "vertical",
            //     contents: [
            //         {
            //             type: "button",
            //             action: {
            //                 type: "uri",
            //                 label: "時間割を変更する",
            //                 uri:
            //                     "https://docs.google.com/spreadsheets/...",
            //             },
            //             style: "secondary",
            //             height: "sm",
            //         },
            //     ],
            //     paddingStart: "10%",
            //     paddingEnd: "10%",
            // },
        }
    }

    // getter
    get template() {
        return this._timetable
    }

    // partial component
    getClassRow(period: string, subject: string) {
        return {
            type: "box",
            layout: "horizontal",
            contents: [
                {
                    type: "text",
                    text: period,
                    align: "center",
                    size: "md",
                    wrap: true,
                },
                {
                    type: "text",
                    text: subject,
                    align: "center",
                    size: "md",
                    wrap: true,
                },
            ],
            paddingTop: "5%",
        }
    }
}
