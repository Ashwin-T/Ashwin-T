import {useParams} from 'react-router-dom';
import {BsArrowLeftSquare} from 'react-icons/bs'
import { HashLink } from 'react-router-hash-link';
import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from "firebase/firestore";

export const Log = () => {

    const params = useParams();

    const [log, setLog] = useState({});
    const [content, setContent] = useState('');


    useEffect(() => {
        const db = getFirestore();
        const getData = async () => {
            const docRef = doc(db, "logs", params.id);
            const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setLog(docSnap.data());
                    setContent(docSnap.data().content);
                } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getData();


    }, [params.id])

    return ( 
        <>
            <div className="flexbox">
                <HashLink className = 'backArrow' smooth to = '/logs'><BsArrowLeftSquare /></HashLink>
            </div>

            <div className = 'flexbox center column log'>
                <div className="flexbox column center title">
                    <h1>{log.title}</h1>
                    <h4>{log.date}</h4>
                </div>

                <div className = 'flexbox content'>
                    {
                        content.split('!').map((item, index)=>{
                            return (
                                <div key = {index} >
                                    <h2>{item}</h2>
                                    <br/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
     );
}
 
