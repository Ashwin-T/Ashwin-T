import { useState  } from 'react'
import {BsArrowLeftSquare} from 'react-icons/bs'
import { HashLink } from 'react-router-hash-link'
import { uid } from '../tools/FirebaseConfig'
import { doc, getFirestore, setDoc } from "firebase/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useHistory } from 'react-router-dom';
import moment from 'moment'
export const Post = ()=>{

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    let history = useHistory();

    const [newBlogData, setNewBlogData] = useState({
        title: 'Title',
        content: 'Content',
        date: moment().format("MMM Do YY"),
        preview: null,
    })

    const addData = async ()=>{
        // Add a new document in collection "cities"
        
        // const storage = getStorage(app);
        // const fileRef = ref(storage, selectedFile);
        // setNewBlogData({...newBlogData, preview: fileRef})
        // await uploadBytes(storage, selectedFile).then((snapshot) => {
        //     console.log('Uploaded a blob or file!' + snapshot.ref.fullPath);
        // })

        
        const db = getFirestore();
        await setDoc(doc(db, "logs", newBlogData.date), {
            title: newBlogData.title,
            content: newBlogData.content,
            date: newBlogData.date,
            preview: newBlogData.preview,
        });

        history.push('/logs');

    }

    const signIn = ()=>{
        signInWithPopup(auth, provider)
        .then((result) => {
           
            if(result.user.uid === uid){
                setPermision(true)
            }
            else{
                setPermision(false)
            }
        }).catch((error) => {
            // Handle Errors here.
            // ...
            console.log(error)
        });
    }

    const [permission, setPermision] = useState(false)

    const Login = ()=>{
        return (
            <>
                <div className="flexbox">
                    <HashLink className = 'backArrow' smooth to = '/logs'><BsArrowLeftSquare /></HashLink>
                </div>
                <div className="loginPage flexbox column center">
                    <button onClick={signIn}>Login</button>
                </div>  
            </>
        )
    }



    return (
        <>
            {permission ? <>
                <div className="flexbox">
                    <HashLink className = 'backArrow' smooth to = '/logs'><BsArrowLeftSquare /></HashLink>
                </div>
                <div className="addBlog flexbox column center">
                    <h1>Add Log</h1>
                    <div className = 'flexbox form column center ' >
                        <input value = {newBlogData.title} onChange = {(e)=> setNewBlogData({...newBlogData, title: e.target.value})} placeholder = 'Title'type="text" />
                        <textarea value = {newBlogData.content} onChange = {(e)=> setNewBlogData({...newBlogData, content: e.target.value})}name="" id="" cols={30} rows={10} placeholder="Content"></textarea>
                        {/* <label className="file-upload flexbox center">
                            <input type="file" accept=".png, .jpg, .jpeg .svg" onChange={(e) => setSelectedFile(e.target.files[0])}/>
                            Upload Preview
                        </label> */}
                        <button onClick = {addData}>Add</button>
                    </div>
                </div>
            </> : <Login />}
        </>
    )
}
