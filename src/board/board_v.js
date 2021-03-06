import React from 'react';

import api from '../services/api'

import { getId, getToken, logout } from '../authentication/auth';

import GlobalStyle from '../styles/global'

import Header from '../components/header/index'

import Board_Content from '../components/board/index'

import DatatoFeed from '../board/board_feed'

import { DndProvider } from 'react-dnd'

import HTML5Backend from 'react-dnd-html5-backend'

export default function Board() {

  var token = getToken();
  let user_id = getId();

  const [breakEl, setBreakEl] = React.useState(false);

  const [boardName, setBoardName] = React.useState('');

  const [boardDesc, setBoardDesc] = React.useState('');

  const [boardCards, setBoardCards] = React.useState([]);

  const [boardUsers, setBoardUsers] = React.useState('');

  const [boardOwner, setBoardOwner] = React.useState('');

  const [boardOwnerId, setBoardOwnerId] = React.useState('');

  const [boardOwnerEmail, setBoardOwnerEmail] = React.useState('');

  const [boardId, setBoardId] = React.useState('');

  const [boardBackground, setBackground] = React.useState('');
  
  const [boardFed, setboardFed] = React.useState('');

  const [userAvatar, setUserAvatar] = React.useState('');

  const [lockState, setLockState] = React.useState(false);

    if(!lockState){
      getUserIcon();
    }
    
    function getIconId(user_avatar) {
      let board_b = "";
      if (user_avatar.length === 3) {
          board_b = user_avatar[1] + user_avatar[2];
          console.log(board_b);
      }
      else {
          board_b = user_avatar[1];
      }
      return board_b;
    }

    async function getUserIcon(){
      setLockState(true);
      api.get("/users/" + user_id,{},{
        headers:{
          Authorization: token
        }
      }).then(res => {
        setUserAvatar(res.data.avatar);
        

      }).catch(err =>{
        console.log(err);
      })
    }

  if (!breakEl) {
    getBoardById();
  }
  
  function getBoardId() {
    var info = window.location.href.split('/');
    return info[4];
  }

  async function getBoardById() {
    setBreakEl(true);
    var boardId = getBoardId();
    await api.get('/boards/' + boardId, {
      headers: {
        Authorization: token  //the token is a variable which holds the token
      }
    }).then(res => {
      setBoardCards(res.data.cards);
      setBackground(res.data.background);
      setBoardId(res.data.id);
      setBoardName(res.data.name);
      setBoardDesc(res.data.description);
      setBoardUsers(res.data.users);
      setBoardOwner(res.data.owner.name);
      setBoardOwnerId(res.data.owner.id);
      setBoardOwnerEmail(res.data.owner.email);
    })
      .catch(err => {

      });
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {boardUsers.length > 0 && <Header  board_id={boardId} board_background={boardBackground} board_name={boardName} board_description={boardDesc} board_users={boardUsers} board_owner={boardOwner} board_owner_email={boardOwnerEmail}/>}
        
        <GlobalStyle />

        {boardBackground && <Board_Content board_background={boardBackground} board_id={boardId} data_cards={DatatoFeed(boardCards)} owner={boardOwnerId}/>}
      </DndProvider>
    </>
  );

}



