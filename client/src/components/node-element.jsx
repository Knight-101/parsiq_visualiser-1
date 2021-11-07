import "./node-element.css"

const Elm = (props) => {


    return(
        <div className="elm-parent">
            {props.text}
        </div>
    )
}

export default Elm;