import React from 'react';
import Stdm from '../assets/images/Stdm.png';

export const Footer: React.FC =()=>{
    return (
        <footer> 
            <div className="footerContent">
                <img src = {Stdm} alt = 'sp man'></img>
            </div>
        </footer>
    )
}
