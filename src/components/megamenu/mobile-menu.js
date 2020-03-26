import React,{Component,useEffect,useState} from 'react';
import * as menu from'ssw.megamenu/dist/megamenu';
import 'ssw.megamenu/dist/megamenu.css';



const MobileMenu= () =>
{
  const [registered, setRegistered] = useState(false);

  const registerEvents = () => {
   if(!registered){
     setRegistered(true);
     menu.registerMobileEvents();
   }
  }

  const getHtml= ()=>{
      return menu.buildMobileMenu();
  }

  return (
   <div>
   <div id="sswmegamenumobile" onMouseOver={() => registerEvents()} onFocus={() => registerEvents()}  dangerouslySetInnerHTML={{
          __html: getHtml()
        }}></div>
   </div>)
}

export default MobileMenu;
