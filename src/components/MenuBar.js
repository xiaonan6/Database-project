import React from 'react'
import { AppBar, Toolbar, makeStyles, Link } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(6)
    },
    appbar: {
        background: 'linear-gradient(45deg, #4c5154 30%, #181d21 90%)',
        position: 'fixed',   
    },
    barDiv: {
        flex: 1,
    },
    pageLink: {
        fontSize: 24,
        color:'inherit',
        underline: 'none',
        marginLeft: theme.spacing(3),
    },
    titleLink: {
        fontSize: 36,
        color:'inherit',
        underline: 'none',
    }
}));

export default function MenuBar() {
    const classes = useStyles();

    return(
        <div>
            <AppBar className={classes.appbar}>
                <Toolbar justifyContent= 'space-between'>
                    <div className={classes.barDiv}>
                        <Link className={classes.titleLink} href='/'>
                            CovidSQL
                        </Link>
                        <Link className={classes.pageLink} href='/'>
                            Main Page
                        </Link>
                        <Link className={classes.pageLink} href='/'>
                            Other page
                        </Link>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
        
    )
}
