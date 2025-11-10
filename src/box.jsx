
function  BoxRED  (props) {
console.log(props.text);
return(
    <div style={{
        width:"100px",
        height:"20px",
        backgroundColor: props.color,
        padding: "10px",
        margin:"20px",
        jistifyContent:"center",
        display:"flex",
        aliginItem:"center",
        borderRadius:"10px"
    }}>
        <b>
            {pageXOffset.text}
        </b>
    </div>
)

}
export default BoxRED


