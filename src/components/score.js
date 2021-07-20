import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }));

export default function Score() {
    const classes = useStyles();
    return (
        <div>
            {`you scored ${sessionStorage.getItem('correct')}/10`}
            <div className={classes.root}>
                <Button href='/quiz' variant="contained" color="secondary">
                    answer questions from same category
                </Button>
                <Button href='/' variant="contained" color="secondary">
                    choose different category
                </Button>
            </div>
        </div>
    )
}