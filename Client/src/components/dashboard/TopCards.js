import { Card, CardBody } from "reactstrap";

const TopCards = (props) => {
  const low = props?.low || 30;
  const mid = props?.mid || 60;
  const hight = props?.hight || 90;
  console.log(low, mid, hight);

  const isBlinking = props?.earning >= hight;

  // CALCULA COLOR FOR EACH VALUE
  const calculateColor = (value) => {

    // Calculate darkness level based on how close the value is to 100
    const darkness = (100 - value) / 100; // Linear function

    // Generate color string (using red as an example)
    const color = `rgba(0, 0, 0, ${(70 - value) / 100}),rgba(0, 0, 0, 1)`;

    // gradientColors = `rgba(255, 255, 255, ${value / hight}/)`;
    // gradientColors = "";
    return color;
  };

  const calculateBG = (value) => {
    let bgColor = "";

    if (value > mid) {
      bgColor = "bg-light-danger text-danger";
    } else if (value > low) {
      bgColor = "bg-light-warning text-warning";
    } else {
      bgColor = "bg-light-success text-success";
    }
    return bgColor;
  };

  const earningColor = calculateColor(props?.earning);
  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, ${earningColor})`,
  };

  return (
    <Card className={`${isBlinking ? "blinking- h-100" : "h-100"}`} style={!isBlinking ? gradientStyle : {}}>
      <CardBody height='100%' className='d-flex align-items-center'>
        <div className='d-flex'>
          <div className={`circle-box lg-box d-inline-block ${calculateBG(props?.earning)}`}>
            <i className={props.icon}></i>
          </div>
          <div className='ms-3'>
            <span>{props.earning}</span>
            <span className='text-muted m-1'>{props.subtitle}</span>
            <h6 className='mb-0 font-weight-bold'>{props.title}</h6>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopCards;
