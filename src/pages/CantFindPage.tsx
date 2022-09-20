import React from 'react'
import { HashLink } from 'react-router-hash-link'

const CantFindPage: React.FC = ()=>{
    return (
        <div className="flexbox column center">
            <div className="CantFindContainer flexbox" >
                <div className = 'content404'>
                    <h1>404</h1>
                    <h3>This page doesn't exist</h3>
                    <br/>
                    <HashLink  to = '/#'><h4>Click here to find your way back</h4></HashLink>
                </div>
            </div>
        </div>
    )
}

export default CantFindPage;
