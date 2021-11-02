import React from 'react'
import { HashLink } from 'react-router-hash-link'

export const CantFindPage: React.FC = ()=>{
    return (
        <div className="flexbox column center">
            <div className="CantFindContainer flexbox" >
                <div className = 'content404'>
                    <h1>404</h1>
                    <h3>This page doesn't exist</h3>
                    <br/>
                    <h4><HashLink  to = '/#'>Click here to find your way back</HashLink></h4>
                </div>
            </div>
        </div>
    )
}
