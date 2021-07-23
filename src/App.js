import './App.css';
import {Header} from "./components/Header/Header";
import React from "react";
import {WebSockets} from "./components/WebSockets/WebSockets";
import {Ping} from "./components/Ping/Ping";
import {Redirect, BrowserRouter, Route, Switch} from 'react-router-dom'


function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header/>
                <Switch>
                    <Route exact path='/websockets'
                           component={WebSockets}/>
                    <Route exact path='/ping'
                           component={Ping}/>
                    <Redirect exact from={'/'} to={'/websockets'}/>

                    <Route path={ '/404' } render={ () => <h1>404: PAGE NOT FOUND</h1> }/>
                    <Redirect from={'*'} to={'/404'}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
