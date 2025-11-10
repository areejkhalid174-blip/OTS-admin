import React from "react";
import img1 from "../assets/img1.png";

function Card(props) {
  return (
    <div>
      <div className="container" style={{ width: 400, height: 500,borderWidth:2 }}>
        <img height={250} width={400} src={img1} alt="" />
        <p style={{ textAlign: "center" }}>
         { props.date }
        </p>
        <h4 style={{ textAlign: "center" }}>
          {props.title}
        </h4>
        <p style={{ textAlign: "center" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi
          recusandae, quidem qui reprehenderit pariatur ipsum doloribus, alias
          numquam facere dicta ipsam eaque velit distinctio commodi? Nam modi
          nostrum fugit est?
        </p>
        <div style={{display:'flex',height:60}}>
          <div style={{width:'33%',height:60,backgroundColor:props.btnColor}}>
              <h3 style={{textAlign:'center'}}>
                {props.btnTitle}
              </h3>
          </div>
          <div style={{width:'33%',height:60,backgroundColor:"blue"}}>
          <h3 style={{textAlign:'center'}}>
                button 1 
              </h3>
          </div>
          <div style={{width:'33%',height:60,backgroundColor:"orange"}}>
          <h3 style={{textAlign:'center'}}>
                button 1 
              </h3>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Card;
