import Logo from '../assets/imgs/Logo.png';
import NoInternetLogo from '../assets/imgs/noInternet.png';
export default function OfflinePage() {
  return (
    <div className='p-2'>
        <div className='font-poppins border border-black/20 overflow-hidden relative max-w-[480px] w-full mx-auto '>
            <div className='flex flex-col items-center py-8'>
                <img src={Logo} width={100} alt='Logo' />
                <h2 className='mt-8 text-3xl font-extrabold mb-3'>
                    You are offline
                </h2>
                <h5>Please check your internet connection</h5>
                <div className='flex justify-center pt-5'>
                    <img src={NoInternetLogo} width={200} className="block" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}
