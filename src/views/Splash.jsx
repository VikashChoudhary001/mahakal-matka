import SplashImage from "../assets/imgs/splash_image_1comp.jpg";

const Splash = () => {
  return (
    <div className="overflow-hidden relative max-w-[480px] w-full mx-auto h-full bg-[#bee6fb]">
      <img src={SplashImage} alt="Logo" className="h-full w-full object-contain block" />
    </div>
  );
};

export default Splash;
