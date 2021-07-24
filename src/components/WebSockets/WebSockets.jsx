import s from './WebSockets.module.scss'
import React, {useEffect, useState} from "react";
import {io} from "socket.io-client";

// const socket = io("wss://trade.trademux.net:8800/?password=1234")


export const WebSockets = () => {

    let socket;
    let values = []
    let startTime;
    let endTime;
    let time;

    useEffect(() => {
        return socket && socket.close(3000, 'socket closed')
    }, [])

    const getDate = (time) => {
       const days = Math.floor(time / (1000 * 60 * 60 * 24) % 30)
           const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
           const minutes = Math.floor((time / (1000 * 60)) % 60)
           const seconds = Math.floor((time / 1000) % 60)
        return `${days} дней, ${hours} часов, ${minutes} минут, ${seconds} секунд`
    }

    const onStartHandler = () => {
        startTime = new Date()
        socket = new WebSocket("wss://trade.trademux.net:8800/?password=1234");
        console.log(socket)

        socket.onmessage = function (event) {
            values.push(JSON.parse(event.data))
        };

    }

    const onStatisticEnteredHandler = () => {
        const newArray = values.map(el => {
            return {id: el.id, value: el.value}
        })
        endTime = new Date()
        time = getDate(endTime - startTime);
        console.log(time)
        console.log('socket', socket)
        console.log('newArray',newArray)
        // const newArray = values.map((el) => {
        //
        // })

    }

    const onCloseHandler = () => {
        socket && socket.close(3000, 'socket closed')
        console.log(socket)
        values = []
        startTime = 0
    }

    return (
        <div className={s.container}>
            <h2>WebSockets</h2>
            <div className={s.buttonsBlock}>
                <button onClick={onStartHandler}>Старт</button>
                <button onClick={onStatisticEnteredHandler}>Статистика</button>
                <button onClick={onCloseHandler}>Закрыть содинение</button>
            </div>
        </div>
    )
}