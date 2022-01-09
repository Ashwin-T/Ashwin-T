import {HashLink} from 'react-router-hash-link'



export const LogPreview = (props) => {
    
    const path = `/logs/${props.doc.date}`

    const style = {background: props.doc.preview !== null ? `url(${props.doc.preview})` : '#fff'}

    return (
        <>
            <HashLink to = {path} className="flexbox center column logPreview" style = {style}>
                <h1>{props.doc.title}</h1>
                <br></br>
                <h2>{props.doc.date}</h2>
            </HashLink>
        </>
    )
}
