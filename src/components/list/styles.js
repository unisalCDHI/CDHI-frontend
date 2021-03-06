import styled, {css} from 'styled-components';
import img from '../snow_mountain.jpg'

export const Container = styled.div`

    padding:0 15px;
    height:100%;
    flex:0 0 320px;
    overflow-y: auto;
    

    & + div {
        border-left: 1px solid rgba(0,0,0, 0.05);
    }


    ${props => props.refreshState === true && css`
        display: none;
    `}

    header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 42px;

        h2{
            font-weight: 500;
            font-size: 16px;
            padding: 0 10px;
        }

        button {
            border:0;
            width: 42px;
            height: 42px;
            border-radius: 18px; 
            background: #3b5bfd;
            cursor: pointer;
        }
    }

    ul{
        margin-top:30px;
    }

`;