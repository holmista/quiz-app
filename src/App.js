import './App.css';
import Questions from './components/questions';
import DropDownDifficulty from './components/dropDownDifficulty';
import Score from './components/score';
import {BrowserRouter as Router, Redirect, Route,useHistory} from 'react-router-dom'
import {useRef, createContext, useState} from 'react'
export const Context = createContext()
function App() {
  
  const[value, setValue] = useState([])

  
  const getdData = (values)=>{
    
    //setValue([values[0],values[1]])
    values[2].push(`/${values[0]}/${values[1]}`)
  }
  return (
    <div className="App">
      <Router>
        <Route exact path='/'>
          <DropDownDifficulty sendData={getdData}/>
        </Route>
          {/* <Route exact path = '/quiz' >
            <Context.Provider value={value}>
              <Questions />
            </Context.Provider>
          </Route> */}
          <Route exact path = '/:category/:difficulty'>
            <Questions />
          </Route>
          <Route exact path = '/score'>
            <Score/>
          </Route>
      </Router>
    </div>
  );
}

export default App;
