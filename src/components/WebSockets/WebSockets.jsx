import s from './WebSockets.module.scss'
import React, {useEffect, useState} from "react";

let socket;
let values = []
let startTime;
let endTime;
let time;
let firstId
let lastId

let averageValue
let valuesLength
let sortedValues



export const WebSockets = () => {



    const [results, setResults] = useState([])

    const onWebsocketCloseFunction = () => {
        socket && socket.close && socket.close(3000, 'socket closed')
        socket = {}
        values = []
        startTime = 0
        setResults([])
    }

    useEffect(() => {

        return onWebsocketCloseFunction
    }, [])

    const getMode = () => {
        const array = sortedValues

        let bestStreak = 1;
        let bestElem = array[0];
        let currentStreak = 1;
        let currentElem = array[0];

        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] !== array[i]) {
                if (currentStreak > bestStreak) {
                    bestStreak = currentStreak;
                    bestElem = currentElem;
                }

                currentStreak = 0;
                currentElem = array[i];
            }

            currentStreak++;
        }

        return currentStreak > bestStreak ? currentElem : bestElem;
    };

    const median = () => {
        const numbers = sortedValues
        let median = 0, numsLen = valuesLength;

        if (numsLen % 2 === 0) {
            median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
        } else {
            median = numbers[(numsLen - 1) / 2];
        }

        return median;
    }

    const standardDeviation = (values) => {
        let avg = averageValue;

        let squareDiffs = values.map(function (value) {
            let diff = value - avg;
            let sqrDiff = diff * diff;
            return sqrDiff;
        });

        let avgSquareDiff = average(squareDiffs);

        let stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }


    const getDate = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24) % 30)
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((time / (1000 * 60)) % 60)
        const seconds = Math.floor((time / 1000) % 60)
        return `${days} дн, ${hours} ч, ${minutes} мин, ${seconds} сек`
    }

    function average(items) {
        let sum = 0;
        for (let i = 0; i < valuesLength; i++) {
            sum += items[i];
        }
        return sum / valuesLength;
    }

    const countLoseQuotation = () => {
        return lastId - firstId - valuesLength + 1
    }

    const onStartHandler = () => {
        values = []
        setResults([])
        startTime = new Date()
        socket = new WebSocket("wss://trade.trademux.net:8800/?password=1234");
        console.log(socket)

        socket.onmessage = function (event) {
            const obj = JSON.parse(event.data)
            values.push(obj.value)

            if (values.length === 1) {
                firstId = obj.id
            } else {
                lastId = obj.id
            }
        };

    }

    const onStatisticEnteredHandler = () => {

        endTime = new Date()
        time = getDate(endTime - startTime);

        valuesLength = values.length
        averageValue = average(values)
        sortedValues = values.sort()

        if (values.length > 0) {
            setResults(prevState => {
                return [...prevState, {
                    time,
                    loseQuotation: countLoseQuotation(),
                    average: averageValue.toFixed(2),
                    standardDeviation: standardDeviation(values).toFixed(2),
                    mode: getMode(),
                    median: median()
                }]
            })
        } else {
            alert('Сначала нажмите старт. Затем подождите немного. Либо недостаточно времени для статистики. Подожди немного')
        }
    }

    const onCloseHandler = () => {
        onWebsocketCloseFunction()
    }

    return (
        <div className={s.container}>
            <h2>WebSockets</h2>
            <div className={s.buttonsBlock}>
                <button onClick={onStartHandler}>Старт</button>
                <button onClick={onStatisticEnteredHandler}>Статистика</button>
                <button onClick={onCloseHandler}>Закрыть содинение</button>

            </div>
            <div className={s.answersBlock}>
                {results.length > 0 && results.map((el, index) => {
                    return (
                        <ul className={s.answersCol} key={index}>
                            <li>
                                <span>Время:</span>
                                <span>{el.time}</span>
                            </li>
                            <li>
                                <span>Потерянные пакеты:</span>
                                <span>{el.loseQuotation}</span>
                            </li>
                            <li>
                                <span>Среднее:</span>
                                <span>{el.average}</span>
                            </li>
                            <li>
                                <span>Стандартное <br/>отклонение:</span>
                                <span>{el.standardDeviation}</span>
                            </li>
                            <li>
                                <span>Мода:</span>
                                <span>{el.mode}</span>
                            </li>
                            <li>
                                <span>Медиана:</span>
                                <span>{el.median}</span>
                            </li>
                        </ul>
                    )
                })}
            </div>
        </div>
    )
}