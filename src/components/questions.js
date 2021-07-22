import {useEffect, useState} from 'react'
import Question from './question'
import axios from 'axios'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Redirect, useRouteMatch as useMatch, useHistory, Link, useLocation} from 'react-router-dom'
import {useContext,useReducer } from 'react'
import { Context } from '../App';
import {reducer} from '../utils/reducer'
import Loading from './loading'



import('./questions.css')


const initialState = {
    loading: true,
    data: null,
    error: null,
    na:false
  }

  

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));


export default function Questions() {
    const { pathname } = useLocation();
    const match = useMatch()
    console.log(match)
    console.log(useHistory())
    const [state, dispatch] = useReducer(reducer, initialState);
    //const specs = useContext(Context)


    const[nan, setnan] = useState(false)
    const classes = useStyles();
    sessionStorage.setItem('correct', 0)
    const category=match.params.category
    const difficulty=match.params.difficulty
    //const category = parseInt(specs[0])
    //const difficulty = specs[1]
    //const[data, setData] = useState([])
    useEffect(()=>fetchData(), [])
    
    const fetchData = async()=>{

        // if(specs.length===0){
        //     //dispatch({type: 'specsNotSet'})
        //     setnan(true)
        //     return
        // }
        

        if(sessionStorage.getItem('token')){
            dispatch({type: 'fetchDataStart'})
            let token = sessionStorage.getItem('token')
            let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986&token=${token}`
            const res = await axios.get(url)
            console.log(res)
            if(res.data.response_code===4){
                console.log('resetting')
                await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${sessionStorage.getItem('token')}`)
                fetchData()
                return
            }
            const data = res.data.results
            console.log(data)
            dispatch({
                type: 'fetchDataSuccess',
                data: data
              })
            //setData(data)
        }else{
            dispatch({type: 'fetchDataStart'})
            let url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple&encode=url3986`
            let token = await axios.get('https://opentdb.com/api_token.php?command=request')
            console.log(token)
            sessionStorage.setItem('token', token.data.token)
            const res = await axios.get(url)
            const data = res.data.results
            dispatch({
                type: 'fetchDataSuccess',
                data: data
              })
            //setData(data)
        }
        
        
    }

    
    if(nan){
        return <div><Redirect to='/'/></div>
    }
    if(state.loading){
        return <Loading/>
    }
    

    
    return (
        <div className='parent'>
            {state.data.map(({question, correct_answer, incorrect_answers})=>{
                let Dquestion = decodeURIComponent(question)
                let Dcorrect_answer = decodeURIComponent(correct_answer)
                let answers = [{answer:Dcorrect_answer, correct:4}]
                for(let i of incorrect_answers){
                    answers.push({answer:decodeURIComponent(i), correct:incorrect_answers.indexOf(i)})
                }
                let shuffled_answers = _.shuffle(answers);
                return <Question key={question} body={Dquestion} answers={shuffled_answers}/>
            })}
            <div className={classes.root}>
                <Link style={{ textDecoration: 'none' }} to={{ 
                    pathname: '/score', 
                    state: { from: pathname } // or any property you like to add
                }}>
                <Button variant="contained" color="secondary">
                    Reveal Score
                </Button>
                </Link>
            </div>
            
        </div>
    )

    
}


