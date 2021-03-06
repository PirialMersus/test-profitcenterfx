import s from './Ping.module.scss'
import React, {useEffect, useState} from "react";

export const Ping = () => {

    let timeOutId;

    useEffect(() => {
        return clearTimeout(timerId)
    }, [])

    const [timerId, setTimerId] = useState(1);
    const [inputValue, setInputValue] = useState('')
    const [results, setResult] = useState([])
    const [error, setError] = useState('')

    const onChangeHandler = (e) => {
        setInputValue(e.currentTarget.value)
    }

    const timeOut = () => {
        timeOutId = setTimeout(onClickHandler, 1000)
        setTimerId(timeOutId)
    }

    const onClickHandler = async (e) => {
        const objRE = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (objRE.test(inputValue)) {
            setError('')
            clearTimeout(timerId)
            let startDate = new Date()

            try {
                let response = await fetch(inputValue);
                console.log(`все ок ${inputValue} работает`)

            } catch {
                console.log(`ошибка при обращении к серверу ${inputValue}. Проверте правильность введенных данных`)
            } finally {
                let finishDate = new Date();
                setResult((prevState) => [finishDate - startDate, ...prevState]);
                timeOut()
            }
        } else {
            setError('Введите корректное значение URL')
        }
    }

    const onClearHandler = () => {
        setError('')
        clearTimeout(timerId)
        setInputValue('')
        setResult([])
    }

    return (
        <div className={s.container}>
            <h2>Ping</h2>
            <div className={s.inputs}>
                <input type="text" value={inputValue} onChange={onChangeHandler}/>
                <button onClick={onClickHandler} disabled={results.length > 0}>Пинг</button>
            </div>
            <div className={s.results}>
                <div>
                    {!error ? results.length > 0 &&
                        results.map((el, index) => (
                            <h4 key={index} className={s.result}>Ответ от {inputValue} время = {el} мс</h4>
                        ))
                        :
                        <h4 className={s.error}>{error}</h4>}
                </div>
                <button onClick={onClearHandler}>Остановить</button>
            </div>
        </div>
    )
}