import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import { controlLed } from "../../api";
const Controller = (props) => {
  const [isON, setIsON] = useState(props.state || false);
  const handelClick = () => {
    setIsON(!isON);
    controlLed(props.devide, !isON);
  };
  let iconON = props.icon;
  let iconOFF = props?.iconOFF || props.icon;
  return (
    <Card className='h-autox h-100' style={{ background: "transparent" }}>
      <CardBody className='d-flex align-items-center mb-4'>
        <div className='d-flex align-items-center justify-content-between w-100' style={{ alignItems: "center" }}>
          <div>
            <i className={`${isON ? `${iconON} ${props.animation}` : iconOFF} d-flex`} style={{ fontSize: "50px" }}></i>
            <p className='text-center m-1'>{props.title}</p>
          </div>

          <div className='d-flex align-items-center justify-content-between text-center' onClick={handelClick}>
            <i className={`bi bi-toggle-${isON ? "on text-success" : "off"} `} style={{ fontSize: "50px" }}></i>
          </div>
          <div>{isON ? "ON" : "OFF"}</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Controller;
