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
        let res = await axios.get(`https://opentdb.com/api_count.php?category=${category}`)
        console.log(res)
        let diffAmount = `total_${difficulty}_question_count`
        console.log(diffAmount)
        let questionAmount=res.data.category_question_count[diffAmount]
        console.log(questionAmount)
        let Res = await axios.get(`https://opentdb.com/api.php?amount=${questionAmount}&category=${category}&difficulty=${difficulty}`)
        let multipleQAData = Res.data.results.filter(({type})=>type==='multiple')
        console.log(`this is the amount of multi qA's ${multipleQAData.length}`)
        let QuestionsToFetch = multipleQAData.length
        if(QuestionsToFetch>10){
            QuestionsToFetch=10
        }
        // console.log(QuestionsToFetch)
        // let url = `https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&difficulty=${difficulty}&encode=url3986`
        // let Res = await axios.get(url)
        // const data = Res.data.results
        // let multipleQuestionsAmount = data.filter(({type})=>type=='multiple')
        // let amountToFetch = 10
        // if(multipleQuestionsAmount<10 && multipleQuestionsAmount<QuestionsToFetch){
        //     amountToFetch=multipleQuestionsAmount
        // }
        // console.log(url)
        console.log(`this is amount to fetch ${QuestionsToFetch}`)
        if(sessionStorage.getItem('token')){
            console.log('here')
            dispatch({type: 'fetchDataStart'})
            let token = sessionStorage.getItem('token')
            let url = `https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&type=multiple&difficulty=${difficulty}&encode=url3986&token=${token}`
            console.log(url)
            const res = await axios.get(url)
            console.log(res)
            if(res.data.response_code===4){
                console.log('resetting')
                let url = `https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&type=multiple&difficulty=${difficulty}&encode=url3986`
                console.log(url)
                let token = await axios.get('https://opentdb.com/api_token.php?command=request')
                sessionStorage.setItem('token', token.data.token)
                const res = await axios.get(url)
                console.log(res)
                const data = res.data.results
                let multipleQuestionsData = data.filter(({type})=>type=='multiple')
                let amount = multipleQuestionsData.length
                console.log(multipleQuestionsData)
                sessionStorage.setItem('amount', amount)
                dispatch({
                    type: 'fetchDataSuccess',
                    data: multipleQuestionsData
                })
                return
                // console.log('resetting')
                // let ohh = await axios.get(`https://opentdb.com/api_token.php?command=reset&token=${sessionStorage.getItem('token')}`)
                // console.log(ohh)
                // const res = await axios.get(`https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&type=multiple&difficulty=${difficulty}&encode=url3986&token=${token}`)
                // console.log(res)
                // const data = res.data.results
                // let multipleQuestionsData = data.filter(({type})=>type=='multiple')
                // let amount = multipleQuestionsData.length
                // sessionStorage.setItem('amount', amount)
                // dispatch({
                //     type: 'fetchDataSuccess',
                //     data: multipleQuestionsData
                //   })
                // return
            }
            const data = res.data.results
            let multipleQuestionsData = data.filter(({type})=>type=='multiple')
            let amount = multipleQuestionsData.length
            sessionStorage.setItem('amount', amount)
            console.log(multipleQuestionsData)
            dispatch({
                type: 'fetchDataSuccess',
                data: multipleQuestionsData
              })
            //setData(data)
        }else{
            dispatch({type: 'fetchDataStart'})
            
            //let url = `https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&difficulty=${difficulty}&encode=url3986`
            let url = `https://opentdb.com/api.php?amount=${QuestionsToFetch}&category=${category}&type=multiple&difficulty=${difficulty}&encode=url3986`
            //console.log(url)
            let token = await axios.get('https://opentdb.com/api_token.php?command=request')
            sessionStorage.setItem('token', token.data.token)
            const res = await axios.get(url)
            console.log(res)
            const data = res.data.results
            let multipleQuestionsData = data.filter(({type})=>type=='multiple')
            let amount = multipleQuestionsData.length
            console.log(multipleQuestionsData)
            sessionStorage.setItem('amount', amount)
            dispatch({
                type: 'fetchDataSuccess',
                data: multipleQuestionsData
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
                <Button variant="contained" color="secondary" className="marginBottom">
                    Reveal Score
                </Button>
                </Link>
            </div>
            
        </div>
    )

}




