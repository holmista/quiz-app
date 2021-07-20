import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import './DropDowns.css'
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function DropDownDifficulty({sendData}) {
  React.useEffect(()=>fetchCategories(), [])
  const fetchCategories = async()=>{
    const data = await axios.get('https://opentdb.com/api_category.php')
    //console.log(data.data.trivia_categories)
    //const categoriesData = data.data.trivia_categories.map(({name})=> name)
    const categoriesData = data.data.trivia_categories
    setCategoriesData(categoriesData)
  }
  const classes = useStyles();
  const [categoriesData, setCategoriesData] = React.useState([])
  const [Difficulty, setDifficulty] = React.useState('');
  const [category, setCategory] = React.useState('')
  const [open, setOpen] = React.useState(false);
  const [openCategories, setOpenCategories]=React.useState(false)
  const [buttonDisabled, setButtonDisabled] = React.useState(true)


  const handleCategoryChange = (event)=>{
    setCategory(event.target.value)
    if(Difficulty!==''){
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  }

  const handleChange = (event) => {
    setDifficulty(event.target.value);
    if(category!==''){
      setButtonDisabled(false)
    }else{
      setButtonDisabled(true)
    }
  };

  const handleCategoryClose = ()=>{
    setOpenCategories(false)
  }

  const handleCategoryOpen = ()=>{
    setOpenCategories(true)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  return (
    <div className='parent'>
      <div className='dropdowns'>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">category</InputLabel>
            <Select id='categories'
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={openCategories}
              onClose={handleCategoryClose}
              onOpen={handleCategoryOpen}
              value={category}
              onChange={handleCategoryChange}
            >
              {categoriesData.map(({name, id})=><MenuItem key={id} value={`${id}`}>{name}</MenuItem>)}
              {/* <MenuItem value='cats'>cats</MenuItem>
              <MenuItem value='dogs'>dogs</MenuItem>
              <MenuItem value='sharks'>sharks</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">difficulty</InputLabel>
            <Select id = 'difficulty'
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={Difficulty}
              onChange={handleChange}
            >
              
              <MenuItem value='easy'>Easy</MenuItem>
              <MenuItem value='medium'>Medium</MenuItem>
              <MenuItem value='hard'>Hard</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div>
        
        {/* <Button  disabled={buttonDisabled} className='button' variant="contained" color="primary" onClick={()=>sendData([category, Difficulty])}>
            Start Quiz
        </Button> */}
        <Button href='/quiz' disabled={buttonDisabled} className='button' variant="contained" color="primary" onClick={()=>sendData([category, Difficulty])}>
            Start Quiz
        </Button>
      </div>
    </div>
  );
}