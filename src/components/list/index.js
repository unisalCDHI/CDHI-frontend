import React ,{ useRef, useContext } from 'react';

import { Container } from './styles';

import { MdAdd } from 'react-icons/md'

import Card from "../card/index";

import BoardContext from '../board/context'

import { useDrag, useDrop } from 'react-dnd'

import AddCircleIcon from '@material-ui/icons/AddCircle';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';

import DialogActions from '@material-ui/core/DialogActions';

import DialogContent from '@material-ui/core/DialogContent';

import DialogContentText from '@material-ui/core/DialogContentText';

import Backdrop from '@material-ui/core/Backdrop';

import CircularProgress from '@material-ui/core/CircularProgress';

import TextField from '@material-ui/core/TextField';

import api from '../../services/api';

import { getToken } from '../../authentication/auth';

import { makeStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar'

import { Alert } from '@material-ui/lab';

import "../list/styles.css"

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function List( { data, index: listIndex, board_id } ){

  const { lists } = useContext(BoardContext);

  const [openAddCard, setOpenAddCard] = React.useState(false);

  const [newCardName, setNewCardName] = React.useState('');

  const [newCardDescription, setNewCardDescription] = React.useState('');

  const [newCardColumn, setNewCardColumn] = React.useState("BACKLOG");

  const [responseItems, setResItems] = React.useState([]);

  const [refreshState, setRefreshState] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const [errorMsg, setErrormsg] = React.useState('');

  const [openCardCreated, setopenCardCreated] = React.useState(false);
  

  let token = getToken();

  async function addCard(items){
    setLoading(true);
    setOpenAddCard(false);
    api.post("/cards", {
      boardId: board_id,
      column: newCardColumn,
      description: newCardDescription,
      name: newCardName,
      usersIds:[
        
      ]
    },  {
          headers: {
          Authorization: token
      }
  }).then(res => {
    
    window.location.reload();
    console.log(data);
    setLoading(false);
    setopenCardCreated(true);
    
    }).catch(err => {
      setLoading(false);
      setErrormsg(err);
    });
  }

  function handleClose(){
    setopenCardCreated(false);
  }

    return (
      <>
      <Backdrop open={loading} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container refreshState={refreshState} id="list_col">
        <header>
          <div id="col_name">
            <p>{data.name}</p>
          </div>
          {data.name === "BACKLOG" && (
          <button onClick={() => setOpenAddCard(true)} type="button" id="addCardBtn">
              <MdAdd size={24} color="#FFF"/>
          </button>)}
        </header>

        <ul id="list">
          {data.items.map((card,index) =>
          <Card 
            key={card.id}
            listIndex={listIndex} 
            index={index} 
            cards={card} 
            data={data}
            board_id={board_id}
          />)} 
        </ul>
        <Dialog open={openAddCard} aria-labelledby="form-dialog-title">
            <DialogContent>
              <DialogContentText>
                <strong>ADICIONAR UM NOVO CARD</strong>
              </DialogContentText>
              <DialogContentText>
                <strong>Nome do card :</strong> 
                <TextField
                  id="txtCardName"
                  onChange={event => setNewCardName(event.target.value)}
                ></TextField>
              </DialogContentText>
              <DialogContentText>
                <strong>Descrição :</strong>
                <TextField
                  id="txtCardDescription"
                  onChange={event => setNewCardDescription(event.target.value)}
                ></TextField>
              </DialogContentText>
            </DialogContent>
          <DialogActions>
            <Button onClick={() => addCard()} color="primary">
              <strong>Adicionar</strong> <AddCircleIcon/>
            </Button>

            <Button onClick={() => setOpenAddCard(false)} color="primary">
              <strong>FECHAR</strong> 
            </Button>
          </DialogActions>
        </Dialog>
      </Container>

      <Snackbar open={openCardCreated} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
            Card criado com sucesso.
        </Alert>
      </Snackbar>

      </>
    );
}