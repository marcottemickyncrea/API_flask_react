import "./App.css";
import Analyse from "./Components/Analyse";
import Archives from "./Components/Archives";
import Scrapping from "./Components/Scrapping";

import { BrowserRouter as Router, Route, Switch, /*Redirect*/ } from "react-router-dom";
import Header from "./Components/Header";
import { useState } from "react";


function App() {
    const [like, setLike] = useState("")
    return (
        <div className= {"page " + like}>
            <Router>
                <header>
                    <Header />
                </header>
                <Switch>
                    <Route exact path="/">
                        <Analyse setLike= {setLike}/>
                    </Route>
                    <Route path="/archives">
                        <Archives />
                    </Route>
                    <Route path="/scrapping">
                        <Scrapping />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App;