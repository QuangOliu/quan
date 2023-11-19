import Typed from "react-typed";
// import us from "../../src/assets/images/me/anh.jpg";
import us from "../../src/assets/images/me/quan.jpg";
function General({ data = {}, id }) {
  const { typing } = data;
  return (
    <div className='home' id={id}>
      <div className='home__content'>
        <div className='home__img'>
          <img src={us} className='rounded-circle' alt='avatar'/>
        </div>
        <div className='home__extra'>
          <h4 className='home__hello'>{data.hello}</h4>

          <Typed strings={[...typing]} className={"home__typing"} typeSpeed={100} backSpeed={45} loop />
          <div className='home__box'></div>
          <p className='home__pagram'>{data.about}</p>
          <ul className='home__list'>
            
          </ul> 
        </div>
      </div>
    </div>
  );
}
export default General;
