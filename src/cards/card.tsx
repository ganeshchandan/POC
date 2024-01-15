const Card = ({content, className} : {content:string; className : string;}) => {
    return <div className={`card ${className}`}>
        {content}
    </div>
}

export default Card;