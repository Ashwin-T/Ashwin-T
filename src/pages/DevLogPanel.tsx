import {BsArrowLeftSquare} from 'react-icons/bs'
import { HashLink } from 'react-router-hash-link';
import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";
import { useState, useEffect } from 'react';

import { LogPreview } from '../components/LogPreview.jsx';

import {app} from '../tools/Firebase';

export const DevLogPanel = ()=>{
    
    const [docs, setDocs] = useState([]);


    useEffect(() => {

        const getData = async () => {
            const db = getFirestore(app);
            const tempArray:any = []; //LMFAO random :any love to see it
            const logsRef = collection(db, "logs");
    
            const querySnapshot = await getDocs(query(logsRef, orderBy("day", "desc")));

            querySnapshot.forEach((doc) => {
                tempArray.push(doc.data());
            });

            setDocs(tempArray);

        }

        getData();

        
    }, [])
    return ( 
        <>
            <div className="flexbox">
                <HashLink className = 'backArrow' smooth to = '/#about'><BsArrowLeftSquare /></HashLink>
            </div>

            <div className = 'flexbox center column devLogPanel'>
                <h1>LOGS</h1>

                <div className = 'flexbox center about'>
                    <h3> - Inspired by the book: The Prince of Persia, I want to start a log of my development and personal journey. I will be adding to this log daily. Altough a lot of it may be about Computer Science, I will include day to day thoughts and events as well for anyone who wants to listen.</h3> 
                </div>
                <div className='flexbox center'>
                    {
                        docs.map((doc, index)=>{
                            return (<LogPreview key = {index} doc = {doc}/>)
                        })
                    }
                </div>
            </div>
        </>
    );
}
 
