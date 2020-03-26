import React,{Component,useEffect,useState} from 'react';
import * as menu from'ssw.megamenu/dist/megamenu';
import 'ssw.megamenu/dist/megamenu.css';



const Menu= () =>
{
  const [registered, setRegistered] = useState(false);

 const registerEvents = () => {
  if(!registered){
    setRegistered(true);
    menu.registerEvents();
  }
 }

  const getHtml= ()=>{
      return menu.buildMegaMenu();
  }


  return (
   <div className="mx-6">
   <div id="sswmegamenu" onMouseOver={() => registerEvents()} onFocus={() => registerEvents()}  dangerouslySetInnerHTML={{
          __html: getHtml()
        }}></div>
   </div>)
}

export default Menu;
