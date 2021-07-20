import {useEffect, useState, useContext} from 'react'
import Question from './question'
import axios from 'axios'
import _ from 'lodash'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import('./questions.css')

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

export default function Questions({specs}) {
    const classes = useStyles();
    sessionStorage.setItem('correct', 0)
    const category = parseInt(sessionStorage.getItem('category'))
    const difficulty = sessionStorage.getItem('difficulty')
    const[data, setData] = useState([])
    const[score, setScore] = useState(0)
    useEffect(()=>fetchData(), [])
    
    const fetchData = async()=>{
        if(sessionStorage.getItem('token')){
            let token = sessionStorage.getItem('token')
            var url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple&encode=base64&token=${token}`
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
            setData(data)
        }else{
            var url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple&encode=base64`
            let token = await axios.get('https://opentdb.com/api_token.php?command=request')
            console.log(token)
            sessionStorage.setItem('token', token.data.token)
            const res = await axios.get(url)
            const data = res.data.results
            setData(data)
        }
        
        
    }
    

    return (
        <div className='parent'>
            {data.map(({question, correct_answer, incorrect_answers})=>{
                let Dquestion = atob(question)
                let Dcorrect_answer = atob(correct_answer)
                let answers = [{answer:Dcorrect_answer, correct:4}]
                for(let i of incorrect_answers){
                    answers.push({answer:atob(i), correct:incorrect_answers.indexOf(i)})
                }
                let shuffled_answers = _.shuffle(answers);
                return <Question key={question} body={Dquestion} answers={shuffled_answers}/>
            })}
            <div className={classes.root}>
                <Button href='/score' variant="contained" color="secondary">
                    Reveal Score
                </Button>
            </div>
            
        </div>
    )
}