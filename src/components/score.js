import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import {Redirect, useHistory, useLocation} from 'react-router-dom'


import { useState, useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));


export default function Score(props) {
    const history = useHistory()
    const location = useLocation()

    const[nan, setnan] = useState(false)
    const category = parseInt(sessionStorage.getItem('category'))
    useEffect(()=>{
        if(isNaN(category)){
            setnan(true)
        }
    },[])
    const classes = useStyles();

    const goBack = ()=>{
        history.goBack()
    }
    if(!location.state){

        return <Redirect to='/'/>
    }
    return (
        <div>
            {`you scored ${sessionStorage.getItem('correct')}/10`}
            <div className={classes.root}>
                <Button variant="contained" color="secondary" onClick={goBack}>
                    answer questions from same category
                </Button>
                <Button href='/' variant="contained" color="secondary">
                    choose different category
                </Button>
            </div>
        </div>
    )
}
