const customMsgImgForDebug = () => {
    // ! unimplemented
    const message = "message"
    const url =
        "https://gitlab.com/ichiya/deploy-image-for-comfes2021/-/raw/image/iconmonstr-check-mark-1-240.png"
    // const url =
    //     "https://gitlab.com/ichiya/deploy-image-for-comfes2021/-/raw/image/R2-timetable-exam4.jpg"

    // const options = LineUtil.makeOptions(
    //     props.LINE_NOTIFY_TOKEN,
    //     JSON.stringify({
    //         message: message,
    //         imageThumbnail: url,
    //         imageFullsize: url,
    //     })
    // )

    // when sending image, `headers` probably cannot include `json...`
    const options: URLFetchRequestOptions = {
        method: "post",
        headers: {
            Authorization: `Bearer ${props.LINE_NOTIFY_TOKEN}`,
        },
        payload: { message: message, imageThumbnail: url, imageFullsize: url },
    }
    LINE.sendCustomDebugLog(options)
}
