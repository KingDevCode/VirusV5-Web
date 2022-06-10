import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import IpAddress from "../../../../IpAddress";
import { socket } from "../../../../socket/socket";

import './PlayerStyling.scss';

function Player(props: {player: any, onPlayerClick: any, selectedPlayer: any;}){
    const [background, setBackground] = useState<string>("white");
    const [player, setPlayer] = useState<any>(props.player);
    const [icon, setIcon] = useState<any>();

    useEffect(function loadPlayerIcon() {
        var ip = new IpAddress();
        fetch(`http://${ip.getIP()}:8080/minecraft/player/icon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({Displayname: player.Displayname})
        }).then(res => res.text())
        .then(text => {
            setIcon(text)
        });
    }, []);
    useEffect(function updateBackground(){
        if (props.selectedPlayer != null){
            if (props.selectedPlayer.Displayname === player.Displayname){
                if (background === "lime"){
                    setBackground("white");
                    props.onPlayerClick(null)
                }else setBackground("lime");
            }else setBackground("white");
        }else setBackground("white");
    }, [props.selectedPlayer]);
    function copyToClipboard(ip: string){
        alert("Gekopieerd naar je clipboard!")
        setTimeout(async()=>await window.navigator.clipboard.writeText(ip), 3000)
    }
    function onPlayerClick(){
        if (props.selectedPlayer === player)
            props.onPlayerClick(null);
        else props.onPlayerClick(player);
    }
    return (
        <div className="playertab noselect" style={{backgroundColor: background}} onClick={onPlayerClick}>
            <div className="playertab-icon"><img src={icon} /></div>
            <div className='playertab-verticalline'>|</div>
            <Tooltip title={"UUID: " + player.UUID}>
                <div className="playertab-playername">{player.Displayname}</div>
            </Tooltip>
            <div className='playertab-verticalline'>|</div>
            <Tooltip title='Player operator status'>
                <div className="playertab-status">OP: {player.Op == true ? <>Ja</> : <>Neen</>}</div>
            </Tooltip> 
            <div className='playertab-verticalline'>|</div>
            <Tooltip onClick={() => copyToClipboard(player.Ip)} title={<div style={{ textAlign: 'center' }}>Het publiek IP van de speler<br />Click om naar het klipbord te kopiëren</div>}>
                <div className="playertab-ip">Ip: {player.Ip}</div>
            </Tooltip> 
        </div>
    );
}
export default Player;