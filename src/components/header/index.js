import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FilterHdrIcon from '@material-ui/icons/FilterHdr';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { getToken } from '../../authentication/auth';
import backgrounds from '../../enums/backgrounds';
import icons_data from '../../enums/icons.js';
import api from '../../services/api.js';
import "../header/styles.css";
import { Container } from './styles';

export default function Header({ board_id, board_background, board_name, board_description, board_users, board_owner, board_owner_email }) {  //TERMINAR DIALOG BACKGROUNDS

  const [openLogout, setOpenLogout] = React.useState(false);
  const [openPeople, setOpenPeople] = React.useState(false);
  const [openBackgrounds, setOpenBackgrounds] = React.useState(false);
  const [backgroundArr, setBackgroundArr] = React.useState(backgrounds);
  const [backgroundId, setBackgroundId] = React.useState(board_background);
  const [addPeople, setAddpeople] = React.useState(false);
  const [userName, setUsername] = React.useState('');
  const user_email = [];
  const [userRes, setUserRes] = React.useState({});
  const [lockState, setLockState] = React.useState(false);
  const [icons, setIcons] = React.useState(icons_data);
  const [usertoBoard, setUsertoBoard] = React.useState("");
  const [openUserAddedtoBoard, setopenUserAddedtoBoard] = React.useState(false);
  const [openUserDeletedtoBoard, setopenUserDeletedtoBoard] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [error, setError] = React.useState('');

  function handleCloseLogout() {
    setOpenLogout(false);
  }

  function handleClose() {
    setopenUserAddedtoBoard(false);
    setopenUserDeletedtoBoard(false);
    setOpenError(false);
  }

  function redirectToHome() {
    window.location = "/home";
  }

  let token = getToken();

  function handleCloseAndLogout() {
    localStorage.removeItem("TOKEN_KEY");
    localStorage.removeItem("ID_KEY");
    setOpenLogout(false);
    window.location = '/login';
  }

  function removeItemFromArray(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  function removeElement(id) {
    var elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }



  async function deleteUserfromBoard(userToDelete) {

    api.delete("/boards/" + board_id + "/" + userToDelete,
      {
        headers: {
          Authorization: token
        }
      }).then(res => { getAllUsers(); removeElement("user" + userToDelete); setopenUserDeletedtoBoard(true) }).catch(err => { setOpenError(true); setError(err.response.data.errors[0].defaultMessage) })
  }

  function getBackgroundId(board_background) {
    let board_b = "";
    if (board_background.length === 3) {
      board_b = board_background[1] + board_background[2];
      console.log(board_b);
    }
    else {
      board_b = board_background[1];
    }
    return board_b;
  }

  function getIconId(icon) {
    let board_b = "";
    if (icon.length === 3) {
      board_b = icon[1] + icon[2];
      console.log(board_b);
    }
    else {
      board_b = icon[1];
    }
    return board_b;
  }

  if (!lockState) {
    getAllUsers();
  }

  console.log(userRes);

  async function getAllUsers() {
    setLockState(true); //ver amanha terminar amanha legal falta isso e mais algumas coisas aaaaa
    api.get("/users", {
      headers: {
        Authorization: token
      }
    }).then(res => {
      setUserRes(res.data);

    }).catch(err => { setOpenError(true); setError(err.response.data.errors[0].defaultMessage) })

  }

  function closePeople() {
    setOpenPeople(false);
    setAddpeople(false);
    setUsertoBoard("");
  }

  function searchingFor(userName) {

    return function (user) {
      return user.name.toLowerCase().includes(userName.toLowerCase()) && user.email.toLowerCase().includes(userName.toLowerCase()) || !userName;
    }

  }

  async function putUserInBoard(user_id) {

    setOpenPeople(false);
    api.post("/boards/" + board_id + "/" + user_id, {}, {
      headers: {
        Authorization: token
      }
    }).
      then(res => {
        setopenUserAddedtoBoard(true)
        getAllUsers();
        window.location.reload();
      }
      ).
      catch(err => { setOpenError(true); setError(err.response.data.errors[0].defaultMessage) })

  }


  async function putBackground(board_id, background_data, token) {
    api.put("/boards/" + board_id + "/background", {
      background: background_data
    }
      , {
        headers: {
          Authorization: token
        }
      }).then(res => {
        document.getElementById("board").style.backgroundImage = "url(" + backgroundArr[getBackgroundId(background_data)].content + ")";
        document.getElementsByClassName("background-selected")[0].setAttribute("class", backgroundId);
        document.getElementsByClassName(background_data)[0].setAttribute("class", "background-selected");
      }

      ).catch(err => { setOpenError(true); setError(err.response.data.errors[0].defaultMessage) })
  }


  return (
    <Container>
      <IconButton><HomeIcon id="home-icon" onClick={() => redirectToHome()} /></IconButton>
      <h2>{board_name}</h2>

      <div id="headers_icons">

        <IconButton><FilterHdrIcon id="backgroundsIcon" onClick={() => setOpenBackgrounds(true)} /></IconButton>

        <IconButton><PeopleAltIcon onClick={() => setOpenPeople(true)} id="peopleIcon" /></IconButton>

        <IconButton><ExitToAppIcon onClick={() => setOpenLogout(true)} id="logoutIcon" /></IconButton>

      </div>

      <Dialog open={openLogout} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            Deseja mesmo fazer logout?
                </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogout} color="primary">
            Não
          </Button>
          <Button onClick={handleCloseAndLogout} color="primary">
            Sim
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPeople} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText><strong id="boardTitle" >PESSOAS DO QUADRO</strong></DialogContentText>
          <DialogContentText>
            <strong>Nº de usuários: </strong>{board_users.length}
          </DialogContentText>
          {board_users.map(user => <>
            <DialogContentText id={"user" + user.id}>
              <Chip onClick={() => putUserInBoard(user.id)} avatar={<Avatar src={icons[getIconId(user.avatar)].content} />} label={user.name + " / " + user.email}></Chip>
              <IconButton onClick=
                {() => deleteUserfromBoard(user.id)}>
                <DeleteForeverIcon color="secondary"></DeleteForeverIcon></IconButton>
            </DialogContentText></>)}
        </DialogContent>
        <DialogContent>

          <Button onClick={() => setAddpeople(true)}>
            <strong>Adicionar pessoas ao quadro</strong>
            <AddCircleIcon color="primary" id="addIcon"></AddCircleIcon>
          </Button>

        </DialogContent>
        {addPeople && <DialogContent>
          <DialogContentText>
            <strong> Nome do usuário: </strong> <TextField id="txt_username" onChange={event => setUsername(event.target.value)} /> <IconButton> <SearchIcon /> </IconButton>
          </DialogContentText>
          {userRes.filter(searchingFor(userName)).map(user =>
              {
                 return <DialogContentText>
                      <Chip onClick={() => putUserInBoard(user.id)} avatar={<Avatar src={icons[getIconId(user.avatar)].content} />} label={user.name + " / " + user.email}>
                    </Chip>
                  </DialogContentText>
              }
              
            )}
        </DialogContent>}
        <DialogActions>
          <Button onClick={() => closePeople()} color="primary">
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openBackgrounds} aria-labelledby="form-dialog-title">
        <DialogContent>
          <DialogContentText>
            <strong>PLANOS DE FUNDO</strong>
          </DialogContentText>

          <Grid align="center" container spacing={3}>
            {backgroundArr.map(background => <>
              <Grid item sm={6} id="imgDiv">
                <img onClick={() => putBackground(board_id, background.id, token)} id="imgs" className={background.id === backgroundId ? "background-selected" : background.id} src={background.content}></img>
              </Grid>
            </>)}
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBackgrounds(false)} color="primary">
            FECHAR
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openUserAddedtoBoard} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Usuário adicionado na board!
        </Alert>
      </Snackbar>

      <Snackbar open={openUserDeletedtoBoard} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Usuário deletado da board!
        </Alert>
      </Snackbar>

      <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>

    </Container>


  );
}