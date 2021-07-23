import s from './WebSockets.module.scss'
import React, {useState} from "react";

export const WebSockets = () => {
const [messages, setMessages] = useState([{a: 6, b: 7}, {a: 6, b: 7}])

    return (
        <div className={s.container}>
            WebSockets
        </div>
    )
}