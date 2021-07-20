import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';

import('./questions.css')

const useStyles = makeStyles((theme) => ({
  radio: {
    '&$checked': {
      color: '#4B8DF8'
    }
  },
  checked: {}
  }));

export default function Question({body, answers}) {
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const checkAnswer = (e)=>{
    console.log(e.target.value)
    if(e.target.value==4){
      let currCorrects = parseInt(sessionStorage.getItem('correct'))+1
      sessionStorage.setItem('correct', currCorrects)
    }
  }

  return (
    <div className='questionParent'>
    <FormControl component="fieldset">
      <FormLabel component="legend">{body}</FormLabel>
      <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
        <FormControlLabel className="correctLabel" value={`${answers[0].correct}`} control={<Radio />} label={answers[0].answer} onClick = {checkAnswer}/>
        <FormControlLabel className="correctLabel" value={`${answers[1].correct}`} control={<Radio />} label={answers[1].answer} onClick = {checkAnswer}/>
        <FormControlLabel className="correctLabel" value={`${answers[2].correct}`} control={<Radio />} label={answers[2].answer} onClick = {checkAnswer}/>
        <FormControlLabel className="correctLabel" value={`${answers[3].correct}`} control={<Radio />} label={answers[3].answer} onClick = {checkAnswer}/>
      </RadioGroup>
    </FormControl>
    </div>
  );
}